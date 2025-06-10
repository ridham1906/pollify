const User = require('../models/userModel');

module.exports.getUser = async(req, res) => {
    try{

        const userId = req.userId;
        
        let user = await User.findById(userId).populate('polls');
        console.log(user);

        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(200).json({ msg: 'User found', user });

    }catch(err){
        return res.status(500).json({ error: 'Internal server error', err: err.message });
    }
} 