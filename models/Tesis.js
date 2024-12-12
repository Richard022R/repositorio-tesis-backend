const mongoose = require('mongoose');

const TesisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anexo11: {
    informeComiteEtica: {
      fileName: { type: String},
      fileUrl: { type: String},
      uploadDate: { type: Date}
    },
    dictamenAprobacionProyecto: {
      fileName: { type: String},
      fileUrl: { type: String},
      uploadDate: { type: Date}
    }
  },
  anexo30: {
    constanciaOriginalidad: {
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    codigoActaSustentacion: {
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    codigoReporteSimilitudCarta: {
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    reciboTurnitin: {
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    reporteSimilitud: {
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    enum: ['En Proceso', 'Revisión', 'Aprobado', 'Rechazado'],
    default: 'En Proceso',
    required: true
  }

}, { collection: 'tesis' });

module.exports = mongoose.model('Tesis', TesisSchema);
