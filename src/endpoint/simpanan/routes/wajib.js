import express from "express"
import controller from '../controllers/wajib.js'
import { is_login, internals, admins } from '../../../middeware/access_auth.js'

const wajib = express.Router()

wajib.get('/', internals, controller.simpanan_parent_list)
wajib.get('/:id_nasabah', is_login, controller.simpanan_list)
wajib.get('/check/belum-setor', is_login, controller.belum_lunas_list)
wajib.put('/setor/:id_simpanan', admins, controller.setor_simpanan)

export default wajib