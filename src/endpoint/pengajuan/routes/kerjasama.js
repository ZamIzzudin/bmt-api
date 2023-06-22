import express from "express"
import controller from '../controllers/kerjasama.js'
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

const kerjasama = express.Router()

kerjasama.get('/', is_login, controller.pengajuan_list)
kerjasama.post('/', nasabah, upload.fields([{ name: 'foto_ktp', maxCount: 1 }, { name: 'foto_kk', maxCount: 1 }, { name: 'dokumen_rab', maxCount: 1 }]), controller.create_pengajuan)
kerjasama.put('/:id_pengajuan', nasabah, upload.fields([{ name: 'foto_ktp', maxCount: 1 }, { name: 'foto_kk', maxCount: 1 }, { name: 'dokumen_rab', maxCount: 1 }]), controller.update_pengajuan)
kerjasama.put('/approve/:id_pengajuan', officer, controller.approve_pengajuan)
kerjasama.put('/reject/:id_pengajuan', officer, controller.reject_pengajuan)
kerjasama.delete('/:id_pengajuan', is_login, controller.delete_pengajuan)


export default kerjasama