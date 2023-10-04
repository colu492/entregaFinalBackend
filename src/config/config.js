import dotenv from 'dotenv'
dotenv.config()

export default {
    port: process.env.PORT,
    uri: process.env.MONGO_URI,
    clientid: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    callback_url: process.env.GITHUB_CALLBACK_URL,
}