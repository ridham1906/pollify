const {customAlphabet} = require('nanoid');
const nanoid = customAlphabet('0123456789', 6);

module.exports.genSessionCode = ()=>{
    return nanoid();
}