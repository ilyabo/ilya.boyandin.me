import React from 'react';
import { VStack } from '@chakra-ui/react';
import { getAllPosts } from '../lib/api';
import CardGrid from '../components/CardGrid';

const HomePage = ({ allProjects }) => {
  return (
    <VStack spacing="100px" mt={10}>
      {/* <VStack spacing={7}>
        <VStack mt={10}>
          <Heading as="h2" size="xl" fontWeight="extrabold" letterSpacing="tight">
            Ilya Boyandin
          </Heading>
          <Heading size="sm" fontWeight="normal" letterSpacing="tight" mt={2}>
            Data Visualization Engineer
          </Heading>
        </VStack>
        <Link href="/about">
          <Box
            width={120}
            height={120}
            sx={{
              img: { borderRadius: '50%' },
            }}
            position="relative"
            cursor="pointer"
          >
            <BlurImage src={ProfileImg} layout="fill" />
          </Box>
        </Link>
        <VStack spacing={1}>
          <Box size="md" fontWeight="normal" letterSpacing="tight" color="">
            <Link href="mailto:ilya@boyandin.me">ilya@boyandin.me</Link>
          </Box>
          <SocialMediaLinks />
        </VStack>
        <Heading
          pt={5}
          as="h3"
          size="md"
          fontWeight="normal"
          letterSpacing="tight"
          textAlign="center"
        >
          I develop interactive data visualizations and maps.
        </Heading>
      </VStack> */}
      <CardGrid items={allProjects} path="projects" linkPath="p" />
    </VStack>
  );
};

export async function getStaticProps() {
  const allProjects = getAllPosts('projects');
  return {
    props: { allProjects },
  };
}

export default HomePage;
