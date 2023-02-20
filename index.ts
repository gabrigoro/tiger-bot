import { startBot, stopBot } from "./botControl";
import express from 'express'

const app = express()

startBot()
app.get('/start', (req, res) => {
    res.send('Iniciando bot')
    startBot()
})

app.get('/stop', (req, res) => {
    res.send('Deteniendo bot')
    stopBot()
})

app.listen(process.env.PORT, () => {
    console.log(`Express server listening on ${process.env.PORT}`)
})