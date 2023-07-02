const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    images: {
        type: Array,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    visible: {
        type: String,
        enum: ['Public', 'Friends', 'Private'],
        default: 'Public'
    },
    likeCount: {
        type: Array
    },
},
    { timestamps: true },
)

const Task = mongoose.model('Task', taskSchema)

export default Task