import {Account, Client, Databases } from 'react-native-appwrite'

export const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

export const account = new Account(client)
export const databases = new Databases(client)

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
export const TASKS_ID = process.env.EXPO_PUBLIC_TASKS_ID!;
export const TODOLIST_ID = process.env.EXPO_PUBLIC_TODOLISTS_ID!;
export const TAGS_ID = process.env.EXPO_PUBLIC_TAGS_ID!;

export interface RealtimeResponse {
    events: string[];
    payload: any;
}
