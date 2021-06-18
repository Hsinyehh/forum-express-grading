const userController = require('../controllers/userController')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
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

  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/admin', (req, res) => {
    res.redirect('/admin/restaurants')
  })

  //註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  //登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  //登出
  app.get('/logout', userController.logout)

  //新增
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  //瀏覽
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  //編輯
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  //刪除
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


  //後台(Restaurant)
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  //後台(User)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.putUser)

}
