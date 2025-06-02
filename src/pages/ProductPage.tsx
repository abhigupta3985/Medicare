import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Skeleton,
  Alert,
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { RootState } from '../store';
import { fetchMedicines } from '../features/medicines/medicinesSlice';
import ProductDetails from '../components/medicines/ProductDetails';
import RecommendedProducts from '../components/medicines/RecommendedProducts';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.medicines);
  
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchMedicines());
    }
  }, [dispatch, items.length]);
  
  const product = items.find(item => item.id === id);
  
  // Get similar products (same category)
  const similarProducts = items
    .filter(item => item.id !== id && item.category === product?.category)
    .slice(0, 8);
  
  return (
    <Container maxW="container.xl" py={8}>
      {/* Breadcrumbs */}
      <Breadcrumb
        separator={<ChevronRight size={14} />}
        mb={6}
        fontSize="sm"
        color="gray.600"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/search">Medicines</BreadcrumbLink>
        </BreadcrumbItem>
        {product && (
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={`/search?category=${product.category}`}>
              {product.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{product?.name || 'Product Details'}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      {loading && !product ? (
        <Box>
          <Skeleton height="400px" mb={6} />
          <Skeleton height="40px" mb={4} />
          <Skeleton height="20px" mb={2} />
          <Skeleton height="20px" mb={2} />
          <Skeleton height="20px" mb={6} />
          <Skeleton height="60px" mb={6} />
          <Skeleton height="200px" />
        </Box>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          There was an error loading the product: {error}
        </Alert>
      ) : product ? (
        <>
          <ProductDetails product={product} />
          
          <Divider my={10} />
          
          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <RecommendedProducts
              title="Similar Products"
              subtitle="You might also be interested in these products"
              products={similarProducts}
            />
          )}
        </>
      ) : (
        <Alert status="warning">
          <AlertIcon />
          Product not found. The requested product may have been removed or is no longer available.
        </Alert>
      )}
    </Container>
  );
};

export default ProductPage;