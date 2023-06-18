import express from "express"
import controller from '../controllers/kas.js'
import { internals, nasabah } from '../../../middeware/access_auth.js'

const kas = express.Router()

kas.get('/', internals, controller.kas_list)
kas.get('/rekap', internals, controller.rekap_kas)
kas.get('/rekap/profile', nasabah, controller.rekap_profile)

kas.post('/', internals, controller.create_kas)

export default kas