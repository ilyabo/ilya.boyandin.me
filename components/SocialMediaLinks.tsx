import { ButtonGroup, ButtonGroupProps, HStack, IconButton } from '@chakra-ui/react';
import * as React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export const SocialMediaLinks = (props: ButtonGroupProps) => (
  <ButtonGroup variant="ghost" color="gray.600" {...props}>
    <IconButton
      as="a"
      href="https://twitter.com/ilyabo"
      aria-label="Twitter"
      icon={<FaTwitter fontSize="20px" />}
    />
    <IconButton
      as="a"
      href="https://www.linkedin.com/in/ilyabo/"
      aria-label="LinkedIn"
      icon={<FaLinkedin fontSize="20px" />}
    />
    <IconButton
      as="a"
      href="https://github.com/ilyabo"
      aria-label="GitHub"
      icon={<FaGithub fontSize="20px" />}
    />
  </ButtonGroup>
);
//
// <HStack>
//   <a href="https://twitter.com/ilyabo" target="_blank" rel="noopener">
//     <FaTwitter />
//   </a>
//   <a href="https://www.linkedin.com/in/ilyabo/" target="_blank" rel="noopener">
//     <FaLinkedin />
//   </a>
//   <a href="https://github.com/ilyabo" target="_blank" rel="noopener">
//     <FaGithub />
//   </a>
// </HStack>;
