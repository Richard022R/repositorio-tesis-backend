const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    fatherLastName: {
      type: String,
      required: [true, 'Please provide a fatherLastName'],
    },
    motherLastName: {
      type: String,
      required: [true, 'Please provide a motherLastName'],
    },
    birthdate: {
      type: Date,
      required: [true, 'Please provide a birthdate'],
    },
    genre: {
      type: String,
      required: [true, 'Please provide a genre'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    code: {
      type: String,
      required: [true, 'Please provide a code'],
    },
    documentNumber: {
      type: String,
      required: [true, 'Please provide a documentNumber'],
    },
    typeTesis: {
      type: String,
      required: [true, 'Please provide a typeTesis'],
      enum: ['Tesis', 'Suficiencia'],
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    role: {
      type: String,
      enum: ['admin', 'secretary', 'student'],
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
