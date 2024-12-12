const mongoose = require('mongoose');

const ProcedureSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please provide a type'],
    },
    status: {
      type: String,
      enum: ['in process', 'finished'],
      default: 'in process',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    trackingStep: [
      {
        name: {
          type: String,
          required: [true, 'Please provide a name'],
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Procedure', ProcedureSchema);