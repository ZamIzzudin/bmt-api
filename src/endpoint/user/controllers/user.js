import { verify_access_token } from '../../../utils/jwt.js'
import conn from '../../../config/index.js'

const user_list = async (req, res) => {
    const { type } = req.query
    const { authorization: raw_token } = req.headers

    const token = raw_token.split(' ')[1]

    let condition = "role = 'nasabah'"
    if (type === 'pengelola') {
        condition = "role = 'admin' OR role = 'admin_master' OR role = 'officer' OR role = 'manager'"
    }

    verify_access_token(token, async (error, result) => {
        if (!error) {
            if (result.role.toLowerCase() === 'admin' && type === 'pengelola') {
                return res.status(405).json({
                    status: 405,
                    message: 'unathorized',
                    info: 'you dont have valid access'
                })
            }
        } else {
            return res.status(405).json({
                status: 403,
                message: 'unathorized',
                info: 'token not found'
            })
        }
    })

    const query = 'SELECT username, nama, nik, jenis_kelamin, no_hp, alamat, pekerjaan, no_rekening, status_perkawinan, email, role FROM user WHERE ' + condition

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

    await conn.query(query, [], handle_response)
}


const controller = {
    user_list
}

export default controller