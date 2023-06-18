import connection from '../../../config/index.js'
import { verify_access_token } from '../../../utils/jwt.js'
import { kas_masuk } from '../../kas/controllers/function.js'
import { uid } from 'uid';


const angsuran_list = async (req, res) => {
    const { id_proses } = req.params

    const query = `SELECT * FROM angsuran WHERE id_proses = ?`

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Angsuran List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Angsuran Not Found"
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
        await conn.query(query, [id_proses], handle_response)
        conn.release();
    })
}

const angsuran_setor = async (req, res) => {
    const { id_proses } = req.params
    const { nominal } = req.body
    const { authorization: raw_token } = req.headers

    const id_angsuran = uid(16)
    const token = raw_token.split(' ')[1]

    var payload = [id_angsuran, id_proses, 'Setor', nominal]

    const query = `INSERT INTO angsuran (id_angsuran, id_proses, tipe_angsuran, nominal, teller) VALUES (?,?,?,?,?)`
    const query_find = `SELECT nominal FROM pembiayaan WHERE id_pembiayaan = ?`

    verify_access_token(token, async (error, result) => {
        if (!error) {
            payload.push(result.name)
        } else {
            return res.status(405).json({
                status: 403,
                message: 'unathorized',
                info: 'token not found'
            })
        }
    })

    const handle_response = async (err, result) => {
        if (!err) {
            res.json({
                status: 200,
                message: `Success Generate Angsuran`,
            })
        } else {
            res.status(404).json({
                status: 404,
                message: 'failed',
                info: err
            })
        }
    }

    connection.getConnection(async (err, conn) => {
        await conn.query(query_find, [id_proses], async (error, data) => {
            if (!error) {
                const catatan = 'Angsuran Setoran Pembiayaan Jual Beli Masuk'
                const query_update = `UPDATE pembiayaan SET sisa_angsuran = ? WHERE id_pembiayaan = ?`
                const new_nominal = data[0].sisa_angsuran - nominal

                kas_masuk(nominal, catatan)

                await conn.query(query_update, [new_nominal, id_proses], async (error, result) => {
                    if (!error) {
                        await conn.query(query, payload, handle_response)
                    }
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    message: 'Pembiayaan Tidak Ditemukan',
                })
            }
        })
        conn.release();
    })
}


const controller = {
    angsuran_list,
    angsuran_setor
}

export default controller