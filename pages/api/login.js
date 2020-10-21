import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import initDB from '../../helpers/initDB';
import User from '../../models/User';

initDB();

export default async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(422).json({ error: 'Please pass all the fields' })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: 'Invalid Credentials' })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (isPasswordMatched) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            })
            const { name, role, email } = user;
            console.log('api/login', user);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            return res.status(201).json({ token, user: { name, role, email } });
        } else {
            return res.status(401).json({ error: 'Invalid Credentials' })
        }
    } catch (err) {
        console.log(err);
    }
}
