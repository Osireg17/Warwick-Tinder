import { Client, Storage, Databases, Account } from 'appwrite'

export const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)


const auth = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export {
    auth,
    database,
    storage
}
export { ID } from 'appwrite';
