import express from "express"
import cron from "node-cron"
import wajib from './wajib.js'
import pokok from './pokok.js'
import sukarela from './sukarela.js'

import { generateSimpananWajib } from '../controllers/function.js'

const pengajuan = express.Router()

pengajuan.use('/wajib', wajib)
pengajuan.use('/pokok', pokok)
pengajuan.use('/sukarela', sukarela)

// Scheduler
cron.schedule('* * * * *', () => {
    generateSimpananWajib()
});


export default pengajuan