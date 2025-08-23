const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const userModel = require('../models/userModel')

// Controller function to generate image from prompt
// http://localhost:4000/api/image/generate-image
const generateImage = async (req, res) => {

  try {

    const userId = req.user.id;
    const { prompt } = req.body

    // Fetching User Details Using userId
    const user = await userModel.findById(userId)
    
    if (!user || !prompt) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    // Checking User creditBalance
    if (user.creditBalance <= 0) {
      return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
    }

    // Creation of new multi/part formdata
    const formdata = new FormData()
    formdata.append('prompt', prompt)

    // Calling Clipdrop API
    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formdata, {
      headers: {
        'x-api-key': process.env.CLIPDROP_API,
      },
      responseType: "arraybuffer"
    })

    // Convertion of arrayBuffer to base64
    const base64Image = Buffer.from(data, 'binary').toString('base64');
    const resultImage = `data:image/png;base64,${base64Image}`

    // Deduction of user credit 
    await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

    // Sending Response
    res.json({ success: true, message: "Image Generated Successfully", resultImage, creditBalance: user.creditBalance - 1 })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

module.exports = { generateImage }