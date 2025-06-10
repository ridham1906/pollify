const Poll = require('../models/pollModel');
const User = require('../models/userModel');
const { genSessionCode } = require('../utils/genSessionCode');

const createPoll = async(req, res) => {
    const {que, options, expireAt} = req.body;

    if(!que || Array.isArray(options) && options.length < 2){
        return res.status(400).json({ error: 'Invalid Poll data' });
    }

    const code = genSessionCode();

    let finalExpireTime;
    if (expireAt) {
        const parsedDate = new Date(expireAt);
        if (!isNaN(parsedDate.getTime())) {
          finalExpireTime = parsedDate; 
        }
      }
   
    const newPoll = new Poll({
        question: que,
        options: options.map(option => ({ option })),
        sessionCode: code,
        createdBy: req.userId,
        expiresAt: finalExpireTime
    })

    await newPoll.save();

    await User.findByIdAndUpdate(req.userId, {
        $push: { polls: newPoll._id }
    });

    return res.status(201).json({ msg: 'Poll created successfully', sessionCode: code });
};


const getPollByCode = async(req, res) => {
    const { code } = req.params;

    try {
        const poll = await Poll.findOne({ sessionCode: code }).populate('createdBy', 'name email');

        if (!poll) {
            return res.status(404).json({ msg: 'Poll not Found' });
        }

        return res.status(200).json({ msg: 'Poll found', poll });
        
    }catch (err){
        return res.status(500).json({ msg: 'Internal server error', err: err.message });
    }
};

const pollsByAdmin = async(req, res)=> {
    const userId = req.userId;
    try {
        const polls = await Poll.find({ createdBy: userId })
        .sort({createdAt : -1})
        .populate('createdBy', 'name email');

        if (!polls || polls.length === 0) {
            return res.status(404).json({ msg: 'No polls found for current user' });
        }

        return res.status(200).json({ msg: 'Polls found', polls });
        
    } catch (err) {
        return res.status(500).json({ msg: 'Internal server error', err: err.message });
    }
}

const deletePoll = async (req, res) => {
    const { id } = req.params;
    try {
        const poll = await Poll.findOneAndDelete({ id, createdBy: req.userId });
        if (!poll) {
            return res.status(404).json({ msg: 'Poll not found' });
        }

        return res.status(200).json({ msg: 'Poll deleted successfully' });

    } catch (err) {
        return res.status(500).json({ msg: 'Error while deleting poll', err: err.message });
    }
};

module.exports = {
    createPoll, getPollByCode, pollsByAdmin, deletePoll
}