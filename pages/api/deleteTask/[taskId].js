import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken'

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let userData = jwt.decode(req?.headers.authorization)

        if (!userData?._id) {
            return res.json({ message: "Invalid access token, please login!" })
        }

        let user = await db.collection('users').findOne({ _id: new ObjectId(userData?._id) })

        if (!user?._id) {
            return res.json({ message: 'User not found!' })
        }

        await db.collection('tasks').deleteOne({ _id: new ObjectId(req.query.taskId) })

        return res.json({ taskId: req.query.taskId });
    } catch (e) {
        console.error(e);
    }
};