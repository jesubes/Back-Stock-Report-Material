const { Router } = require('express');
const {qrGenerate} = require('../controllers/qrCodeController.js')


const router = Router();

//importar  middlewares


router.get('/', qrGenerate)

// POST
// router.post('/',)

// PUT

//DELETE


module.exports = router