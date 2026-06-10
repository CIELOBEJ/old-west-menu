export enum ProductCategory {
  HAMBURGER = 'Hamburger',
  PIZZA = 'Pizza',
  SECONDI = 'Secondi piatti',
  PESCE = 'Piatti a base di pesce',
  ANTIPASTI = 'Antipasti e Insalate',
  BIMBI = 'Menu Bimbi',
  CONTORNI = 'Contorni',
  DOLCI = 'Dolci',
  BEVANDE = 'Bevande',
  AGGIUNTE = 'Ingredienti Extra'
}

export type LanguageCode = 'it' | 'en' | 'fr' | 'de';

export interface ProductTranslation {
  name: string;
  description: string;
}

export interface ProductVariant {
  name: string;
  price: number;
}

export interface ActiveFilters {
  vegetarian: boolean;
  vegan: boolean;
  spicy: boolean;
  bestseller: boolean;
}

export type AllergenType = 
  | 'Glutine' | 'Crostacei' | 'Uova' | 'Pesce' | 'Arachidi' 
  | 'Soia' | 'Latte' | 'Frutta a guscio' | 'Sedano' | 'Senape' 
  | 'Sesamo' | 'Anidride solforosa' | 'Lupini' | 'Molluschi';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  brand?: string;
  variants?: ProductVariant[];
  category: ProductCategory;
  subCategory?: string;
  imageUrl?: string;
  isAvailable: boolean;
  tags?: string[];
  allergens?: AllergenType[];
  translations?: {
    [key in LanguageCode]?: ProductTranslation;
  };
}

export interface CartItem extends MenuItem {
  cartId: string;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedAddons?: MenuItem[];
}

// --- NUOVI TIPI PER IL DELIVERY ---
export type ViewState = 'MENU' | 'LOGIN' | 'ADMIN' | 'CHECKOUT' | 'ORDER_SUCCESS';

export type OrderType = 'delivery' | 'takeaway' | 'table';
export type PaymentMethod = 'cash' | 'pos';

export interface DeliveryZone {
  name: string;
  cost: number;
  minOrder: number;
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryTime: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}