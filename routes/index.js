const userController = require('../controllers/userController')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

module.exports = (app, passport) => {
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
  app.get('/', authenticated, (req, res) => {
    res.redirect('/restaurants')
  })

  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  app.get('/restaurants/top', authenticated, restController.getTopRestaurants)

  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  app.get('/restaurants', authenticated, restController.getRestaurants)



  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

  app.post('/like/:restaurantId', authenticated, userController.addLike)
  app.delete('/like/:restaurantId', authenticated, userController.removeLike)

  //前台(評論)
  app.post('/comments', authenticated, commentController.postComment)

  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  //前台(User)
  app.get('/users/top', authenticated, userController.getTopUser)
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  //前台(Follow)
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)



  //註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  //登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  //登出
  app.get('/logout', userController.logout)

  //後台(Restaurant)
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  //新增(Restaurant)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  //瀏覽(Restaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  //編輯(Restaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  //刪除(Restaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


  //後台(User)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUser)

  //後台(Category)
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)



}
