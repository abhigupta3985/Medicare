import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Flex,
  Text,
  Box,
} from '@chakra-ui/react';
import { Search, History, TrendingUp, X } from 'lucide-react';

import { RootState } from '../../store';
import { toggleSearch } from '../../features/ui/uiSlice';
import { setSearchTerm } from '../../features/medicines/medicinesSlice';

const SearchDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchOpen } = useSelector((state: RootState) => state.ui);
  const [inputValue, setInputValue] = useState('');
  
  // Mock recent searches
  const recentSearches = ['Antibiotics', 'Paracetamol', 'Vitamins'];
  
  // Mock trending searches
  const trendingSearches = ['Covid test', 'Flu medicine', 'Allergy relief', 'Pain killer'];

  const handleSearch = (term: string = inputValue) => {
    if (term.trim()) {
      dispatch(setSearchTerm(term));
      dispatch(toggleSearch());
      navigate('/search');
    }
  };

  const handleClose = () => {
    dispatch(toggleSearch());
  };

  return (
    <Drawer isOpen={isSearchOpen} placement="top" onClose={handleClose} size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton size="lg" />
        <DrawerHeader borderBottomWidth="1px" pb={4}>
          <InputGroup size="lg" maxW={{ base: '100%', md: '600px' }} mx="auto">
            <Input
              placeholder="Search medicines, brands, symptoms..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              autoFocus
              fontSize="xl"
              _focus={{ borderColor: 'brand.500' }}
            />
            <InputRightElement width="4.5rem">
              <IconButton
                aria-label="Search"
                icon={<Search size={20} />}
                h="1.75rem"
                size="sm"
                colorScheme="blue"
                onClick={() => handleSearch()}
              />
            </InputRightElement>
          </InputGroup>
        </DrawerHeader>

        <DrawerBody pt={6}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            maxW={{ base: '100%', md: '900px' }}
            mx="auto"
            gap={10}
          >
            {/* Recent searches */}
            <Box flex="1">
              <Flex align="center" mb={3}>
                <History size={18} color="#718096" />
                <Text ml={2} fontSize="lg" fontWeight="medium">
                  Recent Searches
                </Text>
              </Flex>
              <VStack align="stretch" spacing={3}>
                {recentSearches.map((term, index) => (
                  <Flex 
                    key={index} 
                    justify="space-between" 
                    align="center"
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                    onClick={() => handleSearch(term)}
                  >
                    <Text>{term}</Text>
                    <IconButton
                      aria-label="Remove search"
                      icon={<X size={14} />}
                      size="xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        // In a real app, you would remove the search term here
                      }}
                    />
                  </Flex>
                ))}
              </VStack>
            </Box>

            {/* Trending searches */}
            <Box flex="1">
              <Flex align="center" mb={3}>
                <TrendingUp size={18} color="#718096" />
                <Text ml={2} fontSize="lg" fontWeight="medium">
                  Trending Searches
                </Text>
              </Flex>
              <VStack align="stretch" spacing={3}>
                {trendingSearches.map((term, index) => (
                  <Box
                    key={index}
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                    onClick={() => handleSearch(term)}
                  >
                    <Text>{term}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;