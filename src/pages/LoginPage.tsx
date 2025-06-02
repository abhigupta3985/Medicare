import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';

import { RootState } from '../store';
import { login } from '../features/auth/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };
  
  const validateForm = () => {
    const errors: {
      email?: string;
      password?: string;
    } = {};
    
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await dispatch(login({
        email: formData.email,
        password: formData.password,
      }));
      
      // Get redirect path from location state or default to home
      const from = location.state?.from?.pathname || '/';
      navigate(from);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to MediCare!',
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
          <Heading textAlign="center">Sign In</Heading>
          <Text color="gray.600" textAlign="center">
            Welcome back to MediCare
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
            {error === 'Firebase: Error (auth/invalid-credential).' 
              ? 'Invalid email or password. Please try again.' 
              : error}
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
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
            
            <HStack justify="space-between" width="full">
              <Checkbox colorScheme="blue">Remember me</Checkbox>
              <Button variant="link" colorScheme="blue" size="sm">
                Forgot password?
              </Button>
            </HStack>
            
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Sign In
            </Button>
          </VStack>
        </form>
        
        <Divider />
        
        <Box textAlign="center">
          <Text>
            Don't have an account?{' '}
            <Button
              as={RouterLink}
              to="/register"
              variant="link"
              colorScheme="blue"
            >
              Sign Up
            </Button>
          </Text>
        </Box>
        
        {/* Demo accounts for testing purposes */}
        <Box bg="blue.50" p={4} borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Demo Accounts
          </Text>
          <Text fontSize="xs">
            Email: demo@example.com<br />
            Password: password123
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default LoginPage;