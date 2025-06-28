import jwt from 'jsonwebtoken';
// import { User } from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied, Unauthorized.' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
    
}