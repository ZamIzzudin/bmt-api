import { uid } from 'uid';
import connection from '../../../config/index.js'
import { kas_masuk } from '../../kas/controllers/function.js'

async function generateSimpananPokok(id_nasabah) {
    const id_simpanan = uid(16)
    const payload = [id_simpanan, id_nasabah, 50000, 'Pokok', 'Pokok']
    const query = 'INSERT INTO simpanan (id_simpanan, id_nasabah, nominal, tipe_simpanan, produk_simpanan) VALUES (?,?,?,?,?)'
    kas_masuk(50000)

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
    const month_list = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const date = new Date()
    const bulan = month_list[date.getMonth()];
    const tahun = date.getFullYear()

    const query_find = "SELECT id_user FROM user WHERE role = 'nasabah'"

    connection.getConnection(async (err, conn) => {
        await conn.query(query_find, [], (error, result) => {
            if (!error) {
                result.forEach(async user => {
                    const id_simpanan = uid(16)
                    const payload = [id_simpanan, user.id_user, 30000, 'Wajib', 'Wajib', tahun, bulan, 'BELUM LUNAS']
                    const query = 'INSERT INTO simpanan (id_simpanan, id_nasabah, nominal, tipe_simpanan, produk_simpanan,tahun,bulan,status) VALUES (?,?,?,?,?,?,?,?)'

                    await conn.query(query, payload, (error, result) => {
                        if (!error) {
                            console.log('Berhasil Generate Data')
                        } else {
                            console.log(error)
                        }
                    })
                })
            } else {
                console.log(error)
            }
        })
        conn.release();
    })
}

async function generateSatuSimpananWajib(id_nasabah) {
    const month_list = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const date = new Date()
    const bulan = month_list[date.getMonth()];
    const tahun = date.getFullYear()

    const id_simpanan = uid(16)
    const payload = [id_simpanan, id_nasabah, 30000, 'Wajib', 'Wajib', tahun, bulan, 'BELUM LUNAS']
    const query = 'INSERT INTO simpanan (id_simpanan, id_nasabah, nominal, tipe_simpanan, produk_simpanan,tahun,bulan,status) VALUES (?,?,?,?,?,?,?,?)'

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload, (error, result) => {
            if (!error) {
                console.log('Berhasil Generate Data')
            } else {
                console.log(error)
            }
        })
    })
}

export { generateSimpananPokok, generateSimpananSukarela, generateSimpananWajib, generateSatuSimpananWajib }