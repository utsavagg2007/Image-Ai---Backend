require('dotenv').config()
const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/userRoutes.js')
const connectDB = require('./configs/mongodb.js')
const imageRouter = require('./routes/imageRoutes.js')

// App Config
const PORT = process.env.PORT || 4000
const app = express();

// Intialize Middlewares
app.use(express.json())
app.use(cors())

// API routes
app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)

app.get('/', (req,res) => res.send("API Working"))

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => console.log('Server running on port ' + PORT))
}

startServer()
