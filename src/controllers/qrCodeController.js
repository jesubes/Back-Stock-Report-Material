const { request, response } = require('express');
const qrcode = require('qrcode')
const {Client, LocalAuth} = require('whatsapp-web.js')


let qrCodeImage = null; //fromato base64 

const puppeteerOptions = {
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // '--disable-dev-shm-usage',
        // '--disable-accelerated-2d-canvas',
        // '--no-first-run',
        // '--no-zygote',
        // '--single-process', // Importante para evitar múltiples procesos en contenedores Docker
        // '--disable-gpu'
    ]
}

//validar la peticion
const client = new Client({
    puppeteer: puppeteerOptions,
    authStrategy: new LocalAuth() //mantener sesion local
})

client.once('ready', () =>{
    console.log('Cliente esta listo');
    
})

client.on('auth_failure', (msg) =>{
    console.error('Error en la autenticación', msg);

    
})


client.on('reconnecting', () =>{
    console.log('Intentando reconectar con WhatsApp Web...');
    
})

//generar el codigo
client.on('qr', async(qr) =>{
    console.log('Generando código QR...');
    
    //dar el codigo al frontend
    qrCodeImage = await qrcode.toDataURL(qr);
    console.log('Código listo para el Frontend...');
    
})


//inicializar
client.initialize();

//Generar el QR
const qrGenerate = (req, res) => {
    if(qrCodeImage){
        res.send(`<img src="${qrCodeImage}" alt="Código QR de WhapsApp">`)
    } else {
        res.send('<h2>El código QR aún no está disponible, por favor espera...</h2>')
    }
}


module.exports = {
    qrGenerate,
    client
}