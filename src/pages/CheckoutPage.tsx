import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../features/hooks/useAppSelector';
import { useAppDispatch } from '../features/hooks/useAppDispatch';
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
  Flex,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Textarea,
  Image,
  useSteps,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  useToast,
  Select,
} from '@chakra-ui/react';
import { Lock, CreditCard, MapPin, Truck } from 'lucide-react';

import { RootState } from '../store';
import { createOrder } from '../features/orders/ordersSlice';
import { clearCart } from '../features/cart/cartSlice';
import { countries } from '../services/mockData';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  paymentMethod: string;
  cardName?: string;
  cardNumber?: string;
  expDate?: string;
  cvv?: string;
  notes?: string;
}

interface FormErrors {
  [key: string]: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const [isEditing, setIsEditing] = useState(true);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    phone: user?.profile?.phoneNumber || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    state: user?.profile?.state || '',
    pinCode: user?.profile?.pinCode || '',
    country: 'India',
    paymentMethod: 'creditCard',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps = [
    { title: 'Shipping', description: 'Delivery details' },
    { title: 'Payment', description: 'Payment method' },
    { title: 'Review', description: 'Order summary' },
  ];
  
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setFormData({ ...formData, paymentMethod: value });
  };
  
  const validateShippingForm = () => {
    const newErrors: FormErrors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pinCode'];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    
    // PIN code validation 
if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
  newErrors.pinCode = 'Please enter a valid 6-digit PIN code';
}

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePaymentForm = () => {
    if (formData.paymentMethod === 'creditCard') {
      const newErrors: FormErrors = {};
      
      if (!formData.cardName) {
        newErrors.cardName = 'Please enter the name on card';
      }
      
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Please enter your card number';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.expDate) {
        newErrors.expDate = 'Please enter the expiration date';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expDate)) {
        newErrors.expDate = 'Please enter a valid date (MM/YY)';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'Please enter the CVV';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      if (validateShippingForm()) {
        setActiveStep(activeStep + 1);
      }
    } else if (activeStep === 1) {
      if (validatePaymentForm()) {
        setActiveStep(activeStep + 1);
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to complete your order',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the order
      await dispatch(createOrder({
        userId: user.uid,
        items: items.map(item => ({
          ...item,
          subtotal: item.price * item.quantity,
        })),
        totalAmount,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      }));
      
      // Clear the cart
      dispatch(clearCart());
      
      // Show success toast
      toast({
        title: 'Order placed successfully',
        description: 'Thank you for your purchase!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate to orders page
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Error placing order',
        description: 'There was an error processing your order. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate totals
  const shipping = totalAmount >= 50 ? 0 : 5.99;
  const tax = totalAmount * 0.08;
  const orderTotal = totalAmount + shipping + tax;
  
  if (items.length === 0) {
    return (
      <Container maxW="container.xl" py={10}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          Your cart is empty. Please add items to your cart before proceeding to checkout.
        </Alert>
        <Button
          mt={4}
          colorScheme="blue"
          onClick={() => navigate('/search')}
        >
          Browse Medicines
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Stepper size="md" index={activeStep} colorScheme="blue">
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
      
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        <Box gridColumn="span 2">
          {/* Shipping Information (Step 1) */}
          {activeStep === 0 && (
            <Card variant="outline\" p={4}>
              <CardBody>
                <Heading size="md" mb={6}>
                  <HStack>
                    <MapPin size={20} />
                    <Text>Shipping Information</Text>
                  </HStack>
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl isInvalid={!!errors.firstName}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.lastName}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.phone}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.address} gridColumn={{ md: 'span 2' }}>
                    <FormLabel>Address</FormLabel>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.city}>
                    <FormLabel>City</FormLabel>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.city}</FormErrorMessage>
                  </FormControl>
                  
                  <SimpleGrid columns={2} spacing={4}>
                    <FormControl isInvalid={!!errors.state}>
                      <FormLabel>State</FormLabel>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.state}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.pinCode}>
                      <FormLabel>PIN Code</FormLabel>
                      <Input
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.pinCode}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl>
                    <FormLabel>Country</FormLabel>
                    {isEditing ? (
                      <Select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      >
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Text>
                        {countries.find(c => c.code === formData.country)?.name || formData.country}
                      </Text>
                    )}
                  </FormControl>
                </SimpleGrid>
                
                <Button
                  mt={8}
                  colorScheme="blue"
                  size="lg"
                  onClick={handleNext}
                  width="full"
                >
                  Continue to Payment
                </Button>
              </CardBody>
            </Card>
          )}
          
          {/* Payment Information (Step 2) */}
          {activeStep === 1 && (
            <Card variant="outline" p={4}>
              <CardBody>
                <Heading size="md" mb={6}>
                  <HStack>
                    <CreditCard size={20} />
                    <Text>Payment Method</Text>
                  </HStack>
                </Heading>
                
                <RadioGroup
                  value={formData.paymentMethod}
                  onChange={handlePaymentMethodChange}
                  mb={6}
                >
                  <VStack align="flex-start" spacing={4}>
                    <Radio value="creditCard">Credit Card</Radio>
                    <Radio value="paypal">PayPal</Radio>
                    <Radio value="cod">Cash on Delivery</Radio>
                  </VStack>
                </RadioGroup>
                
                {formData.paymentMethod === 'creditCard' && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isInvalid={!!errors.cardName} gridColumn={{ md: 'span 2' }}>
                      <FormLabel>Name on Card</FormLabel>
                      <Input
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.cardName}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.cardNumber} gridColumn={{ md: 'span 2' }}>
                      <FormLabel>Card Number</FormLabel>
                      <Input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                      <FormErrorMessage>{errors.cardNumber}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.expDate}>
                      <FormLabel>Expiration Date</FormLabel>
                      <Input
                        name="expDate"
                        value={formData.expDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                      />
                      <FormErrorMessage>{errors.expDate}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.cvv}>
                      <FormLabel>CVV</FormLabel>
                      <Input
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="XXX"
                      />
                      <FormErrorMessage>{errors.cvv}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                )}
                
                {formData.paymentMethod === 'paypal' && (
                  <Box p={4} bg="blue.50" borderRadius="md">
                    <Text>You will be redirected to PayPal to complete your payment after reviewing your order.</Text>
                  </Box>
                )}
                
                {formData.paymentMethod === 'cod' && (
                  <Box p={4} bg="yellow.50" borderRadius="md">
                    <Text>You will pay for your order when it's delivered. Additional COD charges may apply.</Text>
                  </Box>
                )}
                
                <FormControl mt={6}>
                  <FormLabel>Order Notes (Optional)</FormLabel>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Special instructions for delivery"
                  />
                </FormControl>
                
                <HStack mt={8} justify="space-between" width="full">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={handleNext}
                  >
                    Review Order
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          )}
          
          {/* Order Review (Step 3) */}
          {activeStep === 2 && (
            <Card variant="outline" p={4}>
              <CardBody>
                <Heading size="md" mb={6}>
                  <HStack>
                    <Truck size={20} />
                    <Text>Review Your Order</Text>
                  </HStack>
                </Heading>
                
                <Box mb={8}>
                  <Heading size="sm" mb={4}>Shipping Address</Heading>
                  <Text>{formData.firstName} {formData.lastName}</Text>
                  <Text>{formData.address}</Text>
                  <Text>{formData.city}, {formData.state} {formData.pinCode}</Text>
                  <Text>{formData.country}</Text>
                  <Text mt={2}>Email: {formData.email}</Text>
                  <Text>Phone: {formData.phone}</Text>
                </Box>
                
                <Divider my={6} />
                
                <Box mb={8}>
                  <Heading size="sm" mb={4}>Payment Method</Heading>
                  <Text>
                    {formData.paymentMethod === 'creditCard' ? 'Credit Card' : 
                      formData.paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
                  </Text>
                  {formData.paymentMethod === 'creditCard' && (
                    <Text>Card ending in {formData.cardNumber?.slice(-4)}</Text>
                  )}
                </Box>
                
                <Divider my={6} />
                
                <Box>
                  <Heading size="sm" mb={4}>Order Items</Heading>
                  <VStack spacing={4} align="stretch" divider={<Divider />}>
                    {items.map((item) => (
                      <Flex key={item.id} justify="space-between" align="center">
                        <HStack>
                          <Image
                            src={item.image}
                            alt={item.name}
                            boxSize="50px"
                            objectFit="cover"
                            borderRadius="md"
                            bg="gray.100"
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">{item.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              Qty: {item.quantity} x ${item.price.toFixed(2)}
                            </Text>
                          </VStack>
                        </HStack>
                        <Text fontWeight="bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
                
                <HStack mt={8} justify="space-between" width="full">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Back to Payment
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    leftIcon={<Lock size={16} />}
                  >
                    Place Order
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          )}
        </Box>
        
        {/* Order Summary */}
        <Box>
          <Card variant="outline" borderRadius="lg">
            <CardBody>
              <Heading size="md" mb={6}>Order Summary</Heading>
              
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between">
                  <Text color="gray.600">Subtotal ({items.length} items)</Text>
                  <Text fontWeight="medium">${totalAmount.toFixed(2)}</Text>
                </Flex>
                
                <Flex justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <Text fontWeight="medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </Text>
                </Flex>
                
                <Flex justify="space-between">
                  <Text color="gray.600">Tax (8%)</Text>
                  <Text fontWeight="medium">${tax.toFixed(2)}</Text>
                </Flex>
                
                <Divider />
                
                <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                  <Text>Total</Text>
                  <Text color="green.600">${orderTotal.toFixed(2)}</Text>
                </Flex>
              </VStack>
              
              <Box mt={6} p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default CheckoutPage;