import Stripe from 'stripe';
import { v4 as uuidV4 } from 'uuid';
import Cart from '../../models/Cart'
import Order from '../../models/Order'
import jwt from 'jsonwebtoken';
import initDB from '../../helpers/initDB'; 

initDB();
const stripe = Stripe(process.env.STRIPE_SECRET);

export default async (req, res) => {

    const { paymentInfo } = req.body;

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "No authorization in headers" })
    }
    try {
        const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
        const cart = await Cart.findOne({ user: userId }).populate("products.product")
        console.log(cart);
        let totalPrice = 0;
        cart.products.forEach(item => {
            totalPrice = totalPrice + (item.quantity * item.product.price)
        });

        const prevCustomer = await stripe.customers.list({
            email: paymentInfo.email
        })

        const isExistingCusomer = prevCustomer.data.length > 0;
        let newCustomer;
        if (!isExistingCusomer) {
            newCustomer = await stripe.customers.create({
                email: paymentInfo.email,
                source: paymentInfo.id
            })
        }
        console.log('newCustomer=', newCustomer)
        console.log('prevCustomer=', prevCustomer)

        const charge = await stripe.charges.create({
            currency: 'AUD',
            amount: totalPrice * 100,
            receipt_email: paymentInfo.email,
            customer: isExistingCusomer ? prevCustomer.data[0].id : newCustomer.id,
            description: `You purchased a product | ${paymentInfo.email}`
        }, {
            idempotencyKey: uuidV4()
        })

        console.log('charge=', charge);

        await new Order({
            user: userId,
            email: paymentInfo.email,
            total: totalPrice,
            products: cart.products
        }).save()

        await Cart.findOneAndUpdate(
            { _id: cart._id },
            { $set: { products: [] } }
        )

        res.status(200).json({ message: 'Payment was successful' })

    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "error processing payment" })
    }
}

