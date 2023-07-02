import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("UserTasks");

       const tasks = await db.collection("tasks").find()
        //    .sort({ metacritic: -1 })
        //    .limit(10)
           .toArray();

       res.json(tasks);
   } catch (e) {
       console.error(e);
   }
};