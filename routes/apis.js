const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//後台(餐廳)
router.get('/admin/restaurants', adminController.getRestaurants)

router.get('/admin/restaurant/:id', adminController.getRestaurant)

//後台(Categoty)
router.get('/admin/categories', categoryController.getCategories)

router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)

module.exports = router