import React from 'react';
import { Text, Box } from '@chakra-ui/react';
import BlurImage from './BlurImage';

export interface Props {
  width?: string | number;
  height?: string | number;
  src: string;
  alt: string;
  pathPrefix?: string;
  float?: 'left' | 'right' | 'none';
  mt?: string | number;
  mb?: string | number;
}

const MarkdownImage: React.FC<Props> = (props) => {
  const { pathPrefix, src, alt, float, width, height, mt = '10', mb = '10' } = props;
  const fullSrc = `${pathPrefix ?? ''}/${src}`;
  return (
    <Box
      as="span"
      display="block"
      width="100%"
      maxWidth={float ? 400 : 800}
      position="relative"
      mt={mt}
      mb={mb}
      mx="auto"
      cursor="pointer"
      float={float}
      px={float ? '50px' : 0}
      //  width={500} height={300}
    >
      {alt ? (
        <Text as="span" display="block" textAlign="center" mb={2}>
          {alt}
        </Text>
      ) : null}
      <BlurImage
        src={fullSrc}
        isZoomable={true}
        alt={alt ?? src}
        // layout="fill"
        layout="responsive"
        sizes="(min-width: 1600px) 1200px,(min-width: 1400px) 1080px,(min-width:1000px) 828px, 750px"
        objectFit={'contain'}
        width={width ?? 1920}
        height={height ?? 1080}
        // quality={85}
        // sizes="500px,1000px,1500px"
      />
    </Box>
  );
};

export default MarkdownImage;
