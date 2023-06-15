import express from "express"
import controller from '../controllers/user.js'
import { admins } from '../../../middeware/access_auth.js'

const user = express.Router()

user.get('/', admins, controller.user_list)

user.put('/:id_user', admins, controller.update_user)
user.delete('/:id_user', admins, controller.delete_user)


export default user