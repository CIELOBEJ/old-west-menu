import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  UtensilsCrossed, 
  Pizza, 
  Beef, 
  Fish, 
  Salad, 
  Baby, 
  Cookie, 
  Beer, 
  Settings, 
  Plus, 
  Trash2, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Utensils, 
  Star, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Phone, 
  LayoutGrid, 
  ArrowRight, 
  Upload, 
  Image as ImageIcon, 
  Download, 
  FileJson, 
  RotateCcw, 
  CheckCircle2, 
  Save, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Loader2, 
  Pencil, 
  RefreshCw, 
  Wheat, 
  CircleDot, 
  Globe, 
  Languages, 
  Check, 
  Leaf, 
  Flame, 
  Award, 
  QrCode, 
  Database,
  Sprout,
  ShoppingBag,
  Milk,
  Egg,
  Nut,
  Bean,
  AlertCircle,
  Wine,
  Shell,
  Info,
  Search,
  Minus
} from 'lucide-react';
import { MenuItem, ProductCategory, ViewState, LanguageCode, ActiveFilters, CartItem, AllergenType, ProductVariant } from './types';
import { INITIAL_MENU_ITEMS, CATEGORIES_LIST, HAMBURGER_SUBCATEGORIES, DIY_OPTIONS, UI_TRANSLATIONS, CATEGORY_TRANSLATIONS, DATA_VERSION, ALLERGENS_CONFIG, EXTRA_INGREDIENTS_ITEMS } from './constants';
import { supabase } from './supabase';

// --- Helper Functions ---

const uploadImageToSupabase = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// --- Helper Components ---

const CategoryIcon = ({ category, className }: { category: ProductCategory | 'Tutti'; className?: string }) => {
  switch (category) {
    case 'Tutti': return <LayoutGrid className={className} />;
    case ProductCategory.HAMBURGER: return <Beef className={className} />;
    case ProductCategory.PIZZA: return <Pizza className={className} />;
    case ProductCategory.SECONDI: return <UtensilsCrossed className={className} />;
    case ProductCategory.PESCE: return <Fish className={className} />;
    case ProductCategory.ANTIPASTI: return <Salad className={className} />;
    case ProductCategory.BIMBI: return <Baby className={className} />;
    case ProductCategory.CONTORNI: return <Utensils className={className} />;
    case ProductCategory.DOLCI: return <Cookie className={className} />;
    case ProductCategory.BEVANDE: return <Beer className={className} />;
    default: return <UtensilsCrossed className={className} />;
  }
};

const AllergenIcon = ({ type, className }: { type: AllergenType; className?: string }) => {
  const config = ALLERGENS_CONFIG[type];
  if (!config) return null;
  
  const IconComponent = {
    'Wheat': Wheat,
    'Shell': Shell,
    'Egg': Egg,
    'Fish': Fish,
    'Nut': Nut, // Peanut & Nuts
    'Bean': Bean, // Soy & Lupini
    'Milk': Milk,
    'Leaf': Leaf, // Celery
    'AlertCircle': AlertCircle, // Mustard
    'CircleDot': CircleDot, // Sesame
    'Wine': Wine, // Sulphites
    'Info': Info // Fallback
  }[config.iconName] || Info;

  return <IconComponent className={className} />;
};

const DEFAULT_LOGO = "https://oldwest.click/wp-content/uploads/2022/06/LOGO-OLD-WEST.png";

const WesternLogo = ({ size = 'md', className, url }: { size?: 'md' | 'lg', className?: string, url?: string }) => {
  const isLarge = size === 'lg';
  const logoUrl = url || DEFAULT_LOGO;
  
  return (
    <div className={`
      ${isLarge ? 'w-28 h-28 rounded-3xl' : 'w-12 h-12 rounded-xl'} 
      bg-accent-500 relative shadow-lg overflow-hidden shrink-0 select-none flex items-center justify-center
      ${className || ''}
    `}>
       <img 
         src={logoUrl} 
         alt="Old West Logo" 
         className={`w-full h-full object-contain ${isLarge ? 'p-2' : 'p-1'}`} 
       />
    </div>
  );
};

const LANGUAGES_CONFIG = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' }, 
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' }
] as const;

