import clientPromise from "../../../lib/mongodb";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

const secret = 'iasoid2319S!@#$SDAFas'

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let userData = jwt.decode(req?.headers.authorization)

        let user = await db.collection('users').findOne({ _id: new ObjectId(userData?._id) })

        if (!user?._id) {
            return res.json({ message: 'Access denied!' })
        }

        await db.collection('tasks').deleteMany({ author: user?._id.toString() })
        await db.collection('users').deleteOne({ _id: user?._id })

        return res.json({ message: 'Successfully!' });
    } catch (e) {
        console.error(e);
    }
};