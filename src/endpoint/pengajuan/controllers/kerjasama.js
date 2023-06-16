import { verify_access_token } from '../../../utils/jwt.js'
import cloudinary from '../../../utils/cloudinary .js'
import connection from '../../../config/index.js'
import { uid } from 'uid';

async function uploadImage(path) {
    const data = await cloudinary.uploader.upload(foto_ktp.path)
    return data.public_id
}

const pengajuan_list = async (req, res) => {
    const { type } = req.query
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    let condition = `WHERE tipe_pengajuan = 'KERJA SAMA' `

    verify_access_token(token, async (error, result) => {
        if (!error) {
            if (result.role.toLowerCase() === 'nasabah' && type === 'pengelola') {
                return res.status(405).json({
                    status: 405,
                    message: 'unathorized',
                    info: 'you dont have valid access'
                })
            } else if (result.role.toLowerCase() === 'nasabah' && type === 'nasabah') {
                condition = condition + `AND id_nasabah = '${result.id}'`
            }
        } else {
            return res.status(405).json({
                status: 403,
                message: 'unathorized',
                info: 'token not found'
            })
        }
    })

    const query = `SELECT pengajuan.*, user.nama FROM pengajuan INNER JOIN user ON user.id_user=pengajuan.id_nasabah ${condition}`

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Pengajuan List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Pengajuan Not Found"
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

const create_pengajuan = async (req, res) => {
    const id_pengajuan = uid(16)
    const { produk_pembiayaan, durasi_pembiayaan, nominal_pembiayaan, nominal_pelunasan, id_nasabah } = req.body
    const { foto_ktp = null, foto_kk = null, dokumen_rab = null } = req.files

    const url_ktp = uploadImage(foto_ktp.path)
    const url_kk = uploadImage(foto_kk.path)
    const url_rab = uploadImage(dokumen_rab.path)

    var payload = [id_pengajuan, produk_pembiayaan, durasi_pembiayaan, nominal_pembiayaan, nominal_pelunasan, id_nasabah, 'KERJA SAMA', url_ktp, url_kk, url_rab]

    let query = 'INSERT INTO pengajuan (id_pengajuan, produk_pengajuan, durasi, nominal_awal, nominal_akhir, id_nasabah, tipe_pengajuan,attach_ktp,attach_kk,attach_lainnya) VALUES (?,?,?,?,?,?,?,?,?,?)'

    if (foto_ktp == null || foto_kk == null || dokumen_rab == null) {
        return res.status(404).json({
            status: 404,
            message: 'Data Not Valid',
            info: 'Attachment must be filled'
        })
    }

    const handle_create_pengajuan = (err, result) => {
        if (!err) {
            return res.status(200).json({
                status: 200,
                message: 'Success Create Pengajuan',
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

const update_pengajuan = async (req, res) => {
    const { id_pengajuan } = req.params
    const { produk_simpanan, setoran_awal, id_nasabah } = req.body

    var payload = [produk_simpanan, setoran_awal, id_nasabah, id_pengajuan]

    let query = 'UPDATE pengajuan SET produk_pengajuan = ?, nominal_awal = ?, id_nasabah = ? WHERE id_pengajuan = ?'

    const query_find = 'SELECT * FROM pengajuan WHERE id_pengajuan = ?'

    const handle_edit_pengajuan = (err, result) => {
        if (!err) {
            return res.status(200).json({
                status: 200,
                message: 'Success Update Pengajuan',
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: 'failed',
                info: err
            })
        }
    }

    const handle_check_data = (err, data) => {
        if (!err) {
            if (data.length > 0) {
                connection.getConnection(async (err, conn) => {
                    conn.query(query, payload, handle_edit_pengajuan)
                    conn.release();
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'Data Not Found',
                    info: 'Cannot find data with this ID'
                })
            }

        } else {
            return res.status(404).json({
                status: 404,
                message: 'error',
                info: 'internal server error'
            })
        }
    }


    connection.getConnection(async (err, conn) => {
        await conn.query(query_find, [id_pengajuan], handle_check_data)
        conn.release();
    })
}

const approve_pengajuan = async (req, res) => {
    const { id_pengajuan } = req.params

    var date = new Date().getTime()

    var payload = [date, 'DISETUJUI', id_pengajuan]

    let query = 'UPDATE pengajuan SET approved_at = ?, status_pengajuan = ? WHERE id_pengajuan = ?'

    const query_find = "SELECT * FROM pengajuan WHERE id_pengajuan = ? AND status_pengajuan = 'BELUM DISETUJUI'"

    const handle_edit_pengajuan = (err, result) => {
        if (!err) {
            return res.status(200).json({
                status: 200,
                message: 'Success Approve Pengajuan',
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: 'failed',
                info: err
            })
        }
    }

    const handle_check_data = (err, data) => {
        if (!err) {
            if (data.length > 0) {
                connection.getConnection(async (err, conn) => {
                    conn.query(query, payload, handle_edit_pengajuan)
                    conn.release();
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'Data Not Found',
                    info: 'Cannot find data with this ID'
                })
            }

        } else {
            return res.status(404).json({
                status: 404,
                message: 'error',
                info: 'internal server error'
            })
        }
    }


    connection.getConnection(async (err, conn) => {
        await conn.query(query_find, [id_pengajuan], handle_check_data)
        conn.release();
    })
}

const delete_pengajuan = async (req, res) => {
    const { id_pengajuan } = req.params

    const query = 'DELETE FROM pengajuan WHERE id_pengajuan = ?'
    const query_find = 'SELECT * FROM pengajuan WHERE id_pengajuan = ?'

    const payload = [id_pengajuan]

    const handle_delete_pengajuan = (err, result) => {
        if (!err) {
            return res.status(200).json({
                status: 200,
                message: 'Success Delete Pegajuan',
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: 'failed',
                info: err
            })
        }
    }

    const handle_check_data = (err, data) => {
        if (!err) {
            if (data.length > 0) {
                connection.getConnection(async (err, conn) => {
                    conn.query(query, payload, handle_delete_pengajuan)
                    conn.release();
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'Data Not Found',
                    info: 'Cannot find data with this ID'
                })
            }

        } else {
            return res.status(404).json({
                status: 404,
                message: 'error',
                info: 'internal server error'
            })
        }
    }


    connection.getConnection(async (err, conn) => {
        await conn.query(query_find, payload, handle_check_data)
        conn.release();
    })
}


const controller = {
    pengajuan_list,
    create_pengajuan,
    update_pengajuan,
    approve_pengajuan,
    delete_pengajuan
}

export default controller