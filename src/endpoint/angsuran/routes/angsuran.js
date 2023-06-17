import express from "express"
// import jualbeli from './jualbeli.js'
// import kerjasama from './kerjasama.js'
import sukarela from './sukarela.js'

const angsuran = express.Router()

// pengajuan.use('/jualbeli', jualbeli)
// pengajuan.use('/kerjasama', kerjasama)
angsuran.use('/sukarela', sukarela)


export default angsuran