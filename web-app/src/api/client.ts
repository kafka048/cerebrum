// async function because the backend is called
const BASE_URL: string = "http://127.0.0.1:8000";  
const TOKEN_STORAGE_KEY: string = "cerebrum.token";
export async function fetchRequest(endpoint: string, options: RequestInit = {}) {

    const url: string = `${BASE_URL}${endpoint}`; 

    const token: string | null = localStorage.getItem(TOKEN_STORAGE_KEY); // if no token; null
    const headers: HeadersInit = {
        "Content-Type":"application/json",
    };
    if (token){
        headers["Authorization"] = `Bearer ${token}`
    };

    const requestOptions = {
        ...options,
        headers: {
            ...headers,
            ...options.headers // to include the headers caller might send
        } // merging default and caller headers
    }

    const response = await fetch(url, requestOptions);
    if(!response.ok){
        const error = await response.json()
        throw new Error(error.detail);
    };

    const data = await response.json()
    return data;

     
}

// NOTES:
// This is a normal typescript module. It cannot call a hook in the auth-state to retrieve the jwt token. 
// Where else can we get the token? The local storage for the first version atleast.
// Why local storage? To persist the token, we need to store the token. 

// STEP1: READ THE TOKEN FROM THE LOCAL STORAGE
// STEP2: BUILD HEADERS -> MERGE THE DEFAULT, CALLER'S AND AUTHORISATION HEADERS
// STEP3: MAKE THE REQUEST
// STEP4: RECEIVE THE RESPONSE -> IF SUCCESS RETURN JSON, IF ERROR THROW ERROR


// Request
// ├── URL -> Uniform Resource Locator: answers where the resource exists. Consists of protocol, domain, path and parameters/query
// ├── Method -> answers what i need to do with this resource. get, post, put, patch, delete
// ├── Headers -> metadata: data about the incoming data
// └── Body

// ## HEADERS: ANSWERS HOW THE SERVER SHOULD INTERPRET THE REQUEST
// Content-Type: application/json -> tells fastapi that the body i am sending is json
// Authorization: Bearer eyJhbGc...-> tells fastapi that the user accessing this resource is represented by this token

// Response
// ├── status -> status code
// ├── ok
// ├── headers
// ├── body
// └── helper methods