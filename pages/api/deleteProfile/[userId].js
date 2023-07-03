import clientPromise from "../../../lib/mongodb";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

const secret = 'iasoid2319S!@#$SDAFas'

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let user = await db.collection('users').findOne({ _id: new ObjectId(req.query.userId) })

        if (user._id == null) {
            return res.json({ message: 'User does not exist!' })
        }

        await db.collection('tasks').deleteMany({ author: user?._id.toString() })
        await db.collection('users').deleteOne({ _id: user?._id })

        return res.json({ message: 'Successfully!' });
    } catch (e) {
        console.error(e);
    }
};