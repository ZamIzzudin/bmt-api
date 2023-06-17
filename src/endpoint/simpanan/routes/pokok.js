import express from "express"
import controller from '../controllers/pokok.js'
import { internals } from '../../../middeware/access_auth.js'

const pokok = express.Router()

pokok.get('/', internals, controller.simpanan_list)

export default pokok