export default function App() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [view, setView] = useState<ViewState>('MENU');
  
  const [activeCategory, setActiveCategory] = useState<string>('Tutti');
  const [activeSubCategoryView, setActiveSubCategoryView] = useState<string | null>(null);
  const [diySelections, setDiySelections] = useState<Record<number, string>>({});
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingCartItemIndex, setEditingCartItemIndex] = useState<number | null>(null);
  const [addonSearch, setAddonSearch] = useState('');

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    vegetarian: false,
    vegan: false,
    spicy: false,
    bestseller: false
  });

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); 
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adminLang, setAdminLang] = useState<LanguageCode>('it');
  
  const [customLogo, setCustomLogo] = useState<string>('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [lang, setLang] = useState<LanguageCode>('it');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    category: ProductCategory.HAMBURGER,
    isAvailable: true,
    subCategory: HAMBURGER_SUBCATEGORIES[0],
    translations: {},
    allergens: []
  });

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        setItems(data);
      } else {
        setItems([...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setItems([...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS]);
    } finally {
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    fetchItems();
    const savedLogo = localStorage.getItem('oldWestLogoUrl');
    if (savedLogo) setCustomLogo(savedLogo);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // --- CART LOGIC ---
  const addToCart = (item: MenuItem, variant?: ProductVariant) => {
    const existingItemIndex = cart.findIndex(
      (i) => i.id === item.id && 
             (variant ? i.selectedVariant?.name === variant.name : !i.selectedVariant) &&
             (!i.selectedAddons || i.selectedAddons.length === 0)
    );

    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, cartId: Math.random().toString(), quantity: 1, selectedVariant: variant }]);
    }
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(i => i.cartId !== cartId));
  };

  const updateCartItemQuantity = (cartId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const openAddonModal = (index: number) => {
    setEditingCartItemIndex(index);
    setAddonSearch('');
    setIsAddonModalOpen(true);
  };

  const addAddonToItem = (addon: MenuItem) => {
    if (editingCartItemIndex === null) return;
    const newCart = [...cart];
    const currentAddons = newCart[editingCartItemIndex].selectedAddons || [];
    newCart[editingCartItemIndex].selectedAddons = [...currentAddons, addon];
    setCart(newCart);
    setIsAddonModalOpen(false);
    setEditingCartItemIndex(null);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => {
      const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
      const addonsPrice = item.selectedAddons?.reduce((aSum, addon) => aSum + addon.price, 0) || 0;
      return sum + (itemPrice + addonsPrice) * item.quantity;
    }, 0);
    return subtotal + (cart.length > 0 ? 2.00 : 0); // Coperto
  };

  const t = (key: string): string => (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][lang]) ? UI_TRANSLATIONS[key][lang] : key;
  const tCategory = (cat: string): string => {
    if (cat === 'Tutti') return UI_TRANSLATIONS['all'][lang];
    if (CATEGORY_TRANSLATIONS[cat as ProductCategory] && CATEGORY_TRANSLATIONS[cat as ProductCategory][lang]) return CATEGORY_TRANSLATIONS[cat as ProductCategory][lang];
    return cat;
  };
  const getProductContent = (item: MenuItem | Partial<MenuItem>) => {
    if (lang === 'it') return { name: item.name || '', description: item.description || '' };
    const trans = item.translations?.[lang];
    return { name: trans?.name || item.name || '', description: trans?.description || item.description || '' };
  };
  const getDIYStepContent = (step: any) => {
    if (lang === 'it') return { title: step.title, description: step.description };
    const trans = step.translations?.[lang];
    return { title: trans?.title || step.title, description: trans?.description || step.description };
  };
  const getDIYOptionContent = (opt: any) => {
     if (lang === 'it') return opt.name;
     return opt.translations?.[lang]?.name || opt.name;
  };

  const checkFilters = (item: MenuItem) => {
    if (activeFilters.vegetarian) {
      const isVeg = item.tags?.includes('Vegetariano') || item.tags?.includes('Vegano') || item.category === ProductCategory.CONTORNI || (item.category === ProductCategory.PIZZA && (item.name === 'Vegetariana' || item.name === 'Margherita' || item.name === 'Marinara' || item.name === 'Verdure'));
      if (!isVeg) return false;
    }
    if (activeFilters.vegan) {
      const isVegan = item.tags?.includes('Vegano') || (item.category === ProductCategory.CONTORNI && item.name !== 'Patatine Fritte') || (item.category === ProductCategory.PIZZA && item.name === 'Marinara'); 
      if (!isVegan) return false;
    }
    if (activeFilters.spicy) {
      const isSpicy = item.tags?.includes('Piccante') || item.description.toLowerCase().includes('piccante') || item.description.toLowerCase().includes('nduja'); 
      if (!isSpicy) return false;
    }
    if (activeFilters.bestseller) {
      const isBest = item.tags?.includes('Best Seller') || item.tags?.includes('Consigliato');
      if (!isBest) return false;
    }
    return true;
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategoryView(null); 
    if (view === 'MENU') {
      const listStart = 300; 
      if (window.scrollY > listStart) window.scrollTo({ top: listStart, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const activeBtn = document.getElementById(`btn-${activeCategory}`);
    if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '1234') { 
      setView('ADMIN'); setAdminPassword(''); setLoginError(''); setActiveCategory('Tutti'); setLang('it'); 
    } else { setLoginError('PIN non valido'); }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    const finalSubCategory = newItem.category === ProductCategory.HAMBURGER ? newItem.subCategory : undefined;
    const itemToSave = {
        name: newItem.name, description: newItem.description, price: Number(newItem.price), category: newItem.category, subCategory: finalSubCategory, imageUrl: newItem.imageUrl, isAvailable: newItem.isAvailable !== undefined ? newItem.isAvailable : true, tags: newItem.tags || [], brand: newItem.brand || null, variants: newItem.variants || null, translations: newItem.translations || null, allergens: newItem.allergens || []
    };
    try {
      if (editingId) {
        const { error } = await supabase.from('menu_items').update(itemToSave).eq('id', editingId);
        if (error) throw error;
        alert('Prodotto modificato con successo!');
      } else {
        const { error } = await supabase.from('menu_items').insert([itemToSave]);
        if (error) throw error;
        alert('Prodotto aggiunto con successo!');
      }
      fetchItems(); setEditingId(null);
      setNewItem({ category: ProductCategory.HAMBURGER, subCategory: HAMBURGER_SUBCATEGORIES[0], isAvailable: true, name: '', description: '', price: 0, imageUrl: '', translations: {}, brand: undefined, variants: undefined, allergens: [] });
      setAdminLang('it');
    } catch (error) { console.error('Error saving item:', error); alert('Errore durante il salvataggio nel database cloud.'); }
  };

  const handleEditItem = (item: MenuItem) => {
    setNewItem({ ...item }); setEditingId(item.id); setAdminLang('it');
    const formElement = document.getElementById('new-product-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setNewItem({ category: ProductCategory.HAMBURGER, subCategory: HAMBURGER_SUBCATEGORIES[0], isAvailable: true, name: '', description: '', price: 0, imageUrl: '', translations: {}, brand: undefined, variants: undefined, allergens: [] });
    setAdminLang('it');
  };
  const handleDeleteItem = async (id: string, e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        const { error } = await supabase.from('menu_items').delete().eq('id', id);
        if (error) throw error;
        fetchItems(); if (editingId === id) handleCancelEdit();
      } catch (error) { console.error('Error deleting item:', error); alert('Errore durante l\'eliminazione.'); }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const publicUrl = await uploadImageToSupabase(file);
        if (publicUrl) setCustomLogo(publicUrl); else alert("Errore caricamento logo su Supabase");
      } catch (error) { alert("Errore durante il caricamento dell'immagine"); } finally { setIsProcessingImage(false); }
    }
  };
  const handleSaveLogo = () => { if (customLogo) { localStorage.setItem('oldWestLogoUrl', customLogo); alert('Logo salvato con successo!'); } };
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       setIsProcessingImage(true);
       try {
         const publicUrl = await uploadImageToSupabase(file);
         if (publicUrl) setNewItem({...newItem, imageUrl: publicUrl}); else alert("Errore caricamento immagine su Supabase");
       } catch (error) { alert("Errore durante il caricamento dell'immagine"); } finally { setIsProcessingImage(false); }
    }
  };
  const handleRemoveProductImage = () => { setNewItem({...newItem, imageUrl: ''}); };
  const handleResetLogo = () => { if (window.confirm('Vuoi ripristinare il logo originale?')) { setCustomLogo(''); localStorage.removeItem('oldWestLogoUrl'); } };
  const handleSyncInitialData = async () => {
    if (window.confirm("Questa operazione caricherà tutti i prodotti iniziali nel database cloud. Potrebbero crearsi duplicati se non è vuoto. Continuare?")) {
       setIsSyncing(true);
       try {
          const formattedItems = [...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS].map(item => ({
             name: item.name, description: item.description, price: item.price, category: item.category, "subCategory": item.subCategory || null, "imageUrl": item.imageUrl || null, brand: item.brand || null, "isAvailable": true, tags: item.tags || [], variants: item.variants || null, translations: item.translations || null, allergens: item.allergens || []
          }));
          const { error } = await supabase.from('menu_items').insert(formattedItems);
          if (error) { console.error("Sync Error Details:", error); throw error; }
          alert("Sincronizzazione completata! I prodotti sono stati caricati."); fetchItems();
       } catch (error: any) { console.error('Sync Error:', error); alert(`Errore durante la sincronizzazione: ${error.message || 'Errore sconosciuto'}`); } finally { setIsSyncing(false); }
    }
  };
  
  const handleExportData = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `old_west_menu_backup_${new Date().toISOString().slice(0,10)}.json`;
    const linkElement = document.createElement('a'); linkElement.setAttribute('href', dataUri); linkElement.setAttribute('download', exportFileDefaultName); linkElement.click();
  };
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => { alert("L'importazione da file JSON locale è disabilitata ora che usi il Database Cloud. Usa la funzione 'Sincronizza Menu Iniziale' o aggiungi i prodotti manualmente."); };
  const handleFactoryReset = () => { alert("Il reset di fabbrica locale non è disponibile con il Database Cloud. Per resettare, cancella i prodotti dal database."); };

  const renderHighlights = () => {
    const highlightedItems = items.filter(item => item.tags?.some(tag => tag === 'Best Seller' || tag === 'Consigliato'));
    if (highlightedItems.length === 0) return null;
    return (
      <div className="container mx-auto px-4 py-6 relative group/carousel">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xl font-western text-wood-800 flex items-center gap-2"><Award size={24} className="text-yellow-500" /> {t('highlight_title')}</h3>
           <div className="flex gap-2 opacity-100 md:opacity-0 group-hover/carousel:opacity-100 transition-opacity">
             <button onClick={() => scrollCarousel('left')} className="bg-white p-2 rounded-full shadow-md hover:bg-wood-50 text-wood-600 z-10 hidden md:flex"><ChevronLeft size={20} /></button>
             <button onClick={() => scrollCarousel('right')} className="bg-white p-2 rounded-full shadow-md hover:bg-wood-50 text-wood-600 z-10 hidden md:flex"><ChevronRight size={20} /></button>
           </div>
        </div>
        <div ref={carouselRef} className={`flex overflow-x-auto gap-4 pb-6 no-scrollbar ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x'}`} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
          {highlightedItems.map(item => {
             const { name } = getProductContent(item);
             return (
              <div key={item.id} className="snap-center shrink-0 w-[85vw] md:w-64 bg-white rounded-2xl shadow-md border border-wood-100 overflow-hidden flex flex-col select-none">
                 <div className="h-32 bg-wood-100 relative pointer-events-none">
                    {item.imageUrl ? <img src={item.imageUrl} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-wood-300"><UtensilsCrossed size={32}/></div>}
                    <div className="absolute top-2 right-2 bg-yellow-400 text-wood-900 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">{item.tags?.find(t => t === 'Best Seller' || t === 'Consigliato') || 'Special'}</div>
                 </div>
                 <div className="p-4 flex-1 flex flex-col pointer-events-none">
                    <h4 className="font-western text-lg leading-tight mb-1 truncate">{name}</h4>
                    <p className="text-accent-600 font-bold mt-auto">€{item.price.toFixed(2)}</p>
                 </div>
              </div>
             );
          })}
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div className="container mx-auto px-4 mb-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveFilters(prev => ({...prev, vegetarian: !prev.vegetarian}))} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeFilters.vegetarian ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-wood-200 text-wood-500 hover:bg-wood-50'}`}><Leaf size={14} /> {t('filter_veg')}</button>
        <button onClick={() => setActiveFilters(prev => ({...prev, vegan: !prev.vegan}))} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeFilters.vegan ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-white border-wood-200 text-wood-500 hover:bg-wood-50'}`}><Sprout size={14} /> Vegano</button>
        <button onClick={() => setActiveFilters(prev => ({...prev, spicy: !prev.spicy}))} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeFilters.spicy ? 'bg-red-100 border-red-200 text-red-700' : 'bg-white border-wood-200 text-wood-500 hover:bg-wood-50'}`}><Flame size={14} /> {t('filter_spicy')}</button>
        <button onClick={() => setActiveFilters(prev => ({...prev, bestseller: !prev.bestseller}))} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeFilters.bestseller ? 'bg-yellow-100 border-yellow-200 text-yellow-700' : 'bg-white border-wood-200 text-wood-500 hover:bg-wood-50'}`}><Award size={14} /> {t('filter_best')}</button>
      </div>
    </div>
  );

  const renderProductGrid = (productList: MenuItem[]) => {
    const filteredList = productList.filter(checkFilters);
    if (filteredList.length === 0 && productList.length > 0) return <div className="text-center py-12 text-wood-400 italic bg-wood-50 rounded-3xl border border-dashed border-wood-200">Nessun prodotto corrisponde ai filtri selezionati.</div>;
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {filteredList.map((item) => {
        const { name, description } = getProductContent(item);
        const hasImage = !!item.imageUrl && item.imageUrl.length > 0;
        const cartItem = cart.find(c => c.id === item.id && !c.selectedVariant);
        const qty = cartItem ? cartItem.quantity : 0;

        return (
        <div key={item.id} className="group bg-white rounded-[2rem] shadow-soft hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative border border-wood-100">
          {hasImage && (
            <div className="relative h-56 overflow-hidden bg-wood-100">
              <img src={item.imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              {item.tags && item.tags.length > 0 && <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm"><Star size={12} className="text-yellow-500 fill-yellow-500" /><span className="text-[10px] font-bold uppercase tracking-wider text-wood-900">{item.tags[0]}</span></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            </div>
          )}
          <div className="p-6 flex-1 flex flex-col relative">
            {hasImage ? (
              <>
                <div className="absolute -top-6 left-6"><div className="bg-accent-600 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-baseline gap-0.5 border-4 border-white"><span className="text-xs font-medium opacity-80">€</span><span className="text-xl font-bold tracking-tight">{item.price.toFixed(2)}</span></div></div>
                <div className="mt-4 mb-2"><h3 className="text-xl md:text-2xl font-western text-wood-900 leading-none group-hover:text-accent-600 transition-colors">{name}</h3>{item.brand && <p className="text-accent-500 font-bold text-sm mt-1">{item.brand}</p>}</div>
              </>
            ) : (
              <div className="flex justify-between items-start mb-2 gap-4">
                 <div><h3 className="text-xl md:text-2xl font-western text-wood-900 leading-tight group-hover:text-accent-600 transition-colors">{name}</h3>{item.brand && <p className="text-accent-500 font-bold text-sm mt-1">{item.brand}</p>}</div>
                 {item.variants ? (
                    <div className="flex flex-col items-end gap-2">{item.variants.map((variant, idx) => {
                         const vCartItem = cart.find(c => c.id === item.id && c.selectedVariant?.name === variant.name);
                         const vQty = vCartItem ? vCartItem.quantity : 0;
                         return (
                         <div key={idx} className="flex items-center gap-2 bg-accent-50 px-2 py-1 rounded-lg border border-accent-100">
                            <span className="text-[10px] font-bold text-wood-500 uppercase tracking-wider">{variant.name}</span>
                            <span className="text-sm font-bold text-accent-600 whitespace-nowrap">€{variant.price.toFixed(2)}</span>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(item, variant); }} className="w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center hover:bg-accent-600"><Plus size={12}/></button>
                         </div>
                    )})}</div>
                 ) : (
                    <div className="bg-accent-600 text-white px-3 py-1.5 rounded-xl shadow-md flex-shrink-0 flex items-baseline gap-0.5"><span className="text-xs font-medium opacity-80">€</span><span className="text-lg font-bold tracking-tight">{item.price.toFixed(2)}</span></div>
                 )}
              </div>
            )}
            {description ? <p className="text-wood-500 text-sm leading-relaxed mb-6 flex-1 mt-2">{description}</p> : <div className="mb-4 flex-1"></div>}
            
            {/* Allergens Display */}
            {item.allergens && item.allergens.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                    {item.allergens.map(al => (
                        <div key={al} className="flex items-center gap-1 bg-wood-100 px-2 py-1 rounded-full text-[10px] text-wood-600" title={ALLERGENS_CONFIG[al].label}>
                            <AllergenIcon type={al} className="w-3 h-3" /> {al}
                        </div>
                    ))}
                </div>
            )}
            
            {item.description && item.description.includes('*') && (
                <p className="text-[10px] text-wood-400 mb-2 italic">{t('frozen_product')}</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-wood-50 mt-auto">
              <span className="text-xs font-bold text-wood-400 uppercase tracking-wider">{tCategory(item.category)}</span>
              {!item.variants && (
                 <div className="flex items-center gap-3">
                    {qty > 0 && (
                        <>
                        <button onClick={() => removeFromCart(cart.find(c => c.id === item.id && !c.selectedVariant)!.cartId)} className="w-8 h-8 rounded-full bg-wood-200 text-wood-600 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"><Minus size={16} /></button>
                        <span className="font-bold text-wood-900">{qty}</span>
                        </>
                    )}
                    <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full bg-wood-100 text-wood-600 flex items-center justify-center hover:bg-accent-500 hover:text-white transition-colors"><Plus size={16} /></button>
                 </div>
              )}
            </div>
          </div>
        </div>
      )})}
    </div>
  )};

  const renderDIYBuilder = () => { /* ... same as before but maybe can trigger add to cart? Skipping for brevity as requested "client chooses pizza..." */
    // Kept simple for now, can be expanded to add to cart later
    let currentTotal = DIY_OPTIONS.basePrice;
    DIY_OPTIONS.steps.forEach(step => {
      const selectedName = diySelections[step.id];
      if (selectedName) {
        const optionData = step.options.find(opt => opt.name === selectedName);
        if (optionData) currentTotal += optionData.price;
      }
    });
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-[2rem] p-8 shadow-soft border border-wood-100 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-western text-wood-900 mb-2">{t('diy_title')}</h3>
            <p className="text-wood-500 mb-6 max-w-2xl">{t('diy_subtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               {DIY_OPTIONS.steps.map((step) => {
                 const { title, description } = getDIYStepContent(step);
                 return (
                 <div key={step.id} className="bg-wood-50 rounded-2xl p-6 border border-wood-100 hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-accent-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex items-center gap-3 mb-4 relative z-10"><div className="w-8 h-8 rounded-full bg-wood-900 text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">{step.id}</div><h4 className="font-western text-xl text-wood-900 leading-none">{title}</h4></div>
                    <p className="text-xs font-bold text-accent-500 uppercase tracking-wider mb-4">{description}</p>
                    <ul className="space-y-2 relative z-10 flex-1">
                       {step.options.map((option, idx) => {
                         const isSelected = diySelections[step.id] === option.name;
                         const optionName = getDIYOptionContent(option);
                         return (
                           <li key={idx} onClick={() => setDiySelections(prev => ({...prev, [step.id]: option.name}))} className={`flex items-center justify-between text-sm p-3 rounded-xl cursor-pointer transition-all duration-200 border ${isSelected ? 'bg-accent-500 text-white font-bold shadow-md border-accent-500 transform -translate-y-0.5' : 'bg-white text-wood-600 hover:bg-wood-100 border-wood-200'}`}>
                              <div className="flex items-center gap-2 flex-1 min-w-0"><CircleDot size={14} className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-accent-500'}`} /><span className="leading-tight text-sm py-1">{optionName}</span></div>
                              <span className={`text-xs ml-2 font-mono whitespace-nowrap ${isSelected ? 'text-white opacity-90' : 'text-wood-400'}`}>{option.price > 0 ? `+€${option.price.toFixed(2)}` : '€ 0'}</span>
                           </li>
                         );
                       })}
                    </ul>
                 </div>
               )})}
            </div>
            <div className="mt-8 bg-wood-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>
               <div className="flex items-center gap-6 relative z-10"><div className="p-4 bg-accent-500 rounded-2xl text-white shadow-lg transform rotate-3"><Wheat size={32} /></div><div><h4 className="font-western text-3xl text-white mb-1">{t('total')}: €{currentTotal.toFixed(2)}</h4><p className="text-xs text-wood-300 font-medium">{t('base_price')} €{DIY_OPTIONS.basePrice.toFixed(2)} + {t('options')}</p></div></div>
               <button className="relative z-10 w-full md:w-auto bg-white text-wood-900 px-8 py-4 rounded-xl font-bold hover:bg-accent-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"><Utensils size={18} /> {t('order_table')}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- CART DRAWER ---
  const renderCartDrawer = () => {
      const addons = items.filter(i => i.category === ProductCategory.AGGIUNTE);
      const filteredAddons = addons.filter(a => a.name.toLowerCase().includes(addonSearch.toLowerCase()));

      return (
      <>
        {isCartOpen && <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)} />}
        <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl transform transition-transform duration-300 z-50 max-h-[85vh] flex flex-col ${isCartOpen ? 'translate-y-0' : 'translate-y-full'}`}>
           <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-2xl font-western text-wood-900 flex items-center gap-2"><ShoppingBag size={24} /> {t('my_order')}</h3>
                 <button onClick={() => setIsCartOpen(false)} className="p-2 bg-wood-100 rounded-full"><X size={20}/></button>
              </div>

              {cart.length === 0 ? (
                 <div className="text-center py-10 text-wood-400">{t('empty_cart')}</div>
              ) : (
                 <div className="space-y-4">
                    {cart.map((item, index) => (
                       <div key={item.cartId} className="flex justify-between items-start border-b border-wood-100 pb-4">
                          <div className="flex-1">
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-wood-900">{item.quantity}x {item.name}</span>
                                {item.selectedVariant && <span className="text-xs bg-wood-100 px-2 rounded-full text-wood-600">{item.selectedVariant.name}</span>}
                             </div>
                             {item.selectedAddons && item.selectedAddons.length > 0 && (
                                <div className="text-xs text-wood-500 mt-1">
                                   {item.selectedAddons.map((add, i) => (
                                      <span key={i} className="block">+ {add.name} (€{add.price.toFixed(2)})</span>
                                   ))}
                                </div>
                             )}
                             <button onClick={() => openAddonModal(index)} className="text-xs font-bold text-accent-600 mt-2 flex items-center gap-1"><Plus size={10}/> {t('add_ingredient')}</button>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                             <span className="font-mono font-bold">€{((item.selectedVariant ? item.selectedVariant.price : item.price) * item.quantity + (item.selectedAddons?.reduce((s, a) => s + a.price, 0) || 0) * item.quantity).toFixed(2)}</span>
                             <div className="flex items-center gap-2 bg-wood-50 rounded-lg p-1">
                                <button onClick={() => { if(item.quantity > 1) updateCartItemQuantity(item.cartId, -1); else removeFromCart(item.cartId); }} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-wood-600"><Minus size={12}/></button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateCartItemQuantity(item.cartId, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-wood-600"><Plus size={12}/></button>
                             </div>
                          </div>
                       </div>
                    ))}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-wood-500">{t('cover_charge')}</span>
                        <span className="font-mono font-bold">€2.00</span>
                    </div>
                 </div>
              )}
           </div>
           <div className="p-6 border-t border-wood-100 bg-wood-50">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-lg font-bold text-wood-900">{t('total')}</span>
                 <span className="text-3xl font-western text-accent-600">€{getCartTotal().toFixed(2)}</span>
              </div>
              <button className="w-full bg-wood-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                 <Utensils size={20} /> {t('order_table')}
              </button>
           </div>
        </div>

        {/* Add-on Modal */}
        {isAddonModalOpen && (
           <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 max-h-[80vh] flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-lg text-wood-900">{t('add_ingredient')}</h4>
                    <button onClick={() => setIsAddonModalOpen(false)}><X/></button>
                 </div>
                 <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wood-400" size={18}/>
                    <input 
                       type="text" 
                       placeholder={t('search_addon')} 
                       value={addonSearch}
                       onChange={(e) => setAddonSearch(e.target.value)}
                       className="w-full bg-wood-50 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-accent-500"
                    />
                 </div>
                 <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredAddons.map(addon => (
                       <button key={addon.id} onClick={() => addAddonToItem(addon)} className="w-full flex justify-between items-center p-3 hover:bg-wood-50 rounded-xl transition-colors text-left">
                          <span className="font-medium text-wood-800">{addon.name}</span>
                          <span className="font-bold text-accent-600">+€{addon.price.toFixed(2)}</span>
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </>
      );
  };

  const renderAdmin = () => {
    const sortedItems = [...items].sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.name.localeCompare(b.name);
    });

    const displayItems = activeCategory === 'Tutti' 
      ? sortedItems 
      : sortedItems.filter(i => i.category === activeCategory);

    return (
    <div className="min-h-screen bg-wood-50 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* ... Header and other admin sections ... */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div><h1 className="text-3xl font-western text-wood-900">{t('admin_area')}</h1><p className="text-wood-500">Gestione Menu & Impostazioni</p></div>
          <div className="flex gap-3"><button onClick={handleExportData} className="flex items-center gap-2 bg-white border border-wood-200 text-wood-600 px-4 py-2 rounded-xl hover:bg-wood-100 transition-colors"><Download size={18} /> Backup</button><label className="flex items-center gap-2 bg-white border border-wood-200 text-wood-600 px-4 py-2 rounded-xl hover:bg-wood-100 transition-colors cursor-pointer"><Upload size={18} /> Ripristina<input type="file" onChange={handleImportData} accept=".json" className="hidden" /></label><button onClick={() => setView('MENU')} className="bg-wood-900 text-white px-4 py-2 rounded-xl hover:bg-wood-800 transition-colors">Esci</button></div>
        </div>

        {/* ... Cloud Sync & Settings Cards (Same as before) ... */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-8 shadow-sm">
           <div className="flex items-start gap-4"><div className="p-3 bg-blue-100 rounded-full text-blue-600"><Database size={24} /></div><div className="flex-1"><h3 className="text-xl font-bold text-blue-900 mb-2">Database Cloud (Supabase)</h3><p className="text-blue-700 text-sm mb-4">L'applicazione è collegata al database online. Le modifiche sono visibili a tutti i clienti in tempo reale.</p><button onClick={handleSyncInitialData} disabled={isSyncing} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50">{isSyncing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />} Sincronizza Menu Iniziale</button><p className="text-[10px] text-blue-400 mt-2 italic">* Usare solo per caricare i prodotti di base la prima volta o per ripristinare.</p></div></div>
        </div>

        {/* Product Form */}
        <div id="new-product-form" className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-accent-100 mb-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-accent-500"></div>
           <h3 className="text-2xl font-western text-wood-900 mb-6 flex items-center gap-2">{editingId ? <Pencil size={24} className="text-accent-500" /> : <Plus size={24} className="text-accent-500" />} {editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h3>
           <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Categoria</label><div className="relative"><select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as ProductCategory})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500">{CATEGORIES_LIST.concat([ProductCategory.AGGIUNTE]).map(cat => (<option key={cat} value={cat}>{tCategory(cat)}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={16} /></div></div>
                    {newItem.category === ProductCategory.HAMBURGER && (<div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Sotto-Categoria</label><div className="relative"><select value={newItem.subCategory} onChange={e => setNewItem({...newItem, subCategory: e.target.value})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500">{HAMBURGER_SUBCATEGORIES.map(sub => (<option key={sub} value={sub}>{sub}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={16} /></div></div>)}
                 </div>
                 <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Nome Prodotto</label><input type="text" required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 font-medium" placeholder="Es. Old West Burger" /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Prezzo (€)</label><input type="number" step="0.01" required value={newItem.price} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 font-mono" /></div>
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Brand (Opzionale)</label><input type="text" value={newItem.brand || ''} onChange={e => setNewItem({...newItem, brand: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500" placeholder="Es. Chianina" /></div>
                 </div>
                 
                 {/* Allergens Section */}
                 <div>
                    <label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-2">Allergeni</label>
                    <div className="flex flex-wrap gap-2 bg-wood-50 p-3 rounded-xl border border-wood-200">
                       {(Object.keys(ALLERGENS_CONFIG) as AllergenType[]).map(allergen => {
                          const isSelected = newItem.allergens?.includes(allergen);
                          return (
                             <button
                                type="button"
                                key={allergen}
                                onClick={() => {
                                   const current = newItem.allergens || [];
                                   const updated = isSelected ? current.filter(a => a !== allergen) : [...current, allergen];
                                   setNewItem({ ...newItem, allergens: updated });
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all ${isSelected ? 'bg-red-100 border-red-200 text-red-700' : 'bg-white border-wood-200 text-wood-500 hover:bg-wood-100'}`}
                             >
                                <AllergenIcon type={allergen} className="w-3 h-3" /> {allergen}
                             </button>
                          )
                       })}
                    </div>
                 </div>

                 {/* Tags */}
                 <div>
                    <label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-2">Etichette</label>
                    <div className="flex flex-wrap gap-2">{['Vegetariano', 'Vegano', 'Piccante', 'Best Seller', 'Consigliato', 'Senza Glutine'].map(tag => { const isActive = newItem.tags?.includes(tag); return (<button type="button" key={tag} onClick={() => { const currentTags = newItem.tags || []; const newTags = isActive ? currentTags.filter(t => t !== tag) : [...currentTags, tag]; setNewItem({...newItem, tags: newTags}); }} className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${isActive ? 'bg-accent-500 border-accent-500 text-white' : 'bg-white border-wood-200 text-wood-500 hover:border-accent-300'}`}>{tag}</button>); })}</div>
                 </div>
              </div>
              {/* ... Right Column (Image & Desc) ... */}
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Immagine</label>
                    <div className="flex items-start gap-4 p-4 bg-wood-50 border border-wood-200 rounded-xl border-dashed">
                       <div className="w-20 h-20 bg-white rounded-lg border border-wood-100 flex items-center justify-center overflow-hidden shrink-0 relative">
                          {isProcessingImage ? (<Loader2 className="animate-spin text-accent-500" />) : newItem.imageUrl ? (<><img src={newItem.imageUrl} alt="Preview" className="w-full h-full object-cover" /><button type="button" onClick={handleRemoveProductImage} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><Trash2 size={16} /></button></>) : (<ImageIcon className="text-wood-300" />)}
                       </div>
                       <div className="flex-1"><input type="text" value={newItem.imageUrl || ''} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="w-full bg-white border border-wood-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-accent-500" placeholder="URL Immagine o Carica ->" /><label className="inline-flex items-center gap-2 bg-white border border-wood-200 text-wood-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-wood-100 cursor-pointer transition-colors"><Upload size={12} /> Carica da Dispositivo<input type="file" onChange={handleProductImageUpload} accept="image/*" className="hidden" /></label></div>
                    </div>
                 </div>
                 <div className="bg-wood-50 rounded-xl p-4 border border-wood-200">
                    <div className="flex items-center justify-between mb-2"><label className="text-xs font-bold text-wood-500 uppercase tracking-wider flex items-center gap-2"><Globe size={12} /> Descrizione ({LANGUAGES_CONFIG.find(l => l.code === adminLang)?.label})</label><div className="flex bg-white rounded-lg p-0.5 border border-wood-200">{LANGUAGES_CONFIG.map(l => (<button type="button" key={l.code} onClick={() => setAdminLang(l.code as LanguageCode)} className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-colors ${adminLang === l.code ? 'bg-accent-500 text-white shadow-sm' : 'text-wood-400 hover:bg-wood-100'}`}>{l.flag}</button>))}</div></div>
                    {adminLang === 'it' ? (<textarea rows={3} value={newItem.description || ''} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full bg-white border border-wood-200 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-500 resize-none" placeholder="Descrizione in Italiano..." />) : (<div className="space-y-2"><input type="text" value={newItem.translations?.[adminLang]?.name || ''} onChange={e => { const newTranslations = { ...newItem.translations }; if (!newTranslations[adminLang]) newTranslations[adminLang] = { name: '', description: '' }; newTranslations[adminLang]!.name = e.target.value; setNewItem({ ...newItem, translations: newTranslations }); }} className="w-full bg-white border border-wood-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-500" placeholder={`Nome in ${LANGUAGES_CONFIG.find(l => l.code === adminLang)?.label}...`} /><textarea rows={2} value={newItem.translations?.[adminLang]?.description || ''} onChange={e => { const newTranslations = { ...newItem.translations }; if (!newTranslations[adminLang]) newTranslations[adminLang] = { name: '', description: '' }; newTranslations[adminLang]!.description = e.target.value; setNewItem({ ...newItem, translations: newTranslations }); }} className="w-full bg-white border border-wood-200 rounded-lg p-3 text-sm focus:outline-none focus:border-accent-500 resize-none" placeholder={`Descrizione in ${LANGUAGES_CONFIG.find(l => l.code === adminLang)?.label}...`} /></div>)}
                 </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-wood-100">
                 {editingId && (<button type="button" onClick={handleCancelEdit} className="px-6 py-3 rounded-xl font-bold text-wood-500 hover:bg-wood-100 transition-colors">Annulla</button>)}
                 <button type="submit" className="bg-accent-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-accent-600 transition-all transform hover:-translate-y-1 flex items-center gap-2"><Save size={18} /> {editingId ? 'Salva Modifiche' : 'Aggiungi Prodotto'}</button>
              </div>
           </form>
        </div>

        {/* Product List with Sorting */}
        <div>
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-2xl font-western text-wood-900">Prodotti nel Menu ({items.length})</h3>
             <div className="relative"><select value={activeCategory} onChange={e => handleCategoryClick(e.target.value)} className="appearance-none bg-white border border-wood-200 rounded-full px-4 py-2 pr-8 text-sm font-bold text-wood-600 focus:outline-none">{['Tutti', ...CATEGORIES_LIST, ProductCategory.AGGIUNTE].map(cat => (<option key={cat} value={cat}>{tCategory(cat)}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={14} /></div>
           </div>
           <div className="space-y-3">
              {displayItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-wood-100 shadow-sm flex items-center gap-4 group hover:border-accent-200 transition-colors">
                   <div className="w-12 h-12 bg-wood-50 rounded-lg overflow-hidden shrink-0">{item.imageUrl ? (<img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-wood-300"><UtensilsCrossed size={16} /></div>)}</div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><h4 className="font-bold text-wood-900 truncate">{item.name}</h4>{item.category === ProductCategory.HAMBURGER && item.subCategory && (<span className="text-[10px] bg-wood-100 text-wood-500 px-2 py-0.5 rounded-full whitespace-nowrap">{item.subCategory}</span>)}</div>
                      <p className="text-xs text-wood-400 truncate">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1"><span className="text-sm font-mono font-bold text-accent-600">€{item.price.toFixed(2)}</span><span className="text-[10px] text-wood-300 uppercase tracking-wider bg-wood-50 px-2 rounded-full">{tCategory(item.category)}</span></div>
                   </div>
                   <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditItem(item)} className="w-8 h-8 rounded-lg bg-wood-100 text-wood-600 flex items-center justify-center hover:bg-accent-500 hover:text-white transition-colors" title="Modifica"><Pencil size={14} /></button>
                      <button onClick={(e) => handleDeleteItem(item.id, e)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Elimina"><Trash2 size={14} /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )};

  return (
    <>
      {renderHeader()}
      {view === 'MENU' && renderMenu()}
      {view === 'LOGIN' && renderLogin()}
      {view === 'ADMIN' && renderAdmin()}

      <button onClick={scrollToTop} className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-accent-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-accent-600 hover:scale-110 ${showScrollTop && !isCartOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`} aria-label="Scroll to top"><ChevronUp size={24} /></button>
    </>
  );
}