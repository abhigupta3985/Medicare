import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import SearchDrawer from '../search/SearchDrawer';
import FilterDrawer from '../filters/FilterDrawer';
import ToastContainer from '../ui/ToastContainer';
import ScrollToTop from '../ui/ScrollToTop';

const Layout = () => {
  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box as="main" flex="1" py="4">
        <Outlet />
      </Box>
      <Footer />
      <CartDrawer />
      <SearchDrawer />
      <FilterDrawer />
      <ToastContainer />
      <ScrollToTop />
    </Box>
  );
};

export default Layout;