const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/User');

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
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Token generado:", token);
    res.status(200).json({ success: true, token, user });
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

// Funciones adicionales (como getUser, updateUser, etc.) deben ser definidas también si las necesitas.

module.exports = {
  register,
  login,
  getUsers,
  // Otras funciones que puedas tener
};
