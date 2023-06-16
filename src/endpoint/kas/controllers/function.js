import { uid } from 'uid';
import connection from '../../../config/index.js'

const kas_masuk = async (nominal, catatan) => {
    const id_transaksi = uid(16)
    const payload = [id_transaksi, nominal, catatan, 'MASUK']
    const query = 'INSERT INTO kas (id_transaksi, nominal_masuk, catatan, jenis_transaksi) VALUES (?,?,?,?)'

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload)
        conn.release();
    })
}

const kas_keluar = async (nominal, catatan) => {
    const id_transaksi = uid(16)
    const payload = [id_transaksi, nominal, catatan, 'KELUAR']
    const query = 'INSERT INTO kas (id_transaksi, nominal_keluar, catatan, jenis_transaksi) VALUES (?,?,?,?)'

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload)
        conn.release();
    })
}

export { kas_masuk, kas_keluar }