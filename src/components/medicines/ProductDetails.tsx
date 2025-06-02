import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Image,
  Badge,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  SimpleGrid,
  useToast,
  List,
  ListItem,
  ListIcon,
  Tag,
  useDisclosure,
} from '@chakra-ui/react';
import { StarIcon, InfoIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { Clock, Truck, Shield, ShoppingCart, Heart, BarChart2 } from 'lucide-react';

import { Medicine } from '../../features/medicines/medicinesSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { addToast } from '../../features/ui/uiSlice';
import PrescriptionUpload from '../prescription/PrescriptionUpload';
import { RootState } from '../../store';

interface ProductDetailsProps {
  product: Medicine;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Mock additional images
  const additionalImages = [
    product.image,
    'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg',
    'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg'
  ];
  
  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to cart',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        requiresPrescription: product.requiresPrescription,
      })
    );
    
    dispatch(
      addToast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        status: 'success',
      })
    );
    
    if (product.requiresPrescription) {
      onOpen();
    }
  };

  return (
    <Box>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 8, md: 12 }}
      >
        {/* Product Images */}
        <Box flex="1">
          <Box
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
            mb={4}
          >
            <Image
              src={selectedImage}
              alt={product.name}
              w="full"
              h="400px"
              objectFit="cover"
              bg="gray.100"
            />
          </Box>
          
          <Flex gap={2} overflow="auto">
            {additionalImages.map((img, idx) => (
              <Box
                key={idx}
                boxSize="80px"
                borderRadius="md"
                overflow="hidden"
                cursor="pointer"
                borderWidth={selectedImage === img ? '2px' : '1px'}
                borderColor={selectedImage === img ? 'brand.500' : 'gray.200'}
                onClick={() => setSelectedImage(img)}
              >
                <Image 
                  src={img} 
                  alt={`${product.name} ${idx + 1}`} 
                  w="full" 
                  h="full" 
                  objectFit="cover"
                  bg="gray.100"
                />
              </Box>
            ))}
          </Flex>
        </Box>
        
        {/* Product Info */}
        <Box flex="1">
          <VStack align="start" spacing={4}>
            <HStack>
              <Badge colorScheme="green" px={2} py={1} borderRadius="full">
                {product.category}
              </Badge>
              {product.requiresPrescription && (
                <Badge colorScheme="purple" px={2} py={1} borderRadius="full">
                  Prescription Required
                </Badge>
              )}
              {product.inStock ? (
                <Badge colorScheme="green" px={2} py={1} borderRadius="full">
                  In Stock
                </Badge>
              ) : (
                <Badge colorScheme="red" px={2} py={1} borderRadius="full">
                  Out of Stock
                </Badge>
              )}
            </HStack>
            
            <Heading as="h1" size="xl">
              {product.name}
            </Heading>
            
            <Text color="gray.600" fontSize="md">
              By <Text as="span" fontWeight="semibold" color="brand.600">{product.brand}</Text>
            </Text>
            
            <HStack spacing={2}>
              <HStack spacing={1}>
                {Array(5)
                  .fill('')
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={i < Math.floor(product.rating) ? 'yellow.400' : 'gray.300'}
                    />
                  ))}
              </HStack>
              <Text color="gray.600">
                ({product.reviewCount} reviews)
              </Text>
            </HStack>
            
            <Box my={2}>
              {product.discountPercentage > 0 ? (
                <Flex align="center">
                  <Heading color="green.600\" size="xl\" mr={3}>
                    ${product.price.toFixed(2)}
                  </Heading>
                  <Text
                    fontSize="lg"
                    color="gray.500"
                    textDecoration="line-through"
                  >
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </Text>
                  <Badge
                    ml={3}
                    colorScheme="red"
                    fontSize="md"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {product.discountPercentage}% OFF
                  </Badge>
                </Flex>
              ) : (
                <Heading color="green.600" size="xl">
                  ${product.price.toFixed(2)}
                </Heading>
              )}
            </Box>
            
            <Text color="gray.700" fontSize="md">
              {product.description}
            </Text>
            
            <Divider />
            
            <Flex
              width="full"
              direction={{ base: 'column', sm: 'row' }}
              gap={4}
              align="center"
            >
              <NumberInput
                defaultValue={1}
                min={1}
                max={10}
                size="lg"
                maxW={32}
                value={quantity}
                onChange={(_, val) => setQuantity(val)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              
              <Button
                size="lg"
                colorScheme="blue"
                leftIcon={<ShoppingCart />}
                flex={1}
                onClick={handleAddToCart}
                isDisabled={!product.inStock}
              >
                Add to Cart
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                colorScheme="red"
                leftIcon={<Heart />}
              >
                Wishlist
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                colorScheme="gray"
                leftIcon={<BarChart2 />}
              >
                Compare
              </Button>
            </Flex>
            
            <Divider />
            
            {/* Shipping & Returns */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} width="full">
              <Flex align="center">
                <Box color="brand.500" mr={3}>
                  <Truck size={24} />
                </Box>
                <Box>
                  <Text fontWeight="medium">Free Shipping</Text>
                  <Text fontSize="sm" color="gray.600">On orders over $50</Text>
                </Box>
              </Flex>
              
              <Flex align="center">
                <Box color="brand.500" mr={3}>
                  <Clock size={24} />
                </Box>
                <Box>
                  <Text fontWeight="medium">Same Day Delivery</Text>
                  <Text fontSize="sm" color="gray.600">Order before 2pm</Text>
                </Box>
              </Flex>
              
              <Flex align="center">
                <Box color="brand.500" mr={3}>
                  <Shield size={24} />
                </Box>
                <Box>
                  <Text fontWeight="medium">Genuine Products</Text>
                  <Text fontSize="sm" color="gray.600">100% Authentic</Text>
                </Box>
              </Flex>
            </SimpleGrid>
          </VStack>
        </Box>
      </Flex>
      
      {/* Product details tabs */}
      <Box mt={12}>
        <Tabs colorScheme="blue" isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Description</Tab>
            <Tab>Ingredients</Tab>
            <Tab>Usage & Dosage</Tab>
            <Tab>Side Effects</Tab>
            <Tab>Reviews</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <Text fontSize="lg" lineHeight="tall">
                {product.description}
              </Text>
              <Text mt={4} fontSize="lg" lineHeight="tall">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
              </Text>
            </TabPanel>
            
            <TabPanel>
              <Text fontWeight="medium" mb={4}>Active Ingredients:</Text>
              <List spacing={2}>
                {product.ingredients.map((ingredient, idx) => (
                  <ListItem key={idx} display="flex" alignItems="center">
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    {ingredient}
                  </ListItem>
                ))}
              </List>
              
              <Text fontWeight="medium" mt={6} mb={4}>Inactive Ingredients:</Text>
              <Text>Microcrystalline cellulose, corn starch, lactose, magnesium stearate, colloidal silicon dioxide, hypromellose, titanium dioxide, polyethylene glycol.</Text>
            </TabPanel>
            
            <TabPanel>
              <VStack align="start" spacing={4}>
                <Box>
                  <Heading size="md" mb={2}>Recommended Dosage</Heading>
                  <Text>{product.dosage}</Text>
                </Box>
                
                <Box>
                  <Heading size="md" mb={2}>Administration</Heading>
                  <Text>Take this medication by mouth as directed by your doctor, usually once daily with or without food. Take this medication at the same time each day.</Text>
                </Box>
                
                <Box>
                  <Heading size="md" mb={2}>Special Instructions</Heading>
                  <List spacing={2}>
                    <ListItem display="flex">
                      <ListIcon as={InfoIcon} color="blue.500" />
                      Do not crush or chew extended-release tablets
                    </ListItem>
                    <ListItem display="flex">
                      <ListIcon as={InfoIcon} color="blue.500" />
                      Store at room temperature away from light and moisture
                    </ListItem>
                    <ListItem display="flex">
                      <ListIcon as={InfoIcon} color="blue.500" />
                      Do not store in the bathroom
                    </ListItem>
                  </List>
                </Box>
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <Text fontWeight="medium" mb={4}>Common Side Effects:</Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {product.sideEffects.map((effect, idx) => (
                  <Tag key={idx} size="lg" borderRadius="full" variant="subtle" colorScheme="red" px={3} py={1}>
                    {effect}
                  </Tag>
                ))}
              </SimpleGrid>
              
              <Text mt={6} color="gray.700">
                This is not a complete list of possible side effects. If you notice other effects not listed above, contact your doctor or pharmacist.
              </Text>
              
              <Box mt={6} p={4} bg="blue.50" borderRadius="md">
                <Heading size="sm" color="blue.700" mb={2}>
                  When to seek medical attention
                </Heading>
                <Text color="gray.700">
                  Seek medical attention right away if you experience: severe dizziness, fainting, fast/irregular heartbeat, unusual tiredness, signs of infection, or persistent nausea/vomiting.
                </Text>
              </Box>
            </TabPanel>
            
            <TabPanel>
              <Text fontSize="lg" mb={6}>
                Product ratings and reviews for {product.name}
              </Text>
              
              <Box bg="gray.100" p={6} borderRadius="md" textAlign="center">
                <Text color="gray.600">
                  Reviews will be displayed here. This is a placeholder for the review component.
                </Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* Prescription Upload Modal */}
      {product.requiresPrescription && (
        <PrescriptionUpload 
          isOpen={isOpen} 
          onClose={onClose}
          productId={product.id}
          productName={product.name}
        />
      )}
    </Box>
  );
};

export default ProductDetails;