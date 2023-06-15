import dotenv from 'dotenv'
dotenv.config()

// DEVELOPMENT KEY
const key = {
    PORT: process.env.PORT,
    MAX_AGE_ACCESS_TOKEN: process.env.MAX_AGE_ACCESS_TOKEN,
    MAX_AGE_REFRESH_TOKEN: process.env.MAX_AGE_REFRESH_TOKEN,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT
}

// PRODUCTION KEY

export default key