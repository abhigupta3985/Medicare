import MedicineCard from '../components/medicines/MedicineCard';
import { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch } from '../features/hooks/useAppDispatch';
import { useAppSelector } from '../features/hooks/useAppSelector';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Avatar,
  Divider,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Card,
  CardBody,
  useToast,
  Grid,
  GridItem,
  Tag,
  Select,
} from '@chakra-ui/react';
import { Edit, Save, Plus, User, Package, Heart, Clock, Settings, LogOut } from 'lucide-react';

import { RootState } from '../store';
import { updateUserProfile, signOut } from '../features/auth/authSlice';
import { fetchUserOrders } from '../features/orders/ordersSlice';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { orders, loading } = useAppSelector((state: RootState) => state.orders);
  const { items: wishlistItems } = useAppSelector((state: RootState) => state.wishlist);
  
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [profileData, setProfileData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    phoneNumber: user?.profile?.phoneNumber || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    state: user?.profile?.state || '',
    pinCode: user?.profile?.pinCode || '',
    medicalConditions: user?.profile?.medicalConditions || [],
    allergies: user?.profile?.allergies || [],
    medications: user?.profile?.medications || [],
    newCondition: '',
    newAllergy: '',
    newMedication: '',
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(fetchUserOrders(user.uid));
  }, [dispatch, navigate, user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleAddItem = (field: 'medicalConditions' | 'allergies' | 'medications', inputField: 'newCondition' | 'newAllergy' | 'newMedication') => {
    if (profileData[inputField].trim()) {
      setProfileData({
        ...profileData,
        [field]: [...(profileData[field] || []), profileData[inputField].trim()],
        [inputField]: '',
      });
    }
  };
  
  const handleRemoveItem = (field: 'medicalConditions' | 'allergies' | 'medications', index: number) => {
    const newArray = [...profileData[field]];
    newArray.splice(index, 1);
    
    setProfileData({
      ...profileData,
      [field]: newArray,
    });
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!profileData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!profileData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (profileData.phoneNumber && !/^\d{10}$/.test(profileData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    // if (profileData.zipCode && !/^\d{5}(-\d{4})?$/.test(profileData.zipCode)) {
    //   newErrors.zipCode = 'Please enter a valid zip code';
    // }

 if (profileData.pinCode && !/^\d{6}$/.test(profileData.pinCode.trim())) {
  newErrors.pinCode = 'Please enter a valid 6-digit PIN code';
}


    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const dataToSave = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        pinCode: profileData.pinCode,
        medicalConditions: profileData.medicalConditions,
        allergies: profileData.allergies,
        medications: profileData.medications,
      };
      
      await dispatch(updateUserProfile({
        uid: user.uid,
        profileData: dataToSave,
      }));
      
      setIsEditing(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error updating your profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/');
  };
  
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
  
  // Navigation items for sidebar
  const navItems = [
    { icon: User, label: 'Personal Info' },
    { icon: Package, label: 'Orders' },
    { icon: Heart, label: 'Saved Items' },
    { icon: Clock, label: 'Prescription History' },
    { icon: Settings, label: 'Account Settings' },
  ];
  
  if (!user) {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={8}>
        {/* Sidebar */}
        <GridItem>
          <VStack spacing={4} align="stretch" position="sticky" top="100px">
            <Card>
              <CardBody>
                <VStack spacing={4} align="center">
                  <Avatar
                    size="xl"
                    name={user.displayName || undefined}
                    src={user.photoURL || undefined}
                  />
                  <VStack spacing={1}>
                    <Heading size="md">{user.displayName}</Heading>
                    <Text color="gray.600" fontSize="sm">{user.email}</Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
            
            <VStack as="nav" spacing={2} align="stretch">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  leftIcon={<item.icon size={18} />}
                  justifyContent="flex-start"
                  variant={activeTab === index ? 'solid' : 'ghost'}
                  colorScheme={activeTab === index ? 'blue' : 'gray'}
                  onClick={() => setActiveTab(index)}
                  py={6}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                leftIcon={<LogOut size={18} />}
                justifyContent="flex-start"
                variant="ghost"
                colorScheme="red"
                onClick={handleSignOut}
                py={6}
              >
                Sign Out
              </Button>
            </VStack>
          </VStack>
        </GridItem>
        
        {/* Main Content */}
        <GridItem>
          <Box bg="white" borderRadius="lg" boxShadow="sm" p={6}>
            <Tabs index={activeTab} onChange={setActiveTab} variant="unstyled">
              <TabList display={{ base: 'flex', md: 'none' }} mb={6} overflowX="auto">
                {navItems.map((item, index) => (
                  <Tab
                    key={index}
                    _selected={{ color: 'blue.500', fontWeight: 'bold', borderBottomWidth: '2px', borderColor: 'blue.500' }}
                    whiteSpace="nowrap"
                  >
                    {item.label}
                  </Tab>
                ))}
              </TabList>
              
              <TabPanels>
                {/* Personal Info Tab */}
                <TabPanel p={0}>
                  <Flex justify="space-between" align="center" mb={6}>
                    <Heading size="lg">Personal Information</Heading>
                    <Button
                      leftIcon={isEditing ? <Save size={16} /> : <Edit size={16} />}
                      colorScheme={isEditing ? 'green' : 'blue'}
                      onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                    >
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </Flex>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {/* Basic Information */}
                    <Card variant="outline">
                      <CardBody>
                        <Heading size="md" mb={4}>Basic Information</Heading>
                        
                        <VStack spacing={4} align="stretch">
                          <SimpleGrid columns={2} spacing={4}>
                            <FormControl isInvalid={!!errors.firstName}>
                              <FormLabel>First Name</FormLabel>
                              {isEditing ? (
                                <>
                                  <Input
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleInputChange}
                                  />
                                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                                </>
                              ) : (
                                <Text>{profileData.firstName || 'Not provided'}</Text>
                              )}
                            </FormControl>
                            
                            <FormControl isInvalid={!!errors.lastName}>
                              <FormLabel>Last Name</FormLabel>
                              {isEditing ? (
                                <>
                                  <Input
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleInputChange}
                                  />
                                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                                </>
                              ) : (
                                <Text>{profileData.lastName || 'Not provided'}</Text>
                              )}
                            </FormControl>
                          </SimpleGrid>
                          
                          <FormControl isInvalid={!!errors.phoneNumber}>
                            <FormLabel>Phone Number</FormLabel>
                            {isEditing ? (
                              <>
                                <Input
                                  name="phoneNumber"
                                  value={profileData.phoneNumber}
                                  onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                              </>
                            ) : (
                              <Text>{profileData.phoneNumber || 'Not provided'}</Text>
                            )}
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>Email Address</FormLabel>
                            <Text>{user.email}</Text>
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    {/* Address Information */}
                    <Card variant="outline">
                      <CardBody>
                        <Heading size="md" mb={4}>Address Information</Heading>
                        
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel>Address</FormLabel>
                            {isEditing ? (
                              <Input
                                name="address"
                                value={profileData.address}
                                onChange={handleInputChange}
                              />
                            ) : (
                              <Text>{profileData.address || 'Not provided'}</Text>
                            )}
                          </FormControl>
                          
                          <SimpleGrid columns={2} spacing={4}>
                            <FormControl>
                              <FormLabel>City</FormLabel>
                              {isEditing ? (
                                <Input
                                  name="city"
                                  value={profileData.city}
                                  onChange={handleInputChange}
                                />
                              ) : (
                                <Text>{profileData.city || 'Not provided'}</Text>
                              )}
                            </FormControl>
                            
                            <FormControl>
                              <FormLabel>State</FormLabel>
                              {isEditing ? (
                                <Input
                                  name="state"
                                  value={profileData.state}
                                  onChange={handleInputChange}
                                />
                              ) : (
                                <Text>{profileData.state || 'Not provided'}</Text>
                              )}
                            </FormControl>
                          </SimpleGrid>
                          
                          <FormControl isInvalid={!!errors.pinCode}>
                            <FormLabel>PIN Code</FormLabel>
                            {isEditing ? (
                              <>
                                <Input
                                  name="pinCode"
                                  value={profileData.pinCode}
                                  onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.pinCode}</FormErrorMessage>
                              </>
                            ) : (
                              <Text>{profileData.pinCode || 'Not provided'}</Text>
                            )}
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                  
                  {/* Medical Information */}
                  <Card variant="outline" mt={6}>
                    <CardBody>
                      <Heading size="md" mb={4}>Medical Information</Heading>
                      
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        {/* Medical Conditions */}
                        <VStack align="stretch" spacing={3}>
                          <FormControl>
                            <FormLabel>Medical Conditions</FormLabel>
                            <Box>
                              {profileData.medicalConditions && profileData.medicalConditions.length > 0 ? (
                                <Flex wrap="wrap\" gap={2} mb={isEditing ? 3 : 0}>
                                  {profileData.medicalConditions.map((condition, index) => (
                                    <Tag
                                      key={index}
                                      size="md"
                                      colorScheme="blue"
                                      borderRadius="full"
                                    >
                                      {condition}
                                      {isEditing && (
                                        <Button
                                          size="xs"
                                          ml={1}
                                          variant="ghost"
                                          onClick={() => handleRemoveItem('medicalConditions', index)}
                                        >
                                          ×
                                        </Button>
                                      )}
                                    </Tag>
                                  ))}
                                </Flex>
                              ) : (
                                <Text color="gray.500">No medical conditions</Text>
                              )}
                            </Box>
                            
                            {isEditing && (
                              <HStack mt={2}>
                                <Input
                                  name="newCondition"
                                  value={profileData.newCondition}
                                  onChange={handleInputChange}
                                  placeholder="Add condition"
                                  size="sm"
                                />
                                <Button
                                  size="sm"
                                  leftIcon={<Plus size={14} />}
                                  onClick={() => handleAddItem('medicalConditions', 'newCondition')}
                                  isDisabled={!profileData.newCondition.trim()}
                                >
                                  Add
                                </Button>
                              </HStack>
                            )}
                          </FormControl>
                        </VStack>
                        
                        {/* Allergies */}
                        <VStack align="stretch" spacing={3}>
                          <FormControl>
                            <FormLabel>Allergies</FormLabel>
                            <Box>
                              {profileData.allergies && profileData.allergies.length > 0 ? (
                                <Flex wrap="wrap\" gap={2} mb={isEditing ? 3 : 0}>
                                  {profileData.allergies.map((allergy, index) => (
                                    <Tag
                                      key={index}
                                      size="md"
                                      colorScheme="red"
                                      borderRadius="full"
                                    >
                                      {allergy}
                                      {isEditing && (
                                        <Button
                                          size="xs"
                                          ml={1}
                                          variant="ghost"
                                          onClick={() => handleRemoveItem('allergies', index)}
                                        >
                                          ×
                                        </Button>
                                      )}
                                    </Tag>
                                  ))}
                                </Flex>
                              ) : (
                                <Text color="gray.500">No allergies</Text>
                              )}
                            </Box>
                            
                            {isEditing && (
                              <HStack mt={2}>
                                <Input
                                  name="newAllergy"
                                  value={profileData.newAllergy}
                                  onChange={handleInputChange}
                                  placeholder="Add allergy"
                                  size="sm"
                                />
                                <Button
                                  size="sm"
                                  leftIcon={<Plus size={14} />}
                                  onClick={() => handleAddItem('allergies', 'newAllergy')}
                                  isDisabled={!profileData.newAllergy.trim()}
                                >
                                  Add
                                </Button>
                              </HStack>
                            )}
                          </FormControl>
                        </VStack>
                        
                        {/* Current Medications */}
                        <VStack align="stretch" spacing={3}>
                          <FormControl>
                            <FormLabel>Current Medications</FormLabel>
                            <Box>
                              {profileData.medications && profileData.medications.length > 0 ? (
                                <Flex wrap="wrap\" gap={2} mb={isEditing ? 3 : 0}>
                                  {profileData.medications.map((medication, index) => (
                                    <Tag
                                      key={index}
                                      size="md"
                                      colorScheme="green"
                                      borderRadius="full"
                                    >
                                      {medication}
                                      {isEditing && (
                                        <Button
                                          size="xs"
                                          ml={1}
                                          variant="ghost"
                                          onClick={() => handleRemoveItem('medications', index)}
                                        >
                                          ×
                                        </Button>
                                      )}
                                    </Tag>
                                  ))}
                                </Flex>
                              ) : (
                                <Text color="gray.500">No medications</Text>
                              )}
                            </Box>
                            
                            {isEditing && (
                              <HStack mt={2}>
                                <Input
                                  name="newMedication"
                                  value={profileData.newMedication}
                                  onChange={handleInputChange}
                                  placeholder="Add medication"
                                  size="sm"
                                />
                                <Button
                                  size="sm"
                                  leftIcon={<Plus size={14} />}
                                  onClick={() => handleAddItem('medications', 'newMedication')}
                                  isDisabled={!profileData.newMedication.trim()}
                                >
                                  Add
                                </Button>
                              </HStack>
                            )}
                          </FormControl>
                        </VStack>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </TabPanel>
                
                {/* Orders Tab */}
                <TabPanel p={0}>
                  <Heading size="lg" mb={6}>My Orders</Heading>
                  
                  {loading ? (
                    <Text>Loading your orders...</Text>
                  ) : orders.length === 0 ? (
                    <Card variant="outline">
                      <CardBody>
                        <VStack py={6} spacing={4}>
                          <Box
                            p={3}
                            bg="gray.100"
                            borderRadius="full"
                          >
                            <Package size={30} color="#718096" />
                          </Box>
                          <Text fontSize="lg" fontWeight="medium">No orders yet</Text>
                          <Text color="gray.600" textAlign="center">
                            You haven't placed any orders with us yet.
                            <br />
                            Browse our products and place your first order.
                          </Text>
                          <Button
                            as={RouterLink}
                            to="/search"
                            colorScheme="blue"
                          >
                            Browse Medicines
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {orders.map((order) => (
                        <Card key={order.id} variant="outline">
                          <CardBody>
                            <Grid templateColumns={{ base: '1fr', md: '1fr auto' }} gap={4}>
                              <GridItem>
                                <HStack mb={3} justify="space-between">
                                  <Heading size="sm">
                                    Order #{order.id.slice(-8)}
                                  </Heading>
                                  <Badge
                                    colorScheme={
                                      order.status === 'delivered'
                                        ? 'green'
                                        : order.status === 'cancelled'
                                        ? 'red'
                                        : 'blue'
                                    }
                                    borderRadius="full"
                                  >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </HStack>
                                
                                <Text fontSize="sm" color="gray.600" mb={3}>
                                  Placed on {formatDate(order.createdAt)}
                                </Text>
                                
                                <Divider mb={3} />
                                
                                <Flex wrap="wrap" gap={3}>
                                  {order.items.map((item) => (
                                    <HStack key={item.id} spacing={2}>
                                      <Tag colorScheme="gray" borderRadius="full">
                                        {item.name} (x{item.quantity})
                                      </Tag>
                                    </HStack>
                                  ))}
                                </Flex>
                              </GridItem>
                              
                              <GridItem display="flex" alignItems="center" justifyContent={{ base: 'flex-start', md: 'flex-end' }}>
                                <VStack align={{ base: 'stretch', md: 'flex-end' }}>
                                  <Text fontWeight="bold" fontSize="lg">
                                    ${order.totalAmount.toFixed(2)}
                                  </Text>
                                  <Button
                                    as={RouterLink}
                                    to={`/orders/${order.id}`}
                                    colorScheme="blue"
                                    size="sm"
                                  >
                                    View Details
                                  </Button>
                                </VStack>
                              </GridItem>
                            </Grid>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  )}
                </TabPanel>
                
                {/* Saved Items Tab */}
                <TabPanel p={0}>
                  <Heading size="lg" mb={6}>Saved Items</Heading>
                  {wishlistItems.length === 0 ? (
                    <Card variant="outline">
                      <CardBody>
                        <VStack py={6} spacing={4}>
                          <Box
                            p={3}
                            bg="gray.100"
                            borderRadius="full"
                          >
                            <Heart size={30} color="#718096" />
                          </Box>
                          <Text fontSize="lg" fontWeight="medium">No saved items yet</Text>
                          <Text color="gray.600" textAlign="center">
                            You haven't saved any items to your wishlist yet.
                            <br />
                            Browse our products and click the heart icon to save items.
                          </Text>
                          <Button
                            as={RouterLink}
                            to="/search"
                            colorScheme="blue"
                          >
                            Browse Medicines
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {wishlistItems.map((item) => (
                        <MedicineCard key={item.id} medicine={item} />
                      ))}
                    </SimpleGrid>
                  )}
                </TabPanel>
                
                {/* Prescription History Tab */}
                <TabPanel p={0}>
                  <Heading size="lg" mb={6}>Prescription History</Heading>
                  <Card variant="outline">
                    <CardBody>
                      <VStack py={6} spacing={4}>
                        <Box
                          p={3}
                          bg="gray.100"
                          borderRadius="full"
                        >
                          <Clock size={30} color="#718096" />
                        </Box>
                        <Text fontSize="lg" fontWeight="medium">No prescription history</Text>
                        <Text color="gray.600" textAlign="center">
                          You don't have any prescription history yet.
                          <br />
                          Your uploaded prescriptions will appear here.
                        </Text>
                        <Button
                          as={RouterLink}
                          to="/search?category=prescription"
                          colorScheme="blue"
                        >
                          Browse Prescription Medicines
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </TabPanel>
                
                {/* Account Settings Tab */}
                <TabPanel p={0}>
                  <Heading size="lg" mb={6}>Account Settings</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Card variant="outline">
                      <CardBody>
                        <Heading size="md" mb={4}>Email Preferences</Heading>
                        
                        <VStack align="stretch" spacing={4}>
                          <FormControl>
                            <Flex justify="space-between" align="center">
                              <Box>
                                <FormLabel mb={0}>Order Notifications</FormLabel>
                                <Text fontSize="sm" color="gray.600">
                                  Receive updates about your orders
                                </Text>
                              </Box>
                              <Select
                                size="sm"
                                width="120px"
                                defaultValue="enabled"
                              >
                                <option value="enabled">Enabled</option>
                                <option value="disabled">Disabled</option>
                              </Select>
                            </Flex>
                          </FormControl>
                          
                          <Divider />
                          
                          <FormControl>
                            <Flex justify="space-between" align="center">
                              <Box>
                                <FormLabel mb={0}>Promotions & Discounts</FormLabel>
                                <Text fontSize="sm" color="gray.600">
                                  Receive special offers and deals
                                </Text>
                              </Box>
                              <Select
                                size="sm"
                                width="120px"
                                defaultValue="enabled"
                              >
                                <option value="enabled">Enabled</option>
                                <option value="disabled">Disabled</option>
                              </Select>
                            </Flex>
                          </FormControl>
                          
                          <Divider />
                          
                          <FormControl>
                            <Flex justify="space-between" align="center">
                              <Box>
                                <FormLabel mb={0}>Prescription Reminders</FormLabel>
                                <Text fontSize="sm" color="gray.600">
                                  Get reminders for prescription refills
                                </Text>
                              </Box>
                              <Select
                                size="sm"
                                width="120px"
                                defaultValue="enabled"
                              >
                                <option value="enabled">Enabled</option>
                                <option value="disabled">Disabled</option>
                              </Select>
                            </Flex>
                          </FormControl>
                          
                          <Divider />
                          
                          <FormControl>
                            <Flex justify="space-between" align="center">
                              <Box>
                                <FormLabel mb={0}>Newsletter</FormLabel>
                                <Text fontSize="sm" color="gray.600">
                                  Receive our monthly health newsletter
                                </Text>
                              </Box>
                              <Select
                                size="sm"
                                width="120px"
                                defaultValue="disabled"
                              >
                                <option value="enabled">Enabled</option>
                                <option value="disabled">Disabled</option>
                              </Select>
                            </Flex>
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </Card>
                    
                    <Card variant="outline">
                      <CardBody>
                        <Heading size="md" mb={4}>Security Settings</Heading>
                        
                        <VStack align="stretch" spacing={4}>
                          <Button variant="outline" colorScheme="blue">
                            Change Password
                          </Button>
                          
                          <Button variant="outline" colorScheme="blue">
                            Two-Factor Authentication
                          </Button>
                          
                          <Divider />
                          
                          <Heading size="sm" mb={2}>Account Actions</Heading>
                          
                          <Button colorScheme="red" variant="outline">
                            Delete Account
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                  
                  <Button
                    mt={6}
                    colorScheme="blue"
                    size="lg"
                  
                  >
                    Save Settings
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ProfilePage;