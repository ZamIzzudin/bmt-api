import express from "express"
import controller from '../controllers/wajib.js'
import { is_login } from '../../../middeware/access_auth.js'

const wajib = express.Router()

wajib.get('/', is_login, controller.simpanan_list)

export default wajib