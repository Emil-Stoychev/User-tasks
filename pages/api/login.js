import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken'

const secret = 'iasoid2319S!@#$SDAFas'

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let user = await db.collection("users").findOne({ username: req.body.username, password: req.body.password })

        if (user == null) {
            return res.json({ message: `Username or password dont't match!` })
        }

        let result = await new Promise((resolve, reject) => {
            jwt.sign({ _id: user?._id, username: user?.username }, secret, { expiresIn: '2d' }, (err, token) => {
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