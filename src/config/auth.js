import { google } from 'googleapis';
import {config} from 'dotenv';

config();

export async function authorize() {
    const oAuth2Client = new google
        .auth
        .OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );
    oAuth2Client.setCredentials({refresh_token:process.env.REFRESH_TOKEN});
    return oAuth2Client;
}

export async function listMessages(auth, userId = 'me', query = '', callback) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.messages.list({
        userId: userId,
        q: query,
        maxResults:500,
        orderBy:'internalDate'
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const messages = res.data.messages;
        if (messages.length) {
            callback(messages);
        } else {
            console.log('No messages found.');
        }
    });
}

export async function getMessage(auth, userId, messageId, callback) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.messages.get({
        userId: userId,
        id: messageId
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);

        let bodyData = {
            data:null,
            createdAt:null
        };

        bodyData.createdAt = res.data.internalDate;

        if (res.data.payload.parts) {
            // This case handles multipart messages.
            bodyData.data = res.data.payload.parts
                .filter(part => part.mimeType === 'text/plain')
                .map(part => Buffer.from(part.body.data, 'base64').toString())
                .join('');
        } else {
            // This case handles single part messages.
            bodyData.data = Buffer.from(res.data.payload.body.data, 'base64').toString();
        }
        callback(bodyData);
    });
}