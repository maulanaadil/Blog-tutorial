import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import type { Post } from "~/models/posts.server";

import { getPosts } from "~/models/posts.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
  return json<LoaderData>({
    posts: await getPosts(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData() as LoaderData;
  console.log(posts);
  return (
    <main>
      <h1>Posts</h1>
      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
      <ul>
        {posts.map((post: Post) => (
          <li key={post.content}>
            <Link to={post.content} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
