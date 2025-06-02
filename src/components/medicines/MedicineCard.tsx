import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Image,
  Text,
  Badge,
  Flex,
  Button,
  IconButton,
  useDisclosure,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { ShoppingCart, Heart, BarChart2, Plus } from 'lucide-react';

import { Medicine } from '../../features/medicines/medicinesSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import { addToast } from '../../features/ui/uiSlice';
import { RootState } from '../../store';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useSelector((state: RootState) => state.auth);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlist.some(item => item.id === medicine.id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      dispatch(
        addToast({
          title: 'Please sign in',
          description: 'You need to be signed in to add items to cart',
          status: 'warning',
        })
      );
      return;
    }
    
    dispatch(
      addToCart({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        image: medicine.image,
        quantity: quantity,
        requiresPrescription: medicine.requiresPrescription,
      })
    );
    
    dispatch(
      addToast({
        title: 'Added to cart',
        description: `${medicine.name} has been added to your cart`,
        status: 'success',
      })
    );
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      dispatch(
        addToast({
          title: 'Please sign in',
          description: 'You need to be signed in to save items',
          status: 'warning',
        })
      );
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(medicine.id));
      dispatch(
        addToast({
          title: 'Removed from wishlist',
          description: `${medicine.name} has been removed from your wishlist`,
          status: 'info',
        })
      );
    } else {
      dispatch(addToWishlist(medicine));
      dispatch(
        addToast({
          title: 'Added to wishlist',
          description: `${medicine.name} has been added to your wishlist`,
          status: 'success',
        })
      );
    }
  };
  
  const navigateToDetail = () => {
    navigate(`/product/${medicine.id}`);
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.3s"
      position="relative"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={navigateToDetail}
      cursor="pointer"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      {medicine.discountPercentage > 0 && (
        <Badge
          colorScheme="red"
          position="absolute"
          top="10px"
          left="10px"
          zIndex="1"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="full"
        >
          {medicine.discountPercentage}% OFF
        </Badge>
      )}
      
      {medicine.requiresPrescription && (
        <Badge
          colorScheme="purple"
          position="absolute"
          top="10px"
          right="10px"
          zIndex="1"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="full"
        >
          Rx
        </Badge>
      )}
      
      <Box position="relative" overflow="hidden" pb="80%" bg="gray.100">
        <Image
          src={medicine.image}
          alt={medicine.name}
          position="absolute"
          top="0"
          width="100%"
          height="100%"
          objectFit="cover"
          opacity={medicine.inStock ? 1 : 0.6}
        />
        
        <Flex
          position="absolute"
          bottom="10px"
          left="0"
          right="0"
          justify="center"
          opacity={isHovered ? 1 : 0}
          transition="opacity 0.3s"
          zIndex="1"
        >
          <Tooltip label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
            <IconButton
              aria-label="Toggle wishlist"
              icon={<Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />}
              size="sm"
              colorScheme={isInWishlist ? "red" : "gray"}
              variant="solid"
              mx={1}
              onClick={handleWishlist}
            />
          </Tooltip>
          
          <Tooltip label="Compare">
            <IconButton
              aria-label="Compare"
              icon={<BarChart2 size={16} />}
              size="sm"
              colorScheme="gray"
              variant="solid"
              mx={1}
              onClick={(e) => {
                e.stopPropagation();
                // Compare logic
              }}
            />
          </Tooltip>
          
          <Tooltip label="Quick view">
            <IconButton
              aria-label="Quick view"
              icon={<Plus size={16} />}
              size="sm"
              colorScheme="blue"
              variant="solid"
              mx={1}
              onClick={(e) => {
                e.stopPropagation();
                // Quick view logic
              }}
            />
          </Tooltip>
        </Flex>
        
        {!medicine.inStock && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.60"
            justify="center"
            align="center"
          >
            <Badge
              colorScheme="red"
              px={3}
              py={1}
              fontSize="md"
              borderRadius="md"
            >
              Out of Stock
            </Badge>
          </Flex>
        )}
      </Box>
      
      <Box p={4} flex="1" display="flex" flexDirection="column">
        <Text
          fontSize="xs"
          color="gray.500"
          textTransform="uppercase"
          mb={1}
        >
          {medicine.brand}
        </Text>
        
        <Text
          fontWeight="semibold"
          fontSize="md"
          lineHeight="tight"
          noOfLines={2}
          mb={2}
        >
          {medicine.name}
        </Text>
        
        <Text fontSize="sm" color="gray.600" noOfLines={2} mb={3} flex="1">
          {medicine.description}
        </Text>
        
        <Flex justify="space-between" align="center" mt="auto">
          <Box>
            {medicine.discountPercentage > 0 ? (
              <Flex align="center">
                <Text
                  fontWeight="bold"
                  color="green.600"
                  fontSize="md"
                  mr={2}
                >
                  ₹{medicine.price.toFixed(2)}
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  textDecoration="line-through"
                >
                  ₹{(medicine.price / (1 - medicine.discountPercentage / 100)).toFixed(2)}
                </Text>
              </Flex>
            ) : (
              <Text fontWeight="bold" color="green.600" fontSize="md">
                ₹{medicine.price.toFixed(2)}
              </Text>
            )}
          </Box>
          
          <Flex align="center" gap={2}>
            <NumberInput
              size="sm"
              maxW={16}
              min={1}
              max={10}
              value={quantity}
              onChange={(_, val) => setQuantity(val)}
              onClick={(e) => e.stopPropagation()}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            
            <Button
              rightIcon={<ShoppingCart size={16} />}
              colorScheme="blue"
              size="sm"
              onClick={handleAddToCart}
              isDisabled={!medicine.inStock}
            >
              Add
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default MedicineCard;