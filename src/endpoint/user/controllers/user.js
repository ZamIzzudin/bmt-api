import { verify_access_token } from '../../../utils/jwt.js'
import { encrpyt_one_way } from '../../../utils/crypt.js'
import connection from '../../../config/index.js'

const user_list = async (req, res) => {
    const { type } = req.query
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    let condition = "role = 'nasabah'"
    if (type === 'pengelola') {
        condition = "role = 'admin' OR role = 'admin_master' OR role = 'officer' OR role = 'manager'"
    }

    const query = 'SELECT id_user, created_at,username, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email, role FROM user WHERE ' + condition

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                if (type != 'pengelola') {
                    res.json({
                        status: 200,
                        message: `Success Get Users`,
                        data: {
                            nasabah: result
                        }
                    })
                } else {
                    const spreed = {
                        "admin": [],
                        "admin_master": [],
                        "officer": [],
                        "manager": []
                    }

                    result.forEach(each => {
                        spreed[each.role.toLowerCase()].push(each)
                    })

                    res.json({
                        status: 200,
                        message: `Success Get Users`,
                        data: spreed
                    })
                }
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "User Not Found"
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

    const handle_update_user = (err, result) => {
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
        await conn.query(query_find, [id_user], handle_update_user)
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
    user_list,
    update_user,
    delete_user
}

export default controller
