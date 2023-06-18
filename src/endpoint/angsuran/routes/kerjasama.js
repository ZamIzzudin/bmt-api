import express from "express"
import controller from '../controllers/kerjasama.js'
import { is_login, admins } from '../../../middeware/access_auth.js'

const kerjasama = express.Router()

kerjasama.get('/:id_proses', is_login, controller.angsuran_list)
kerjasama.post('/setor/:id_proses', admins, controller.angsuran_setor)


export default kerjasama