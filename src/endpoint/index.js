import express from "express"
import auth_user from "./auth/routes/auth.js"
import user from "./user/routes/user.js"


const endpoint = express.Router()

endpoint.get('/', (req, res) => { //welcome response endpoint
    res.json({
        status: 200,
        message: 'Welcome to BMT APP REST API',
        created_by: "azzam-ganteng-dev",
        version: "0.1 **dev**"
    })
})

endpoint.use('/auth', auth_user)
endpoint.use('/user', user)

endpoint.get('*', (req, res) => { //error response endpoint
    res.send({
        status: 404,
        message: 'Inappropriate command, please read documentation or contact the administrator',
        documentation: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    })
})


export default endpoint