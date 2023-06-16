import express from "express"
import controller from '../controllers/sukarela.js'
import { nasabah, is_login } from '../../../middeware/access_auth.js'

const sukarela = express.Router()

sukarela.get('/', is_login, controller.pengajuan_list)
sukarela.post('/', nasabah, controller.create_pengajuan)


sukarela.put('/:id_user', controller.update_user)
sukarela.delete('/:id_user', controller.delete_user)


export default sukarela