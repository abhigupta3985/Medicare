import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  VStack,
  Box,
  Text,
  Flex,
  Divider,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { ShoppingBag } from 'lucide-react';
import { RootState } from '../../store';
import { toggleCartDrawer } from '../../features/ui/uiSlice';
import CartItem from './CartItem';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartDrawerOpen } = useSelector((state: RootState) => state.ui);
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const firstField = useRef<HTMLDivElement>(null);

  const handleCheckout = () => {
    dispatch(toggleCartDrawer());
    navigate('/checkout');
  };

  const onClose = () => {
    dispatch(toggleCartDrawer());
  };

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={firstField}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </DrawerHeader>

        <DrawerBody>
          {items.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="full"
              py={10}
            >
              <ShoppingBag size={60} strokeWidth={1} color="#CBD5E0" />
              <Text mt={4} fontSize="lg" fontWeight="medium">
                Your cart is empty
              </Text>
              <Text mt={1} fontSize="md" color="gray.500" textAlign="center">
                Looks like you haven't added any medicines to your cart yet.
              </Text>
              <Button
                mt={6}
                colorScheme="blue"
                onClick={() => {
                  onClose();
                  navigate('/search');
                }}
              >
                Browse Medicines
              </Button>
            </Flex>
          ) : (
            <VStack spacing={4} align="stretch" divider={<Divider />}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </VStack>
          )}
        </DrawerBody>

        {items.length > 0 && (
          <DrawerFooter borderTopWidth="1px" flexDirection="column">
            <Flex
              w="full"
              justify="space-between"
              align="center"
              mb={4}
              fontSize="lg"
            >
              <Text fontWeight="semibold">Total:</Text>
              <Text fontWeight="bold" color="brand.500">
                ${totalAmount.toFixed(2)}
              </Text>
            </Flex>
            <Button
              colorScheme="blue"
              size="lg"
              w="full"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;