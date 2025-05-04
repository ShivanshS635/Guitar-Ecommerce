import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import connectPaypal from './config/paypal.js';
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import inquiryRouter from './routes/inquiryRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import galleryRouter from './routes/galleryRoutes.js'

const app = express()
const PORT = process.env.PORT || 4000

connectDB()
connectCloudinary()
connectPaypal()

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors())


app.use('/api/user' , userRouter)
app.use('/api/product' , productRouter)
app.use('/api/cart' , cartRouter)
app.use('/api/order' , orderRouter)
app.use('/api/reviews' , reviewRouter)
app.use('/api/inquiry' , inquiryRouter)
app.use('/api/contact', contactRouter);
app.use('/api/gallery' , galleryRouter)


app.get('/', (req, res) => {
  res.send('API Working');
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})