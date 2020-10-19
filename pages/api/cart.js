import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import Authenticated from '../../helpers/Authenticated';
import initDB from '../../helpers/initDB'; 

initDB();

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await fetchUserCart(req, res);
            break;
        case "PUT":
            await addProductToCart(req, res);
            break;
        case "DELETE":
            await deleteProductInCart(req, res);
            break;

    }
}

const deleteProductInCart = Authenticated(async (req, res) => {
    const { productId } = req.body;

    const updatedCart = await Cart.findOneAndUpdate(
        { user: req.userId },
        { $pull: { products: { product: productId } } },
        { new: true }
    ).populate("products.product")

    return res.status(200).json(updatedCart.products);
})

const fetchUserCart = Authenticated(async (req, res) => {
    const cartDoc = await Cart.findOne({ user: req.userId })
        .populate("products.product")
    return res.status(200).json(cartDoc.products);
})

const addProductToCart = Authenticated(async (req, res) => {
    const { quantity, productId } = req.body;
    console.log('quantity=', quantity, 'productId=', productId)
    const cart = await Cart.findOne({ user: req.userId });
    const isProdExistInCart = cart.products.some(pdoc => productId === pdoc.product.toString());
    if (isProdExistInCart) {
        await Cart.findOneAndUpdate(
            {
                _id: cart._id,
                "products.product": productId
            },
            { $inc: { "products.$.quantity": quantity } }
        )
    } else {
        const newProduct = { quantity, product: productId }
        await Cart.findByIdAndUpdate(
            { _id: cart._id },
            { $push: { products: newProduct } }
        )
    }
    return res.status(200).json({ message: 'Product added to Cart' });
})


