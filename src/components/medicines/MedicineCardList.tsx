import { SimpleGrid, Box, Text, Spinner, Center } from '@chakra-ui/react';
import MedicineCard from './MedicineCard';
import { Medicine } from '../../features/medicines/medicinesSlice';

interface MedicineCardListProps {
  medicines: Medicine[];
  loading?: boolean;
  emptyMessage?: string;
}

const MedicineCardList = ({ 
  medicines,
  loading = false,
  emptyMessage = "No medicines found matching your criteria"
}: MedicineCardListProps) => {
  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (medicines.length === 0) {
    return (
      <Center py={10}>
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            {emptyMessage}
          </Text>
          <Text fontSize="md" color="gray.500" mt={2}>
            Try adjusting your search or filter criteria
          </Text>
        </Box>
      </Center>
    );
  }

  return (
    <SimpleGrid 
      columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
      spacing={6}
    >
      {medicines.map((medicine) => (
        <MedicineCard key={medicine.id} medicine={medicine} />
      ))}
    </SimpleGrid>
  );
};

export default MedicineCardList;