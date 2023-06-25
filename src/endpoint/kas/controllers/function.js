import { uid } from 'uid';
import connection from '../../../config/index.js'

async function kas_masuk(nominal, catatan) {
    const id_transaksi = uid(16)
    const payload = [id_transaksi, nominal, catatan, 'MASUK']
    const query = 'INSERT INTO kas (id_transaksi, nominal_masuk, catatan, jenis_transaksi) VALUES (?,?,?,?)'

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload, (error, result) => {
            if (error) {
                console.log(error)
            }
        })
        conn.release();
    })
}

async function kas_keluar(nominal, catatan) {
    const id_transaksi = uid(16)
    const payload = [id_transaksi, nominal, catatan, 'KELUAR']
    const query = 'INSERT INTO kas (id_transaksi, nominal_keluar, catatan, jenis_transaksi) VALUES (?,?,?,?)'

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload, (error, result) => {
            if (error) {
                console.log(error)
            }
        })
        conn.release();
    })
}

async function addSimpananToKas(id_nasabah, nominal){
    const queryfind = `SELECT * FROM simpanan WHERE id_nasabah = '${id_nasabah}' AND tipe_simpanan = 'Sukarela' AND produk_simpanan = 'Wadiah'`
    const  handleFind =(err, result)=> {
        const newNominal = nominal + result[0].nominal
        const queryUpdate = `UPDATE simpanan SET nominal = ? WHERE id_simpanan = '${result[0].id_simpanan}'`
        console.error(err)
        connection.getConnection(async (err, conn) => {
            await conn.query(queryUpdate, [newNominal], (error, result) => {
                if (error) {
                    console.log(error)
                }
            })
            conn.release();
        })
    }
    connection.getConnection(async (err, conn) => {
        await conn.query(queryfind, [], handleFind)
        conn.release();
    })
}

export { kas_masuk, kas_keluar, addSimpananToKas }