import express from "express"
import controller from '../controllers/sukarela.js'
import { nasabah, is_login, approval } from '../../../middeware/access_auth.js'

const sukarela = express.Router()

sukarela.get('/', is_login, controller.pengajuan_list)
sukarela.post('/', nasabah, controller.create_pengajuan)
sukarela.put('/:id_pengajuan', nasabah, controller.update_pengajuan)
sukarela.put('/approve/:id_pengajuan', approval, controller.approve_pengajuan)
sukarela.put('/reject/:id_pengajuan', approval, controller.reject_pengajuan)
sukarela.delete('/:id_pengajuan', is_login, controller.delete_pengajuan)


export default sukarela