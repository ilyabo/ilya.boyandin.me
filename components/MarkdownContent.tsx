import React from 'react';
import styled from '@emotion/styled';
import ReactMarkdown from 'react-markdown';
import { MEDIA_DIR } from '../config';
import rehypeRaw from 'rehype-raw';
import MarkdownImage from './MarkdownImage';
import MarkdownVideo from './MarkdownVideo';
import { Box, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import colors from '../colors';

const Outer = styled(Box)`
  width: 100%;
  p {
    line-height: 1.5;
    margin-bottom: 1.5em;
  }
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5em;
  }
  blockquote {
    border-left: 3px solid
      ${({ theme }) =>
        // @ts-ignore
        theme.colors.gray[300]};
    padding-left: 1em;
  }
  iframe {
    height: unset !important;
    aspect-ratio: 16 / 9.72;
    max-width: min(100%, 800px);
    margin: 0 auto 2em auto;
  }
`;

export const MarkdownContent = (props: {
  content: string;
  slug: string;
  path?: string;
  maxwidth?: string;
}) => {
  const { content, slug, path, maxwidth } = props;
  const pathPrefix = `/${MEDIA_DIR}/${path ? `${path}/` : ''}${slug}`;
  return (
    <Outer>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          img: (props) => (
            <MarkdownImage
              pathPrefix={pathPrefix}
              {...props}
              src={props.src ?? ''}
              alt={props.alt ?? ''}
            />
          ),
          embed: (props: Record<string, any>) => {
            switch (props.kind) {
              case 'soundcloud': {
                const params = Object.entries({
                  // color: '#c97eae',
                  color: '#ccd',
                  auto_play: false,
                  hide_related: true,
                  show_comments: false,
                  show_user: false,
                  show_reposts: false,
                  show_teaser: false,
                  visual: false,
                })
                  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                  .join('&');
                return (
                  <Box maxHeight="165px" overflow="hidden" marginBottom="20px">
                    <iframe
                      height="100"
                      style={{
                        width: '100%',
                        border: 'none',
                        overflow: 'hidden',
                      }}
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${props.id}&${params}`}
                    ></iframe>
                  </Box>
                );
              }
              default:
                return (
                  <MarkdownVideo
                    pathPrefix={pathPrefix}
                    {...props}
                    src={props.src ?? ''}
                    maxWidth={props.maxwidth ? Number(props.maxwidth) : undefined}
                  />
                );
            }
          },
          button: (props: Record<string, any>) => (
            <span style={{ display: props.align ? 'block' : 'inline', textAlign: props.align }}>
              <Link href={props.href}>
                <a target={'_blank'}>
                  <Button colorScheme="blue" variant={props.variant ?? 'solid'} size="sm">
                    {props.children}
                  </Button>
                </a>
              </Link>
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Outer>
  );
};

export default MarkdownContent;
