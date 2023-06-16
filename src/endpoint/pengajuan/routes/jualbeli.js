import express from "express"
import controller from '../controllers/jualbeli.js'
import { admins } from '../../../middeware/access_auth.js'

const jualbeli = express.Router()

jualbeli.get('/', admins, controller.user_list)

jualbeli.put('/:id_user', admins, controller.update_user)
jualbeli.delete('/:id_user', admins, controller.delete_user)


export default jualbeli