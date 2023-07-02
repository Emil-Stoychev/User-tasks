import clientPromise from "../lib/mongodb";
import Layout from './Layout'

export default function Tasks({ tasks }) {
    return (
        <>
            <Layout>
                <div>
                    <h1>Top 20 Tasks of All Time</h1>
                    <p>
                        <small>(According to Metacritic)</small>
                    </p>
                    <ul>
                        {tasks.map((task) => (
                            <li key={task._id}>
                                <h2>{task.title}</h2>
                                <h3>{task.completed ? 'true' : 'false'}</h3>
                            </li>
                        ))}
                    </ul>
                </div>
            </Layout>
        </>
    );
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("UserTasks");

        const tasks = await db
            .collection("tasks")
            .find({})
            // .sort({ metacritic: -1 })
            // .limit(20)
            .toArray();

        return {
            props: { tasks: JSON.parse(JSON.stringify(tasks)) },
        };
    } catch (e) {
        console.error(e);
    }
}