import express from "express"
import controller from '../controllers/sukarela.js'
import { nasabah, is_login, officer } from '../../../middeware/access_auth.js'

const kerjasama = express.Router()

kerjasama.get('/', is_login, controller.pengajuan_list)
kerjasama.post('/', nasabah, controller.create_pengajuan)
kerjasama.put('/:id_pengajuan', nasabah, controller.update_pengajuan)
kerjasama.put('/approve/:id_pengajuan', officer, controller.approve_pengajuan)
kerjasama.delete('/:id_pengajuan', is_login, controller.delete_pengajuan)


export default kerjasama