import mysql from 'mysql'
import key from '../state/index.js'

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = key //configuration

const connection = mysql.createPool({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
})

export default connection