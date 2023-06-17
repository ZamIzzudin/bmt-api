import connection from '../../../config/index.js'

const simpanan_list = async (req, res) => {
    const { status = null, bulan = null, tahun = null } = req.query
    const { id_nasabah } = req.params

    let condition = `WHERE simpanan.tipe_simpanan = 'Wajib' AND simpanan.id_nasabah = '${id_nasabah}' `

    if (status == 'belum-lunas') {
        condition = condition + `simpanan.status = 'BELUM LUNAS' `
    }

    if (bulan != null) {
        condition = condition + `simpanan.bulan = ${bulan} `
    }

    if (tahun != null) {
        condition = condition + `simpanan.tahun = ${tahun} `
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

    const query = `SELECT simpanan.id_nasabah, user.nama, simpanan.nominal, simpanan.tahun, COUNT(simpanan.tahun) as child_tahunan, COUNT(user.nama) as child_setoran FROM simpanan INNER JOIN user ON user.id_user=simpanan.id_nasabah WHERE tipe_simpanan = 'Wajib'`

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
    const { bulan = null, tahun = null } = req.query

    let condition = `WHERE simpanan.tipe_simpanan = 'Wajib' simpanan.status = 'BELUM LUNAS' `

    if (bulan != null) {
        condition = condition + `simpanan.bulan = ${bulan} `
    }

    if (tahun != null) {
        condition = condition + `simpanan.tahun = ${tahun} `
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

const controller = {
    simpanan_list,
    simpanan_parent_list,
    belum_lunas_list
}

export default controller