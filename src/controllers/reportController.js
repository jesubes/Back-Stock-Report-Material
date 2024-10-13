const { client: whp} = require('./qrCodeController.js')
const { MessageMedia } = require('whatsapp-web.js')
const { jsonToImage } = require('./excelConvertController');


//Solo enviar el reporte de excel converitdo a JSON
const reportForMsj = async (req, res) => {

    console.log('REPORT');
    //sacar el numero de query
    /* Traemos el JSON para sacar el celular del almacen ya filtrado,
        y los demas campos los enviamos a generar una imagen para enviar
        un archivo .jpg al celular
    
    */

    const {number = number.toString(), name} = req.query
    const jsonData = req.body
    
    //mandamos el JSON a convertir en imagen
    const imageJpg =  await jsonToImage(jsonData, number)
    
    //datos de whatsapp
    const prefix = '549'
    const chatId = `${prefix}${number}@c.us`.toString();
    const mediaWs = MessageMedia.fromFilePath(`./reportImage/materiales${number}.jpg`)
    console.log(chatId);
    
    
    try {
        const isRegistered = await whp.isRegisteredUser(`${chatId}`)
        if(isRegistered){
            await whp.sendMessage(chatId, `Hola ${name}, \nTe envio el stock en tu almacén: `)
            new Promise(resolve => setTimeout(resolve, 400));
            const response = await whp.sendMessage(chatId, mediaWs)
            console.log('Mensaje enviado ->', response.fromMe);
            
            return res.send({messageSent: response.fromMe})
            // return res.send({messageSent: 'ok MENSAJE'})
        }

    } catch (error) {
        console.error('Error al enviar mensaje', error)
        res.status(500).send(`Error al enviar el mensaje al numero: ${number}`)
    }
}


//MENSAJE TEST
const msjTest = async (req, res) => {
    console.log('TEST');

    const number = '5493816450030';
    const message = 'Este es el BOT DE JESUS de web'
    const chatId = `${number}@c.us`

    try {
        const response = await whp.sendMessage(chatId, 'media')
        console.log('Mensaje enviado ->', response._data.body);

    } catch (error) {
        console.error('Error al enviar mensaje', error)
        res.status(500).send(`Error al enviar el mensaje al numero: ${number}`)
    }

    return res.send('ok msj')
}


module.exports = {
    reportForMsj,
    msjTest
}