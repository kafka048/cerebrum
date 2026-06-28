import { UserLogin, UserCreate } from "@/types/user";
import { fetchRequest } from "./client";


export async function login(credentials: UserLogin) {
    const url = "/users/login";
    const options = {
        method: "POST",
        body: JSON.stringify(credentials)
    }

    return fetchRequest(url, options);
}

export async function signup(credentials: UserCreate) {
    const url = "/users/signup";
    const options = {
        method: "POST",
        body: JSON.stringify(credentials)
    }

    return fetchRequest(url, options)
}

export async function getCurrentUser() {
    const url = '/users/me'
    const options = {
        method: "GET"
    }

    return fetchRequest(url, options)
}