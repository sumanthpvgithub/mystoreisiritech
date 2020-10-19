import Product from '../../../models/Product';
import initDB from '../../../helpers/initDB';

initDB();

export default async (req, res) => {
    switch (req.method) {
        case 'GET':
            await getProduct(req, res)
            break;
        case 'DELETE':
            await deleteProduct(req, res)
            break;
        default:

            break;
    }

}

const getProduct = async (req, res) => {
    try {
        console.log(req.query)
        const { pid } = req.query;
        const product = await Product.findOne({ _id: pid })
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({error: "internal server error - getProduct"})
        console.log(err);
    }
}

const deleteProduct = async (req, res) => {
    try {
        console.log(req.query)
        const { pid } = req.query;
        await Product.findOneAndDelete({ _id: pid })
        res.status(200).json({})
    } catch (err) {
        res.status(500).json({error: "internal server error - deleteProduct"})
        console.log(err);
    }
}

