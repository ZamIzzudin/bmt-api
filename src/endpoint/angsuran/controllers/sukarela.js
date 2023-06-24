import connection from '../../../config/index.js'
import { verify_access_token } from '../../../utils/jwt.js'
import { kas_masuk, kas_keluar } from '../../kas/controllers/function.js'
import { uid } from 'uid';


const angsuran_list = async (req, res) => {
    const { id_proses } = req.params
    const { search } = req.query

    const query = `SELECT * FROM angsuran WHERE id_proses = ?`

    //Fix search query
    if (search) {
        query += ` AND (id_angsuran LIKE '%${search}%')`;
   }

    const handle_response = async (err, result) => {
        if (!err) {
            if (result.length > 0) {
                res.json({
                    status: 200,
                    message: `Success Get Angsuran List`,
                    data: result
                })
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'failed',
                    info: "Angsuran Not Found"
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
        await conn.query(query, [id_proses], handle_response)
        conn.release();
    })
}

const angsuran_setor = async (req, res) => {
    const { id_proses } = req.params
    const { nominal } = req.body
    const { authorization: raw_token } = req.headers

    const id_angsuran = uid(16)
    const token = raw_token.split(' ')[1]

    var payload = [id_angsuran, id_proses, 'Setor', nominal]

    const query = `INSERT INTO angsuran (id_angsuran, id_proses, tipe_angsuran, nominal, teller) VALUES (?,?,?,?,?)`
    const query_find = `SELECT nominal FROM simpanan WHERE id_simpanan = ?`

    verify_access_token(token, async (error, result) => {
        if (!error) {
            payload.push(result.name)
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
            res.json({
                status: 200,
                message: `Success Generate Angsuran`,
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
        await conn.query(query_find, [id_proses], async (error, data) => {
            if (!error) {
                const catatan = 'Angsuran Setoran Simpanan Sukarela Masuk'
                const query_update = `UPDATE simpanan SET nominal = ? WHERE id_simpanan = ?`
                const new_nominal = data[0].nominal + nominal

                kas_masuk(nominal, catatan)

                await conn.query(query_update, [new_nominal, id_proses], async (error, result) => {
                    if (!error) {
                        await conn.query(query, payload, handle_response)
                    }
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    message: 'Rekening Tidak Ditemukan',
                })
            }
        })
        conn.release();
    })
}

const angsuran_tarik = async (req, res) => {
    const { id_proses } = req.params
    const { nominal } = req.body
    const { authorization: raw_token } = req.headers

    const id_angsuran = uid(16)
    const token = raw_token.split(' ')[1]

    var payload = [id_angsuran, id_proses, 'Tarik', nominal]

    const query = `INSERT INTO angsuran (id_angsuran, id_proses, tipe_angsuran, nominal, teller) VALUES (?,?,?,?,?)`
    const query_find = `SELECT nominal FROM simpanan WHERE id_simpanan = ?`

    verify_access_token(token, async (error, result) => {
        if (!error) {
            payload.push(result.name)
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
            res.json({
                status: 200,
                message: `Success Generate Angsuran`,
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
        await conn.query(query_find, [id_proses], async (error, data) => {
            if (!error) {
                if (data[0].nominal >= nominal) {
                    const catatan = 'Penarikan Simpanan Sukarela Keluar'
                    const query_update = `UPDATE simpanan SET nominal = ? WHERE id_simpanan = ?`
                    const new_nominal = data[0].nominal - nominal

                    kas_keluar(nominal, catatan)

                    await conn.query(query_update, [new_nominal, id_proses], async (error, result) => {
                        if (!error) {
                            await conn.query(query, payload, handle_response)
                        }
                    })

                } else {
                    return res.status(400).json({
                        status: 400,
                        message: 'Nominal Tidak Mencukupi Untuk Melakukan Penarikan',
                    })
                }
            } else {
                return res.status(404).json({
                    status: 404,
                    message: 'Rekening Tidak Ditemukan',
                })
            }
        })
        conn.release();
    })
}

const controller = {
    angsuran_list,
    angsuran_setor,
    angsuran_tarik
}

export default controller
