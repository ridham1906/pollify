const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.authController = async(req, res)=> {
    const {token} = req.body;

    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if(!user){
            user = new User({ email, name, googleId });
            await user.save();
        }

        const appToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token: appToken, user })

    }catch(error) {
        console.error('Error in auth:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
}