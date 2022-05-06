import { Form, useActionData, useTransition } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";

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
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));
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

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof content === "string", "content must be a string");
  invariant(typeof markdown === "string", "title markdown be a string");

  await createPost({ title, content, markdown });

  return redirect("/posts/admin");
};

export default function NewPost() {
  const errors = useActionData();
  const transition = useTransition();

  const isCreating = Boolean(transition.submission);
  return (
    <Form method="post">
      <p>
        <label>
          Post Title{" "}
          {errors?.title && <em className="text-red-600">{errors.title}</em>}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          Post Content{" "}
          {errors?.content && (
            <em className="text-red-600">{errors.content}</em>
          )}
          <input type="text" name="content" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown && (
            <em className="text-red-600">{errors.markdown}</em>
          )}
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
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
