import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  VStack,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Flex,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
  Box,
} from '@chakra-ui/react';
import { RootState } from '../../store';
import { toggleFilterDrawer } from '../../features/ui/uiSlice';
import { setFilter, resetFilters } from '../../features/medicines/medicinesSlice';

// Mock data - in a real app this would come from the database
const categories = [
  'Prescription', 'OTC Medicines', 'Vitamins', 'Skincare', 
  'Personal Care', 'COVID Essentials', 'Medical Devices'
];

const brands = [
  'Johnson & Johnson', 'Pfizer', 'Roche', 'Novartis', 
  'Bayer', 'Abbott', 'GSK', 'Merck', 'Sanofi'
];

const FilterDrawer = () => {
  const dispatch = useDispatch();
  const { isFilterDrawerOpen } = useSelector((state: RootState) => state.ui);
  const { filters } = useSelector((state: RootState) => state.medicines);

  const handlePriceChange = (values: number[]) => {
    dispatch(
      setFilter({
        filterType: 'priceRange',
        value: { min: values[0], max: values[1] },
      })
    );
  };

  const handleCategoryChange = (values: string[]) => {
    dispatch(
      setFilter({
        filterType: 'categories',
        value: values,
      })
    );
  };

  const handleBrandChange = (values: string[]) => {
    dispatch(
      setFilter({
        filterType: 'brands',
        value: values,
      })
    );
  };

  const handleAvailabilityChange = (value: boolean | null) => {
    dispatch(
      setFilter({
        filterType: 'availability',
        value,
      })
    );
  };

  const handlePrescriptionChange = (value: boolean | null) => {
    dispatch(
      setFilter({
        filterType: 'requiresPrescription',
        value,
      })
    );
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const handleClose = () => {
    dispatch(toggleFilterDrawer());
  };

  return (
    <Drawer isOpen={isFilterDrawerOpen} placement="left" onClose={handleClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Filter Medicines</DrawerHeader>

        <DrawerBody>
          <Flex justifyContent="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="medium">Filters</Text>
            <Button variant="link" colorScheme="blue" onClick={handleReset}>
              Reset All
            </Button>
          </Flex>

          <VStack spacing={6} align="stretch" divider={<Divider />}>
            {/* Price Range */}
            <Box>
              <Text fontWeight="medium" mb={4}>Price Range</Text>
              <Flex justify="space-between" mb={2}>
                <Text>${filters.priceRange.min}</Text>
                <Text>${filters.priceRange.max}</Text>
              </Flex>
              <RangeSlider
                defaultValue={[filters.priceRange.min, filters.priceRange.max]}
                min={0}
                max={1000}
                step={10}
                onChange={handlePriceChange}
                colorScheme="blue"
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Box>

            {/* Categories */}
            <Box>
              <Text fontWeight="medium" mb={4}>Categories</Text>
              <CheckboxGroup
                colorScheme="blue"
                value={filters.categories}
                onChange={handleCategoryChange}
              >
                <Stack spacing={2}>
                  {categories.map((category) => (
                    <Checkbox key={category} value={category}>
                      {category}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>

            {/* Brands */}
            <Box>
              <Text fontWeight="medium" mb={4}>Brands</Text>
              <CheckboxGroup
                colorScheme="blue"
                value={filters.brands}
                onChange={handleBrandChange}
              >
                <Stack spacing={2}>
                  {brands.map((brand) => (
                    <Checkbox key={brand} value={brand}>
                      {brand}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>

            {/* Availability */}
            <Box>
              <Text fontWeight="medium" mb={4}>Availability</Text>
              <Stack spacing={2}>
                <Checkbox
                  isChecked={filters.availability === true}
                  onChange={() => handleAvailabilityChange(filters.availability === true ? null : true)}
                  colorScheme="blue"
                >
                  In Stock
                </Checkbox>
              </Stack>
            </Box>

            {/* Prescription Requirement */}
            <Box>
              <Text fontWeight="medium" mb={4}>Prescription</Text>
              <Stack spacing={2}>
                <Checkbox
                  isChecked={filters.requiresPrescription === false}
                  onChange={() => handlePrescriptionChange(filters.requiresPrescription === false ? null : false)}
                  colorScheme="blue"
                >
                  No Prescription Needed
                </Checkbox>
                <Checkbox
                  isChecked={filters.requiresPrescription === true}
                  onChange={() => handlePrescriptionChange(filters.requiresPrescription === true ? null : true)}
                  colorScheme="blue"
                >
                  Prescription Required
                </Checkbox>
              </Stack>
            </Box>
          </VStack>

          <Button
            mt={6}
            colorScheme="blue"
            w="full"
            onClick={handleClose}
          >
            Apply Filters
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;