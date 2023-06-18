import express from "express"
import controller from '../controllers/jualbeli.js'
import { is_login } from '../../../middeware/access_auth.js'

const jualbeli = express.Router()

jualbeli.get('/', is_login, controller.pembiayaan_list)

export default jualbeli