const express = require('express')
const router = express.Router()
const adminControllers = require('./../controllers/adminController.js')
const menuControllers = require('./../controllers/menuController.js')
const {authenticateToken, isAdmin} = require('./../middlewares/auth.js')


router.get('/admin/users',adminControllers.viewUsers)
router.get('/admin/booking', adminControllers.viewUsers)
router.put('/admin/update', adminControllers.updateBookingStatus)


// Admin Routes that related to menu access
router.post('/admin/menuadd', menuControllers.addItem)
router.put('/admin/menuupdate', menuControllers.updateItem)
router.delete('/admin/menudelete', menuControllers.deleteItem)




module.exports = router