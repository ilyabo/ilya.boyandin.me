import React from 'react';
import { Box } from '@chakra-ui/react';

export interface Props {
  img?: string;
  src: string;
  pathPrefix?: string;
  maxWidth?: number;
}

const MarkdownVideo: React.FC<Props> = (props) => {
  const { pathPrefix = '', src, img, maxWidth = 800 } = props;
  return (
    <Box
      as="span"
      display="block"
      width="100%"
      maxWidth={maxWidth}
      position="relative"
      my={10}
      mx="auto"
    >
      <video width="100%" controls autoPlay loop playsInline>
        <source src={`${pathPrefix}/${src}`} type="video/mp4" />
        {img ? <img src={`${pathPrefix}/${img}`} /> : null}
      </video>
    </Box>
  );
};

export default MarkdownVideo;
