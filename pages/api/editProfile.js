import clientPromise from "../../lib/mongodb";
const bcrypt = require('bcrypt')
import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        let user = await db.collection('users').findOne({ _id: new ObjectId(req.body.userId) })

        if (!user?._id) {
            return res.json({ message: 'User not found!' })
        }

        let oldPass = await bcrypt.compare(req.body.oldPassword, user?.password)

        if (!oldPass) {
            return res.json({ message: "Wrong password!" })
        }

        let hashedPassword = await bcrypt.hash(req.body.newPassword, 10)

        await db.collection("users").updateOne(
            { _id: new ObjectId(req.body.userId) },
            {
                $set: {
                    password: hashedPassword,
                },
            }
        );

        return res.json({ message: 'Successfully!' });
    } catch (e) {
        console.error(e);
    };
};