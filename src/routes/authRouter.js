const router = require("express").Router()
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMIddleware");

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.put('/update', authMiddleware, authController.updateUser);

module.exports = router;