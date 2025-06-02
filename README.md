# Medicare - Online Pharmacy Platform

## Introduction
Medicare is a modern, intuitive, and fully responsive frontend application for an online pharmacy. It is designed to offer users a seamless experience in searching, purchasing, and managing medications online. With a focus on responsive design, advanced UI components, real-time updates, and secure prescription handling, Medicare ensures convenience, efficiency, and trust in digital healthcare services.


## Project Type
Frontend


## Deplolyed App
Frontend: https://medicare-onlinepharmacy.netlify.app/

## Directory Structure

```
medicare/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── project_structure.txt
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .bolt/
│   ├── config.json
│   └── prompt
├── node_modules/
├── public/
│   └── _redirects
├── dist/  # (generated after build)
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── theme.ts
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   └── ui/
│   │       ├── PrescriptionUpload.tsx
│   │       └── Toast.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts
│   │   │   ├── components/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── hooks/
│   │   │       └── useAuth.ts
│   │   ├── cart/
│   │   │   ├── cartSlice.ts
│   │   │   └── components/
│   │   │       └── CartDrawer.tsx
│   │   ├── medicines/
│   │   │   ├── medicinesSlice.ts
│   │   │   └── components/
│   │   │       ├── MedicineCard.tsx
│   │   │       └── SearchBar.tsx
│   │   ├── orders/
│   │   │   ├── ordersSlice.ts
│   │   │   └── components/
│   │   │       └── OrderStatusBar.tsx
│   │   └── prescriptions/
│   │       └── components/
│   │           └── PrescriptionUploader.tsx
│   ├── pages/
│   │   ├── Checkout.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Product.tsx
│   │   └── Profile.tsx
│   ├── services/
│   │   └── firebase.ts
│   ├── store/
│   │   ├── index.ts
│   │   └── uiSlice.ts
│   └── types/
│       └── index.ts
```


## Video Walkthrough of the project  


## Features
List out the key features of your application.

- 🔍 Real-time Search with filters (category, brand, price)
- 📦 Interactive Cart & Multi-Step Checkout
- 📱 Responsive UI optimized for mobile, tablet, and desktop
- 🛒 Dynamic Product Cards with quick actions

## design decisions or assumptions
- Frontend-only implementation; backend assumed to be abstracted or mocked.
- Used Redux for scalable state management.
- Firebase used for auth and storage.

## Installation & Getting started

git clone https://github.com/your-username/medicare.git

cd medicare
npm install
npm run dev


## Usage

//Start the local dev server
npm run dev

- Visit http://localhost:5173
- Browse medicine catalog, apply filters, add to cart
- Upload prescriptions with drag-and-drop interface
- Simulate a multi-step checkout flow
- View your profile

## Screenshots
![Screenshot 2025-06-02 235908](https://github.com/user-attachments/assets/7a4054d2-9fa8-483f-b203-ef5c7003f730)  
![Screenshot 2025-06-03 000016](https://github.com/user-attachments/assets/0400b787-c452-42f3-8aed-7d8571867a32)  
![Screenshot 2025-06-03 000101](https://github.com/user-attachments/assets/7a8b30d8-e407-4038-ba42-87d8723bfa57)  
![Screenshot 2025-06-03 000254](https://github.com/user-attachments/assets/5cefe834-dca4-4f65-8516-cf2542af5529)  
![Screenshot 2025-06-03 001018](https://github.com/user-attachments/assets/f29ba658-f2ee-4a78-a3bb-ad297ce24c1b)  
![Screenshot 2025-06-03 001140](https://github.com/user-attachments/assets/ca23d2e3-b9ab-44c0-9545-0c70b8bf15dd)  



## Credentials
Email: demo@example.com  
Password: password123



## APIs Used
🔐 Firebase Auth & Storage – https://firebase.google.com


## Technology Stack

- ⚛️ React – UI library
- ⚡ Vite – Build tool
- 🌬️ Tailwind CSS – Utility-first styling
- 🧠 Redux Toolkit – State management
- 🔐 Firebase – Authentication and file storage
- 🛒 TypeScript – Static type checking

