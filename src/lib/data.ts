import { addDays, format, differenceInDays } from 'date-fns';

export interface Crop {
  id: string;
  name: string;
  variety: string;
  sowingDate: string;
  estimatedGrowthDays: number;
  harvestDate?: string;
  status: 'Sembrado' | 'En crecimiento' | 'Listo para cosecha' | 'Cosechado';
  quantity: number;
  location: string;
  history?: Array<{ date: string; action: string; note: string }>;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'Sensor' | 'Bomba' | 'Motor';
  category: 'Temperatura' | 'pH' | 'Humedad' | 'Agua' | 'Ventilación';
  status: 'Activo' | 'Inactivo' | 'Falla';
  location: string;
  installationDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  currentValue?: number;
  unit?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Semillas' | 'Fertilizantes' | 'Nutrientes' | 'Accesorios' | 'Repuestos';
  quantity: number;
  minStock: number;
  unit: string;
  price: number;
  provider: string;
  lastPurchase: string;
}

export interface Sale {
  id: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  customer?: string;
}

// Simulated data helpers
export const calculateHarvestDate = (sowingDate: string, growthDays: number) => {
  return format(addDays(new Date(sowingDate), growthDays), 'yyyy-MM-dd');
};

export const getStatusByDate = (sowingDate: string, growthDays: number) => {
  const today = new Date();
  const harvest = addDays(new Date(sowingDate), growthDays);
  const diff = differenceInDays(harvest, today);

  if (diff <= 0) return 'Listo para cosecha';
  if (diff > growthDays * 0.8) return 'Sembrado';
  return 'En crecimiento';
};

// Mock data - Reset to zero for user production
export const mockCrops: Crop[] = [];

export const mockEquipment: Equipment[] = [];

export const mockInventory: InventoryItem[] = [];

export const mockSales: Sale[] = [];

export const mockChartData: any[] = [];
