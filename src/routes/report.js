const { Router } = require('express')
const { msjTest, reportForMsj} = require('../controllers/reportController.js')


const router = Router();

//importar middlewares

// importar controladores de CONTROLLERS

router.get('/', msjTest)

//POST
//**Crear una imagen con un almacen ya filtrado del frontend en un JSON */
router.post('/', reportForMsj)

//PUT

//DELETE

module.exports = router