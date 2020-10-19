import Order from '../../models/Order';
import Authenticated from '../../helpers/Authenticated';
import initDB from '../../helpers/initDB';

initDB();

export default Authenticated(async (req, res) => {
    const orders = await Order.find({ user: req.userId }).populate("products.product")
    console.log('api/orders=', orders);
    res.status(200).json(orders);
})