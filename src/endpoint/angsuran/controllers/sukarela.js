import connection from '../../../config/index.js'
import { verify_access_token } from '../../../utils/jwt.js'
import { kas_masuk, kas_keluar } from '../../kas/controllers/function.js'
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

const action_anggsuran = async (req, res) => {
    const { id_proses } = req.params
    const { tipe_angsuran, nominal } = req.body
    const { authorization: raw_token } = req.headers

    const id_angsuran = uid(16)
    const token = raw_token.split(' ')[1]

    var payload = [id_angsuran, id_proses, tipe_angsuran, nominal]

    const query = `INSERT INTO angsuran (id_angsuran, id_proses, tipe_angsuran, nominal, teller) VALUES (?,?,?,?,?)`

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
            if (tipe_angsuran === 'Setor') {
                const catatan = 'Angsuran Setoran Masuk'
                kas_masuk(nominal, catatan)
            } else {
                const catatan = 'Angsuran Penarikan Keluar'
                kas_keluar(nominal, catatan)
            }

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
        await conn.query(query, payload, handle_response)
        conn.release();
    })
}

const controller = {
    angsuran_list,
    action_anggsuran
}

export default controller