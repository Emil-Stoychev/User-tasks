import Link from "next/link";

export default function Navigation() {
  return (
    <>
      <div>
        <Link href="/tasks">All tasks</Link>
        <Link href="/create">Create</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/">Logout</Link>
      </div>
    </>
  );
}
