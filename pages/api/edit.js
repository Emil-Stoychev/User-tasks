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

        await db.collection("tasks").updateOne(
            { _id: new ObjectId(req.body.taskId) },
            {
                $set: {
                    title: req.body.data.title,
                    description: req.body.data.description,
                },
            }
        );

        let editedTask = await db.collection("tasks").findOne({ _id: new ObjectId(req.body.taskId) })

        return res.json(editedTask);
    } catch (e) {
        console.error(e);
    };
};