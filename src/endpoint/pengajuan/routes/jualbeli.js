import express from "express"
import controller from '../controllers/jualbeli.js'
import multer from "multer"
import { nasabah, is_login, officer } from '../../../middeware/access_auth.js'

//config images storage
const filestorage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    },
    limits: {
        fileSize: 50 * 1024 * 1024
    },
})

const upload = multer({ storage: filestorage })

const jualbeli = express.Router()

jualbeli.get('/', is_login, controller.pengajuan_list)
jualbeli.post('/', nasabah, upload.fields([{ name: 'foto_ktp', maxCount: 1 }, { name: 'foto_kk', maxCount: 1 }, { name: 'dokumen_rab', maxCount: 1 }]), controller.create_pengajuan)
jualbeli.put('/:id_pengajuan', nasabah, upload.fields([{ name: 'foto_ktp', maxCount: 1 }, { name: 'foto_kk', maxCount: 1 }, { name: 'dokumen_rab', maxCount: 1 }]), controller.update_pengajuan)
jualbeli.put('/approve/:id_pengajuan', officer, controller.approve_pengajuan)
jualbeli.put('/reject/:id_pengajuan', officer, controller.reject_pengajuan)
jualbeli.delete('/:id_pengajuan', is_login, controller.delete_pengajuan)


export default jualbeli