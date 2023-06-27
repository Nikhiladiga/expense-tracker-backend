// const fs = require('fs').promises;
// const path = require('path');
// const process = require('process');
// const { authenticate } = require('@google-cloud/local-auth');
// const { google } = require('googleapis');


// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


// async function loadSavedCredentialsIfExist() {
//     try {
//         const content = await fs.readFile(TOKEN_PATH);
//         const credentials = JSON.parse(content);
//         return google.auth.fromJSON(credentials);
//     } catch (err) {
//         return null;
//     }
// }


// async function saveCredentials(client) {
//     const content = await fs.readFile(CREDENTIALS_PATH);
//     const keys = JSON.parse(content);
//     const key = keys.installed || keys.web;
//     const payload = JSON.stringify({
//         type: 'authorized_user',
//         client_id: key.client_id,
//         client_secret: key.client_secret,
//         refresh_token: client.credentials.refresh_token,
//     });
//     await fs.writeFile(TOKEN_PATH, payload);
// }

// async function authorize() {
//     let client = await loadSavedCredentialsIfExist();
//     if (client) {
//         return client;
//     }
//     client = await authenticate({
//         scopes: SCOPES,
//         keyfilePath: CREDENTIALS_PATH,
//     });
//     if (client.credentials) {
//         await saveCredentials(client);
//     }
//     return client;
// }

// async function listMessages(auth, userId = 'me', query = '', callback) {
//     const gmail = google.gmail({ version: 'v1', auth });
//     gmail.users.messages.list({
//         userId: userId,
//         q: query,
//     }, (err, res) => {
//         if (err) return console.log('The API returned an error: ' + err);
//         const messages = res.data.messages;
//         if (messages.length) {
//             callback(messages);
//         } else {
//             console.log('No messages found.');
//         }
//     });
// }


// // async function getMessage(auth, userId, messageId, callback) {
// //     const gmail = google.gmail({ version: 'v1', auth });
// //     gmail.users.messages.get({
// //         userId: userId,
// //         id: messageId,
// //     }, (err, res) => {
// //         if (err) return console.log('The API returned an error: ' + err);
// //         callback(res.data);
// //     });
// // }

// async function getMessage(auth, userId, messageId, callback) {
//     const gmail = google.gmail({ version: 'v1', auth });
//     gmail.users.messages.get({
//         userId: userId,
//         id: messageId,
//     }, (err, res) => {
//         if (err) return console.log('The API returned an error: ' + err);

//         let bodyData;
//         if (res.data.payload.parts) {
//             // This case handles multipart messages.
//             bodyData = res.data.payload.parts
//                 .filter(part => part.mimeType === 'text/plain')
//                 .map(part => Buffer.from(part.body.data, 'base64').toString())
//                 .join('');
//         } else {
//             // This case handles single part messages.
//             bodyData = Buffer.from(res.data.payload.body.data, 'base64').toString();
//         }
//         callback(bodyData);
//     });
// }

// // + 'after:25-06-2023 before:27-06-2023'

// authorize().then(auth => {
//     listMessages(auth, 'me', 'from:alerts@axisbank.com after:2023/06/05 before:2023/06/27', (messages) => {
//         messages.forEach((message) => {
//             getMessage(auth, 'me', message.id, (body) => {
//                 if (body.length > 0) {
//                     console.log("---------------------------------------------------");
//                 // Regular expression to match date followed by "Dear Nikhil Adiga"
//                 const startPattern = /\d{2}-\d{2}-\d{4} Dear Nikhil Adiga/;
//                 const startMatch = body.match(startPattern);
//                 const end = body.indexOf("Axis Bank Ltd") + "Axis Bank Ltd".length;
//                 let mainContent = '';

//                 if (startMatch) {
//                     const start = body.indexOf(startMatch[0]);
//                     // Extract the main content
//                     mainContent = body.slice(start, end);
//                 }
//                 console.log(mainContent);
//                 }
//             });
//         });
//     });
// })
//     .catch(console.error);