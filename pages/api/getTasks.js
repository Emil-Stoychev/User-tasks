import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

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

        const tasks = await db.collection("tasks").find({ author: userData._id }).toArray();

        res.json(tasks);
    } catch (e) {
        console.error(e);
    }
};