const Tesis = require('../models/Tesis');
const path = require('path');

// Configuración de multer para la subida de archivos
const multer = require('multer');

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

// Crear nueva tesis con documentos de anexo 11
exports.createTesis = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files || !req.files['informeComiteEtica'] || !req.files['dictamenAprobacionProyecto']) {
      return res.status(400).json({
        message: 'Debe incluir los documentos obligatorios del anexo 11: informe del comité de ética y dictamen de aprobación del proyecto.'
      });
    }

    const newTesis = new Tesis({
      userId,
      anexo11: {
        informeComiteEtica: {
          fileName: req.files['informeComiteEtica'][0].originalname,
          fileUrl: req.files['informeComiteEtica'][0].path,
          uploadDate: new Date()
        },
        dictamenAprobacionProyecto: {
          fileName: req.files['dictamenAprobacionProyecto'][0].originalname,
          fileUrl: req.files['dictamenAprobacionProyecto'][0].path,
          uploadDate: new Date()
        }
      },
      createdAt: new Date(),
      estado: 'En Proceso',
    });

    const savedTesis = await newTesis.save();
    res.status(201).json({
      message: 'Tesis creada exitosamente con documentos de anexo 11.',
      data: savedTesis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la tesis.', error });
  }
};

// Subir documentos al anexo 30
exports.addAnexo30 = async (req, res) => {
  try {
    const { id } = req.params;

    const tesis = await Tesis.findById(id);

    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    // Verificar si los documentos de anexo 11 están completos
    if (!tesis.anexo11 || !tesis.anexo11.informeComiteEtica || !tesis.anexo11.dictamenAprobacionProyecto) {
      return res.status(400).json({
        message: 'Debe completar primero los documentos del anexo 11 antes de subir archivos al anexo 30.'
      });
    }

    // Actualizar los documentos del anexo 30
    const anexo30Files = {};
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        anexo30Files[key] = {
          fileName: req.files[key][0].originalname,
          fileUrl: req.files[key][0].path,
          uploadDate: new Date()
        };
      });
    }

    tesis.anexo30 = { ...tesis.anexo30, ...anexo30Files };
    const updatedTesis = await tesis.save();

    res.status(200).json({
      message: 'Documentos del anexo 30 añadidos exitosamente.',
      data: updatedTesis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al añadir documentos al anexo 30.', error });
  }
};

// Obtener tesis por ID
exports.getTesisById = async (req, res) => {
  try {
    const { id } = req.params;

    const tesis = await Tesis.findById(id);

    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    res.status(200).json({
      message: 'Tesis encontrada.',
      data: tesis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la tesis.', error });
  }
};

// Puedes subir extras y vincularlos a la tesis