const { Server } = require('socket.io');
const Poll = require('../models/pollModel');

let io;

const connectToSocket = (server) => {

    io = new Server( server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        }
    })

    io.on('connection', async(socket) => {

        socket.on('join-session', (sessionCode)=> {
            socket.join(sessionCode);
            socket.emit('success', { msg: 'session joined', status: "success" });
        })

        socket.on('submit-vote', async (data)=> {
            const { sessionCode, optionId } = data;

            try{
                let poll = await Poll.findOne({ sessionCode });

                if (!poll) {
                    return socket.emit('error', { type:"vote-error" , msg: 'Poll not found or expired' });
                }
    
                if (!poll.options.some(opt => opt._id.toString() === optionId)) {
                    return socket.emit('error', {type:"vote-error", msg: 'Invalid option selected' });
                }
                
                if(poll.expiresAt && new Date(poll.expiresAt) < new Date() && poll.status == 'expired') {
                    return socket.emit('error', {type: "vote-error", msg: 'Poll has been expired' });
                }

                let option = poll.options.find(opt => opt._id.toString() === optionId);
                option.votes += 1;
                await poll.save();

                io.to(sessionCode).emit('poll-update', {
                    options: poll.options,
                    totalVotes: poll.options.reduce((sum, o) => sum + o.votes, 0)
                });

            }catch(err){
                return socket.emit('error', {type:"vote-error", msg: 'Error while submitting vote', err: err.message });
            }
        });

        socket.on('update-vote', async (data)=> {
            const { sessionCode, prevOptionId, newOptionId } = data;

            try{
                let poll = await Poll.findOne({ sessionCode });

                if (!poll) {
                    return socket.emit('error', { type:"vote-error" , msg: 'Poll not found or expired' });
                }
    
                if (!poll.options.some(opt => opt._id.toString() === prevOptionId)) {
                    return socket.emit('error', {type:"vote-error", msg: 'Invalid option selected' });
                }
                
                if(poll.expiresAt && new Date(poll.expiresAt) < new Date() && poll.status == 'expired') {
                    return socket.emit('error', {type: "vote-error", msg: 'Poll has been expired' });
                }

                let prevOption = poll.options.find(opt => opt._id.toString() === prevOptionId);
                prevOption.votes -= 1;

                let newOption = poll.options.find(opt=> opt._id.toString()=== newOptionId);
                newOption.votes +=1;

                await poll.save();  

                io.to(sessionCode).emit('poll-update', {
                    options: poll.options,
                    totalVotes: poll.options.reduce((sum, o) => sum + o.votes, 0)
                });

            }catch(err){
                return socket.emit('error', {type:"vote-error", msg: 'Error while submitting vote', err: err.message });
            }
        });

        socket.on("expire-poll", async(data)=> {
            const{id, code} = data;
                try{
                    let poll = await Poll.findById(id).populate('createdBy');
                if(!poll){
                    socket.emit("error", {type:"poll-error", msg: "poll not found"});
                }
                poll.status = "expired";
                poll.expiresAt = Date.now();

                let newPoll = await poll.save();
                socket.emit("success", {msg: "Poll expired Successfully!"});
                io.to(code).emit("poll-update", {newPoll, msg: "Poll has been Expired or disabled by admin"});

            }catch(err){
              return socket.emit('error', {type:"poll-expiry-error", msg: 'Error while expiring poll', err: err.message });
            }
        })

        socket.on('disconnect', () => {
            
        });

    });
}

module.exports = { connectToSocket, getIo: ()=>io}