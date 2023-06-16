import express from "express"
import controller from '../controllers/kerjasama.js'
import { admins } from '../../../middeware/access_auth.js'

const kerjasama = express.Router()

kerjasama.get('/', admins, controller.user_list)

kerjasama.put('/:id_user', admins, controller.update_user)
kerjasama.delete('/:id_user', admins, controller.delete_user)


export default kerjasama