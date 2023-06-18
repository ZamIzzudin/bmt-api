import connection from '../../../config/index.js'
import { verify_access_token } from '../../../utils/jwt.js'
import { uid } from 'uid';

const kas_list = async (req, res) => {
    const { type } = req.query

    let query = `SELECT * FROM kas`

    if (type != null) {
        query = query + ` WHERE jenis_transaksi = '${type.toUpperCase()}'`
    }

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Data Kas`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Transaksi Kas Not Found"
                })
            }
        } else {
            res.status(404).json({
                status: 404,
                message: 'failed',
                info: err
            })
        }
    }

    connection.getConnection(async (err, conn) => {
        await conn.query(query, [], handle_response)
        conn.release();
    })
}

const create_kas = async (req, res) => {
    const id_transaksi = uid(16)
    const { nominal, jenis_transaksi, catatan } = req.body

    var payload = [id_transaksi, nominal, jenis_transaksi.toUpperCase(), catatan]

    let query = 'INSERT INTO kas (id_transaksi, nominal_masuk, jenis_transaksi, catatan) VALUES (?,?,?,?)'

    if (jenis_transaksi.toUpperCase() === 'KELUAR') {
        query = 'INSERT INTO kas (id_transaksi, nominal_keluar, jenis_transaksi, catatan) VALUES (?,?,?,?)'
    }

    const handle_create_pengajuan = (err, result) => {
        if (!err) {
            return res.status(200).json({
                status: 200,
                message: 'Success Create Transaksi Kas',
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: 'failed',
                info: err
            })
        }
    }

    connection.getConnection(async (err, conn) => {
        await conn.query(query, payload, handle_create_pengajuan)
        conn.release();
    })
}

const rekap_kas = async (req, res) => {
    let rekap = {}
    connection.getConnection(async (err, conn) => {

        const queries = [
            query(`SELECT SUM(nominal_masuk) AS kas_masuk, SUM(nominal_keluar) AS kas_keluar FROM kas`, conn),
            query(`SELECT COUNT(email) AS jumlah_nasabah FROM user WHERE role = 'NASABAH'`, conn),
            query(`SELECT SUM(nominal) AS total_simpanan_sukarela FROM simpanan WHERE tipe_simpanan = 'Sukarela'`, conn),
            query(`SELECT SUM(nominal) AS total_simpanan_wajib FROM simpanan WHERE tipe_simpanan = 'Wajib'`, conn),
            query(`SELECT SUM(nominal) AS total_simpanan_pokok FROM simpanan WHERE tipe_simpanan = 'Pokok'`, conn),
        ];

        const queryResults = await Promise.all(queries);

        queryResults.forEach(result => {
            Object.keys(result).forEach(each => {
                rekap[each] = result[each]
            })
        });

        rekap['total_saldo_sementara'] = rekap.kas_masuk - rekap.kas_keluar
        conn.release();

        return res.json({
            status: 200,
            message: `Success Get Data Kas`,
            data: rekap
        })
    })
}

const rekap_profile = async (req, res) => {
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    let id_nasabah = null

    verify_access_token(token, async (error, result) => {
        if (!error) {
            id_nasabah = result.id
        } else {
            return res.status(405).json({
                status: 403,
                message: 'unathorized',
                info: 'token not found'
            })
        }
    })

    let rekap = {}
    connection.getConnection(async (err, conn) => {

        const queries = [
            query(`SELECT SUM(nominal) AS total_pembiayaan, SUM(sisa_angsuran) AS total_sisa_angsuran_pembiayaan FROM pembiayaan WHERE id_nasabah = '${id_nasabah}'`, conn),
            query(`SELECT SUM(nominal) AS total_simpanan_sukarela FROM simpanan WHERE tipe_simpanan = 'Sukarela' AND id_nasabah = '${id_nasabah}'`, conn),
            query(`SELECT SUM(nominal) AS total_simpanan_wajib FROM simpanan WHERE tipe_simpanan = 'Wajib' AND id_nasabah = '${id_nasabah}'`, conn),
            query(`SELECT SUM(nominal) AS total_simpanan_pokok FROM simpanan WHERE tipe_simpanan = 'Pokok' AND id_nasabah = '${id_nasabah}'`, conn),
        ];

        const queryResults = await Promise.all(queries);

        queryResults.forEach(result => {
            Object.keys(result).forEach(each => {
                rekap[each] = result[each]
            })
        });

        conn.release();

        return res.json({
            status: 200,
            message: `Success Get Data Kas`,
            data: rekap
        })
    })
}

function query(text, conn) {
    return new Promise(async (resolve, reject) => {
        try {
            await conn.query(text, [], (error, result) => {
                resolve(result[0])
            })
        } catch (error) {
            reject(error);
        }
    })
}

const controller = {
    kas_list,
    create_kas,
    rekap_kas,
    rekap_profile
}

export default controller