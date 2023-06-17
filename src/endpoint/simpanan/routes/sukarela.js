import express from "express"
import controller from '../controllers/sukarela.js'
import { is_login } from '../../../middeware/access_auth.js'

const sukarela = express.Router()

sukarela.get('/', is_login, controller.simpanan_list)

export default sukarela