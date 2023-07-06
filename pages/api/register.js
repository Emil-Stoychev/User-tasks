import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken'
const bcrypt = require('bcrypt')

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let user = await db.collection("users").findOne({ username: req.body.username })

        if (user == null) {
            let hashedPassword = await bcrypt.hash(req.body.password, 10)

            user = await db.collection("users").insertOne({
                username: req.body.username,
                password: hashedPassword,
            })

            user = await db.collection("users").findOne({ username: req.body.username })
        } else {
            return res.json({ message: 'User already exist!' })
        }

        let result = await new Promise((resolve, reject) => {
            jwt.sign({ _id: user?._id, username: user?.username }, process.env.secret, { expiresIn: '2d' }, (err, token) => {
                if (err) {
                    return reject(err)
                }

                resolve(token)
            })
        })

        return res.json(result);
    } catch (e) {
        console.error(e);
    }
};