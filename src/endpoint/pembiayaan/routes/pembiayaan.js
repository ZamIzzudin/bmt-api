import express from "express"
import kerjasama from './kerjasama.js'
import jualbeli from './jualbeli.js'


const pembiayaan = express.Router()

pembiayaan.use('/kerjasama', kerjasama)
pembiayaan.use('/jualbeli', jualbeli)


export default pembiayaan