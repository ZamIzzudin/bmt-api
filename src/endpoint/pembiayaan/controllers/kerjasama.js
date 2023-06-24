import connection from '../../../config/index.js'
import { verify_access_token } from '../../../utils/jwt.js'

const pembiayaan_list = async (req, res) => {
    const { type, search } = req.query
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    let condition = `WHERE pembiayaan.tipe_pembiayaan = 'KERJA SAMA' `

    verify_access_token(token, async (error, result) => {
        if (!error) {
            if (result.role.toLowerCase() === 'nasabah' && type === 'pengelola') {
                return res.status(405).json({
                    status: 405,
                    message: 'unathorized',
                    info: 'you dont have valid access'
                })
            } else if (result.role.toLowerCase() === 'nasabah' && type === 'nasabah') {
                condition = condition + `AND pembiayaan.id_nasabah = '${result.id}'`
            }
        } else {
            return res.status(405).json({
                status: 403,
                message: 'unathorized',
                info: 'token not found'
            })
        }
    })

    //Fix search query
    if (search) {
        condition += `AND (user.nama LIKE '%${search}%' OR pembiayaan.id_nasabah LIKE '%${search}%') `;
    }

    const query = `SELECT pembiayaan.*, user.nama FROM pembiayaan INNER JOIN user ON user.id_user=pembiayaan.id_nasabah ${condition}`

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Pembiayaan Kerja Sama List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Pembiayaan Kerja Sama Not Found"
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
    pembiayaan_list
}

export default controller