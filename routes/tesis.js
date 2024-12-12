const express = require('express');
const router = express.Router();
const tesisController = require('../controllers/tesisControllers');
const multer = require('multer');

// Configuración de multer
const upload = multer({ storage: tesisController.storage });

// Rutas
router.post(
  '/tesis',
  upload.fields([
    { name: 'informeComiteEtica', maxCount: 1 },
    { name: 'dictamenAprobacionProyecto', maxCount: 1 }
  ]),
  tesisController.createTesis
);

router.put(
  '/tesis/:id/anexo30',
  upload.fields([
    { name: 'constanciaOriginalidad', maxCount: 1 },
    { name: 'codigoActaSustentacion', maxCount: 1 },
    { name: 'codigoReporteSimilitudCarta', maxCount: 1 },
    { name: 'reciboTurnitin', maxCount: 1 },
    { name: 'reporteSimilitud', maxCount: 1 }
  ]),
  tesisController.addAnexo30
);

router.get('/tesis/:id', tesisController.getTesisById);

module.exports = router;