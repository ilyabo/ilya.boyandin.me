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
  const match = attrs.match(new RegExp(`${name}=(?:"([^"]+)"|'([^']+)'|([^\\s>]+))`, 'i'));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function preprocessMarkdown(content: string, context: MarkdownContext) {
  return content
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string, src: string) => {
      return `![${alt}](${resolveMediaPath(context, src.trim())})`;
    })
    .replace(
      /<(img|video|source|iframe)([^>]*?)\bsrc=(?:"([^"]+)"|'([^']+)'|([^\s>]+))([^>]*)>/gi,
      (_match, tag: string, before: string, doubleQuotedSrc: string, singleQuotedSrc: string, unquotedSrc: string, after: string) => {
        const src = doubleQuotedSrc ?? singleQuotedSrc ?? unquotedSrc;
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
        return `${wrapperStart}<a class="action-link" href="${resolveMediaPath(context, href.trim())}" target="_blank" rel="noopener">${label}</a>${wrapperEnd}`;
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

function meaningfulChildren(node: any) {
  return (node?.children ?? []).filter((child: any) => {
    return child.type !== 'text' || child.value.trim();
  });
}

function nextMeaningfulSibling(children: any[], index: number): { node: any; index: number } | null {
  for (let nextIndex = index + 1; nextIndex < children.length; nextIndex += 1) {
    const node = children[nextIndex];
    if (node.type !== 'text' || node.value.trim()) {
      return { node, index: nextIndex };
    }
  }

  return null;
}

function textContent(node: any): string {
  if (!node || typeof node !== 'object') return '';
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textContent).join('');
}

function isImageOnlyParagraph(node: any) {
  if (node?.type !== 'element' || node.tagName !== 'p') return false;
  const children = meaningfulChildren(node);

  if (children.length !== 1) return false;
  const child = children[0];
  if (child.type === 'element' && child.tagName === 'img') return true;
  return child.type === 'element' && child.tagName === 'a' && Boolean(findImageAlt(child));
}

function captionFromParagraph(node: any): string | null {
  if (node?.type !== 'element' || node.tagName !== 'p') return null;
  const children = meaningfulChildren(node);
  if (children.length !== 1) return null;

  return captionFromNode(children[0]);
}

function captionFromNode(node: any): string | null {
  if (node?.type !== 'element' || !['em', 'i'].includes(node.tagName)) return null;

  const caption = textContent(node).trim();
  return caption || null;
}

function mediaChildrenFromNode(node: any): any[] | null {
  if (node?.type === 'element' && ['img', 'video', 'iframe'].includes(node.tagName)) {
    return [node];
  }

  if (node?.type !== 'element' || node.tagName !== 'p') return null;

  const children = meaningfulChildren(node);
  if (children.length !== 1) return null;

  const child = children[0];
  if (child.type === 'element' && ['img', 'video', 'iframe'].includes(child.tagName)) {
    return [child];
  }

  if (child.type === 'element' && child.tagName === 'a' && findImageAlt(child)) {
    return [child];
  }

  return null;
}

function figureFromCaptionedMediaParagraph(node: any): any | null {
  if (node?.type !== 'element' || node.tagName !== 'p') return null;

  const children = meaningfulChildren(node);
  if (children.length !== 2) return null;

  const [first, second] = children;
  const captionNode = ['em', 'i'].includes(first.tagName) ? first : second;
  const mediaNode = captionNode === first ? second : first;
  if (captionNode.type !== 'element' || !['em', 'i'].includes(captionNode.tagName)) return null;

  const mediaChildren = mediaChildrenFromNode(mediaNode);
  if (!mediaChildren) return null;

  const caption = textContent(captionNode).trim();
  return caption ? figureNode(mediaChildren, caption) : null;
}

function figureNode(mediaChildren: any[], caption: string) {
  return {
    type: 'element',
    tagName: 'figure',
    properties: {},
    children: [
      ...mediaChildren,
      {
        type: 'element',
        tagName: 'figcaption',
        properties: {},
        children: [{ type: 'text', value: caption }],
      },
    ],
  };
}

function rehypeMediaFigures() {
  return (tree: any) => {
    function visit(node: any) {
      if (!node?.children) return;

      const children = [];

      for (let index = 0; index < node.children.length; index += 1) {
        const child = node.children[index];
        const next = nextMeaningfulSibling(node.children, index);
        const paragraphFigure = figureFromCaptionedMediaParagraph(child);

        if (paragraphFigure) {
          children.push(paragraphFigure);
          continue;
        }

        const mediaOnlyChildren = mediaChildrenFromNode(child);
        const followingCaption = mediaOnlyChildren && next ? captionFromParagraph(next.node) ?? captionFromNode(next.node) : null;

        if (mediaOnlyChildren && followingCaption) {
          children.push(figureNode(mediaOnlyChildren, followingCaption));
          index = next!.index;
          continue;
        }

        const caption = captionFromParagraph(child) ?? captionFromNode(child);
        const mediaChildren = caption && next ? mediaChildrenFromNode(next.node) : null;

        if (caption && mediaChildren) {
          children.push(figureNode(mediaChildren, caption));
          index = next!.index;
          continue;
        }

        if (!isImageOnlyParagraph(child)) {
          visit(child);
          children.push(child);
          continue;
        }

        const alt = findImageAlt(child);
        children.push(alt ? figureNode(child.children ?? [], alt) : child);
      }

      node.children = children;
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
    .use(rehypeMediaFigures)
    .use(rehypeStringify)
    .process(processed);

  return String(file);
}
