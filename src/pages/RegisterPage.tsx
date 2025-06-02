import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Checkbox,
  HStack,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';

import { RootState } from '../store';
import { register } from '../features/auth/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    termsAccepted?: string;
  }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: newValue });
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };
  
  const validateForm = () => {
    const errors: {
      displayName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      termsAccepted?: string;
    } = {};
    
    if (!formData.displayName.trim()) {
      errors.displayName = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await dispatch(register({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
      }));
      
      navigate('/');
      
      toast({
        title: 'Account created',
        description: 'Your account has been successfully created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      // Error is handled in the slice
    }
  };
  
  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={2} align="center">
          <Heading textAlign="center">Create an Account</Heading>
          <Text color="gray.600" textAlign="center">
            Join MediCare for fast and reliable medicine delivery
          </Text>
        </VStack>
        
        {error && (
          <Box
            p={3}
            bg="red.50"
            color="red.500"
            borderRadius="md"
            textAlign="center"
          >
            {error === 'Firebase: Error (auth/email-already-in-use).' 
              ? 'Email is already in use. Please try another email or sign in.' 
              : error}
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!formErrors.displayName}>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="displayName"
                placeholder="John Doe"
                value={formData.displayName}
                onChange={handleChange}
              />
              <FormErrorMessage>{formErrors.displayName}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!formErrors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <FormErrorMessage>{formErrors.email}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!formErrors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formErrors.password}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!formErrors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!formErrors.termsAccepted}>
              <Checkbox
                name="termsAccepted"
                isChecked={formData.termsAccepted}
                onChange={handleChange}
                colorScheme="blue"
              >
                I agree to the Terms of Service and Privacy Policy
              </Checkbox>
              <FormErrorMessage>{formErrors.termsAccepted}</FormErrorMessage>
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Create Account
            </Button>
          </VStack>
        </form>
        
        <Divider />
        
        <Box textAlign="center">
          <Text>
            Already have an account?{' '}
            <Button
              as={RouterLink}
              to="/login"
              variant="link"
              colorScheme="blue"
            >
              Sign In
            </Button>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default RegisterPage;