const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    releasedDate: String
})

const User = mongoose.model('User', userSchema)

export default User