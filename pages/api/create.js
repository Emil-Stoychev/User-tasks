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