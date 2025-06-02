import { Button, Container, Heading, Text, VStack, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Heading size="4xl" color="gray.400">404</Heading>
        <Heading size="xl">Page Not Found</Heading>
        <Text fontSize="lg" color="gray.600">
          The page you are looking for doesn't exist or has been moved.
        </Text>
        <Box>
          <Button
            as={RouterLink}
            to="/"
            colorScheme="blue"
            leftIcon={<Home size={16} />}
            mr={4}
          >
            Go Home
          </Button>
          <Button
            as={RouterLink}
            to="#"
            onClick={() => window.history.back()}
            variant="outline"
            leftIcon={<ArrowLeft size={16} />}
          >
            Go Back
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;