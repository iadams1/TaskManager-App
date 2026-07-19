import { Models } from "react-native-appwrite";


export interface Tasks extends Models.Document {
    user_id: string;
    title: string;
    location: string;
    time: string;
    subject: string;
    description: string;
    status: string;
    date: string;
}

export interface ToDoList extends Models.Document {
    user_id: string;
    title: string;
    status: string;
}