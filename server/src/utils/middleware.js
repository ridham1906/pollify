const jwt = require('jsonwebtoken');

module.exports.jwtAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split('Bearer ')[1];
    if(!token){
        return res.status(401).json({ msg: 'Unauthorized! No token Found' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch(err){
        return res.status(401).json({ msg: 'Invalid Token' });
    }
}