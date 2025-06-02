import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  title: string;
  description?: string;
  status: 'info' | 'warning' | 'success' | 'error';
  duration?: number;
  isClosable?: boolean;
}

interface UiState {
  toasts: Toast[];
  isSearchOpen: boolean;
  isCartDrawerOpen: boolean;
  isFilterDrawerOpen: boolean;
  isLoading: boolean;
}

const initialState: UiState = {
  toasts: [],
  isSearchOpen: false,
  isCartDrawerOpen: false,
  isFilterDrawerOpen: false,
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Math.random().toString(36).substring(2, 9);
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    toggleFilterDrawer: (state) => {
      state.isFilterDrawerOpen = !state.isFilterDrawerOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  toggleSearch,
  toggleCartDrawer,
  toggleFilterDrawer,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;