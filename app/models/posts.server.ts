import type { post } from "@prisma/client";
import { prisma } from "~/db.server";

export type { post } from "@prisma/client";

export type Post = {
  title: string;
  content: string;
};

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(content: string) {
  return prisma.post.findUnique({ where: { content } });
}

export async function createPost(
  post: Pick<post, "content" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}
