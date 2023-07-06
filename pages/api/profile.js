import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let userData = jwt.decode(req?.headers.authorization)

        if (userData == null) {
            return res.json({ message: 'Invalid token, please login!' })
        }

        let user = await db.collection('users').findOne({ _id: new ObjectId(userData._id) })

        if (user?._id == null) {
            return res.json({ message: 'User does not exist!' })
        }

        return res.json(user);
    } catch (e) {
        console.error(e);
    }
};