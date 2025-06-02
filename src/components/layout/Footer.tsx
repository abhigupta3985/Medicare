import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Divider,
  HStack,
  Link,
} from '@chakra-ui/react';
import { ArrowRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <Box bg="gray.50" color="gray.700" mt={10}>
      <Container as={Stack} maxW={'container.xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack spacing={6}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="brand.600">
                MediCare
              </Text>
              <Text fontSize="sm" mt={2}>
                Your trusted online pharmacy since 2023. We provide quality medicines and healthcare products with fast delivery and professional service.
              </Text>
            </Box>
            <Stack direction={'row'} spacing={6}>
              <Button
                aria-label="Facebook"
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: 'brand.500' }}
              >
                <Facebook size={18} />
              </Button>
              <Button
                aria-label="Twitter"
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: 'brand.500' }}
              >
                <Twitter size={18} />
              </Button>
              <Button
                aria-label="Instagram"
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: 'brand.500' }}
              >
                <Instagram size={18} />
              </Button>
              <Button
                aria-label="LinkedIn"
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: 'brand.500' }}
              >
                <Linkedin size={18} />
              </Button>
            </Stack>
          </Stack>
          
          <Stack align={'flex-start'}>
            <Heading fontSize="md" fontWeight="bold" mb={2}>Shop by Category</Heading>
            <Link href={'#'}>Prescription Drugs</Link>
            <Link href={'#'}>OTC Medicines</Link>
            <Link href={'#'}>Vitamins & Supplements</Link>
            <Link href={'#'}>Personal Care</Link>
            <Link href={'#'}>Medical Devices</Link>
            <Link href={'#'}>COVID Essentials</Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <Heading fontSize="md" fontWeight="bold" mb={2}>Company</Heading>
            <Link href={'#'}>About Us</Link>
            <Link href={'#'}>Our Stores</Link>
            <Link href={'#'}>Careers</Link>
            <Link href={'#'}>Blog</Link>
            <Link href={'#'}>News & Media</Link>
            <Link href={'#'}>Contact Us</Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <Heading fontSize="md" fontWeight="bold" mb={2}>Stay Updated</Heading>
            <Text fontSize="sm">Subscribe to get special offers, free giveaways, and health tips.</Text>
            <InputGroup size="md" mt={2}>
              <Input
                placeholder="Your email"
                bg="white"
                _focus={{
                  borderColor: 'brand.500',
                }}
              />
              <InputRightElement>
                <Button
                  h="full"
                  size="sm"
                  variant="ghost"
                  color="gray.500"
                  _hover={{ color: 'brand.500' }}
                >
                  <ArrowRight size={16} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Stack>
        </SimpleGrid>
        
        <Divider my={6} />
        
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text fontSize="sm">© 2025 MediCare. All rights reserved</Text>
          <HStack spacing={4} mt={{ base: 4, md: 0 }}>
            <Link fontSize="sm" href={'#'}>Privacy Policy</Link>
            <Link fontSize="sm" href={'#'}>Terms of Service</Link>
            <Link fontSize="sm" href={'#'}>Shipping Policy</Link>
            <Link fontSize="sm" href={'#'}>Refund Policy</Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;