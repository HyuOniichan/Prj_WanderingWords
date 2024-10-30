const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: { type: String, required: true },
    content: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    thumbnail: {
        type: String, 
        default: 'https://i.sstatic.net/l60Hf.png'
    }, 
    tags: [String],
    comments: [String],
    status: String, 
}, {
    timestamps: true, 
})

module.exports = mongoose.model('Blog', blogSchema); 

