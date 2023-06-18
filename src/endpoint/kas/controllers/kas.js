import connection from '../../../config/index.js'
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
    let query = `SELECT SUM(nominal_masuk), SUM(nominal_keluar) FROM kas`

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

const controller = {
    kas_list,
    create_kas,
    rekap_kas
}

export default controller