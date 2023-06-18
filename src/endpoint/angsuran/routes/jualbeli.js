import express from "express"
import controller from '../controllers/jualbeli.js'
import { is_login, admins } from '../../../middeware/access_auth.js'

const jualbeli = express.Router()

jualbeli.get('/:id_proses', is_login, controller.angsuran_list)
jualbeli.post('/setor/:id_proses', admins, controller.angsuran_setor)


export default jualbeli