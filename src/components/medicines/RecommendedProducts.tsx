import { useRef } from 'react';
import {
  Box,
  Heading,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Medicine } from '../../features/medicines/medicinesSlice';
import MedicineCard from './MedicineCard';

interface RecommendedProductsProps {
  title: string;
  subtitle?: string;
  products: Medicine[];
}

const RecommendedProducts = ({ title, subtitle, products }: RecommendedProductsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAmount = useBreakpointValue({ base: 270, md: 300 });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount || 300;
      } else {
        current.scrollLeft += scrollAmount || 300;
      }
    }
  };

  if (!products.length) return null;

  return (
    <Box mb={10}>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
      >
        <Box>
          <Heading size="lg">{title}</Heading>
          {subtitle && (
            <Text color="gray.600" mt={1}>
              {subtitle}
            </Text>
          )}
        </Box>
        <Flex>
          <IconButton
            aria-label="Scroll left"
            icon={<ChevronLeft size={20} />}
            onClick={() => scroll('left')}
            mr={2}
            variant="outline"
          />
          <IconButton
            aria-label="Scroll right"
            icon={<ChevronRight size={20} />}
            onClick={() => scroll('right')}
            variant="outline"
          />
        </Flex>
      </Flex>

      <Box
        ref={scrollRef}
        display="flex"
        overflowX="auto"
        css={{
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
        py={2}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            minW={{ base: '250px', md: '280px' }}
            maxW={{ base: '250px', md: '280px' }}
            mr={4}
            flex="0 0 auto"
          >
            <MedicineCard medicine={product} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecommendedProducts;