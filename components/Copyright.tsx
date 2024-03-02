import { Link, Text, TextProps } from '@chakra-ui/layout';
import * as React from 'react';
import { HStack } from '@chakra-ui/react';

export const Copyright = (props: TextProps) => (
  <HStack fontSize="sm" {...props}>
    <Text>&copy;</Text>
    <Text>{new Date().getFullYear()}</Text>
    <Text>Ilya Boyandin</Text>
  </HStack>
);
