const { get } = require('mongoose');
const Tesis = require('../models/Tesis');
const User = require('../models/User');


// Crear nueva tesis con documentos de anexo 11
exports.createTesis = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validar datos de entrada
    if (!userId) {
      return res.status(400).json({ message: 'El campo userId es obligatorio.' });
    }

    if (
      !req.files || 
      !req.files['informeComiteEtica'] || 
      !req.files['dictamenAprobacionProyecto']
    ) {
      return res.status(400).json({
        message: 'Debe incluir los documentos obligatorios del anexo 11: informe del comité de ética y dictamen de aprobación del proyecto.',
      });
    }

    // Buscar usuario
    const userFind = await User.findById(userId);
    if (!userFind) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Crear nueva tesis
    const newTesis = new Tesis({
      userId,
      anexo11: {
        informeComiteEtica: {
          fileName: req.files['informeComiteEtica'][0].originalname,
          fileUrl: req.files['informeComiteEtica'][0].path,
          uploadDate: new Date(),
        },
        dictamenAprobacionProyecto: {
          fileName: req.files['dictamenAprobacionProyecto'][0].originalname,
          fileUrl: req.files['dictamenAprobacionProyecto'][0].path,
          uploadDate: new Date(),
        },
      },
      createdAt: new Date(),
      estado: 'En Proceso',
    });

    // Actualizar estado del usuario
    userFind.status = 1;
    await userFind.save();

    // Preparar respuesta del usuario
    const userResponse = {
      birthdate: userFind.birthdate,
      code: userFind.code,
      documentNumber: userFind.documentNumber,
      email: userFind.email,
      fatherLastName: userFind.fatherLastName,
      genre: userFind.genre,
      motherLastName: userFind.motherLastName,
      name: userFind.name,
      status: userFind.status,
      typeTesis: userFind.typeTesis,
      userId: userFind._id,
    };

    // Guardar tesis
    const savedTesis = await newTesis.save();

    // Respuesta exitosa
    res.status(201).json({
      message: 'Tesis creada exitosamente con documentos de anexo 11.',
      data: savedTesis,
      user: userResponse,
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

// subir documentos al extras
exports.addExtras = async (req, res) => {
  try {
    const { id } = req.params;

    const tesis = await Tesis.findById(id);

    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    // Actualizar los documentos de extras
    const extrasFiles = {};
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        extrasFiles[key] = {
          fileName: req.files[key][0].originalname,
          fileUrl: req.files[key][0].path,
          uploadDate: new Date()
        };
      });
    }

    tesis.extras = { ...tesis.extras, ...extrasFiles };
    const updatedTesis = await tesis.save();

    res.status(200).json({
      message: 'Documentos de extras añadidos exitosamente.',
      data: updatedTesis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al añadir documentos de extras.', error });
  }
};

// obtener tesis por id de usuario
exports.getTesisByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const tesis = await Tesis.findOne({ userId });

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

// descargar documento de tesis
exports.downloadFile = async (req, res) => {
  try {
    const { tesisId, fileKey } = req.params;

    const tesis = await Tesis.findById(tesisId);

    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    if (!tesis.anexo11 || !tesis.anexo30 || !tesis.extras) {
      return res.status(404).json({ message: 'No se encontraron archivos para descargar.' });
    }

    const file = tesis.anexo11[fileKey] || tesis.anexo30[fileKey] || tesis.extras[fileKey];

    if (!file) {
      return res.status(404).json({ message: 'Archivo no encontrado.' });
    }

    res.download(file.fileUrl);
    console.log(file.fileUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al descargar el archivo.', error });
  }
};

// obtener los documentos de la tesis en anexo 11
exports.getAnexo11Documents = async (req, res) => {
  try {
    const { tesisId } = req.params;

    const tesis = await Tesis.findById(tesisId);

    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    res.status(200).json({
      message: 'Documentos de Anexo 11 obtenidos.',
      data: tesis.anexo11 || {}
    });
  } catch (error) {
    console.error('Error in getAnexo11Documents:', error);
    res.status(500).json({ message: 'Error al obtener los documentos.', error: error.message });
  }
};

// obtener todos los documentos de un usuario
exports.getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const tesis = await Tesis.findOne({ userId });
    console.log(tesis);
    if (!tesis) { 
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    res.status(200).json({
      message: 'Documentos de usuario obtenidos.',
      data: {tesis, user}
    });
  }
  catch (error) {
    console.error('Error in getUserDocuments:', error);
    res.status(500).json({ message: 'Error al obtener los documentos.', error: error.message });
  }
};

// actualizar el status de la tesis
exports.updateTesisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const tesis = await Tesis.findById(id);

    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    tesis.estado = estado;
    const updatedTesis = await tesis.save();

    res.status(200).json({
      message: 'Estado de la tesis actualizado.',
      data: updatedTesis
    });
  } catch (error) {
    console.error('Error in updateTesisStatus:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la tesis.', error: error.message });
  }
};

