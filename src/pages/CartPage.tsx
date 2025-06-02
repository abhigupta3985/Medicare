import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  SimpleGrid,
  Image,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Alert,
  AlertIcon,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import { Trash2, AlertCircle, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import { RootState } from '../store';
import { updateQuantity, removeFromCart } from '../features/cart/cartSlice';
import PrescriptionUpload from '../components/prescription/PrescriptionUpload';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const [uploadModalItem, setUploadModalItem] = useState<{ id: string; name: string } | null>(null);
  
  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleUploadPrescription = (id: string, name: string) => {
    setUploadModalItem({ id, name });
  };
  
  const handleCheckout = () => {
    const prescriptionNeeded = items.some(item => item.requiresPrescription && !item.prescriptionUploaded);
    
    if (prescriptionNeeded) {
      toast({
        title: 'Prescription required',
        description: 'Please upload prescriptions for all required medications before checkout',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <Container maxW="container.xl\" py={10}>
        <Card variant="outline" borderRadius="lg">
          <CardBody>
            <VStack spacing={6} py={10}>
              <Box
                p={4}
                borderRadius="full"
                bg="gray.100"
              >
                <ShoppingCart size={60} color="#718096" />
              </Box>
              <Heading size="lg">Your cart is empty</Heading>
              <Text color="gray.600" textAlign="center">
                Looks like you haven't added any medicines to your cart yet.
                <br />
                Browse our catalog to find what you need.
              </Text>
              <Button
                as={RouterLink}
                to="/search"
                colorScheme="blue"
                size="lg"
                rightIcon={<ArrowRight size={16} />}
              >
                Browse Medicines
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8}>Shopping Cart</Heading>
      
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        <Box gridColumn="span 2">
          <VStack
            spacing={4}
            align="stretch"
            bg="white"
            borderRadius="lg"
            p={6}
            boxShadow="sm"
          >
            {/* Cart Items */}
            {items.map((item) => (
              <Box key={item.id}>
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  align={{ base: 'stretch', sm: 'center' }}
                  justify="space-between"
                  py={4}
                >
                  <Flex flex="1">
                    <Image
                      src={item.image}
                      alt={item.name}
                      boxSize="80px"
                      objectFit="cover"
                      borderRadius="md"
                      mr={4}
                      bg="gray.100"
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium" noOfLines={1}>
                        {item.name}
                      </Text>
                      <Text color="green.600" fontWeight="bold">
                        ${item.price.toFixed(2)}
                      </Text>
                      
                      {item.requiresPrescription && (
                        <HStack>
                          <AlertCircle size={14} color={item.prescriptionUploaded ? "green" : "orange"} />
                          <Text fontSize="xs" color={item.prescriptionUploaded ? "green.500" : "orange.500"}>
                            {item.prescriptionUploaded ? "Prescription Uploaded" : "Requires Prescription"}
                          </Text>
                          {!item.prescriptionUploaded && (
                            <Button
                              size="xs"
                              colorScheme="blue"
                              variant="link"
                              onClick={() => handleUploadPrescription(item.id, item.name)}
                            >
                              Upload
                            </Button>
                          )}
                        </HStack>
                      )}
                    </VStack>
                  </Flex>
                  
                  <Flex
                    align="center"
                    mt={{ base: 4, sm: 0 }}
                    justify={{ base: 'space-between', sm: 'flex-end' }}
                    flex="1"
                  >
                    <Box width="100px">
                      <NumberInput
                        size="sm"
                        min={1}
                        max={10}
                        value={item.quantity}
                        onChange={(_, valueAsNumber) => handleQuantityChange(item.id, valueAsNumber)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                    
                    <Text fontWeight="bold" mx={6} minW="80px" textAlign="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                    
                    <IconButton
                      aria-label="Remove item"
                      icon={<Trash2 size={16} />}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemove(item.id)}
                    />
                  </Flex>
                </Flex>
                <Divider />
              </Box>
            ))}
          </VStack>
        </Box>
        
        {/* Order Summary */}
        <Box>
          <Card variant="outline" borderRadius="lg">
            <CardHeader borderBottomWidth="1px">
              <Heading size="md">Order Summary</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text fontWeight="medium">${totalAmount.toFixed(2)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <Text fontWeight="medium">
                    {totalAmount >= 50 ? 'Free' : '$5.99'}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Tax</Text>
                  <Text fontWeight="medium">
                    ${(totalAmount * 0.08).toFixed(2)}
                  </Text>
                </Flex>
                <Divider />
                <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                  <Text>Total</Text>
                  <Text color="green.600">
                    ${(totalAmount + (totalAmount >= 50 ? 0 : 5.99) + totalAmount * 0.08).toFixed(2)}
                  </Text>
                </Flex>
                
                {items.some(item => item.requiresPrescription && !item.prescriptionUploaded) && (
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Please upload prescriptions for all required medications before checkout
                    </Text>
                  </Alert>
                )}
              </VStack>
            </CardBody>
            <CardFooter borderTopWidth="1px">
              <VStack spacing={3} width="full">
                <Button
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  as={RouterLink}
                  to="/search"
                  variant="outline"
                  width="full"
                >
                  Continue Shopping
                </Button>
              </VStack>
            </CardFooter>
          </Card>
        </Box>
      </SimpleGrid>
      
      {/* Prescription Upload Modal */}
      {uploadModalItem && (
        <PrescriptionUpload
          isOpen={!!uploadModalItem}
          onClose={() => setUploadModalItem(null)}
          productId={uploadModalItem.id}
          productName={uploadModalItem.name}
        />
      )}
    </Container>
  );
};

export default CartPage;