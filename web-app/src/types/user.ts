export interface UserCreate {
    name: string,
    email: string,
    password: string
}

export interface UserLogin {
    email: string,
    password: string
}

export interface TokenResponse {
    access_token: string 
    token_type: string
}


    