import jwt from 'jsonwebtoken';

function Authenticated(iComponent) {
    return (req, res) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ error: "No authorization in headers" })
        }
        try {
            const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
            req.userId = userId;
            return iComponent(req, res);
        } catch (err) {
            console.log(err);
            return res.status(401).json({ error: "You must login!" })
        }
    }
}

export default Authenticated;