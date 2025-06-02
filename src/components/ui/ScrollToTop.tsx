import { useState, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <IconButton
      aria-label="Scroll to top"
      icon={<ArrowUp size={16} />}
      size="md"
      colorScheme="brand"
      position="fixed"
      bottom="4"
      right="4"
      borderRadius="full"
      onClick={scrollToTop}
      opacity={0.8}
      _hover={{ opacity: 1 }}
      zIndex={3}
    />
  );
};

export default ScrollToTop;