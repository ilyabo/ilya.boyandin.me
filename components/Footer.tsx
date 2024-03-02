import { Text, Box, HStack, Stack, StackDivider } from '@chakra-ui/react';
import * as React from 'react';
import { Copyright } from './Copyright';
import { SocialMediaLinks } from './SocialMediaLinks';
import NextLink from 'next/link';

export const Footer = () => (
  <Box
    as="footer"
    role="contentinfo"
    mx="auto"
    maxW="7xl"
    width="100%"
    py="12"
    px={{ base: '4', md: '8' }}
  >
    <Stack spacing="5" divider={<StackDivider />}>
      <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: '10', lg: '28' }}>
        {/*<Box flex="1">*/}
        {/*  <Logo />*/}
        {/*</Box>*/}
        {/*<Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '10', md: '20' }}>*/}
        {/*  <LinkGrid spacing={{ base: '10', md: '20', lg: '28' }} flex="1" />*/}
        {/*  <Contact width={{ base: 'full', md: 'sm' }} />*/}
        {/*</Stack>*/}
      </Stack>
      <Stack
        direction={{ base: 'column-reverse', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack alignItems={'center'} gap={3}>
          <Copyright />
          <NextLink href="https://github.com/ilyabo/ilya.boyandin.me" passHref>
            <a target="_blank" rel="noopener">
              <Text fontSize="xs">source code</Text>
            </a>
          </NextLink>
        </HStack>
        <SocialMediaLinks />
      </Stack>
    </Stack>
  </Box>
);

export default Footer;
