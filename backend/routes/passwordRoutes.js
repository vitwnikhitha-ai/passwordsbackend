const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const auth = require('../middleware/auth');

router.get('/', auth, passwordController.getPasswords);
router.post('/', auth, passwordController.addPassword);
router.put('/:id', auth, passwordController.updatePassword);
router.delete('/:id', auth, passwordController.deletePassword);

module.exports = router;
