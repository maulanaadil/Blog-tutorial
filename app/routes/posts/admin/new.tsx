import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/server-runtime";

import { createPost } from "~/models/posts.server";

type ActionData =
  | {
      title: null | string;
      content: null | string;
      markdown: null | string;
    }
  | undefined;

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const content = formData.get("content");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    content: content ? null : "Content is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  await createPost({ title, content, markdown });

  return redirect("/posts/admin");
};

export default function NewPost() {
  return (
    <Form method="post">
      <p>
        <label>
          Post Title{" "}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Content{" "}
          <input type="text" name="content" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
          <br />
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className={`${inputClassName} font-mono`}
          />
        </label>
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Submit
        </button>
      </p>
    </Form>
  );
}
