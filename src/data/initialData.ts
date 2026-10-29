import { Medicine, UserAccount, SaleTransaction, PriceHistory, PurchaseOrder, PharmacyProfile } from '../types/pharmacy';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    username: 'kasir1',
    fullName: 'Kasir Budi Prasetyo',
    role: 'kasir',
    pin: '1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    phone: '0812-3456-7890'
  },
  {
    id: 'usr-2',
    username: 'manajer',
    fullName: 'Manajer Siti Nurhaliza, S.Farm',
    role: 'manajer',
    pin: '2345',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    phone: '0813-9876-5432'
  },
  {
    id: 'usr-3',
    username: 'owner',
    fullName: 'Seniman Koding (Owner / Apt. Hendra, S.Farm)',
    role: 'owner',
    pin: '3456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    phone: '0811-2233-4455'
  }
];

export const INITIAL_PHARMACY_PROFILE: PharmacyProfile = {
  name: 'APOTEK SEHAT SURABAYA',
  branchName: 'Pusat Surabaya Jawa Timur',
  sipa: 'SIPA: 19880521/SIPA_35.78/2022/2045',
  sia: 'SIA: 503/442-A/SIA/436.7.2/2021',
  pharmacistName: 'apt. Hendra Kusuma, S.Farm., M.Clin.Pharm',
  address: 'Jl. Raya Darmo No. 48, Tegalsari, Surabaya, Jawa Timur 60265',
  phone: '(031) 5678901 / 0811-2233-4455',
  receiptFooter: 'Terima kasih atas kunjungan Anda. Semoga lekas sembuh! Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.'
};

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    code: '63634634',
    name: 'Paramex',
    category: 'Bebas',
    unit: 'Strip',
    shelfLocation: 'Rak A-01',
    stock: 6, // Low stock! Min is 10
    minStock: 10,
    buyPrice: 2800,
    sellPrice: 4000,
    expiryDate: '2027-08-15',
    supplier: 'PT Konimex Pharmaceutical',
    batchNumber: 'KX-89211',
    dosage: 'Dewasa: 2-3 kali sehari 1 tablet sesudah makan',
    description: 'Meredakan sakit kepala, sakit gigi dan nyeri ringan'
  },
  {
    id: 'med-2',
    code: '754875856',
    name: 'Lameson - 16',
    category: 'Keras / Resep',
    unit: 'Strip',
    shelfLocation: 'Lemari Khusus G-02',
    stock: 3, // Very low stock! Min is 8
    minStock: 8,
    buyPrice: 28000,
    sellPrice: 38000,
    expiryDate: '2027-12-01',
    supplier: 'PT Lapi Laboratories',
    batchNumber: 'LP-7762',
    dosage: 'Sesuai petunjuk dokter (Methylprednisolone 16mg)',
    description: 'Kortikosteroid antiinflamasi dan imunosupresif'
  },
  {
    id: 'med-3',
    code: '89999081234',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotik',
    unit: 'Strip',
    shelfLocation: 'Rak B-03',
    stock: 24,
    minStock: 15,
    buyPrice: 6500,
    sellPrice: 10000,
    expiryDate: '2028-02-20',
    supplier: 'PT Kimia Farma Trading',
    batchNumber: 'KF-2024-09',
    dosage: '3 kali sehari 1 kaplet harus dihabiskan (Resep Dokter)',
    description: 'Antibiotik spektrum luas untuk infeksi bakteri'
  },
  {
    id: 'med-4',
    code: '89927531122',
    name: 'Panadol Extra Merah',
    category: 'Bebas',
    unit: 'Strip',
    shelfLocation: 'Rak A-02',
    stock: 4, // Critical stock! Min is 12
    minStock: 12,
    buyPrice: 10500,
    sellPrice: 14500,
    expiryDate: '2027-10-10',
    supplier: 'PT Glaxo Wellcome Indonesia',
    batchNumber: 'GSK-4011',
    dosage: '1 kaplet 3-4 kali sehari jika demam/nyeri',
    description: 'Paracetamol 500mg + Caffeine 65mg pereda nyeri ampuh'
  },
  {
    id: 'med-5',
    code: '89930051010',
    name: 'Sanmol Syrup 60ml',
    category: 'Bebas',
    unit: 'Botol',
    shelfLocation: 'Rak C-01 (Sirup Anak)',
    stock: 18,
    minStock: 10,
    buyPrice: 18500,
    sellPrice: 24000,
    expiryDate: '2027-06-18',
    supplier: 'PT Sanbe Farma',
    batchNumber: 'SB-8820',
    dosage: 'Anak 2-5 tahun: 1 sendok takar (5ml) 3-4 kali sehari',
    description: 'Sirup penurun panas dan pereda sakit rasa jeruk'
  },
  {
    id: 'med-6',
    code: '89927700201',
    name: 'Betadine Antiseptic Solution 30ml',
    category: 'Bebas Terbatas',
    unit: 'Botol',
    shelfLocation: 'Rak D-02 (P3K)',
    stock: 14,
    minStock: 8,
    buyPrice: 26000,
    sellPrice: 34000,
    expiryDate: '2028-04-12',
    supplier: 'PT Mahakam Beta Farma',
    batchNumber: 'MB-5510',
    dosage: 'Oleskan pada luka terbuka secukupnya',
    description: 'Povidone Iodine 10% cairan pembersih dan pencegah infeksi luka'
  },
  {
    id: 'med-7',
    code: '89913892200',
    name: 'Cetirizine 10mg',
    category: 'Generik',
    unit: 'Strip',
    shelfLocation: 'Rak B-01',
    stock: 35,
    minStock: 15,
    buyPrice: 4200,
    sellPrice: 7500,
    expiryDate: '2027-11-30',
    supplier: 'PT Dexa Medica',
    batchNumber: 'DX-1129',
    dosage: '1 kali sehari 1 tablet pada malam hari',
    description: 'Antihistamin pereda alergi, gatal-gatal, dan bersin'
  },
  {
    id: 'med-8',
    code: '89988661109',
    name: 'Neurobion Forte',
    category: 'Suplemen & Vitamin',
    unit: 'Strip',
    shelfLocation: 'Rak E-01 (Vitamin)',
    stock: 22,
    minStock: 10,
    buyPrice: 38000,
    sellPrice: 48000,
    expiryDate: '2027-09-05',
    supplier: 'PT Procter & Gamble Health',
    batchNumber: 'PG-9902',
    dosage: '1 tablet sehari sesudah makan',
    description: 'Vitamin neurotropik B1, B6, B12 untuk kebas dan kesemutan'
  },
  {
    id: 'med-9',
    code: '89923456781',
    name: 'Antasida Doen Tablet Kunyah',
    category: 'Bebas',
    unit: 'Strip',
    shelfLocation: 'Rak A-03',
    stock: 5, // Low stock! Min is 12
    minStock: 12,
    buyPrice: 2000,
    sellPrice: 3500,
    expiryDate: '2027-05-20',
    supplier: 'PT Kimia Farma Trading',
    batchNumber: 'KF-8831',
    dosage: 'Kunyah 1-2 tablet sebelum makan atau saat perut perih',
    description: 'Menetralkan asam lambung, maag dan kembung'
  },
  {
    id: 'med-10',
    code: '89932145601',
    name: 'Diapet Kapsul',
    category: 'Bebas',
    unit: 'Strip',
    shelfLocation: 'Rak A-04',
    stock: 19,
    minStock: 10,
    buyPrice: 3200,
    sellPrice: 5000,
    expiryDate: '2028-01-15',
    supplier: 'PT Soho Industri Pharmasi',
    batchNumber: 'SH-4412',
    dosage: 'Dewasa: 2 kapsul 2 kali sehari',
    description: 'Obat diare alami dari ekstrak daun jambu biji'
  },
  {
    id: 'med-11',
    code: '89970012399',
    name: 'Tensimeter Digital Omron HEM-7120',
    category: 'Alat Kesehatan',
    unit: 'Pcs',
    shelfLocation: 'Etalase Alkes 01',
    stock: 2, // Low stock! Min is 3
    minStock: 3,
    buyPrice: 420000,
    sellPrice: 520000,
    expiryDate: '2030-01-01',
    supplier: 'PT Enseval Medika Prima',
    batchNumber: 'OM-2024-X',
    dosage: 'Pengukur tekanan darah otomatis lengan atas',
    description: 'Alat ukur tekanan darah digital akurat bergaransi'
  },
  {
    id: 'med-12',
    code: '89960014288',
    name: 'Cefixime 200mg',
    category: 'Antibiotik',
    unit: 'Strip',
    shelfLocation: 'Lemari Khusus G-01',
    stock: 15,
    minStock: 10,
    buyPrice: 22000,
    sellPrice: 32000,
    expiryDate: '2027-12-25',
    supplier: 'PT Dexa Medica',
    batchNumber: 'DX-5509',
    dosage: 'Harus dengan resep dokter: 1 kapsul 2 kali sehari',
    description: 'Sefalosporin generasi ketiga spektrum luas'
  }
];

