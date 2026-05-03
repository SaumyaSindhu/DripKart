import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProductController(req, res) {
  const { title, description, priceAmount, priceCurrency } = req.body;

  const seller = req.user;

  try {
    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );

    const product = await productModel.create({
      title,
      description,
      price: {
        amount: priceAmount,
        currency: priceCurrency || "INR",
      },
      images,
      seller: seller._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getSellerProductsController(req, res) {
  const seller = req.user;

  try {

    const products = await productModel.find({ seller: seller._id})

    if (!products) {
      return res.status(404).json({
        message: "No products found"
      })
    }

    res.status(200).json({
      message: "Products fetched successfully",
      products
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
