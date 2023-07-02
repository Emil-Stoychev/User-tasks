import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken'

const secret = 'iasoid2319S!@#$SDAFas'

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let userData = jwt.decode(req?.headers.authorization)

        if (userData == null) {
            return res.json({ message: 'Invalid token, please login!' })
        }

        let createTask = await db.collection("tasks").insertOne({
            title: req.body.title,
            description: req.body.description,
            completed: false,
            author: userData._id
        })

        let createdTask = await db.collection("tasks").findOne({ _id: createTask.insertedId })

        return res.json(createdTask);
    } catch (e) {
        console.error(e);
    }
};