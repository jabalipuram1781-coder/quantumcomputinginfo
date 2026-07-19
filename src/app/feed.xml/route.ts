import { Feed } from "feed";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/constants";

export async function GET() {
  const posts = await getAllPosts();
  
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: siteConfig.language,
    image: `${siteConfig.url}${siteConfig.defaultOgImage}`,
    favicon: `${siteConfig.url}${siteConfig.favicon}`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.name}`,
    feedLinks: {
      rss: `${siteConfig.url}/feed.xml`,
    },
    author: {
      name: siteConfig.author.name,
      link: siteConfig.author.url,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.url}/blog/${post.slug}`,
      link: `${siteConfig.url}/blog/${post.slug}`,
      description: post.description,
      content: post.content,
      date: new Date(post.publishDate),
      author: [
        {
          name: post.author,
        },
      ],
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
