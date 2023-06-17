import connection from '../../../config/index.js'
import { verify_access_token } from '../../../utils/jwt.js'

const simpanan_list = async (req, res) => {
    const { type, status = null, bulan = null, tahun = null } = req.query
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    let condition = `WHERE simpanan.tipe_simpanan = 'Wajib' `

    if (status == 'belum-lunas') {
        condition = condition + `simpanan.status = 'BELUM LUNAS' `
    }

    if (bulan != null) {
        condition = condition + `simpanan.bulan = ${bulan} `
    }

    if (tahun != null) {
        condition = condition + `simpanan.tahun = ${tahun} `
    }

    verify_access_token(token, async (error, result) => {
        if (!error) {
            if (result.role.toLowerCase() === 'nasabah' && type === 'pengelola') {
                return res.status(405).json({
                    status: 405,
                    message: 'unathorized',
                    info: 'you dont have valid access'
                })
            } else if (result.role.toLowerCase() === 'nasabah' && type === 'nasabah') {
                condition = condition + `AND simpanan.id_nasabah = '${result.id}'`
            }
        } else {
            return res.status(405).json({
                status: 403,
                message: 'unathorized',
                info: 'token not found'
            })
        }
    })


    const query = `SELECT simpanan.*, user.nama FROM simpanan INNER JOIN user ON user.id_user=simpanan.id_nasabah ${condition}`

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Simpanan Sukarela List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Simpanan Sukarela Not Found"
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
    simpanan_list
}

export default controller