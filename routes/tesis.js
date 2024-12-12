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

router.get('/tesis/user/:userId', tesisController.getTesisByUserId);

router.get('/tesis/anexo11/:tesisId', tesisController.getAnexo11Documents);
router.get('/tesis/anexo30/:tesisId', tesisController.getAnexo30Documents);
router.get('/tesis/extras/:tesisId', tesisController.getExtrasDocuments);
router.get('/tesis/download/:fileName', tesisController.downloadFile);

module.exports = router;