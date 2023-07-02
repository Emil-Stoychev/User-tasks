import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken'

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let userData = jwt.decode(req?.headers.authorization)

        if (userData == null) {
            return res.json({ message: 'Invalid token, please login!' })
        }

        await db.collection('tasks').deleteOne({ _id: new ObjectId(req.query.taskId) })

        return res.json({ taskId: req.query.taskId });
    } catch (e) {
        console.error(e);
    }
};