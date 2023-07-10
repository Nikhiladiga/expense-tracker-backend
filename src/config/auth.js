import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import {promises as fs} from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');

let CREDENTIALS_PATH;
if(process.env.NODE_ENV === "dev"){
    CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
} else if(process.env.NODE_ENV === "prod"){
    CREDENTIALS_PATH = "/etc/secrets/credentials.json";
}

async function loadSavedCredentialsIfExist() {
    console.log("Inside loadSavedCredentialsIfExist method");
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        console.log("CREDS:",credentials);
        let data = google.auth.fromJSON(credentials);
        console.log("DATA FROM GOOGLE:",data);
        return data;
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    console.log("Inside saveCredentials method");
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
    console.log("token.json file created and saved");
}

export async function authorize() {
    console.log("Inside authorize method");
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
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