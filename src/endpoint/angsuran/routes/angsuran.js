import express from "express"
import jualbeli from './jualbeli.js'
import kerjasama from './kerjasama.js'
import sukarela from './sukarela.js'

const angsuran = express.Router()

angsuran.use('/jualbeli', jualbeli)
angsuran.use('/kerjasama', kerjasama)
angsuran.use('/sukarela', sukarela)


export default angsuran