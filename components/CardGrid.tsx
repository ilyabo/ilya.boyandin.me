import React from 'react';
import Link from 'next/link';
import { Box, Link as ChakraLink, Grid, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import formatDate from '../lib/formatDate';
import BlurImage from '../components/BlurImage';
import colors from '../colors';

const CardGrid = ({ items, path, linkPath }) => {
  return (
    <Grid
      templateColumns={{
        xl: 'repeat(3, 1fr)',
        lg: 'repeat(2, 1fr)',
        md: 'repeat(2, 1fr)',
        sm: 'repeat(1, 1fr)',
      }}
      columnGap={{
        xl: '10px',
        lg: '20px',
        md: '10px',
      }}
      rowGap={{
        xl: '20px',
        lg: '20px',
        md: '0px',
        sm: '0px',
      }}
    >
      {items.map((md) => (
        <Box
          key={md.slug}
          borderRadius={'10px'}
          padding={'20px'}
          transition="background-color 0.2s"
          cursor="pointer"
          _hover={{
            backgroundColor: 'gray.100',
          }}
        >
          <Link href={`/${linkPath}/${md.slug}`}>
            <ChakraLink
              as="a"
              href={`/${linkPath}/${md.slug}`}
              _hover={{
                textDecoration: 'none !important',
              }}
              _focus={{
                boxShadow: 'none',
              }}
            >
              <VStack width={[280, 280, 320, 360]} cursor="pointer" gap={1}>
                <HStack width="100%">
                  <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {md.title}
                  </Text>
                  <Spacer />
                  <Text fontSize="xs" whiteSpace="nowrap" color={'#aab'}>
                    {formatDate(md.date)}
                  </Text>
                </HStack>
                <Box
                  width={'100%'}
                  height={[120, 140, 160, 180]}
                  maxWidth="80vw"
                  position="relative"
                  border="1px solid #ccc"
                  borderRadius="10px"
                  overflow="hidden"
                >
                  <BlurImage
                    sizes="360px"
                    src={`/media/${path}/${md.slug}/${md.preview}`}
                    // placeholder="blur"
                    // blurDataURL={`/media/${md.slug}/${md.preview}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </Box>
              </VStack>
            </ChakraLink>
          </Link>
        </Box>
      ))}
    </Grid>
  );
};

export default CardGrid;
