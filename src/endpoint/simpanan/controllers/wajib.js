import connection from '../../../config/index.js'
import { verify_access_token } from '../../../utils/jwt.js'
import { kas_masuk } from '../../kas/controllers/function.js'


const simpanan_list = async (req, res) => {
    const { status = null, bulan = null, tahun = null, search = null } = req.query
    const { id_nasabah } = req.params

    let condition = `WHERE simpanan.tipe_simpanan = 'Wajib' AND simpanan.id_nasabah = '${id_nasabah}' `

    if (status == 'belum-lunas') {
        condition = condition + `AND simpanan.status = 'BELUM LUNAS'`
    }

    if (search != null) {
        condition += `AND (simpanan.tahun LIKE '%${search}%' OR simpanan.bulan LIKE '%${search}%')`;
      }
      
    const query = `SELECT simpanan.*, user.nama FROM simpanan INNER JOIN user ON user.id_user=simpanan.id_nasabah ${condition}`

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Simpanan Wajib List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Simpanan Wajib Not Found"
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

const simpanan_parent_list = async (req, res) => {
    const { search = null } = req.query;
    let condition = ""

    if (search != null) {
        condition = condition + `AND (user.nama LIKE '%${search}%') `;
    }
    const query = `SELECT MAX(simpanan.id_nasabah) AS id_nasabah, user.nama, SUM(simpanan.nominal) AS nominal, simpanan.tahun FROM simpanan INNER JOIN user ON user.id_user=simpanan.id_nasabah WHERE tipe_simpanan = 'Wajib' ${condition} GROUP BY simpanan.tahun, user.nama`
    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Simpanan Wajib List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Simpanan Wajib Not Found"
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

const belum_lunas_list = async (req, res) => {
    const { bulan = null, tahun = null, search = null } = req.query

    let condition = `WHERE simpanan.tipe_simpanan = 'Wajib' AND simpanan.status = 'BELUM LUNAS' `

    if (bulan != null) {
        condition = condition + `AND simpanan.bulan = '${bulan}' `
    }

    if (tahun != null) {
        condition = condition + `AND simpanan.tahun = '${tahun}' `
    }

    if (search != null) {
        condition = condition + ` AND (user.nama LIKE '%${search}%' OR simpanan.nomor_simpanan LIKE '%${search}%')`;
    }

    const query = `SELECT simpanan.*, user.nama FROM simpanan INNER JOIN user ON user.id_user=simpanan.id_nasabah ${condition}`

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Simpanan Wajib List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Simpanan Wajib Not Found"
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

const setor_simpanan = async (req, res) => {
    const { id_simpanan } = req.params
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    let query = ''

    verify_access_token(token, async (error, result) => {
        if (!error) {
            query = `UPDATE simpanan SET status = 'LUNAS', id_teller = '${result.name}' WHERE id_simpanan = '${id_simpanan}'`
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
            const catatan = `Setor Simpanan Wajib (${id_simpanan})`
            kas_masuk(30000, catatan)
            res.json({
                status: 200,
                message: `Success Setor Simpanan Wajib List`,
                data: result
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
        await conn.query(query, [], handle_response)
        conn.release();
    })
}

const controller = {
    simpanan_list,
    simpanan_parent_list,
    belum_lunas_list,
    setor_simpanan
}

export default controller
