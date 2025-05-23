import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  editProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
    { name: "image6", maxCount: 1 },
    { name: "image7", maxCount: 1 },
    { name: "image8", maxCount: 1 },
    { name: "image9", maxCount: 1 },
    { name: "image10", maxCount: 1 },
  ]),
  addProduct
);

router.post(
  "/edit/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  editProduct
);

router.get("/list", listProducts);
router.post("/remove", removeProduct);
router.post("/single", singleProduct);

export default router;
