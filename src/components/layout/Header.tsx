import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Badge,
  Avatar,
  Text,
  Image,
  Divider,
} from '@chakra-ui/react';
import { Search, ShoppingCart, User, Menu as MenuIcon, X } from 'lucide-react';
import { RootState } from '../../store';
import { signOut } from '../../features/auth/authSlice';
import { toggleSearch, toggleCartDrawer } from '../../features/ui/uiSlice';
import { setSearchTerm } from '../../features/medicines/medicinesSlice';

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchValue));
    navigate('/search');
  };
  
  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/');
  };

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="1000"
      bg={scrolled ? 'white' : 'transparent'}
      transition="all 0.3s"
      boxShadow={scrolled ? 'sm' : 'none'}
      backdropFilter={scrolled ? 'blur(10px)' : 'none'}
    >
      <Container maxW="container.xl" py={3}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <RouterLink to="/">
            <Flex align="center">
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                color="brand.600"
                display="flex"
                alignItems="center"
              >
                <Box as="span" mr={2} color="brand.500">
                  {/* You can replace this with an actual logo */}
                  🏥
                </Box>
                MediCare
              </Text>
            </Flex>
          </RouterLink>

          {/* Search bar (desktop) */}
          <Box 
            display={{ base: 'none', md: 'block' }} 
            flex="1" 
            mx={8}
          >
            <form onSubmit={handleSearch}>
              <InputGroup>
                <Input
                  placeholder="Search medicines, brands, symptoms..."
                  variant="filled"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  bg="gray.100"
                  _hover={{ bg: 'gray.200' }}
                  _focus={{ bg: 'white', borderColor: 'brand.500' }}
                  borderRadius="full"
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Search"
                    icon={<Search size={18} />}
                    variant="ghost"
                    type="submit"
                    color="gray.500"
                    _hover={{ color: 'brand.500' }}
                  />
                </InputRightElement>
              </InputGroup>
            </form>
          </Box>

          {/* Navigation links and buttons */}
          <HStack spacing={4}>
            {/* Search button (mobile) */}
            <IconButton
              aria-label="Search"
              icon={<Search size={20} />}
              variant="ghost"
              display={{ base: 'flex', md: 'none' }}
              onClick={() => dispatch(toggleSearch())}
            />

            {/* Cart button */}
            <Box position="relative">
              <IconButton
                aria-label="Shopping cart"
                icon={<ShoppingCart size={20} />}
                variant="ghost"
                onClick={() => dispatch(toggleCartDrawer())}
              />
              {totalItems > 0 && (
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Box>

            {/* User menu */}
            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rounded="full"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar
                    size="sm"
                    name={user.displayName || undefined}
                    src={user.photoURL || undefined}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">My Profile</MenuItem>
                  <MenuItem as={RouterLink} to="/profile">My Orders</MenuItem>
                  <MenuItem as={RouterLink} to="/profile">Saved Items</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                as={RouterLink}
                to="/login"
                variant="outline"
                colorScheme="blue"
                leftIcon={<User size={16} />}
                size="sm"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <IconButton
              display={{ base: 'flex', lg: 'none' }}
              onClick={onToggle}
              icon={isOpen ? <X size={20} /> : <MenuIcon size={20} />}
              variant="ghost"
              aria-label="Toggle Navigation"
            />
          </HStack>
        </Flex>

        {/* Categories menu - This will be expanded in future iterations */}
        <Flex 
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          alignItems="center"
          justifyContent="center"
          mt={4}
          pb={2}
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <HStack spacing={6} as="nav">
            <Text as={RouterLink} to="/search?category=prescription" fontWeight="medium" fontSize="sm" whiteSpace="nowrap">Prescription</Text>
            <Text as={RouterLink} to="/search?category=otc" fontWeight="medium" fontSize="sm" whiteSpace="nowrap">OTC Medicines</Text>
            <Text as={RouterLink} to="/search?category=vitamins" fontWeight="medium" fontSize="sm" whiteSpace="nowrap">Vitamins & Supplements</Text>
            <Text as={RouterLink} to="/search?category=skincare" fontWeight="medium" fontSize="sm" whiteSpace="nowrap">Skincare</Text>
            <Text as={RouterLink} to="/search?category=personal" fontWeight="medium" fontSize="sm" whiteSpace="nowrap">Personal Care</Text>
            <Text as={RouterLink} to="/search?category=covid" fontWeight="medium" fontSize="sm" whiteSpace="nowrap">COVID Essentials</Text>
            <Text as={RouterLink} to="/search?category=devices" fontWeight="medium" fontSize="sm" whiteSpace="nowrap">Medical Devices</Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;