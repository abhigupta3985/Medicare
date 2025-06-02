import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  Select,
  HStack,
  VStack,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Hide,
  Show,
} from '@chakra-ui/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import { RootState } from '../store';
import {
  fetchMedicines,
  setSearchTerm,
  setFilter,
  resetFilters,
} from '../features/medicines/medicinesSlice';
import { toggleFilterDrawer } from '../features/ui/uiSlice';
import MedicineCardList from '../components/medicines/MedicineCardList';

// Mock data
const categories = [
  'Prescription', 'OTC Medicines', 'Vitamins', 'Skincare', 
  'Personal Care', 'COVID Essentials', 'Medical Devices'
];

const brands = [
  'Johnson & Johnson', 'Pfizer', 'Roche', 'Novartis', 
  'Bayer', 'Abbott', 'GSK', 'Merck', 'Sanofi'
];

const SearchPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { items, filteredItems, loading, searchTerm, filters } = useSelector(
    (state: RootState) => state.medicines
  );
  
  const [sortBy, setSortBy] = useState('relevance');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Fetch medicines if not already loaded
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchMedicines());
    }
  }, [dispatch, items.length]);
  
  // Process URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Process category param
    const categoryParam = params.get('category');
    if (categoryParam) {
      dispatch(setFilter({
        filterType: 'categories',
        value: [categoryParam],
      }));
    }
    
    // Process discount param
    const discountParam = params.get('discount');
    if (discountParam === 'true') {
      // In a real app, we would have a specific filter for this
      // For now, we're just setting a search term
      dispatch(setSearchTerm('discount'));
    }
    
    // Process search param
    const searchParam = params.get('q');
    if (searchParam) {
      dispatch(setSearchTerm(searchParam));
      setLocalSearchTerm(searchParam);
    }
  }, [location.search, dispatch]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearchTerm));
  };
  
  const handleReset = () => {
    dispatch(resetFilters());
    setLocalSearchTerm('');
    dispatch(setSearchTerm(''));
    setSortBy('relevance');
  };
  
  // Sort the results
  const sortedResults = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discountPercentage - a.discountPercentage;
      default:
        // Default sort (relevance) - by name
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>
        Search Medicines
      </Heading>
      
      {/* Search and sort bar */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align={{ base: 'stretch', md: 'center' }}
        mb={6}
        gap={4}
      >
        <Box flex="1">
          <form onSubmit={handleSearch}>
            <InputGroup>
              <Input
                placeholder="Search medicines, brands, symptoms..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                bg="white"
                borderRadius="md"
                _focus={{ borderColor: 'brand.500' }}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search"
                  icon={<Search size={18} />}
                  variant="ghost"
                  type="submit"
                  color="gray.500"
                />
              </InputRightElement>
            </InputGroup>
          </form>
        </Box>
        
        <HStack spacing={4}>
          <Show below="md">
            <Button
              leftIcon={<SlidersHorizontal size={16} />}
              onClick={onOpen}
              variant="outline"
            >
              Filters
            </Button>
          </Show>
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            bg="white"
            width={{ base: 'full', md: 'auto' }}
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
          </Select>
        </HStack>
      </Flex>
      
      {/* Active filters */}
      {(searchTerm || 
        filters.categories.length > 0 ||
        filters.brands.length > 0 ||
        filters.availability !== null ||
        filters.requiresPrescription !== null) && (
        <Box mb={6}>
          <Flex align="center" mb={2}>
            <Text fontWeight="medium" mr={2}>Active Filters:</Text>
            <Button 
              size="xs" 
              variant="link" 
              colorScheme="blue"
              onClick={handleReset}
            >
              Reset All
            </Button>
          </Flex>
          
          <Flex flexWrap="wrap" gap={2}>
            {searchTerm && (
              <Button
                size="sm"
                borderRadius="full"
                rightIcon={<X size={12} />}
                onClick={() => {
                  dispatch(setSearchTerm(''));
                  setLocalSearchTerm('');
                }}
              >
                Search: {searchTerm}
              </Button>
            )}
            
            {filters.categories.map((category) => (
              <Button
                key={category}
                size="sm"
                borderRadius="full"
                rightIcon={<X size={12} />}
                onClick={() => {
                  dispatch(setFilter({
                    filterType: 'categories',
                    value: filters.categories.filter(c => c !== category),
                  }));
                }}
              >
                Category: {category}
              </Button>
            ))}
            
            {filters.brands.map((brand) => (
              <Button
                key={brand}
                size="sm"
                borderRadius="full"
                rightIcon={<X size={12} />}
                onClick={() => {
                  dispatch(setFilter({
                    filterType: 'brands',
                    value: filters.brands.filter(b => b !== brand),
                  }));
                }}
              >
                Brand: {brand}
              </Button>
            ))}
            
            {filters.availability !== null && (
              <Button
                size="sm"
                borderRadius="full"
                rightIcon={<X size={12} />}
                onClick={() => {
                  dispatch(setFilter({
                    filterType: 'availability',
                    value: null,
                  }));
                }}
              >
                In Stock Only
              </Button>
            )}
            
            {filters.requiresPrescription !== null && (
              <Button
                size="sm"
                borderRadius="full"
                rightIcon={<X size={12} />}
                onClick={() => {
                  dispatch(setFilter({
                    filterType: 'requiresPrescription',
                    value: null,
                  }));
                }}
              >
                {filters.requiresPrescription ? 'Prescription Required' : 'No Prescription Needed'}
              </Button>
            )}
          </Flex>
        </Box>
      )}
      
      {/* Main content with sidebar */}
      <Grid templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={8}>
        {/* Filters sidebar (desktop) */}
        <Hide below="md">
          <GridItem>
            <VStack align="stretch" spacing={6} position="sticky" top="100px">
              <Box>
                <Heading size="sm" mb={4}>
                  Categories
                </Heading>
                <VStack align="stretch" spacing={2}>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      justifyContent="flex-start"
                      isActive={filters.categories.includes(category)}
                      onClick={() => {
                        const newCategories = filters.categories.includes(category)
                          ? filters.categories.filter(c => c !== category)
                          : [...filters.categories, category];
                        
                        dispatch(setFilter({
                          filterType: 'categories',
                          value: newCategories,
                        }));
                      }}
                      size="sm"
                      py={1}
                    >
                      {category}
                    </Button>
                  ))}
                </VStack>
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={4}>
                  Brands
                </Heading>
                <VStack align="stretch" spacing={2} maxH="200px" overflowY="auto">
                  {brands.map((brand) => (
                    <Button
                      key={brand}
                      variant="ghost"
                      justifyContent="flex-start"
                      isActive={filters.brands.includes(brand)}
                      onClick={() => {
                        const newBrands = filters.brands.includes(brand)
                          ? filters.brands.filter(b => b !== brand)
                          : [...filters.brands, brand];
                        
                        dispatch(setFilter({
                          filterType: 'brands',
                          value: newBrands,
                        }));
                      }}
                      size="sm"
                      py={1}
                    >
                      {brand}
                    </Button>
                  ))}
                </VStack>
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={4}>
                  Availability
                </Heading>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  isActive={filters.availability === true}
                  onClick={() => {
                    dispatch(setFilter({
                      filterType: 'availability',
                      value: filters.availability === true ? null : true,
                    }));
                  }}
                  size="sm"
                  py={1}
                >
                  In Stock Only
                </Button>
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={4}>
                  Prescription
                </Heading>
                <VStack align="stretch" spacing={2}>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    isActive={filters.requiresPrescription === false}
                    onClick={() => {
                      dispatch(setFilter({
                        filterType: 'requiresPrescription',
                        value: filters.requiresPrescription === false ? null : false,
                      }));
                    }}
                    size="sm"
                    py={1}
                  >
                    No Prescription Needed
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    isActive={filters.requiresPrescription === true}
                    onClick={() => {
                      dispatch(setFilter({
                        filterType: 'requiresPrescription',
                        value: filters.requiresPrescription === true ? null : true,
                      }));
                    }}
                    size="sm"
                    py={1}
                  >
                    Prescription Required
                  </Button>
                </VStack>
              </Box>
              
              <Divider />
              
              <Box>
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  width="full"
                  onClick={handleReset}
                >
                  Reset All Filters
                </Button>
              </Box>
            </VStack>
          </GridItem>
        </Hide>
        
        {/* Products grid */}
        <GridItem>
          <Box mb={4}>
            <Text color="gray.600">
              Showing {sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'}
            </Text>
          </Box>
          
          <MedicineCardList
            medicines={sortedResults}
            loading={loading}
            emptyMessage={
              searchTerm
                ? `No results found for "${searchTerm}". Try adjusting your search or filters.`
                : "No medicines found matching your criteria. Try adjusting your filters."
            }
          />
        </GridItem>
      </Grid>
      
      {/* Mobile filters drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>
                  Categories
                </Heading>
                <VStack align="stretch" spacing={2}>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      justifyContent="flex-start"
                      isActive={filters.categories.includes(category)}
                      onClick={() => {
                        const newCategories = filters.categories.includes(category)
                          ? filters.categories.filter(c => c !== category)
                          : [...filters.categories, category];
                        
                        dispatch(setFilter({
                          filterType: 'categories',
                          value: newCategories,
                        }));
                      }}
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </VStack>
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={4}>
                  Brands
                </Heading>
                <VStack align="stretch" spacing={2} maxH="200px" overflowY="auto">
                  {brands.map((brand) => (
                    <Button
                      key={brand}
                      variant="ghost"
                      justifyContent="flex-start"
                      isActive={filters.brands.includes(brand)}
                      onClick={() => {
                        const newBrands = filters.brands.includes(brand)
                          ? filters.brands.filter(b => b !== brand)
                          : [...filters.brands, brand];
                        
                        dispatch(setFilter({
                          filterType: 'brands',
                          value: newBrands,
                        }));
                      }}
                      size="sm"
                    >
                      {brand}
                    </Button>
                  ))}
                </VStack>
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={4}>
                  Availability
                </Heading>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  isActive={filters.availability === true}
                  onClick={() => {
                    dispatch(setFilter({
                      filterType: 'availability',
                      value: filters.availability === true ? null : true,
                    }));
                  }}
                  size="sm"
                >
                  In Stock Only
                </Button>
              </Box>
              
              <Divider />
              
              <Box>
                <Heading size="sm" mb={4}>
                  Prescription
                </Heading>
                <VStack align="stretch" spacing={2}>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    isActive={filters.requiresPrescription === false}
                    onClick={() => {
                      dispatch(setFilter({
                        filterType: 'requiresPrescription',
                        value: filters.requiresPrescription === false ? null : false,
                      }));
                    }}
                    size="sm"
                  >
                    No Prescription Needed
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    isActive={filters.requiresPrescription === true}
                    onClick={() => {
                      dispatch(setFilter({
                        filterType: 'requiresPrescription',
                        value: filters.requiresPrescription === true ? null : true,
                      }));
                    }}
                    size="sm"
                  >
                    Prescription Required
                  </Button>
                </VStack>
              </Box>
              
              <Divider />
              
              <Flex justify="space-between" mt={4}>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset All
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={onClose}
                >
                  Apply Filters
                </Button>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default SearchPage;