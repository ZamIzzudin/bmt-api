import { uid } from 'uid';
import connection from '../../../config/index.js'
import { kas_keluar } from '../../kas/controllers/function.js'

async function generatePembiayaan(id_nasabah, produk, tipe, durasi, nominal, pelunasan) {
    const id_pembiayaan = uid(16)
    const min_angsuran_raw = pelunasan / parseInt(durasi)
    const min_angsuran = Math.round(min_angsuran_raw / 1000) * 1000

    // Tenggat
    const today = new Date();
    const tenggat_pelunasan_raw = new Date(today.getFullYear(), today.getMonth() + parseInt(durasi), today.getDate());

    const tenggat_pelunasan = tenggat_pelunasan_raw.getTime() / 1000

    const payload = [id_pembiayaan, id_nasabah, produk, tipe, durasi, nominal, pelunasan, min_angsuran, 'BELUM LUNAS', pelunasan, tenggat_pelunasan]
    const query = 'INSERT INTO pembiayaan (id_pembiayaan, id_nasabah, produk_pembiayaan, tipe_pembiayaan, durasi,nominal,pelunasan,min_angsuran,status, sisa_angsuran,tenggat_pelunasan) VALUES (?,?,?,?,?,?,?,?,?,?,?)'

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload, (error, result) => {
            if (error) {
                console.log(error)
            }
        })
        conn.release();
    })
}

export { generatePembiayaan }