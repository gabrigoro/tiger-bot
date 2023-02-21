import { getBotStatus, startBot, stopBot } from "./botControl"
import express from 'express'
import { readFile } from 'fs'
import { logger } from "./logger"

const app = express()

app.get('/', (req, res) => {
    // procesar un SSR para mostar la pagina
    res.contentType('html')
    readFile('./public/index.html', (err, data) => {
        if (err) throw err
        res.send(data)
    })
})

app.get('/status', (req, res) => {
    const status = getBotStatus()
    res.send({ status })
})

// startBot()
app.get('/start', (req, res) => {
    if (getBotStatus() === 'online') return res.send({ status })
    startBot().then((status) => {
        res.send({status})
    })
})

app.get('/stop', (req, res) => {
    stopBot().then((status) => {
        res.send({status})
    })
})


app.listen(process.env.PORT, () => {
    logger.info(`Express server listening on ${process.env.PORT}`)
})