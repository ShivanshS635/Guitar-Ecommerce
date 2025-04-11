import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'

const app = express()
const PORT = process.env.PORT || 4000

connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors())
app.use('/api/user' , userRouter)
app.use('/api/product' , productRouter)

//api endpoints
app.get('/', (req, res) => {
  res.send('API Working');
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})