import express from "express"
import controller from '../controllers/kerjasama.js'
import { is_login } from '../../../middeware/access_auth.js'

const kerjasama = express.Router()

kerjasama.get('/', is_login, controller.pembiayaan_list)

export default kerjasama