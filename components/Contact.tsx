import { HTMLChakraProps, Stack } from '@chakra-ui/react';
import * as React from 'react';
import { FooterHeading } from './FooterHeading';

export const Contact = (props: HTMLChakraProps<'form'>) => {
  return (
    <Stack spacing="4">
      <FooterHeading>Contact us</FooterHeading>
      <Stack spacing="4" direction={{ base: 'column', md: 'row' }}></Stack>
    </Stack>
  );
};

export default Contact;
