import { uid } from 'uid';
import connection from '../../../config/index.js'

async function generateSimpananPokok(id_nasabah) {
    const id_simpanan = uid(16)
    const payload = [id_simpanan, id_nasabah, 50000, 'Pokok', 'Pokok']
    const query = 'INSERT INTO simpanan (id_simpanan, id_nasabah, nominal, tipe_simpanan, produk_simpanan) VALUES (?,?,?,?,?)'

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload, (error, result) => {
            if (error) {
                console.log(error)
            }
        })
        conn.release();
    })
}

async function generateSimpananSukarela(id_nasabah, nominal, produk) {
    const id_simpanan = uid(16)
    const payload = [id_simpanan, id_nasabah, nominal, 'Sukarela', produk]
    const query = 'INSERT INTO simpanan (id_simpanan, id_nasabah, nominal, tipe_simpanan, produk_simpanan) VALUES (?,?,?,?,?)'

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload, (error, result) => {
            if (error) {
                console.log(error)
            }
        })
        conn.release();
    })
}

async function generateSimpananWajib() {
    const date = new Date()
    console.log('Generte Simpanan Wajib ' + date.toDateString())
}

export { generateSimpananPokok, generateSimpananSukarela, generateSimpananWajib }