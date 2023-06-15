import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import endpoint from './src/endpoint/index.js'
import key from './src/state/index.js'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { PORT } = key //configuration

//DB Configuration **SOON**

const app = express()

app.use('/public', express.static(path.join(__dirname, '/public'))) //middleware

app.use(cors({
    credentials: true,
    origin: '*', //enable cors access to selected domeain
}))

app.use(cookieParser()); //allow to access cookie

app.use(bodyParser.urlencoded({ extended: false })) //allow request with format x-www-form-urlencoded

app.use(bodyParser.json()) //allow request with format json

app.use(endpoint) //route render

app.listen(PORT, () => console.log(`http://localhost:${PORT}`)) //success flagging