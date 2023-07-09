import { Account, Client, Databases } from 'appwrite'

export const PROJECT_ID = '64a548f9a5673f8f20ae'
export const DATABASE_ID = '64a54ae078c1951d6478'
export const COLLECTION_ID_MESSAGES = '64a54aeb8945fe908b65'
// export const projectID = import.meta.env.VITE_PROJECT_ID
// export const databaseID = import.meta.env.VITE_DATABASE_ID
// export const collectionIDMessages = import.meta.env.VITE_COLLECTION_ID_MESSAGES

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('64a548f9a5673f8f20ae');
    // .setProject(projectID);

export const databases = new Databases(client);
export const account = new Account(client)
    

    export default client;