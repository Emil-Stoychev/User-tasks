import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

const secret = 'iasoid2319S!@#$SDAFas'

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let userData = jwt.decode(req?.headers.authorization)

        if (userData == null) {
            return res.json({ message: 'Invalid token, please login!' })
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