import { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch } from '../features/hooks/useAppDispatch';
import { useAppSelector } from '../features/hooks/useAppSelector';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Divider,
  Image,
  Badge,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Skeleton,
  Alert,
  AlertIcon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronLeft, MapPin, ShoppingBag, Truck, Check } from 'lucide-react';

import { RootState } from '../store';
import { fetchOrderById } from '../features/orders/ordersSlice';

const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder, loading, error } = useAppSelector((state: RootState) => state.orders);
  
  // Responsive step orientation
  const stepOrientation = useBreakpointValue({ base: 'vertical', md: 'horizontal' });
  
  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);
  
  // Determine the current step based on order status
  const getActiveStep = () => {
    if (!currentOrder) return 0;
    
    switch (currentOrder.status) {
      case 'processing':
        return 0;
      case 'confirmed':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1; // Special case for cancelled orders
      default:
        return 0;
    }
  };
  
  const steps = [
    { title: 'Processing', description: 'Order received' },
    { title: 'Confirmed', description: 'Payment verified' },
    { title: 'Shipped', description: 'On the way' },
    { title: 'Delivered', description: 'Order completed' },
  ];
  
  const activeStep = getActiveStep();
  
  if (loading) {
    return (
      <Container maxW="container.xl\" py={8}>
        <VStack spacing={6} align="stretch">
          <Skeleton height="40px" width="300px" />
          <Skeleton height="20px" width="200px" />
          <Skeleton height="100px" />
          <Skeleton height="300px" />
        </VStack>
      </Container>
    );
  }
  
  if (error || !currentOrder) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error || 'Order not found. The requested order may have been removed or is no longer available.'}
        </Alert>
        <Button
          as={RouterLink}
          to="/profile"
          leftIcon={<ChevronLeft size={16} />}
          colorScheme="blue"
          variant="outline"
        >
          Back to Orders
        </Button>
      </Container>
    );
  }
  
  // Format date
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <Button
        as={RouterLink}
        to="/profile"
        leftIcon={<ChevronLeft size={16} />}
        colorScheme="blue"
        variant="outline"
        mb={6}
      >
        Back to Orders
      </Button>
      
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Order #{currentOrder.id.slice(-8)}</Heading>
          <Text color="gray.600">
            Placed on {formatDate(currentOrder.createdAt)}
          </Text>
        </Box>
        <Badge
          colorScheme={
            currentOrder.status === 'delivered'
              ? 'green'
              : currentOrder.status === 'cancelled'
              ? 'red'
              : 'blue'
          }
          fontSize="md"
          px={3}
          py={1}
          borderRadius="full"
        >
          {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
        </Badge>
      </HStack>
      
      {currentOrder.status !== 'cancelled' ? (
        <Box mb={10}>
          <Stepper 
            index={activeStep} 
            colorScheme="green" 
            size="lg"
            orientation={stepOrientation as any}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink={0}>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Box>
      ) : (
        <Alert status="error" mb={10}>
          <AlertIcon />
          This order has been cancelled. Please contact customer support if you have any questions.
        </Alert>
      )}
      
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        <Box gridColumn="span 2">
          <Card variant="outline" mb={6}>
            <CardBody>
              <Heading size="md" mb={4}>
                <HStack>
                  <ShoppingBag size={20} />
                  <Text>Order Items</Text>
                </HStack>
              </Heading>
              
              <VStack spacing={4} align="stretch" divider={<Divider />}>
                {currentOrder.items.map((item) => (
                  <Flex key={item.id} justify="space-between" align="center">
                    <HStack>
                      <Image
                        src={item.image}
                        alt={item.name}
                        boxSize="60px"
                        objectFit="cover"
                        borderRadius="md"
                        bg="gray.100"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{item.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          Qty: {item.quantity} x ${item.price.toFixed(2)}
                        </Text>
                        {item.requiresPrescription && (
                          <Badge colorScheme="purple" fontSize="xs">
                            Prescription Required
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                    <Text fontWeight="bold">
                      ${item.subtotal.toFixed(2)}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </CardBody>
          </Card>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card variant="outline">
              <CardBody>
                <Heading size="md" mb={4}>
                  <HStack>
                    <MapPin size={20} />
                    <Text>Shipping Address</Text>
                  </HStack>
                </Heading>
                
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">{currentOrder.shippingAddress.name}</Text>
                  <Text>{currentOrder.shippingAddress.street}</Text>
                  <Text>
                    {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.pinCode}
                  </Text>
                  <Text>{currentOrder.shippingAddress.country}</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card variant="outline">
              <CardBody>
                <Heading size="md" mb={4}>
                  <HStack>
                    <Truck size={20} />
                    <Text>Delivery Details</Text>
                  </HStack>
                </Heading>
                
                <VStack align="start" spacing={2}>
                  <Flex justify="space-between" width="full">
                    <Text color="gray.600">Estimated Delivery:</Text>
                    <Text fontWeight="medium">
                      {currentOrder.estimatedDelivery
                        ? formatDate(currentOrder.estimatedDelivery)
                        : 'To be determined'}
                    </Text>
                  </Flex>
                  
                  {currentOrder.trackingNumber && (
                    <Flex justify="space-between" width="full">
                      <Text color="gray.600">Tracking Number:</Text>
                      <Text fontWeight="medium">{currentOrder.trackingNumber}</Text>
                    </Flex>
                  )}
                  
                  <Flex justify="space-between" width="full">
                    <Text color="gray.600">Shipping Method:</Text>
                    <Text fontWeight="medium">Standard Shipping</Text>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>
        
        <Box>
          <Card variant="outline">
            <CardBody>
              <Heading size="md" mb={6}>Order Summary</Heading>
              
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text fontWeight="medium">${currentOrder.totalAmount.toFixed(2)}</Text>
                </Flex>
                
                <Flex justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <Text fontWeight="medium">
                    {currentOrder.totalAmount >= 50 ? 'Free' : '$5.99'}
                  </Text>
                </Flex>
                
                <Flex justify="space-between">
                  <Text color="gray.600">Tax</Text>
                  <Text fontWeight="medium">
                    ${(currentOrder.totalAmount * 0.08).toFixed(2)}
                  </Text>
                </Flex>
                
                <Divider />
                
                <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                  <Text>Total</Text>
                  <Text color="green.600">
                    ${(
                      currentOrder.totalAmount +
                      (currentOrder.totalAmount >= 50 ? 0 : 5.99) +
                      currentOrder.totalAmount * 0.08
                    ).toFixed(2)}
                  </Text>
                </Flex>
                
                <Divider />
                
                <Flex justify="space-between">
                  <Text color="gray.600">Payment Method</Text>
                  <Text fontWeight="medium">
                    {currentOrder.paymentMethod === 'creditCard'
                      ? 'Credit Card'
                      : currentOrder.paymentMethod === 'paypal'
                      ? 'PayPal'
                      : 'Cash on Delivery'}
                  </Text>
                </Flex>
                
                <Flex justify="space-between">
                  <Text color="gray.600">Order Date</Text>
                  <Text fontWeight="medium">{formatDate(currentOrder.createdAt)}</Text>
                </Flex>
              </VStack>
              
              {currentOrder.status === 'delivered' && (
                <Button
                  mt={6}
                  colorScheme="green"
                  width="full"
                  leftIcon={<Check size={16} />}
                  variant="outline"
                  as={RouterLink}
                  to={`/product/${currentOrder.items[0].id}`}
                >
                  Buy Again
                </Button>
              )}
              
              <Button
                mt={3}
                colorScheme="blue"
                width="full"
                variant="outline"
              >
                Need Help?
              </Button>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default OrderTrackingPage;