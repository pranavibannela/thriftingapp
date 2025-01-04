import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Welcome to Thrift App</h1>
      <div className="space-x-4">
        <Link href="/auth?type=signup" className="px-6 py-2 bg-blue-500 text-white rounded">
          Sign Up
        </Link>
        <Link href="/auth?type=login" className="px-6 py-2 bg-blue-500 text-white rounded">
          Login
        </Link>
      </div>
    </div>
  );
}
