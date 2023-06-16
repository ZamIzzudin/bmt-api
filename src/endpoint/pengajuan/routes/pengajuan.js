import express from "express"
import jualbeli from './jualbeli.js'
import sukarela from './sukarela.js'
import kerjasama from './kerjasama.js'

const pengajuan = express.Router()

pengajuan.use('/jualbeli', jualbeli)
pengajuan.use('/kerjsama', kerjasama)
pengajuan.use('/sukarela', sukarela)


export default pengajuan