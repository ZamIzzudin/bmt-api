import { uid } from 'uid';
import { encrpyt_one_way, pairing_one_way } from '../../../utils/crypt.js'
import { create_access_token, create_refresh_token, verify_refresh_token } from '../../../utils/jwt.js'
import conn from '../../../config/index.js'

const register = async (req, res) => {
    const id_user = uid(16)
    const { nama, no_telp, asal_prov, asal_kab, email, password } = req.body

    const query_find = 'SELECT * FROM tb_user WHERE email = ?'

    const do_register = async () => {
        const encrypted_password = await encrpyt_one_way(password)
        const payload = [id_user, nama, no_telp, asal_prov, asal_kab, "not defined", email, encrypted_password]

        const query_regist = 'INSERT INTO tb_user (id_user, nama, no_telp, asal_prov, asal_kab, foto_profile, email, password) VALUE (?,?,?,?,?,?,?,?)'

        const handle_register = (error, result) => {
            if (!error) {
                const access_token = create_access_token(id_user, 'User');
                const refresh_token = create_refresh_token(id_user, 'User')

                res.cookie("refreshToken", refresh_token, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //one day
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                })

                res.status(200).json({
                    status: 200,
                    message: `Success Register New User with email : ${email}`,
                    data: {
                        id: result[0].id_user,
                        nama: result[0].nama,
                        no_telp: result[0].no_telp,
                        email: result[0].email,
                        asal_kab: result[0].asal_kab,
                        asal_prov: result[0].asal_prov,
                        foto_profile: result[0].foto_profile,
                        deskripsi: result[0].deskripsi
                    },
                    access_token
                })
            } else {
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

    const query = 'SELECT * FROM tb_user WHERE email = ?'

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                const hashPassword = await pairing_one_way(password.toString(), result[0].password)

                if (hashPassword) {
                    const access_token = create_access_token(result[0].id_user, 'User');
                    const refresh_token = create_refresh_token(result[0].id_user, 'User')

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
                            id: result[0].id_user,
                            nama: result[0].nama,
                            no_telp: result[0].no_telp,
                            email: result[0].email,
                            asal_kab: result[0].asal_kab,
                            asal_prov: result[0].asal_prov,
                            foto_profile: result[0].foto_profile,
                            deskripsi: result[0].deskripsi
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

const controller = {
    register,
    login,
    refresh_token
}

export default controller