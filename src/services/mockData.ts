import { v4 as uuidv4 } from 'uuid';

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  category: string;
  requiresPrescription: boolean;
  dosage: string;
  sideEffects: string[];
  ingredients: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  discountPercentage: number;
}

// Helper function to generate medicines
const generateMedicines = () => {
  const brands = [
    'Cipla', 'Sun Pharma', 'Dr. Reddy\'s', 'Lupin', 'Zydus Cadila',
    'Torrent Pharma', 'Alkem Labs', 'Mankind Pharma', 'Glenmark',
    'Intas Pharmaceuticals', 'Biocon', 'Ipca Labs', 'Abbott India',
    'GSK India', 'Pfizer India'
  ];

  const categories = [
    'Prescription', 'OTC Medicines', 'Vitamins', 'Skincare',
    'Personal Care', 'COVID Essentials', 'Medical Devices',
    'Pain Relief', 'Antibiotics', 'Diabetes Care', 'Heart Health',
    'Respiratory Care', 'Digestive Health', 'Mental Health'
  ];

  const commonMedicines = [
    // Pain Relief & Fever
    { name: 'Crocin Advance 500mg', brand: 'GSK India', category: 'Pain Relief', requiresPrescription: false },
    { name: 'Dolo 650mg', brand: 'Micro Labs', category: 'Pain Relief', requiresPrescription: false },
    { name: 'Combiflam', brand: 'Sanofi India', category: 'Pain Relief', requiresPrescription: false },
    { name: 'Sumo', brand: 'Sun Pharma', category: 'Pain Relief', requiresPrescription: false },
    { name: 'Meftal Spas', brand: 'Blue Cross', category: 'Pain Relief', requiresPrescription: false },
    
    // Antibiotics
    { name: 'Augmentin 625 Duo', brand: 'GSK India', category: 'Antibiotics', requiresPrescription: true },
    { name: 'Azithral 500', brand: 'Alembic', category: 'Antibiotics', requiresPrescription: true },
    { name: 'Cifran 500', brand: 'Cipla', category: 'Antibiotics', requiresPrescription: true },
    { name: 'Moxikind CV', brand: 'Mankind', category: 'Antibiotics', requiresPrescription: true },
    
    // Diabetes Care
    { name: 'Metformin 500mg', brand: 'USV', category: 'Diabetes Care', requiresPrescription: true },
    { name: 'Glycomet GP', brand: 'USV', category: 'Diabetes Care', requiresPrescription: true },
    { name: 'Janumet', brand: 'MSD', category: 'Diabetes Care', requiresPrescription: true },
    
    // Heart Health
    { name: 'Ecosprin 75', brand: 'USV', category: 'Heart Health', requiresPrescription: true },
    { name: 'Telma 40', brand: 'Glenmark', category: 'Heart Health', requiresPrescription: true },
    { name: 'Stamlo 5', brand: 'Dr. Reddy\'s', category: 'Heart Health', requiresPrescription: true },
    
    // Respiratory Care
    { name: 'Asthalin Inhaler', brand: 'Cipla', category: 'Respiratory Care', requiresPrescription: true },
    { name: 'Montair LC', brand: 'Cipla', category: 'Respiratory Care', requiresPrescription: true },
    { name: 'Allegra 120mg', brand: 'Sanofi', category: 'Respiratory Care', requiresPrescription: false },
    
    // Mental Health
    { name: 'Nexito Plus', brand: 'Sun Pharma', category: 'Mental Health', requiresPrescription: true },
    { name: 'Oleanz 5', brand: 'Sun Pharma', category: 'Mental Health', requiresPrescription: true },
    { name: 'Restyl 0.25', brand: 'Cipla', category: 'Mental Health', requiresPrescription: true },
    
    // Common Combination Medicines
    { name: 'T-Bact Ointment', brand: 'GSK India', category: 'Skincare', requiresPrescription: false },
    { name: 'Betnovate-N', brand: 'GSK India', category: 'Skincare', requiresPrescription: true },
    { name: 'Pantop D', brand: 'Aristo', category: 'Digestive Health', requiresPrescription: true },
    { name: 'Cyclopam', brand: 'Indoco', category: 'Digestive Health', requiresPrescription: false },
    { name: 'Sinarest', brand: 'Centaur', category: 'Respiratory Care', requiresPrescription: false },
    { name: 'Cheston Cold', brand: 'Cipla', category: 'Respiratory Care', requiresPrescription: false },
    { name: 'Calpol Plus', brand: 'GSK India', category: 'Pain Relief', requiresPrescription: false },
    { name: 'Zerodol-SP', brand: 'Ipca', category: 'Pain Relief', requiresPrescription: true },
    { name: 'Taxim-O 200', brand: 'Alkem', category: 'Antibiotics', requiresPrescription: true },
    { name: 'Azee 500', brand: 'Cipla', category: 'Antibiotics', requiresPrescription: true },
    
    // Vitamins & Supplements
    { name: 'Shelcal 500', brand: 'Torrent', category: 'Vitamins', requiresPrescription: false },
    { name: 'Supradyn Daily', brand: 'Abbott', category: 'Vitamins', requiresPrescription: false },
    { name: 'Zincovit', brand: 'Apex', category: 'Vitamins', requiresPrescription: false },
    { name: 'Calcirol D3', brand: 'Cipla', category: 'Vitamins', requiresPrescription: false },
    { name: 'B-Complex Forte', brand: 'USV', category: 'Vitamins', requiresPrescription: false },
  ];

  const images = [
    'https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg',
    'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg',
    'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg',
    'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg',
    'https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg'
  ];

  // Generate medicines
  const medicines: Medicine[] = [];
  
  // First, add all common medicines
  commonMedicines.forEach(med => {
    medicines.push({
      id: uuidv4(),
      name: med.name,
      brand: med.brand,
      description: `${med.name} by ${med.brand} - Quality medication for effective treatment`,
      price: Math.floor(Math.random() * 500) + 50, // Price in INR (₹50 to ₹550)
      image: images[Math.floor(Math.random() * images.length)],
      category: med.category,
      requiresPrescription: med.requiresPrescription,
      dosage: "Please follow prescription or package instructions",
      sideEffects: ["Consult package insert for side effects", "Contact doctor if symptoms persist"],
      ingredients: ["Active ingredient", "Excipients"],
      inStock: Math.random() > 0.1, // 90% chance of being in stock
      rating: (Math.random() * 2) + 3, // Rating between 3 and 5
      reviewCount: Math.floor(Math.random() * 500) + 50,
      discountPercentage: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0 // 30% chance of discount
    });
  });

  // Generate additional random medicines to reach 500
  const remainingCount = 500 - medicines.length;
  for (let i = 0; i < remainingCount; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const requiresPrescription = Math.random() > 0.6; // 40% chance of requiring prescription
    
    medicines.push({
      id: uuidv4(),
      name: `${brand} Medicine ${i + commonMedicines.length + 1}`,
      brand,
      description: `Quality medication by ${brand} for effective treatment`,
      price: Math.floor(Math.random() * 1000) + 100, // Price in INR (₹100 to ₹1100)
      image: images[Math.floor(Math.random() * images.length)],
      category,
      requiresPrescription,
      dosage: "Please follow prescription or package instructions",
      sideEffects: ["Consult package insert for side effects", "Contact doctor if symptoms persist"],
      ingredients: ["Active ingredient", "Excipients"],
      inStock: Math.random() > 0.1,
      rating: (Math.random() * 2) + 3,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      discountPercentage: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0
    });
  }

  return medicines;
};

export const medicines = generateMedicines();

export const mockUploadPrescription = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUrl = `https://firebasestorage.googleapis.com/v0/b/medicare/o/prescriptions%2F${encodeURIComponent(file.name)}?alt=media&token=${uuidv4()}`;
      resolve(mockUrl);
    }, 2000);
  });
};

export const countries = [
  { code: 'IN', name: 'India', postalCodeRegex: '^[1-9][0-9]{5}$', postalCodeLabel: 'PIN Code' },
  { code: 'US', name: 'United States', postalCodeRegex: '^\\d{5}(-\\d{4})?$', postalCodeLabel: 'PIN Code' },
  { code: 'GB', name: 'United Kingdom', postalCodeRegex: '^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$', postalCodeLabel: 'Postal Code' },
  { code: 'CA', name: 'Canada', postalCodeRegex: '^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$', postalCodeLabel: 'Postal Code' },
  { code: 'AU', name: 'Australia', postalCodeRegex: '^[0-9]{4}$', postalCodeLabel: 'Postal Code' },
  { code: 'SG', name: 'Singapore', postalCodeRegex: '^[0-9]{6}$', postalCodeLabel: 'Postal Code' }
];