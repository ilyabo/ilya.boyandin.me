import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { ContentEntry } from './content';
import { isExternalUrl, isRootRelativePath, markdownMediaPath, pageMediaPath } from './media';

const rehypeRawPlugin = rehypeRaw as never;

type MarkdownContext =
  | { kind: 'entry'; entry: Pick<ContentEntry, 'slug' | 'title' | 'type'> }
  | { kind: 'page'; slug: string };

function resolveMediaPath(context: MarkdownContext, value: string) {
  if (!value || isExternalUrl(value) || isRootRelativePath(value) || value.startsWith('#')) {
    return value;
  }

  return context.kind === 'entry' ? markdownMediaPath(context.entry, value) : pageMediaPath(context.slug, value);
}

function soundCloudEmbed(id: string) {
  const params = new URLSearchParams({
    color: '#ccd',
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'false',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: 'false',
  });

  return `<div class="soundcloud-embed"><iframe height="100" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${id}&${params.toString()}"></iframe></div>`;
}

function attributeValue(attrs: string, name: string) {
  const match = attrs.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
  return match?.[1] ?? null;
}

function preprocessMarkdown(content: string, context: MarkdownContext) {
  return content
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string, src: string) => {
      return `![${alt}](${resolveMediaPath(context, src.trim())})`;
    })
    .replace(
      /<(img|video|source)([^>]*?)\bsrc=["']([^"']+)["']([^>]*)>/gi,
      (_match, tag: string, before: string, src: string, after: string) => {
        return `<${tag}${before}src="${resolveMediaPath(context, src)}"${after}>`;
      }
    )
    .replace(/<embed\b([^>]*)\/?>/gi, (match: string, attrs: string) => {
      const kind = attributeValue(attrs, 'kind');
      const id = attributeValue(attrs, 'id');
      const src = attributeValue(attrs, 'src');

      if (kind === 'soundcloud' && id) return soundCloudEmbed(id);
      if (src) return `<video controls src="${resolveMediaPath(context, src)}"></video>`;
      return match;
    })
    .replace(
      /<button\b([^>]*)\bhref=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/button>/gi,
      (_match, before: string, href: string, after: string, label: string) => {
        const attrs = `${before} ${after}`;
        const align = attributeValue(attrs, 'align');
        const wrapperStart = align ? `<span class="action-link-wrap" style="text-align:${align}">` : '';
        const wrapperEnd = align ? '</span>' : '';
        return `${wrapperStart}<a class="action-link" href="${href}" target="_blank" rel="noopener">${label}</a>${wrapperEnd}`;
      }
    );
}

function findImageAlt(node: any): string | null {
  if (!node || typeof node !== 'object') return null;
  if (node.type === 'element' && node.tagName === 'img') {
    const alt = node.properties?.alt;
    return typeof alt === 'string' && alt.trim() ? alt.trim() : null;
  }

  for (const child of node.children ?? []) {
    const alt = findImageAlt(child);
    if (alt) return alt;
  }

  return null;
}

function isImageOnlyParagraph(node: any) {
  if (node?.type !== 'element' || node.tagName !== 'p') return false;
  const meaningfulChildren = (node.children ?? []).filter((child: any) => {
    return child.type !== 'text' || child.value.trim();
  });

  if (meaningfulChildren.length !== 1) return false;
  const child = meaningfulChildren[0];
  if (child.type === 'element' && child.tagName === 'img') return true;
  return child.type === 'element' && child.tagName === 'a' && Boolean(findImageAlt(child));
}

function rehypeImageFigures() {
  return (tree: any) => {
    function visit(node: any) {
      if (!node?.children) return;

      node.children = node.children.map((child: any) => {
        if (!isImageOnlyParagraph(child)) {
          visit(child);
          return child;
        }

        const alt = findImageAlt(child);
        if (!alt) return child;

        return {
          type: 'element',
          tagName: 'figure',
          properties: {},
          children: [
            ...(child.children ?? []),
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [{ type: 'text', value: alt }],
            },
          ],
        };
      });
    }

    visit(tree);
  };
}

export async function renderMarkdown(content: string, context: MarkdownContext) {
  const processed = preprocessMarkdown(content, context);
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRawPlugin)
    .use(rehypeImageFigures)
    .use(rehypeStringify)
    .process(processed);

  return String(file);
}
