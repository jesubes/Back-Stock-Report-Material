const {Router} = require('express') 
const {excelExtract, excelToJson, excelToJsonContact} = require('../controllers/excelConvertController')
const multer = require('multer')

const router = Router();

const upload = multer({ storage: multer.memoryStorage() })

//Crear ruta para el ingreso del archivo
router.post('/', upload.single('fileExcel'), excelExtract)
//1. sacar el archivo del query
router.post('/json', upload.single('fileExcel'), excelToJson)

router.post('/contact', upload.single('fileContact'), excelToJsonContact)

//2. validar si excel

//3. validar valores

//4. convertir

//5. parsear los datos para cada usuario 

module.exports = router;