const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/User');
const Tesis = require('../models/Tesis');
const verifyToken = require('../middlewares/jwt');

// Registro de usuario (con hash de contraseña)
const register = async (req, res, next) => {
  try {
    const { password, ...userData } = req.body;

    // Hashear la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserSchema.create({ ...userData, password: hashedPassword });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Login de usuario y generación de JWT
const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Datos recibidos:", email, password); // Verifies the received data

  try {
    const user = await UserSchema.findOne({ email });
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    //console.log("Usuario encontrado:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const response = {
      "birthdate": user.birthdate,
      "code": user.code,
      "documentNumber": user.documentNumber,
      "email": user.email,
      "fatherLastName": user.fatherLastName,
      "genre": user.genre,
      "motherLastName": user.motherLastName,
      "name": user.name,
      "status": user.status,
      "typeTesis": user.typeTesis,
      "userId": user._id,
    }
    console.log("Token generado:", token);
    res.status(200).json({ success: true, token, user: response });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



// Obtener todos los usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await UserSchema.find(); // Obtener todos los usuarios desde la base de datos
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// elimitar usuario por id y su tesis
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserSchema.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    await Tesis.deleteOne({ userId: id });
    await UserSchema.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Funciones adicionales (como getUser, updateUser, etc.) deben ser definidas también si las necesitas.

module.exports = {
  register,
  login,
  getUsers,
  deleteUser,
  // Otras funciones que puedas tener
};
