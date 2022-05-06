import { marked } from "marked";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { post } from "~/models/posts.server";
import { getPost } from "~/models/posts.server";
import invariant from "tiny-invariant";

type LoaderData = {
  post: post;
  html: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.content, `params.content is required`);

  const post = await getPost(params.content);
  invariant(post, `Post not found: ${params.content}`);

  const html = marked(post.markdown);
  return json<LoaderData>({ post, html });
};

export default function PostContent() {
  const { post, html } = useLoaderData() as LoaderData;
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </main>
  );
}