export const INITIAL_PRICE_HISTORIES: PriceHistory[] = [
  {
    id: 'ph-1',
    medicineId: 'med-1',
    medicineCode: '63634634',
    medicineName: 'Paramex',
    oldBuyPrice: 2500,
    newBuyPrice: 2800,
    oldSellPrice: 3500,
    newSellPrice: 4000,
    changedBy: 'Manajer Siti Nurhaliza, S.Farm',
    changedByRole: 'manajer',
    changedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    reason: 'Penyesuaian kenaikan harga distributor PBF'
  },
  {
    id: 'ph-2',
    medicineId: 'med-2',
    medicineCode: '754875856',
    medicineName: 'Lameson - 16',
    oldBuyPrice: 26000,
    newBuyPrice: 28000,
    oldSellPrice: 35000,
    newSellPrice: 38000,
    changedBy: 'Seniman Koding (Owner / Apt. Hendra, S.Farm)',
    changedByRole: 'owner',
    changedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    reason: 'Kenaikan bahan baku impor kortikosteroid'
  }
];

// Today's date ISO helper
const todayStr = new Date().toISOString();
const todayDateOnly = todayStr.split('T')[0];

export const INITIAL_SALES: SaleTransaction[] = [
  {
    id: 'trx-1',
    invoiceNumber: `INV-${todayDateOnly.replace(/-/g, '')}-001`,
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    cashierId: 'usr-1',
    cashierName: 'Kasir Budi Prasetyo',
    customerName: 'Ibu Ratna',
    customerType: 'Umum',
    items: [
      {
        medicineId: 'med-1',
        code: '63634634',
        name: 'Paramex',
        category: 'Bebas',
        unit: 'Strip',
        buyPrice: 2800,
        sellPrice: 4000,
        quantity: 1,
        subtotal: 4000,
        profit: 1200,
        instructions: '1 tablet saat pusing'
      },
      {
        medicineId: 'med-2',
        code: '754875856',
        name: 'Lameson - 16',
        category: 'Keras / Resep',
        unit: 'Strip',
        buyPrice: 28000,
        sellPrice: 38000,
        quantity: 1,
        subtotal: 38000,
        profit: 10000,
        instructions: '1x1 sesudah makan pagi'
      }
    ],
    subtotal: 42000,
    discount: 0,
    tax: 0,
    totalAmount: 42000, // Matches Rp 42.000 from user's screenshot!
    totalCost: 30800,
    totalProfit: 11200,
    paymentMethod: 'Tunai',
    cashTendered: 50000,
    change: 8000,
    notes: 'Pasien langganan'
  },
  {
    id: 'trx-2',
    invoiceNumber: `INV-${todayDateOnly.replace(/-/g, '')}-002`,
    date: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    cashierId: 'usr-1',
    cashierName: 'Kasir Budi Prasetyo',
    customerName: 'Bpk. Ahmad Fauzi',
    customerType: 'Resep Dokter',
    doctorName: 'dr. Sp.PD Bambang',
    items: [
      {
        medicineId: 'med-3',
        code: '89999081234',
        name: 'Amoxicillin 500mg',
        category: 'Antibiotik',
        unit: 'Strip',
        buyPrice: 6500,
        sellPrice: 10000,
        quantity: 2,
        subtotal: 20000,
        profit: 7000,
        instructions: '3x1 kaplet habiskan'
      },
      {
        medicineId: 'med-1',
        code: '63634634',
        name: 'Paramex',
        category: 'Bebas',
        unit: 'Strip',
        buyPrice: 2800,
        sellPrice: 4000,
        quantity: 3,
        subtotal: 12000,
        profit: 3600,
        instructions: '3x1 jika nyeri'
      }
    ],
    subtotal: 32000,
    discount: 0,
    tax: 0,
    totalAmount: 32000,
    totalCost: 21400,
    totalProfit: 10600,
    paymentMethod: 'QRIS',
    cashTendered: 32000,
    change: 0,
    notes: 'Scan QRIS BCA'
  }
];

export const INITIAL_PURCHASES: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-20261025-01',
    supplier: 'PT Kimia Farma Trading',
    date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    status: 'Diterima',
    recordedBy: 'Manajer Siti Nurhaliza, S.Farm',
    items: [
      {
        medicineId: 'med-3',
        name: 'Amoxicillin 500mg',
        quantity: 50,
        buyPrice: 6500,
        subtotal: 325000
      },
      {
        medicineId: 'med-7',
        name: 'Cetirizine 10mg',
        quantity: 50,
        buyPrice: 4200,
        subtotal: 210000
      }
    ],
    totalAmount: 535000,
    notes: 'Restock mingguan antibiotik & generik'
  }
];
