import React from 'react';
import styled from '@emotion/styled';
import colors from '../colors';
import Link from 'next/link';
import { Box, HStack } from '@chakra-ui/react';
import Headroom from 'react-headroom';
import { useRouter } from 'next/router';

const Outer = styled.div`
  overflow: hidden;
  //box-shadow: 0px 0px 10px ${colors.primary[1]};
  background-color: ${colors.primary[1]};
  transform: translate3D(0, 0, 0);
  z-index: 2;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 600px) {
    align-items: center;
  }
  a {
    text-decoration: none !important;
    display: flex;
    color: #fff;
    padding: ${30 * 0.3}px ${30 * 0.5}px;
    font-size: 11pt;
    cursor: pointer;
    transition: color 0.1s, background-color 0.1s;
    &.active {
      background-color: #ffffff20;
      color: #fff;
    }
    &:hover {
      background-color: #ffffffc0;
      color: ${colors.primary[0]} !important;
    }
  }
  @media print {
    visibility: hidden;
    padding: 0;
  }
`;

const StyledHeadroom = styled(Headroom)`
  @media print {
    visibility: hidden;
  }
  .headroom {
    transition: opacity 0.5s;
  }
  .headroom--scrolled {
    opacity: 0.9;
  }
`;

const Navbar = ({}) => {
  const router = useRouter();
  const path = router.pathname;
  return (
    <StyledHeadroom>
      <Outer>
        <Box maxW="7xl" mx="auto" width="100%">
          <HStack fontWeight="bold">
            <Link href="/">
              <a className={path === '/' ? 'active' : undefined}>Home</a>
            </Link>
            <Link href="/projects">
              <a
                className={
                  path.startsWith('/projects') || path.startsWith('/p') ? 'active' : undefined
                }
              >
                Projects
              </a>
            </Link>
            <Link href="/talks/">
              <a className={path.startsWith('/talks') ? 'active' : undefined}>Talks</a>
            </Link>
            <Link href="/music/">
              <a className={path.startsWith('/music') ? 'active' : undefined}>Music</a>
            </Link>
            {/*<Link href="/resume/">*/}
            {/*  <a className={path.startsWith('/resume') ? 'active' : undefined}>Resume</a>*/}
            {/*</Link>*/}
          </HStack>
        </Box>
      </Outer>
    </StyledHeadroom>
  );
};

export default Navbar;
