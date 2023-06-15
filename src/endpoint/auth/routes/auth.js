import express from "express"
import controller from '../controllers/auth.js'
import { is_login } from '../../../middeware/access_auth.js'

const auth_user = express.Router()

auth_user.post('/register', controller.register)
auth_user.post('/login', controller.login)

auth_user.get('/refresh', is_login, controller.refresh_token)

export default auth_user