import { uid } from 'uid';
import connection from '../../../config/index.js'

const simpanan_list = async (req, res) => {
    let condition = `WHERE simpanan.tipe_simpanan = 'Pokok' `

    const query = `SELECT simpanan.*, user.nama FROM simpanan INNER JOIN user ON user.id_user=simpanan.id_nasabah ${condition}`

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Simpanan Pokok List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Simpanan Pokok Not Found"
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