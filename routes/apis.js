const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')

//後台(餐廳)
router.get('/admin/restaurants', adminController.getRestaurants)

router.get('/admin/restaurant/:id', adminController.getRestaurant)

//後台(Categoty)
router.get('/admin/categories', categoryController.getCategories)


module.exports = router