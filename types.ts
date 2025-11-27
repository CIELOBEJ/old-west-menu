export enum ProductCategory {
  HAMBURGER = 'Hamburger',
  PIZZA = 'Pizza',
  SECONDI = 'Secondi piatti',
  PESCE = 'Piatti a base di pesce',
  ANTIPASTI = 'Antipasti e Insalate',
  BIMBI = 'Menu Bimbi',
  CONTORNI = 'Contorni',
  DOLCI = 'Dolci',
  BEVANDE = 'Bevande'
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
  vegan: boolean; // NUOVO
  spicy: boolean;
  bestseller: boolean;
}

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
  translations?: {
    [key in LanguageCode]?: ProductTranslation;
  };
}

export type ViewState = 'MENU' | 'LOGIN' | 'ADMIN';