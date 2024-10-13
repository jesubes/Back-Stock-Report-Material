const { request } = require("express");
const puppeteer = require('puppeteer')
const XLSX = require('xlsx');
// const {jsonToHtml} = require('./jpgConverController.js')

let resultFilter = null

const excelExtract = async (req = request, res) => {

    try {
        if (!req.file) {
            return res.status(400).send('No se cargó ningun archivo...');
        }

        //leer el archivo del buffer con XLSX
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

        //convertir la primera hoja a JSON
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const htmlData = XLSX.utils.sheet_to_html(worksheet)

        // const filterForStore = (data, storeFilter) => {

        //     return data.filter(store => store["Almacén"] === storeFilter)
        // }

        // resultFilter = filterForStore(jsonData, "S087")

        // console.log(resultFilter);

        // const htmlResult = await jsonToHtml(resultFilter)

        const styledHtml = `
             <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                ${htmlData}
            </body>
            </html>        
        `;

        return res.send(
            // htmlResult   
            // htmlData
            styledHtml
        )
    } catch (error) {
        console.error('Error al procesar el archivo:', error)
        res.status(500).send('Error al procesar el archivo...')
    }
}

const jsonFilter = () => {
    return JSON.stringify(resultFilter)
}


// devolver un json desde un excel
const excelToJson = async (req, res) => {

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];

    const sheetData = workbook.Sheets[sheetName] // con esto tengo la hoja de calculo que necesito pasar a JSON

    //convertir la hoja de cálculo a JSON
    const jsonData = XLSX.utils.sheet_to_json(sheetData);

    try{
        const resultDataFiletr = await filterToJSON(["Material", "Texto breve de material", "Libre utilización", "Lote", "Almacén"], jsonData)
    
        // console.log(resultDataFiletr);
    
        return res.send(resultDataFiletr)

    }catch(error) {
        console.log(error);
        res.status(500).json({message: 'Archivo No se subido..'})
    }
    //hardCode
}


//filtar datos con campos necesarios
const filterToJSON = (arrayFilter = [], jsonDataToFilter) => {
    let filterColumn = [];
    console.log('filter ->',arrayFilter);

    filterColumn = jsonDataToFilter.map(item => {
        const filteredItem = {};
        arrayFilter.forEach(key => {
            if (item[key] !== undefined) {
                filteredItem[key] = item[key];
            }
        });
     return filteredItem;
    })
    return filterColumn;
}


// json to image
const jsonToImage = async (jsonData, number) => {

    // console.log(jsonData);
    //Hay que tener en cuenta que es un array de objeto para crear una hoja de calculo de excel
    const newWorkSheet = XLSX.utils.json_to_sheet(jsonData)

    //convertir a html
    const tableHtml = XLSX.utils.sheet_to_html(newWorkSheet)

    //dar Estilo a la Tabla
    const styledHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charaset="UTF-8">
            <style>
                table{
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
            </style>
        </head>
        <body>
            ${tableHtml}
        </body>
        <body>
    `;

    // convertir el estilo a imagen
    const browser = await puppeteer.launch()
    const pageObj = await browser.newPage()
    await pageObj.setContent(styledHtml)

    //dimensiones
    const rowHeight = 20; // 20 px por fila
    const totalHeight = Math.min(rowHeight * jsonData.length, 1200);
    await pageObj.setViewport({
        width: 900,
        height: totalHeight
    })
    const jpqFilePath = `./reportImage/materiales${number}.jpg`
    
    try{
        await pageObj.screenshot({path: jpqFilePath, fullPage: true})
        await browser.close();
    
        return true

    }catch( error ){
        console.error( error )
    }
}


//Devolver un JSON de los contactos en excel
const excelToJsonContact = async (req, res) => {
    
    try{
        if(!req.file){
            return res.status(400).send('No se cargó ningun archivo...')
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });  //leer el archivo del buffer con XLSX

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];   //convertir la primera hoja a JSON

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        //TODO : hacer lo necesario para validar datos - como el nombre y su numero de telfono
        const resultDataFiletr = await filterToJSON(["Almacén","Nombre","Numero"], jsonData)

        //se vuelve sin capos vacios
        const resultNoNull = resultDataFiletr.filter((item) =>{ 
            if(item.Nombre && item.Numero){
                return item
            }
        })
        // console.log(resultNoNull);
        
        return res.send(resultNoNull);
    }catch (error) {
        console.log('Error al procesar el archivo: ', error);
        res.status(500).send('Error al procesar el archivo...')
    }
}


module.exports = {
    excelExtract,
    excelToJson,
    jsonFilter,
    jsonToImage,
    excelToJsonContact
}