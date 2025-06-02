import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Image,
  SimpleGrid,
  Flex,
  Icon,
  VStack,
  HStack,
  Grid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import { RootState } from '../store';
import { fetchMedicines, fetchRecommendedMedicines } from '../features/medicines/medicinesSlice';
import RecommendedProducts from '../components/medicines/RecommendedProducts';
import MedicineCardList from '../components/medicines/MedicineCardList';

// Mock data for categories
const categories = [
  { id: 1, name: 'Prescription Drugs', image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', slug: 'prescription' },
  { id: 2, name: 'OTC Medicines', image: 'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg', slug: 'otc' },
  { id: 3, name: 'Vitamins & Supplements', image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg', slug: 'vitamins' },
  { id: 4, name: 'Personal Care', image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg', slug: 'personal' },
  { id: 5, name: 'Medical Devices', image: 'https://images.pexels.com/photos/3683102/pexels-photo-3683102.jpeg', slug: 'devices' },
  { id: 6, name: 'COVID Essentials', image: 'https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg', slug: 'covid' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, recommendedItems, loading } = useSelector((state: RootState) => state.medicines);
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  useEffect(() => {
    // Fetch medicines if not already loaded
    if (items.length === 0) {
      dispatch(fetchMedicines());
    }
    
    // Fetch recommended medicines if user is logged in
    if (user) {
      dispatch(fetchRecommendedMedicines(user.uid));
    }
  }, [dispatch, items.length, user]);
  
  // For featured products, just take the first 4 items with highest rating
  const featuredProducts = [...items]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  
  // For new arrivals, just take the first 4 items (in a real app, would be sorted by date)
  const newArrivals = [...items].slice(0, 4);
  
  // For deals, take items with discount
  const deals = items.filter(item => item.discountPercentage > 0).slice(0, 8);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="brand.50"
        pt={{ base: 8, md: 12 }}
        pb={{ base: 12, md: 16 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap={8}
            alignItems="center"
          >
            <GridItem>
              <Heading
                as="h1"
                size="xl"
                fontWeight="bold"
                lineHeight="1.2"
                mb={4}
              >
                Your Health, Delivered <br />
                <Box as="span" color="brand.500">
                  Right to Your Door
                </Box>
              </Heading>
              
              <Text fontSize="lg" mb={6} color="gray.600">
                Access quality medications, personalized care, and quick deliveries from the comfort of your home.
              </Text>
              
              <HStack spacing={4}>
                <Button
                  as={RouterLink}
                  to="/search"
                  size="lg"
                  colorScheme="blue"
                  rightIcon={<ArrowRight size={16} />}
                >
                  Browse Medicines
                </Button>
                <Button
                  as={RouterLink}
                  to="/profile"
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                >
                  Upload Prescription
                </Button>
              </HStack>
            </GridItem>
            
            <GridItem display={{ base: 'none', md: 'block' }}>
              <Image
                src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"
                alt="Online Pharmacy"
                borderRadius="lg"
                shadow="xl"
              />
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Categories Section */}
      <Container maxW="container.xl" mt={{ base: -10, md: -16 }}>
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 6 }}
          spacing={4}
          mb={{ base: 12, md: 16 }}
        >
          {categories.map((category) => (
            <RouterLink to={`/search?category=${category.slug}`} key={category.id}>
              <VStack
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="md"
                transition="transform 0.3s, box-shadow 0.3s"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'lg',
                }}
              >
                <Box
                  width="full"
                  height="120px"
                  borderRadius="md"
                  overflow="hidden"
                  mb={2}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </Box>
                <Text fontWeight="medium" textAlign="center">
                  {category.name}
                </Text>
              </VStack>
            </RouterLink>
          ))}
        </SimpleGrid>
      </Container>
      
      {/* Main Content */}
      <Container maxW="container.xl" mb={16}>
        {/* Recommended Section (only if user is logged in) */}
        {user && recommendedItems.length > 0 && (
          <RecommendedProducts
            title="Recommended For You"
            subtitle="Based on your health profile and previous orders"
            products={recommendedItems}
          />
        )}
        
        {/* Featured Products */}
        <Box mb={16}>
          <Flex
            justify="space-between"
            align="center"
            mb={6}
          >
            <Heading size="lg">Featured Products</Heading>
            <Button
              as={RouterLink}
              to="/search"
              variant="link"
              colorScheme="blue"
              rightIcon={<ArrowRight size={16} />}
            >
              View All
            </Button>
          </Flex>
          
          <MedicineCardList medicines={featuredProducts} loading={loading && items.length === 0} />
        </Box>
        
        {/* Special Offers Banner */}
        <Box
          bg="blue.500"
          color="white"
          borderRadius="lg"
          overflow="hidden"
          mb={16}
          position="relative"
        >
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
            <GridItem p={{ base: 6, md: 10 }}>
              <Heading size="xl" mb={4}>
                Special Offer
              </Heading>
              <Text fontSize="lg" mb={6}>
                Get 20% off on all medicines when you subscribe to our monthly delivery service.
              </Text>
              <Button
                bg="white"
                color="blue.500"
                _hover={{ bg: 'blue.50' }}
                size="lg"
              >
                Subscribe Now
              </Button>
            </GridItem>
            <GridItem display={{ base: 'none', md: 'block' }}>
              <Image
                src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg"
                alt="Special Offer"
                h="100%"
                w="100%"
                objectFit="cover"
              />
            </GridItem>
          </Grid>
        </Box>
        
        {/* Deals & Discounts */}
        <Box mb={16}>
          <Flex
            justify="space-between"
            align="center"
            mb={6}
          >
            <Heading size="lg">Deals & Discounts</Heading>
            <Button
              as={RouterLink}
              to="/search?discount=true"
              variant="link"
              colorScheme="blue"
              rightIcon={<ArrowRight size={16} />}
            >
              View All
            </Button>
          </Flex>
          
          <MedicineCardList medicines={deals} loading={loading && items.length === 0} />
        </Box>
        
        {/* New Arrivals */}
        <Box mb={16}>
          <Flex
            justify="space-between"
            align="center"
            mb={6}
          >
            <Heading size="lg">New Arrivals</Heading>
            <Button
              as={RouterLink}
              to="/search?sort=newest"
              variant="link"
              colorScheme="blue"
              rightIcon={<ArrowRight size={16} />}
            >
              View All
            </Button>
          </Flex>
          
          <MedicineCardList medicines={newArrivals} loading={loading && items.length === 0} />
        </Box>
        
        {/* Health Tips & Blog Section */}
        <Box mb={16}>
          <Flex
            justify="space-between"
            align="center"
            mb={6}
          >
            <Heading size="lg">Health Tips & Articles</Heading>
            <Button
              variant="link"
              colorScheme="blue"
              rightIcon={<ArrowRight size={16} />}
            >
              View All
            </Button>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {/* These would be actual blog posts in a real app */}
            <Box borderRadius="lg" overflow="hidden" boxShadow="md">
              <Image
                src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg"
                alt="Health Tip"
                w="100%"
                h="200px"
                objectFit="cover"
              />
              <Box p={5}>
                <Text color="blue.500" fontWeight="medium" mb={2}>
                  Health Tips
                </Text>
                <Heading size="md" mb={2}>
                  10 Ways to Boost Your Immune System Naturally
                </Heading>
                <Text color="gray.600" noOfLines={3}>
                  Discover simple, everyday habits that can strengthen your immune system and help you stay healthy all year round.
                </Text>
                <Button mt={4} variant="link" colorScheme="blue" rightIcon={<ArrowRight size={14} />}>
                  Read More
                </Button>
              </Box>
            </Box>
            
            <Box borderRadius="lg" overflow="hidden" boxShadow="md">
              <Image
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg"
                alt="Health Tip"
                w="100%"
                h="200px"
                objectFit="cover"
              />
              <Box p={5}>
                <Text color="blue.500" fontWeight="medium" mb={2}>
                  Wellness
                </Text>
                <Heading size="md" mb={2}>
                  The Importance of Sleep for Mental Health
                </Heading>
                <Text color="gray.600" noOfLines={3}>
                  Learn why quality sleep is crucial for your mental wellbeing and how to improve your sleep hygiene for better rest.
                </Text>
                <Button mt={4} variant="link" colorScheme="blue" rightIcon={<ArrowRight size={14} />}>
                  Read More
                </Button>
              </Box>
            </Box>
            
            <Box borderRadius="lg" overflow="hidden" boxShadow="md">
              <Image
                src="https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg"
                alt="Health Tip"
                w="100%"
                h="200px"
                objectFit="cover"
              />
              <Box p={5}>
                <Text color="blue.500" fontWeight="medium" mb={2}>
                  Medication
                </Text>
                <Heading size="md" mb={2}>
                  Understanding Antibiotic Resistance
                </Heading>
                <Text color="gray.600" noOfLines={3}>
                  Find out what antibiotic resistance means, why it matters, and how you can help combat this growing global health concern.
                </Text>
                <Button mt={4} variant="link" colorScheme="blue" rightIcon={<ArrowRight size={14} />}>
                  Read More
                </Button>
              </Box>
            </Box>
          </SimpleGrid>
        </Box>
        
        {/* Testimonials */}
        <Box mb={16}>
          <Heading size="lg" mb={6} textAlign="center">
            What Our Customers Say
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {/* These would be dynamic testimonials in a real app */}
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="md"
              position="relative"
            >
              <Text fontSize="lg" fontStyle="italic" mb={4}>
                "The prescription delivery service is phenomenal! I received my medications on the same day I ordered them. Highly recommended!"
              </Text>
              <Flex align="center">
                <Image
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                  alt="Customer"
                  borderRadius="full"
                  boxSize="40px"
                  mr={3}
                  objectFit="cover"
                />
                <Box>
                  <Text fontWeight="bold">John Smith</Text>
                  <Text fontSize="sm" color="gray.500">
                    Regular Customer
                  </Text>
                </Box>
              </Flex>
            </Box>
            
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="md"
              position="relative"
            >
              <Text fontSize="lg" fontStyle="italic" mb={4}>
                "As someone with chronic conditions, this pharmacy has made my life so much easier. The medication reminders and automatic refills are lifesavers!"
              </Text>
              <Flex align="center">
                <Image
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                  alt="Customer"
                  borderRadius="full"
                  boxSize="40px"
                  mr={3}
                  objectFit="cover"
                />
                <Box>
                  <Text fontWeight="bold">Sarah Johnson</Text>
                  <Text fontSize="sm" color="gray.500">
                    Premium Member
                  </Text>
                </Box>
              </Flex>
            </Box>
            
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="md"
              position="relative"
            >
              <Text fontSize="lg" fontStyle="italic" mb={4}>
                "The pharmacists are incredibly knowledgeable. I had questions about drug interactions, and they provided detailed and helpful information."
              </Text>
              <Flex align="center">
                <Image
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                  alt="Customer"
                  borderRadius="full"
                  boxSize="40px"
                  mr={3}
                  objectFit="cover"
                />
                <Box>
                  <Text fontWeight="bold">Robert Williams</Text>
                  <Text fontSize="sm" color="gray.500">
                    New Customer
                  </Text>
                </Box>
              </Flex>
            </Box>
          </SimpleGrid>
        </Box>
        
        {/* App Download Section */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={8}
          bg="gray.50"
          p={{ base: 6, md: 10 }}
          borderRadius="lg"
          alignItems="center"
        >
          <GridItem>
            <Heading size="lg" mb={4}>
              Download Our Mobile App
            </Heading>
            <Text fontSize="lg" mb={6} color="gray.600">
              Get exclusive app-only discounts, track your orders in real-time, and set medication reminders.
            </Text>
            <Flex gap={4} flexWrap="wrap">
              <Button colorScheme="black" size="lg">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" h="24px" mr={2} />
                Google Play
              </Button>
              <Button colorScheme="black" size="lg">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" h="24px" mr={2} />
                App Store
              </Button>
            </Flex>
          </GridItem>
          <GridItem display={{ base: 'none', md: 'flex' }} justifyContent="center">
            <Image
              src="https://images.pexels.com/photos/6214140/pexels-photo-6214140.jpeg"
              alt="Mobile App"
              maxH="400px"
              borderRadius="lg"
            />
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;