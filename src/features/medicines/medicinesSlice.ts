import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { medicines as mockMedicines, Medicine } from '../../services/mockData';

interface MedicinesState {
  items: Medicine[];
  filteredItems: Medicine[];
  recommendedItems: Medicine[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
    availability: boolean | null;
    requiresPrescription: boolean | null;
  };
}

const initialState: MedicinesState = {
  items: [],
  filteredItems: [],
  recommendedItems: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 1000 },
    availability: null,
    requiresPrescription: null,
  },
};

export const fetchMedicines = createAsyncThunk(
  'medicines/fetchMedicines',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockMedicines;
  }
);

export const fetchRecommendedMedicines = createAsyncThunk(
  'medicines/fetchRecommendedMedicines',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockMedicines.slice(0, 3);
  }
);

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredItems = applyFilters(state.items, state.searchTerm, state.filters);
    },
    setFilter: (
      state,
      action: PayloadAction<{
        filterType: keyof MedicinesState['filters'];
        value: any;
      }>
    ) => {
      const { filterType, value } = action.payload;
      // @ts-ignore - Dynamic access
      state.filters[filterType] = value;
      state.filteredItems = applyFilters(state.items, state.searchTerm, state.filters);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredItems = applyFilters(state.items, state.searchTerm, state.filters);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = applyFilters(action.payload, state.searchTerm, state.filters);
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRecommendedMedicines.fulfilled, (state, action) => {
        state.recommendedItems = action.payload;
      });
  },
});

// Helper function to apply filters
const applyFilters = (
  medicines: Medicine[],
  searchTerm: string,
  filters: MedicinesState['filters']
) => {
  return medicines.filter((medicine) => {
    // Search term filter
    if (
      searchTerm &&
      !medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(medicine.category)
    ) {
      return false;
    }

    // Brand filter
    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(medicine.brand)
    ) {
      return false;
    }

    // Price range filter
    if (
      medicine.price < filters.priceRange.min ||
      medicine.price > filters.priceRange.max
    ) {
      return false;
    }

    // Availability filter
    if (
      filters.availability !== null &&
      medicine.inStock !== filters.availability
    ) {
      return false;
    }

    // Prescription filter
    if (
      filters.requiresPrescription !== null &&
      medicine.requiresPrescription !== filters.requiresPrescription
    ) {
      return false;
    }

    return true;
  });
};

export const { setSearchTerm, setFilter, resetFilters } = medicinesSlice.actions;

export default medicinesSlice.reducer;