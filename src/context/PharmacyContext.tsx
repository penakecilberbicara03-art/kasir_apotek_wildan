import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Medicine,
  UserAccount,
  SaleTransaction,
  PriceHistory,
  PurchaseOrder,
  PharmacyProfile,
  UserRole,
  CartItem,
  PaymentMethod,
  SaleItem
} from '../types/pharmacy';
import {
  INITIAL_USERS,
  INITIAL_MEDICINES,
  INITIAL_SALES,
  INITIAL_PRICE_HISTORIES,
  INITIAL_PURCHASES,
  INITIAL_PHARMACY_PROFILE
} from '../data/initialData';

interface PharmacyContextType {
  currentUser: UserAccount;
  users: UserAccount[];
  medicines: Medicine[];
  sales: SaleTransaction[];
  priceHistories: PriceHistory[];
  purchases: PurchaseOrder[];
  profile: PharmacyProfile;
  cart: CartItem[];
  lowStockMedicines: Medicine[];
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  // Auth
  login: (username: string, pin: string) => boolean;
  switchUserRole: (role: UserRole) => void;
  logout: () => void;
  addUser: (user: Omit<UserAccount, 'id'>) => void;
  updateUser: (id: string, user: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;
  // Medicine CRUD
  addMedicine: (medicine: Omit<Medicine, 'id' | 'lastUpdated'>) => Medicine;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => boolean;
  updateMedicinePrice: (
    id: string,
    newBuyPrice: number,
    newSellPrice: number,
    reason: string
  ) => void;
  restockMedicine: (id: string, quantity: number, buyPrice?: number) => void;
  // Cart & POS Cashier
  addToCart: (medicine: Medicine, qty?: number) => boolean;
  updateCartQty: (medicineId: string, qty: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
  processSale: (saleData: {
    customerName: string;
    customerType: 'Umum' | 'Resep Dokter' | 'Langganan';
    doctorName?: string;
    discount: number;
    tax: number;
    paymentMethod: PaymentMethod;
    cashTendered: number;
    notes?: string;
  }) => { success: boolean; transaction?: SaleTransaction; error?: string };
  // Purchases / Restock
  createPurchaseOrder: (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'date'>) => PurchaseOrder;
  // Settings & Profile
  updateProfile: (profile: Partial<PharmacyProfile>) => void;
  // Reset & Backup
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetToDemo: () => void;
  // Helper
  formatRupiah: (amount: number) => string;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'pos_apotek_users_v2',
  MEDICINES: 'pos_apotek_medicines_v2',
  SALES: 'pos_apotek_sales_v2',
  PRICES: 'pos_apotek_price_history_v2',
  PURCHASES: 'pos_apotek_purchases_v2',
  PROFILE: 'pos_apotek_profile_v2',
  CURRENT_USER_ID: 'pos_apotek_current_user_v2'
};

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = users.find(u => u.id === storedId);
      // Default to owner/seniman koding for full feature discovery
      return found || users.find(u => u.role === 'owner') || users[0];
    } catch {
      return users[0];
    }
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      return stored ? JSON.parse(stored) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  const [sales, setSales] = useState<SaleTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SALES);
      return stored ? JSON.parse(stored) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [priceHistories, setPriceHistories] = useState<PriceHistory[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRICES);
      return stored ? JSON.parse(stored) : INITIAL_PRICE_HISTORIES;
    } catch {
      return INITIAL_PRICE_HISTORIES;
    }
  });

  const [purchases, setPurchases] = useState<PurchaseOrder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return stored ? JSON.parse(stored) : INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  const [profile, setProfile] = useState<PharmacyProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : INITIAL_PHARMACY_PROFILE;
    } catch {
      return INITIAL_PHARMACY_PROFILE;
    }
  });

  const [selectedBranch, setSelectedBranch] = useState<string>('Pusat Surabaya Jawa Timur');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(priceHistories));
  }, [priceHistories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  // Derived: Medicines that reached or are below minimum stock
  const lowStockMedicines = useMemo(() => {
    return medicines.filter(m => m.stock <= m.minStock);
  }, [medicines]);

  // Currency Formatter (Indonesian Rupiah)
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
  };

  // Auth Operations
  const login = (username: string, pin: string): boolean => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.pin === pin);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const switchUserRole = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    // Fallback to Kasir or keep current logged out state
    const kasirUser = users.find(u => u.role === 'kasir') || users[0];
    setCurrentUser(kasirUser);
  };

  const addUser = (userData: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updated: Partial<UserAccount>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updated }));
    }
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser.id === id) {
      const remaining = users.filter(u => u.id !== id);
      setCurrentUser(remaining[0]);
    }
  };

  // Medicine CRUD Operations
  const addMedicine = (data: Omit<Medicine, 'id' | 'lastUpdated'>): Medicine => {
    const newMedicine: Medicine = {
      ...data,
      id: `med-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    setMedicines(prev => [newMedicine, ...prev]);
    return newMedicine;
  };

  const updateMedicine = (id: string, data: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          ...data,
          lastUpdated: new Date().toISOString()
        };
      }
      return m;
    }));
  };

  const deleteMedicine = (id: string): boolean => {
    // Check if medicine has been sold
    const isSold = sales.some(s => s.items.some(item => item.medicineId === id));
    setMedicines(prev => prev.filter(m => m.id !== id));
    // Also remove from cart if present
    setCart(prev => prev.filter(item => item.medicine.id !== id));
    return !isSold;
  };

  // Price adjustment with automatic log to PriceHistory
  const updateMedicinePrice = (
    id: string,
    newBuyPrice: number,
    newSellPrice: number,
    reason: string
  ) => {
    const target = medicines.find(m => m.id === id);
    if (!target) return;

    const oldBuy = target.buyPrice;
    const oldSell = target.sellPrice;

    // Update medicine
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          buyPrice: newBuyPrice,
          sellPrice: newSellPrice,
          lastUpdated: new Date().toISOString()
        };
      }
      return m;
    }));

    // Record price history
    const historyEntry: PriceHistory = {
      id: `ph-${Date.now()}`,
      medicineId: target.id,
      medicineCode: target.code,
      medicineName: target.name,
      oldBuyPrice: oldBuy,
      newBuyPrice: newBuyPrice,
      oldSellPrice: oldSell,
      newSellPrice: newSellPrice,
      changedBy: currentUser.fullName,
      changedByRole: currentUser.role,
      changedAt: new Date().toISOString(),
      reason: reason || 'Penyesuaian berkala harga obat'
    };

    setPriceHistories(prev => [historyEntry, ...prev]);
  };

  const restockMedicine = (id: string, quantity: number, buyPrice?: number) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          stock: m.stock + quantity,
          buyPrice: buyPrice !== undefined && buyPrice > 0 ? buyPrice : m.buyPrice,
          lastUpdated: new Date().toISOString()
        };
      }
      return m;
    }));
  };

  // Cart & POS Cashier Operations
  const addToCart = (medicine: Medicine, qty: number = 1): boolean => {
    // Check available stock
    const existing = cart.find(c => c.medicine.id === medicine.id);
    const currentQtyInCart = existing ? existing.quantity : 0;
    const totalDesired = currentQtyInCart + qty;

    if (totalDesired > medicine.stock) {
      return false; // Not enough stock
    }

    setCart(prev => {
      const idx = prev.findIndex(item => item.medicine.id === medicine.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: totalDesired
        };
        return next;
      }
      return [...prev, { medicine, quantity: qty, instructions: medicine.dosage }];
    });
    return true;
  };

  const updateCartQty = (medicineId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(medicineId);
      return;
    }
    const targetMed = medicines.find(m => m.id === medicineId);
    if (!targetMed) return;

    if (qty > targetMed.stock) {
      qty = targetMed.stock;
    }

    setCart(prev => prev.map(item => {
      if (item.medicine.id === medicineId) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const removeFromCart = (medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Process Sale (Deducts stock automatically!)
  const processSale = (saleData: {
    customerName: string;
    customerType: 'Umum' | 'Resep Dokter' | 'Langganan';
    doctorName?: string;
    discount: number;
    tax: number;
    paymentMethod: PaymentMethod;
    cashTendered: number;
    notes?: string;
  }): { success: boolean; transaction?: SaleTransaction; error?: string } => {
    if (cart.length === 0) {
      return { success: false, error: 'Keranjang belanja masih kosong.' };
    }

    // Verify stock availability for all items before committing
    for (const item of cart) {
      const currentMed = medicines.find(m => m.id === item.medicine.id);
      if (!currentMed || currentMed.stock < item.quantity) {
        return {
          success: false,
          error: `Stok obat ${item.medicine.name} tidak mencukupi (sisa: ${currentMed ? currentMed.stock : 0}).`
        };
      }
    }

    // Calculate totals
    const saleItems: SaleItem[] = cart.map(item => {
      const sellPrice = item.customPrice || item.medicine.sellPrice;
      const buyPrice = item.medicine.buyPrice;
      const subtotal = sellPrice * item.quantity;
      const profit = (sellPrice - buyPrice) * item.quantity;
      return {
        medicineId: item.medicine.id,
        code: item.medicine.code,
        name: item.medicine.name,
        category: item.medicine.category,
        unit: item.medicine.unit,
        buyPrice,
        sellPrice,
        quantity: item.quantity,
        subtotal,
        profit,
        instructions: item.instructions || item.medicine.dosage
      };
    });

    const subtotal = saleItems.reduce((acc, it) => acc + it.subtotal, 0);
    const totalAmount = Math.max(0, subtotal - (saleData.discount || 0) + (saleData.tax || 0));
    const totalCost = saleItems.reduce((acc, it) => acc + (it.buyPrice * it.quantity), 0);
    const totalProfit = totalAmount - totalCost;

    if (saleData.paymentMethod === 'Tunai' && saleData.cashTendered < totalAmount) {
      return {
        success: false,
        error: `Uang tunai yang diterima (${formatRupiah(saleData.cashTendered)}) kurang dari total (${formatRupiah(totalAmount)}).`
      };
    }

    const change = saleData.paymentMethod === 'Tunai' ? Math.max(0, saleData.cashTendered - totalAmount) : 0;

    const todayDateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const invoiceNumber = `INV-${todayDateStr}-${String(sales.length + 1).padStart(3, '0')}`;

    const newTransaction: SaleTransaction = {
      id: `trx-${Date.now()}`,
      invoiceNumber,
      date: new Date().toISOString(),
      cashierId: currentUser.id,
      cashierName: currentUser.fullName,
      customerName: saleData.customerName || 'Pelanggan Umum',
      customerType: saleData.customerType,
      doctorName: saleData.doctorName,
      items: saleItems,
      subtotal,
      discount: saleData.discount || 0,
      tax: saleData.tax || 0,
      totalAmount,
      totalCost,
      totalProfit,
      paymentMethod: saleData.paymentMethod,
      cashTendered: saleData.paymentMethod === 'Tunai' ? saleData.cashTendered : totalAmount,
      change,
      notes: saleData.notes
    };

    // 1. Deduct Stock Atomically
    setMedicines(prev => prev.map(m => {
      const cartItem = cart.find(ci => ci.medicine.id === m.id);
      if (cartItem) {
        return {
          ...m,
          stock: Math.max(0, m.stock - cartItem.quantity),
          lastUpdated: new Date().toISOString()
        };
      }
      return m;
    }));

    // 2. Append Transaction
    setSales(prev => [newTransaction, ...prev]);

    // 3. Clear Cart
    clearCart();

    return { success: true, transaction: newTransaction };
  };

  // Purchase Order / Kulakan from PBF
  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'date'>): PurchaseOrder => {
    const todayDateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const poNumber = `PO-${todayDateStr}-${String(purchases.length + 1).padStart(2, '0')}`;

    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`,
      poNumber,
      date: new Date().toISOString()
    };

    // If status is 'Diterima', automatically increment stock!
    if (newPO.status === 'Diterima') {
      setMedicines(prev => prev.map(m => {
        const itemInPO = newPO.items.find(pi => pi.medicineId === m.id);
        if (itemInPO) {
          return {
            ...m,
            stock: m.stock + itemInPO.quantity,
            buyPrice: itemInPO.buyPrice > 0 ? itemInPO.buyPrice : m.buyPrice,
            lastUpdated: new Date().toISOString()
          };
        }
        return m;
      }));
    }

    setPurchases(prev => [newPO, ...prev]);
    return newPO;
  };

  const updateProfile = (updated: Partial<PharmacyProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  // Backup & Restore
  const exportData = (): string => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      users,
      medicines,
      sales,
      priceHistories,
      purchases
    };
    return JSON.stringify(backup, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.medicines && Array.isArray(data.medicines)) {
        setMedicines(data.medicines);
      }
      if (data.sales && Array.isArray(data.sales)) {
        setSales(data.sales);
      }
      if (data.priceHistories && Array.isArray(data.priceHistories)) {
        setPriceHistories(data.priceHistories);
      }
      if (data.purchases && Array.isArray(data.purchases)) {
        setPurchases(data.purchases);
      }
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      }
      if (data.profile) {
        setProfile(data.profile);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToDemo = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[2]); // Owner
    setMedicines(INITIAL_MEDICINES);
    setSales(INITIAL_SALES);
    setPriceHistories(INITIAL_PRICE_HISTORIES);
    setPurchases(INITIAL_PURCHASES);
    setProfile(INITIAL_PHARMACY_PROFILE);
    setCart([]);
    localStorage.clear();
  };

  return (
    <PharmacyContext.Provider
      value={{
        currentUser,
        users,
        medicines,
        sales,
        priceHistories,
        purchases,
        profile,
        cart,
        lowStockMedicines,
        selectedBranch,
        setSelectedBranch,
        login,
        switchUserRole,
        logout,
        addUser,
        updateUser,
        deleteUser,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        updateMedicinePrice,
        restockMedicine,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        processSale,
        createPurchaseOrder,
        updateProfile,
        exportData,
        importData,
        resetToDemo,
        formatRupiah
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