exports.getAnexo30Documents = async (req, res) => {
  try {
    const { tesisId } = req.params;

    const tesis = await Tesis.findById(tesisId);

    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    res.status(200).json({
      message: 'Documentos de Anexo 30 obtenidos.',
      data: tesis.anexo30 || {}
    });
  } catch (error) {
    console.error('Error in getAnexo30Documents:', error);
    res.status(500).json({ message: 'Error al obtener los documentos.', error: error.message });
  }
};

exports.getExtrasDocuments = async (req, res) => {
  try {
    const { tesisId } = req.params;

    const tesis = await Tesis.findById(tesisId);

    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    res.status(200).json({
      message: 'Documentos Extras obtenidos.',
      data: tesis.extras || {}
    });
  } catch (error) {
    console.error('Error in getExtrasDocuments:', error);
    res.status(500).json({ message: 'Error al obtener los documentos.', error: error.message });
  }
};

// Actualizar documentos del Anexo 11
exports.updateAnexo11 = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tesis = await Tesis.findById(id);
    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    // Actualizar solo los documentos que se enviaron
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        tesis.anexo11[key] = {
          fileName: req.files[key][0].originalname,
          fileUrl: req.files[key][0].path,
          uploadDate: new Date()
        };
      });
    }

    const updatedTesis = await tesis.save();

    res.status(200).json({
      message: 'Documentos del anexo 11 actualizados exitosamente.',
      data: updatedTesis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar documentos del anexo 11.', error });
  }
};

// Actualizar documentos específicos del Anexo 30
exports.updateAnexo30 = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tesis = await Tesis.findById(id);
    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    // Verificar si existe el anexo 11 antes de actualizar el 30
    if (!tesis.anexo11 || !tesis.anexo11.informeComiteEtica || !tesis.anexo11.dictamenAprobacionProyecto) {
      return res.status(400).json({
        message: 'Debe completar primero los documentos del anexo 11.'
      });
    }

    // Actualizar solo los documentos que se enviaron
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        tesis.anexo30[key] = {
          fileName: req.files[key][0].originalname,
          fileUrl: req.files[key][0].path,
          uploadDate: new Date()
        };
      });
    }

    const updatedTesis = await tesis.save();

    res.status(200).json({
      message: 'Documentos del anexo 30 actualizados exitosamente.',
      data: updatedTesis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar documentos del anexo 30.', error });
  }
};

// Actualizar documentos extras
exports.updateExtras = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tesis = await Tesis.findById(id);
    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    // Actualizar solo los documentos que se enviaron
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        tesis.extras[key] = {
          fileName: req.files[key][0].originalname,
          fileUrl: req.files[key][0].path,
          uploadDate: new Date()
        };
      });
    }

    const updatedTesis = await tesis.save();

    res.status(200).json({
      message: 'Documentos extras actualizados exitosamente.',
      data: updatedTesis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar documentos extras.', error });
  }
};

// Función genérica para actualizar cualquier documento
exports.updateDocument = async (req, res) => {
  try {
    const { id, documentType, documentKey } = req.params;
    
    const tesis = await Tesis.findById(id);
    if (!tesis) {
      return res.status(404).json({ message: 'Tesis no encontrada.' });
    }

    // Validar que el tipo de documento existe
    if (!['anexo11', 'anexo30', 'extras'].includes(documentType)) {
      return res.status(400).json({ message: 'Tipo de documento no válido.' });
    }

    // Validar que existe el archivo
    if (!req.files || !req.files[documentKey]) {
      return res.status(400).json({ message: 'No se ha proporcionado ningún archivo.' });
    }

    // Actualizar el documento específico
    tesis[documentType][documentKey] = {
      fileName: req.files[documentKey][0].originalname,
      fileUrl: req.files[documentKey][0].path,
      uploadDate: new Date()
    };

    const updatedTesis = await tesis.save();

    res.status(200).json({
      message: `Documento ${documentKey} actualizado exitosamente.`,
      data: updatedTesis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el documento.', error });
  }
};
