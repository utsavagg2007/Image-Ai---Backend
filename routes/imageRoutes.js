const express = require('express')
const { generateImage } = require('../controllers/imageController')
const authUser = require('../middlewares/auth')

const imageRouter = express.Router()

imageRouter.post('/generate-image', authUser, generateImage)

module.exports = imageRouter