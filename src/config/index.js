import mysql from 'mysql'
import key from '../state/index.js'

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = key //configuration

const conn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
})

conn.connect((err) => {
    if (err) {
        console.log('error connecting : ' + err.stack);
        return;
    }
    console.log('DB success connected');
});

export default conn