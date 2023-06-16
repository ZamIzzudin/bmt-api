import { verify_access_token } from '../../../utils/jwt.js'
import { encrpyt_one_way } from '../../../utils/crypt.js'
import connection from '../../../config/index.js'
import { uid } from 'uid';

const pengajuan_list = async (req, res) => {
    const { type } = req.query
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    let condition = `WHERE tipe_pengajuan = 'SUKARELA' `

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

    const query = 'SELECT * FROM pengajuan ' + condition

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
    const { produk_simpanan, setoran_awal, id_nasabah } = req.body

    var payload = [id_pengajuan, produk_simpanan, setoran_awal, id_nasabah, 'SUKARELA']

    let query = 'INSERT INTO pengajuan (id_pengajuan, produk_pengajuan, nominal_awal, id_nasabah, tipe_pengajuan) VALUES (?,?,?,?,?)'

    const handle_create_user = (err, result) => {
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
        await conn.query(query, payload, handle_create_user)
        conn.release();
    })
}

const update_user = async (req, res) => {
    const { id_user } = req.params
    const { type } = req.query
    const { username, password, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email } = req.body
    const { authorization: raw_token } = req.headers

    var payload = [username, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email, id_user]

    const token = raw_token.split(' ')[1]

    let query = 'UPDATE user SET username = ?, nama = ?, nik = ?, jenis_kelamin = ?, no_hp = ?, alamat = ?, pekerjaan = ?, no_rekening = ?, status_perkawinan = ?, email = ? WHERE id_user = ?'

    if (password != null) {
        const encrypted_password = await encrpyt_one_way(password)
        query = 'UPDATE user SET username = ?, password = ?, nama = ?, nik = ?, jenis_kelamin = ?, no_hp = ?, alamat = ?, pekerjaan = ?, no_rekening = ?, status_perkawinan = ?, email = ? WHERE id_user = ?'
        payload = [username, encrypted_password, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email, id_user]
    }

    const query_find = 'SELECT * FROM user WHERE id_user = ?'

    verify_access_token(token, async (error, result) => {
        if (!error) {
            if (result.role.toLowerCase() === 'admin' && type === 'pengelola') {
                return res.status(405).json({
                    status: 405,
                    message: 'unathorized',
                    info: 'you dont have valid access'
                })
            }
        }
    })

    const handle_delete_user = (err, result) => {
        if (!err) {
            return res.status(200).json({
                status: 200,
                message: 'Success Update User',
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
                    conn.query(query, payload, handle_delete_user)
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
        await conn.query(query_find, [id_user], handle_check_data)
        conn.release();
    })
}

const delete_user = async (req, res) => {
    const { id_user } = req.params
    const { type } = req.query
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    const query = 'DELETE FROM user WHERE id_user = ?'
    const query_find = 'SELECT * FROM user WHERE id_user = ?'

    const payload = [id_user]

    verify_access_token(token, async (error, result) => {
        if (!error) {
            if (result.role.toLowerCase() === 'admin' && type === 'pengelola') {
                return res.status(405).json({
                    status: 405,
                    message: 'unathorized',
                    info: 'you dont have valid access'
                })
            }
        }
    })

    const handle_delete_user = (err, result) => {
        if (!err) {
            return res.status(200).json({
                status: 200,
                message: 'Success Delete User',
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
                    conn.query(query, payload, handle_delete_user)
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
    update_user,
    delete_user
}

export default controller