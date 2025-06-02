import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { RootState } from '../../store';
import { removeToast } from '../../features/ui/uiSlice';

const ToastContainer = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state: RootState) => state.ui);
  const toast = useToast();

  useEffect(() => {
    // Show new toasts
    toasts.forEach((t) => {
      if (!toast.isActive(t.id)) {
        toast({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          duration: t.duration || 5000,
          isClosable: t.isClosable ?? true,
          position: 'top-right',
          onCloseComplete: () => {
            dispatch(removeToast(t.id));
          },
        });
      }
    });
  }, [toasts, toast, dispatch]);

  return null;
};

export default ToastContainer;