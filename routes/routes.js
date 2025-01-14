const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/userController')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')



const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}


//前台
router.get('/', authenticated, (req, res) => {
  res.redirect('/restaurants')
})

router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

router.get('/restaurants/:id', authenticated, restController.getRestaurant)

router.get('/restaurants', authenticated, restController.getRestaurants)



router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

//前台(評論)
router.post('/comments', authenticated, commentController.postComment)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

//前台(User)
router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

//前台(Follow)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)



//註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
//登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
//登出
router.get('/logout', userController.logout)

//後台(Restaurant)
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

//新增(Restaurant)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

//瀏覽(Restaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

//編輯(Restaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

//刪除(Restaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


//後台(User)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUser)

//後台(Category)
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

module.exports = router



