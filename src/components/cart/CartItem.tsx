import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Flex,
  Box,
  Image,
  Text,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tooltip,
} from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType, removeFromCart, updateQuantity } from '../../features/cart/cartSlice';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (valueAsString: string, valueAsNumber: number) => {
    setQuantity(valueAsNumber);
    dispatch(updateQuantity({ id: item.id, quantity: valueAsNumber }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <Flex py={2} align="center" justify="space-between">
      <Flex flex="1">
        <Image
          boxSize="60px"
          objectFit="cover"
          src={item.image}
          alt={item.name}
          borderRadius="md"
          mr={3}
          bg="gray.100"
        />
        <Box>
          <Text fontWeight="medium" noOfLines={1}>
            {item.name}
          </Text>
          <Text color="green.600" fontWeight="bold" fontSize="sm">
            ${item.price.toFixed(2)}
          </Text>
          {item.requiresPrescription && (
            <Text fontSize="xs" color={item.prescriptionUploaded ? "green.500" : "orange.500"}>
              {item.prescriptionUploaded ? "Prescription Uploaded" : "Requires Prescription"}
            </Text>
          )}
        </Box>
      </Flex>

      <Flex align="center" ml={4}>
        <NumberInput
          size="sm"
          maxW={20}
          min={1}
          max={10}
          value={quantity}
          onChange={handleQuantityChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Tooltip label="Remove item" placement="top">
          <IconButton
            aria-label="Remove from cart"
            icon={<Trash2 size={16} />}
            variant="ghost"
            colorScheme="red"
            size="sm"
            ml={2}
            onClick={handleRemove}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default CartItem;