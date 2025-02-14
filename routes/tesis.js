const express = require('express');
const router = express.Router();
const tesisController = require('../controllers/tesisControllers');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
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

router.put(
  '/tesis/:id/extras',
  upload.fields([
    { name: 'constanciaAmnistia', maxCount: 1 },
    { name: 'expedito', maxCount: 1 },
    { name: 'certificadoDeNoAdeudo', maxCount: 1 },
    { name: 'constanciaDeSolvencia', maxCount: 1 },
    { name: 'contanciaDeMatriculaEgreso', maxCount: 1 },
    { name: 'cartaCompromiso', maxCount: 1 },
    { name: 'cartaRenuncia', maxCount: 1 },
    { name: 'codigoResolucionJuradosFacu', maxCount: 1 },
    { name: 'codigoResolucionJuradosInfo', maxCount: 1 },
    { name: 'nExpedienteResolucionJuados', maxCount: 1 },
    { name: 'codigoResolucionAsesorFacu',  maxCount: 1 },
    { name: 'codigoResolucionAsesorInfo', maxCount: 1 },
    { name: 'envioDeResolucionesAsesor', maxCount: 1 },
  ]),
  tesisController.addExtras
);

router.get('/tesis/:id', tesisController.getTesisById); 


router.get('/tesis/user/:userId', tesisController.getTesisByUserId); // inicio
router.get('/tesis/anexo11/:tesisId', tesisController.getAnexo11Documents); // anexo 11
router.get('/tesis/anexo30/:tesisId', tesisController.getAnexo30Documents); // anexo 30
router.get('/tesis/extras/:tesisId', tesisController.getExtrasDocuments); // extras


router.get('/tesis/download/:tesisId/:fileKey', tesisController.downloadFile);

router.get('/users/:userId/files', tesisController.getUserDocuments);

router.put('/tesis/:id', tesisController.updateTesisStatus);

// Nuevas rutas para actualizar documentos
router.put(
  '/tesis/:id/anexo11/update',
  upload.fields([
    { name: 'informeComiteEtica', maxCount: 1 },
    { name: 'dictamenAprobacionProyecto', maxCount: 1 }
  ]),
  tesisController.updateAnexo11
);

router.put(
  '/tesis/:id/anexo30/update',
  upload.fields([
    { name: 'constanciaOriginalidad', maxCount: 1 },
    { name: 'codigoActaSustentacion', maxCount: 1 },
    { name: 'codigoReporteSimilitudCarta', maxCount: 1 },
    { name: 'reciboTurnitin', maxCount: 1 },
    { name: 'reporteSimilitud', maxCount: 1 }
  ]),
  tesisController.updateAnexo30
);

router.put(
  '/tesis/:id/extras/update',
  upload.fields([
    { name: 'constanciaAmnistia', maxCount: 1 },
    { name: 'expedito', maxCount: 1 },
    { name: 'certificadoDeNoAdeudo', maxCount: 1 },
    { name: 'constanciaDeSolvencia', maxCount: 1 },
    { name: 'contanciaDeMatriculaEgreso', maxCount: 1 },
    { name: 'cartaCompromiso', maxCount: 1 },
    { name: 'cartaRenuncia', maxCount: 1 },
    { name: 'codigoResolucionJuradosFacu', maxCount: 1 },
    { name: 'codigoResolucionJuradosInfo', maxCount: 1 },
    { name: 'nExpedienteResolucionJuados', maxCount: 1 },
    { name: 'codigoResolucionAsesorFacu', maxCount: 1 },
    { name: 'codigoResolucionAsesorInfo', maxCount: 1 },
    { name: 'envioDeResolucionesAsesor', maxCount: 1 }
  ]),
  tesisController.updateExtras
);

// Ruta genérica para actualizar cualquier documento
router.put(
  '/tesis/:id/:documentType/:documentKey/update',
  upload.single('documento'),
  tesisController.updateDocument
);

module.exports = router;