const express = require('express')
const router = express.Router()

const { register, login, setAvatar, getAllUsers, logOut } = require('../controllers/userController')


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/setAvatar/:id').post(setAvatar)
router.route('/allusers/:id').get(getAllUsers)
router.get("/logout/:id", logOut);


module.exports = router




