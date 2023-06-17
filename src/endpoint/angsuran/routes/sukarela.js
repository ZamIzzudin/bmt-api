import express from "express"
import controller from '../controllers/sukarela.js'
import { is_login, admins } from '../../../middeware/access_auth.js'

const sukarela = express.Router()

sukarela.get('/:id_proses', is_login, controller.angsuran_list)
sukarela.post('/setor/:id_proses', admins, controller.angsuran_setor)
sukarela.post('/tarik/:id_proses', admins, controller.angsuran_tarik)


export default sukarela