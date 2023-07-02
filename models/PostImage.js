const mongoose = require('mongoose')

const TaskImageSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: {
        type: String
    },
    thumbnail: {
        type: String
    },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
},
    { timestamps: true },
)

const TaskImage = mongoose.model('TaskImage', TaskImageSchema)

export default TaskImage