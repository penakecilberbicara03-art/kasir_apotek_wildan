export type UserRole = 'kasir' | 'manajer' | 'owner';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  pin: string;
  avatar?: string;
  phone?: string;
}

export type MedicineCategory = 
  | 'Bebas'
  | 'Bebas Terbatas'
  | 'Keras / Resep'
  | 'Generik'
  | 'Suplemen & Vitamin'
  | 'Alat Kesehatan'
  | 'Antibiotik';

export type MedicineUnit = 
  | 'Strip'
  | 'Tablet'
  | 'Botol'
  | 'Box'
  | 'Tube'
  | 'Ampul'
  | 'Sachet'
  | 'Pcs';

export interface Medicine {
  id: string;
  code: string; // Barcode / Kode Obat (e.g. 63634634)
  name: string;
  category: MedicineCategory;
  unit: MedicineUnit;
  shelfLocation: string; // Lokasi Rak (e.g. Rak A-02)
  stock: number;
  minStock: number; // Batas Minimum Reorder
  buyPrice: number; // Harga Beli / Modal (HPP)
  sellPrice: number; // Harga Jual
  expiryDate: string; // YYYY-MM-DD
  supplier: string;
  batchNumber: string;
  description?: string;
  dosage?: string; // Aturan Pakai (e.g. 3x sehari 1 tablet)
  lastUpdated?: string;
}

export interface PriceHistory {
  id: string;
  medicineId: string;
  medicineCode: string;
  medicineName: string;
  oldBuyPrice: number;
  newBuyPrice: number;
  oldSellPrice: number;
  newSellPrice: number;
  changedBy: string;
  changedByRole: UserRole;
  changedAt: string;
  reason: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  customPrice?: number;
  instructions?: string;
}

export interface SaleItem {
  medicineId: string;
  code: string;
  name: string;
  category: MedicineCategory;
  unit: MedicineUnit;
  buyPrice: number; // HPP at time of sale
  sellPrice: number;
  quantity: number;
  subtotal: number;
  profit: number; // (sellPrice - buyPrice) * quantity
  instructions?: string;
}

export type PaymentMethod = 'Tunai' | 'QRIS' | 'Debit' | 'Transfer';

export interface SaleTransaction {
  id: string;
  invoiceNumber: string; // INV-20261029-001
  date: string; // ISO date
  cashierId: string;
  cashierName: string;
  customerName: string;
  customerType: 'Umum' | 'Resep Dokter' | 'Langganan';
  doctorName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  totalCost: number; // Total HPP
  totalProfit: number; // Total Laba Bersih
  paymentMethod: PaymentMethod;
  cashTendered: number;
  change: number;
  notes?: string;
}

export interface PurchaseItem {
  medicineId: string;
  name: string;
  quantity: number;
  buyPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  status: 'Diterima' | 'Diproses' | 'Dibatalkan';
  items: PurchaseItem[];
  totalAmount: number;
  recordedBy: string;
  notes?: string;
}

export interface PharmacyProfile {
  name: string;
  branchName: string;
  sipa: string; // Surat Izin Praktik Apoteker
  sia: string; // Surat Izin Apotek
  pharmacistName: string;
  address: string;
  phone: string;
  receiptFooter: string;
}
