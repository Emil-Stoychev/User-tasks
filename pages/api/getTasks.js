import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken'

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let userData = jwt.decode(req?.headers.authorization)

        if (userData == null) {
            return res.json({ message: 'Invalid token, please login!' })
        }

        const tasks = await db.collection("tasks").find({ author: userData._id })
            //    .sort({ metacritic: -1 })
            //    .limit(10)
            .toArray();

        res.json(tasks);
    } catch (e) {
        console.error(e);
    }
};