import express from "express"
import controller from '../controllers/kas.js'
import { internals } from '../../../middeware/access_auth.js'

const kas = express.Router()

kas.get('/', internals, controller.kas_list)
kas.post('/', internals, controller.create_kas)
kas.post('/rekap', internals, controller.rekap_kas)


export default kas