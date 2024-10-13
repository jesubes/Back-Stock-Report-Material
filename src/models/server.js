const express = require('express')
const cors = require('cors')
const {PORT} = require('../.env')

require('dotenv').config();

class Server{
    constructor() {
        this.app = express();
        
        this.port = process.env.PORT

        this.paths ={
            qrcode:     '/api/qrcode',
            report:     '/api/report',
            excel:      '/api/excel',
            contact:    '/api/contact'
        }

        //this.conectarDB();

        this.middlewares();
        
        this.routes();
    }

    middlewares() {
        this.app.use( express.json() )
        this.app.use(cors())
    }

    routes() {
        this.app.use( this.paths.qrcode, require('../routes/qrCode.js'));
        this.app.use( this.paths.report, require('../routes/report.js'));
        this.app.use( this.paths.excel, require('../routes/excelConvert'))
        this.app.use( this.paths.contact, require('../routes/excelConvert.js'))
    }

    listen() {
        this.app.listen( this.port, ()=>{
            console.log('Servidor corriendo en el puerto --> ', this.port)
        })
    }
}

module.exports = Server;