const express = require('express');
const { register, login, getUsers, deleteUser,  } = require('../controllers/user');
const router = express.Router();
const UserSchema = require('../models/User');
const verifyToken = require('../middlewares/jwt');

router.post('/register', register);
router.post('/login', login);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
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
    res.status(200).json({ user: response });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

module.exports = router;
