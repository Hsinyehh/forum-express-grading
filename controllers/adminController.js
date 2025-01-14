const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService.js')


const adminController = {
  //Restaurant
  //Done
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories: categories
      })
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, (data) => {
      return res.render('admin/create', data)
    })
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(res, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
  },

  //User
  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => { return res.render('admin/users', { users: users }) })
  },

  putUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (user.isAdmin) {
          user.update({ isAdmin: 0 })
        }
        else {
          user.update({ isAdmin: 1 })
        }

      })
      .then(() => {
        req.flash('success_messages', 'user was successfully to update')
        res.redirect('/admin/users')
      })
      .catch(error => console.log(error))
  }

}

module.exports = adminController