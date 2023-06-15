import { uid } from 'uid';
import { encrpyt_one_way, pairing_one_way } from '../../../utils/crypt.js'
import { create_access_token, create_refresh_token, verify_refresh_token } from '../../../utils/jwt.js'
import conn from '../../../config/index.js'

const register = async (req, res) => {
    const id_user = uid(16)
    const date = Date.now()
    const { username, password, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email, role } = req.body

    const query_find = 'SELECT * FROM user WHERE email = ?'

    const do_register = async () => {
        const encrypted_password = await encrpyt_one_way(password)
        const payload = [id_user, username, encrypted_password, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email, role.toUpperCase(), date]

        const query_regist = 'INSERT INTO user (id_user,username, password, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email,role, created_at) VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?)'
        const handle_register = (error, result) => {
            if (!error) {
                const access_token = create_access_token(id_user, role.toUpperCase());
                const refresh_token = create_refresh_token(id_user, role.toUpperCase())

                res.cookie("refreshToken", refresh_token, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //one day
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                })

                res.status(200).json({
                    status: 200,
                    message: `Success Register New Account with email : ${email}`,
                    data: { id_user, username, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email, role },
                    access_token
                })
            } else {
                console.log(error)
                res.status(404).json({
                    status: 404,
                    message: 'failed',
                    info: err
                })
            }
        }
        conn.query(query_regist, payload, handle_register)
    }

    const handle_check_exist = (err, result) => {
        if (!err) {
            if (result.length === 0) {
                do_register()
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Email Is Already Registrated, Use Another Email"
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

    await conn.query(query_find, [email], handle_check_exist)
}

const login = async (req, res) => {
    const { email, password } = req.body
    const payload = [email]

    const query = 'SELECT * FROM user WHERE email = ?'

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                const hashPassword = await pairing_one_way(password.toString(), result[0].password)

                if (hashPassword) {
                    const access_token = create_access_token(result[0].id_user, result[0].role.toUpperCase());
                    const refresh_token = create_refresh_token(result[0].id_user, result[0].role.toUpperCase())

                    res.cookie("refreshToken", refresh_token, {
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //one day
                        httpOnly: true,
                        secure: true,
                        sameSite: "none"
                    })

                    res.json({
                        status: 200,
                        message: `Success Login As User ${email}`,
                        data: {
                            id_user: result[0].id_user,
                            username: result[0].username,
                            nama: result[0].nama,
                            nik: result[0].nik,
                            jenis_kelamin: result[0].jenis_kelamin,
                            no_hp: result[0].no_hp,
                            alamat: result[0].alamat,
                            pekerjaan: result[0].pekerjaan,
                            no_rekening: result[0].no_rekening,
                            status_perkawinan: result[0].status_perkawinan,
                            email: result[0].email,
                            role: result[0].role.toUpperCase()
                        },
                        access_token
                    })
                } else {
                    res.status(400).json({
                        status: 400,
                        message: 'failed',
                        info: "Password doesn't match"
                    })
                }
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "User Isn't Registered"
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

    await conn.query(query, payload, handle_response)
}

const refresh_token = async (req, res) => {
    const { refreshToken } = req.cookies

    try {

        if (!refreshToken) {
            return res.status(400).json({
                status: 400,
                message: 'failed',
                info: 'Refresh token not found'
            })
        }

        verify_refresh_token(refreshToken, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'Forbidden Access'
                })
            }

            const access_token = create_access_token(decoded.id, decoded.role)
            const refresh_token = create_refresh_token(decoded.id, decoded.role)


            //send cookie with contain refresh token
            res.cookie("refreshToken", refresh_token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //one day
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })

            res.status(200).json({
                status: 200,
                message: 'Success refresh token',
                access_token
            })
        })

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'Server Error'
        })
    }
}


const testing = async (req, res) => {

    const query = 'SELECT * FROM user'

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Users}`,
                    data: result
                })

            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "User Isn't Registered"
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

    await conn.query(query, [], handle_response)
}


const controller = {
    register,
    login,
    testing,
    refresh_token
}

export default controller