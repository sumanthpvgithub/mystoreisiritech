import initDB from '../../helpers/initDB';
import Product from '../../models/Product';

initDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getAllProducts(req, res)
      break;
    case "POST":
      await saveProduct(req, res)
      break;
  }
}

const getAllProducts = async (req, res) => {
  try {
    Product.find().then(products => {
      res.status(200).json(products);
    })
  } catch (err) {
    res.status(500).json({ error: "internal server error - getAllProducts" })
    console.log(err);
  }
}

const saveProduct = async (req, res) => {
  const { name, price, description, mediaUrl } = req.body;
  try {
    if (!name || !price || !description || !mediaUrl) {
      return res.status(422).json({ error: "Please add all the fields - saveProduct" })
    }

    const product = await new Product({
      name, price, description, mediaUrl
    }).save()

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "internal server error - saveProduct" })
    console.log(err);
  }
}