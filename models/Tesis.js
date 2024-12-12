const req = require('express/lib/request');
const mongoose = require('mongoose');

const TesisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anexo11: {
    informeComiteEtica: {
      type: Object,
      required: true,
      fileName: { type: String},
      fileUrl: { type: String},
      uploadDate: { type: Date}
    },
    dictamenAprobacionProyecto: {
      type: Object,
      required: true,
      fileName: { type: String},
      fileUrl: { type: String},
      uploadDate: { type: Date}
    }
  },
  anexo30: {
    constanciaOriginalidad: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date },
    },
    codigoActaSustentacion: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    codigoReporteSimilitudCarta: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    reciboTurnitin: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    reporteSimilitud: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    }
  },
  extras: {
    constanciaAmnistia: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    expedito: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    certificadoDeNoAdeudo: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    constanciaDeSolvencia: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    contanciaDeMatriculaEgreso: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    cartaCompromiso: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    cartaRenuncia: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    codigoResolucionJuradosFacu: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    codigoResolucionJuradosInfo: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    nExpedienteResolucionJuados: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    codigoResolucionAsesorFacu: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    codigoResolucionAsesorInfo: {
      type: Object,
      required: false,
      fileName: { type: String },
      fileUrl: { type: String },
      uploadDate: { type: Date }
    },
    envioDeResolucionesAsesor: {
      type: Object,
      required: false,
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
