import express from "express"
import controller from '../controllers/user.js'
import { admins, is_login} from '../../../middeware/access_auth.js'

const user = express.Router()

user.get('/', admins, controller.user_list)

user.put('/:id_user', is_login, controller.update_user)
user.delete('/:id_user', admins, controller.delete_user)


export default user
