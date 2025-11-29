import React, { useState, useEffect, useRef } from 'react';
import { 
  UtensilsCrossed, Pizza, Beef, Fish, Salad, Baby, Cookie, Beer, Settings, Plus, Minus, Trash2, LogOut, 
  ChevronLeft, ChevronRight, Lock, Utensils, Star, MapPin, Clock, Instagram, Facebook, Phone, LayoutGrid, 
  ArrowRight, Upload, Image as ImageIcon, Download, RotateCcw, Save, ChevronDown, ChevronUp, X, Loader2, 
  Pencil, RefreshCw, Wheat, CircleDot, Globe, Languages, Check, Leaf, Flame, Award, QrCode, Database, Sprout, ShoppingBag, 
  Milk, Egg, Nut, Bean, AlertCircle, Wine, Shell, Info, Search 
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
    const { error } = await supabase.storage.from('menu-images').upload(filePath, file);
    if (error) { console.error('Error uploading image:', error); return null; }
    const { data: publicUrlData } = supabase.storage.from('menu-images').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (error) { console.error('Error:', error); return null; }
};

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
    case ProductCategory.AGGIUNTE: return <Plus className={className} />;
    default: return <UtensilsCrossed className={className} />;
  }
};

const AllergenIcon = ({ type, className }: { type: AllergenType; className?: string }) => {
  const config = ALLERGENS_CONFIG[type];
  if (!config) return null;
  const IconComponent = { 'Wheat': Wheat, 'Shell': Shell, 'Egg': Egg, 'Fish': Fish, 'Nut': Nut, 'Bean': Bean, 'Milk': Milk, 'Leaf': Leaf, 'AlertCircle': AlertCircle, 'CircleDot': CircleDot, 'Wine': Wine, 'Info': Info }[config.iconName] || Info;
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
       <img src={logoUrl} alt="Old West Logo" className={`w-full h-full object-contain ${isLarge ? 'p-2' : 'p-1'}`} />
    </div>
  );
};

const LANGUAGES_CONFIG = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' }, 
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' }
] as const;

const t = (key: string, lang: LanguageCode): string => (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][lang]) ? UI_TRANSLATIONS[key][lang] : key;
const tCategory = (cat: string, lang: LanguageCode): string => {
  if (cat === 'Tutti') return UI_TRANSLATIONS['all'][lang];
  if (CATEGORY_TRANSLATIONS[cat as ProductCategory] && CATEGORY_TRANSLATIONS[cat as ProductCategory][lang]) return CATEGORY_TRANSLATIONS[cat as ProductCategory][lang];
  return cat;
};

const getDIYStepContent = (step: any, lang: LanguageCode) => { 
  if (lang === 'it') return { title: step.title, description: step.description }; 
  const trans = step.translations?.[lang]; 
  return { title: trans?.title || step.title, description: trans?.description || step.description }; 
};
const getDIYOptionContent = (opt: any, lang: LanguageCode) => { 
  if (lang === 'it') return opt.name; 
  return opt.translations?.[lang]?.name || opt.name; 
};

// --- MAIN COMPONENT ---

export default function App() {
  // 1. STATE DEFINITIONS
  const [items, setItems] = useState<MenuItem[]>([]);
  const [view, setView] = useState<ViewState>('MENU');
  const [activeCategory, setActiveCategory] = useState<string>('Tutti');
  const [activeSubCategoryView, setActiveSubCategoryView] = useState<string | null>(null);
  const [diyStep, setDiyStep] = useState(0);
  const [diySelections, setDiySelections] = useState<Record<number, any>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingCartItemIndex, setEditingCartItemIndex] = useState<number | null>(null);
  const [addonSearch, setAddonSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ vegetarian: false, vegan: false, spicy: false, bestseller: false });
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
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ category: ProductCategory.HAMBURGER, isAvailable: true, subCategory: HAMBURGER_SUBCATEGORIES[0], translations: {}, allergens: [] });
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const diyControlsRef = useRef<HTMLDivElement>(null); 
  const diyHeaderRef = useRef<HTMLDivElement>(null); // Ref per scrollare in alto nel DIY
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 2. EFFECTS
  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) throw error;
      if (data && data.length > 0) setItems(data); 
      else setItems([...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS]);
    } catch (error) { 
      console.error('Error fetching data:', error); 
      setItems([...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS]); 
    } finally { 
      setIsDataLoaded(true); 
    }
  };

  useEffect(() => { fetchItems(); const savedLogo = localStorage.getItem('oldWestLogoUrl'); if (savedLogo) setCustomLogo(savedLogo); }, []);
  useEffect(() => { const handleScroll = () => { if (window.scrollY > 300) setShowScrollTop(true); else setShowScrollTop(false); }; window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  
  // Nuovo Effect: Scrolla in alto quando cambia lo step DIY
  useEffect(() => {
    if (activeSubCategoryView === 'Hamburger "Fai da te"' && diyHeaderRef.current) {
      diyHeaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [diyStep]);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // 3. LOGIC HANDLERS
  const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => { if (!ref.current) return; setIsDragging(true); setStartX(e.pageX - ref.current.offsetLeft); setScrollLeft(ref.current.scrollLeft); };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => { if (!isDragging || !ref.current) return; e.preventDefault(); const x = e.pageX - ref.current.offsetLeft; const walk = (x - startX) * 2; ref.current.scrollLeft = scrollLeft - walk; };
  const scrollCarousel = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => { if (ref.current) { const scrollAmount = 300; ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' }); } };
  
  const getProductContent = (item: MenuItem | Partial<MenuItem>) => { if (lang === 'it') return { name: item.name || '', description: item.description || '' }; const trans = item.translations?.[lang]; return { name: trans?.name || item.name || '', description: trans?.description || item.description || '' }; };

  const checkFilters = (item: MenuItem) => {
    if (activeFilters.vegetarian) { const isVeg = item.tags?.includes('Vegetariano') || item.tags?.includes('Vegano') || item.category === ProductCategory.CONTORNI || (item.category === ProductCategory.PIZZA && (item.name === 'Vegetariana' || item.name === 'Margherita' || item.name === 'Marinara' || item.name === 'Verdure')); if (!isVeg) return false; }
    if (activeFilters.vegan) { const isVegan = item.tags?.includes('Vegano') || (item.category === ProductCategory.CONTORNI && item.name !== 'Patatine Fritte') || (item.category === ProductCategory.PIZZA && item.name === 'Marinara'); if (!isVegan) return false; }
    if (activeFilters.spicy) { 
        const nameLower = item.name.toLowerCase();
        if (nameLower.includes('salamella') && !item.tags?.includes('Piccante')) return false;
        const isSpicy = item.tags?.includes('Piccante') || item.description.toLowerCase().includes('piccante') || item.description.toLowerCase().includes('nduja'); 
        if (!isSpicy) return false; 
    }
    if (activeFilters.bestseller) { const isBest = item.tags?.includes('Best Seller') || item.tags?.includes('Consigliato'); if (!isBest) return false; }
    return true;
  };

  const handleCategoryClick = (cat: string) => { setActiveCategory(cat); setActiveSubCategoryView(null); if (view === 'MENU') { const listStart = 300; if (window.scrollY > listStart) window.scrollTo({ top: listStart, behavior: 'smooth' }); } };
  useEffect(() => { const activeBtn = document.getElementById(`btn-${activeCategory}`); if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeCategory]);
  
  const addToCart = (item: MenuItem, variant?: ProductVariant) => {
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1000);
    const existingItemIndex = cart.findIndex((i) => i.id === item.id && (variant ? i.selectedVariant?.name === variant.name : !i.selectedVariant) && (!i.selectedAddons || i.selectedAddons.length === 0));
    if (existingItemIndex > -1) { const newCart = [...cart]; newCart[existingItemIndex].quantity += 1; setCart(newCart); } else { setCart([...cart, { ...item, cartId: Math.random().toString(), quantity: 1, selectedVariant: variant }]); }
  };
  
  const removeFromCart = (cartId: string) => setCart(cart.filter(i => i.cartId !== cartId));
  const updateCartItemQuantity = (cartId: string, delta: number) => { setCart(cart.map(item => { if (item.cartId === cartId) { const newQty = item.quantity + delta; return newQty > 0 ? { ...item, quantity: newQty } : item; } return item; })); };
  const openAddonModal = (index: number) => { setEditingCartItemIndex(index); setAddonSearch(''); setIsAddonModalOpen(true); };
  const addAddonToItem = (addon: MenuItem) => { if (editingCartItemIndex === null) return; const newCart = [...cart]; const currentAddons = newCart[editingCartItemIndex].selectedAddons || []; newCart[editingCartItemIndex].selectedAddons = [...currentAddons, addon]; setCart(newCart); setIsAddonModalOpen(false); setEditingCartItemIndex(null); };
  const getCartTotal = () => { const subtotal = cart.reduce((sum, item) => { const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price; const addonsPrice = item.selectedAddons?.reduce((aSum, addon) => aSum + addon.price, 0) || 0; return sum + (itemPrice + addonsPrice) * item.quantity; }, 0); return subtotal + (cart.length > 0 ? 2.00 : 0); };

  const handleDiySelection = (stepId: number, option: any) => { 
    setDiySelections(prev => ({ ...prev, [stepId]: option }));
    setTimeout(() => {
      diyControlsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };
  
  const handleDiyNext = () => {
     if (diyStep < DIY_OPTIONS.steps.length - 1) {
       setDiyStep(diyStep + 1);
       // Scroll to top gestito dallo useEffect
     } else {
       const totalPrice = DIY_OPTIONS.basePrice + DIY_OPTIONS.steps.reduce((acc, step) => { const selected = diySelections[step.id]; return acc + (selected ? selected.price : 0); }, 0);
       const description = DIY_OPTIONS.steps.map(step => { const selected = diySelections[step.id]; return selected ? `${getDIYOptionContent(selected, lang)}` : ''; }).filter(Boolean).join(' + ');
       const diyItem: MenuItem = { id: `diy-${Date.now()}`, name: t('create_your_taste', lang), description: description, price: totalPrice, category: ProductCategory.HAMBURGER, isAvailable: true, imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/hamburger-fai-da-te.jpg' };
       addToCart(diyItem); setDiySelections({}); setDiyStep(0); setActiveSubCategoryView(null);
     }
  };

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (adminPassword === '1234') { setView('ADMIN'); setAdminPassword(''); setLoginError(''); setActiveCategory('Tutti'); setLang('it'); } else { setLoginError('PIN non valido'); } };
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newItem.name || !newItem.price) return;
    const itemToSave = { name: newItem.name, description: newItem.description, price: Number(newItem.price), category: newItem.category, subCategory: newItem.category === ProductCategory.HAMBURGER ? newItem.subCategory : undefined, imageUrl: newItem.imageUrl, isAvailable: newItem.isAvailable !== undefined ? newItem.isAvailable : true, tags: newItem.tags || [], brand: newItem.brand || null, variants: newItem.variants || null, translations: newItem.translations || null, allergens: newItem.allergens || [] };
    try { if (editingId) { await supabase.from('menu_items').update(itemToSave).eq('id', editingId); alert('Prodotto modificato!'); } else { await supabase.from('menu_items').insert([itemToSave]); alert('Prodotto aggiunto!'); } fetchItems(); setEditingId(null); setNewItem({ category: ProductCategory.HAMBURGER, subCategory: HAMBURGER_SUBCATEGORIES[0], isAvailable: true, name: '', description: '', price: 0, imageUrl: '', translations: {}, brand: undefined, variants: undefined, allergens: [] }); setAdminLang('it'); } catch (error) { console.error(error); alert('Errore database.'); }
  };
  const handleEditItem = (item: MenuItem) => { setNewItem({ ...item }); setEditingId(item.id); setAdminLang('it'); document.getElementById('new-product-form')?.scrollIntoView({ behavior: 'smooth' }); };
  const handleCancelEdit = () => { setEditingId(null); setNewItem({ category: ProductCategory.HAMBURGER, subCategory: HAMBURGER_SUBCATEGORIES[0], isAvailable: true, name: '', description: '', price: 0, imageUrl: '', translations: {}, brand: undefined, variants: undefined, allergens: [] }); setAdminLang('it'); };
  const handleDeleteItem = async (id: string, e?: React.MouseEvent) => { if (e) { e.preventDefault(); e.stopPropagation(); } if (window.confirm('Eliminare?')) { try { await supabase.from('menu_items').delete().eq('id', id); fetchItems(); if (editingId === id) handleCancelEdit(); } catch (error) { console.error(error); alert('Errore eliminazione.'); } } };
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { setIsProcessingImage(true); try { const url = await uploadImageToSupabase(file); if(url) setCustomLogo(url); } catch(e){alert('Errore upload');} finally{setIsProcessingImage(false);} } };
  const handleSaveLogo = () => { if(customLogo) { localStorage.setItem('oldWestLogoUrl', customLogo); alert('Logo salvato!'); } };
  const handleResetLogo = () => { if(window.confirm('Reset logo?')) { setCustomLogo(''); localStorage.removeItem('oldWestLogoUrl'); } };
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { setIsProcessingImage(true); try { const url = await uploadImageToSupabase(file); if(url) setNewItem({...newItem, imageUrl: url}); } catch(e){alert('Errore upload');} finally{setIsProcessingImage(false);} } };
  const handleRemoveProductImage = () => setNewItem({...newItem, imageUrl: ''});
  const handleSyncInitialData = async () => { if (window.confirm("Sovrascrivere database con dati iniziali?")) { setIsSyncing(true); try { const itemsToSync = [...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS].map(i => ({ name: i.name, description: i.description, price: i.price, category: i.category, "subCategory": i.subCategory||null, "imageUrl": i.imageUrl||null, brand: i.brand||null, "isAvailable": true, tags: i.tags||[], variants: i.variants||null, translations: i.translations||null, allergens: i.allergens||[] })); const { error } = await supabase.from('menu_items').insert(itemsToSync); if (error) throw error; alert("Sincronizzato!"); fetchItems(); } catch (e: any) { alert("Errore sync: " + e.message); } finally { setIsSyncing(false); } } };
  const handleExportData = () => { const dataStr = JSON.stringify(items, null, 2); const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr); const link = document.createElement('a'); link.setAttribute('href', dataUri); link.setAttribute('download', `backup_${new Date().toISOString().slice(0,10)}.json`); link.click(); };
  const handleImportData = () => alert("Import locale disabilitato. Usa sync cloud.");
  const handleFactoryReset = () => alert("Reset locale disabilitato. Gestisci da DB.");

  // --- RENDER FUNCTIONS ---

  const renderHeader = () => (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${view === 'MENU' ? 'bg-wood-900/95 backdrop-blur-md border-b border-wood-800' : 'bg-wood-900 shadow-md'}`}>
      <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setView('MENU')}>
           <div className="transform group-hover:rotate-12 transition-transform duration-300"><WesternLogo size="md" url={customLogo} /></div>
           <div className="flex flex-col"><span className="font-western text-xl text-white tracking-wide leading-none">OLD WEST</span><span className="text-[10px] uppercase tracking-[0.2em] text-accent-500 font-bold">Cameri</span></div>
        </div>
        {view === 'MENU' ? (
          <div className="flex items-center gap-4">
             <div className="relative">
                {isLangMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)}></div>}
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-2 bg-wood-800 hover:bg-wood-700 transition-colors pl-3 pr-2 py-1.5 rounded-xl border border-wood-700 text-white"><span className="text-xl leading-none">{LANGUAGES_CONFIG.find(l => l.code === lang)?.flag}</span><ChevronDown size={14} className={`text-wood-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} /></button>
                {isLangMenuOpen && (<div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-wood-100 overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200">{LANGUAGES_CONFIG.map((l) => (<button key={l.code} onClick={() => { setLang(l.code as LanguageCode); setIsLangMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 hover:bg-wood-50 transition-colors text-left ${lang === l.code ? 'bg-accent-50 text-accent-700' : 'text-wood-700'}`}><div className="flex items-center gap-3"><span className="text-2xl leading-none shadow-sm rounded-sm">{l.flag}</span><span className="text-sm font-bold">{l.label}</span></div>{lang === l.code && <Check size={16} />}</button>))}</div>)}
             </div>
             <button onClick={() => setView('LOGIN')} className="w-10 h-10 rounded-full flex items-center justify-center text-wood-400 hover:text-white hover:bg-wood-800 transition-all"><Settings size={20} /></button>
          </div>
        ) : (<button onClick={() => { setView('MENU'); setActiveCategory('Tutti'); window.scrollTo(0,0); }} className="flex items-center gap-2 bg-wood-800 text-white px-5 py-2 rounded-full hover:bg-accent-600 transition-colors text-sm font-medium"><LogOut size={16} /> <span className="hidden md:inline">{t('back_to_menu', lang)}</span></button>)}
      </div>
    </nav>
  );

  const renderFloatingCartBar = () => {
     if (cart.length === 0 || isCartOpen) return null;
     const itemCount = cart.reduce((a, b) => a + b.quantity, 0);
     const total = getCartTotal();

     return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom-20 duration-300">
           <button onClick={() => setIsCartOpen(true)} className="w-full bg-wood-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-wood-700 hover:bg-wood-800 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="bg-accent-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">{itemCount}</div>
                 <span className="font-bold text-sm text-wood-100">{t('items', lang)}</span>
              </div>
              <span className="font-bold text-lg font-mono">€{total.toFixed(2)}</span>
           </button>
        </div>
     );
  };

  const renderCartDrawer = () => {
      const addons = items.filter(i => i.category === ProductCategory.AGGIUNTE);
      const filteredAddons = addons.filter(a => a.name.toLowerCase().includes(addonSearch.toLowerCase()));
      return (
      <>
        {isCartOpen && <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />}
        <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl transform transition-transform duration-300 z-50 max-h-[90vh] flex flex-col ${isCartOpen ? 'translate-y-0' : 'translate-y-full'}`}>
           <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-2xl font-western text-wood-900 flex items-center gap-2"><ShoppingBag size={24} /> {t('my_order', lang)}</h3>
                 <button onClick={() => setIsCartOpen(false)} className="p-2 bg-wood-100 rounded-full hover:bg-wood-200 transition-colors"><X size={20}/></button>
              </div>
              
              {cart.length === 0 ? (<div className="text-center py-10 text-wood-400">{t('empty_cart', lang)}</div>) : (
                 <div className="space-y-6">
                    {cart.map((item, index) => (
                       <div key={item.cartId} className="flex justify-between items-start border-b border-wood-100 pb-6">
                          <div className="flex-1 pr-4">
                             <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-wood-900 text-lg">{item.quantity}x {item.name}</span>
                             </div>
                             {item.selectedVariant && <span className="text-xs bg-wood-100 px-2 py-0.5 rounded text-wood-600 block w-fit mb-1">{item.selectedVariant.name}</span>}
                             
                             {item.id.startsWith('diy-') && (<p className="text-xs italic text-wood-500 mb-2 leading-relaxed">{item.description}</p>)}

                             {item.selectedAddons && item.selectedAddons.length > 0 && (
                                <div className="text-sm text-wood-500 mt-1 space-y-0.5">
                                   {item.selectedAddons.map((add, i) => (
                                      <div key={i} className="flex items-center gap-1 text-accent-600 font-medium"><Plus size={10} /> {add.name} (+€{add.price.toFixed(2)})</div>
                                   ))}
                                </div>
                             )}
                             
                             <button onClick={() => openAddonModal(index)} className="text-xs font-bold text-wood-400 mt-3 flex items-center gap-1 hover:text-accent-600 transition-colors border border-wood-200 rounded-lg px-3 py-1.5 w-fit">
                                <Plus size={12}/> {t('add_ingredient', lang)}
                             </button>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                             <span className="font-mono font-bold text-lg">€{((item.selectedVariant ? item.selectedVariant.price : item.price) * item.quantity + (item.selectedAddons?.reduce((s, a) => s + a.price, 0) || 0) * item.quantity).toFixed(2)}</span>
                             <div className="flex items-center gap-3 bg-wood-50 rounded-xl p-1 shadow-inner">
                                <button onClick={() => { if(item.quantity > 1) updateCartItemQuantity(item.cartId, -1); else removeFromCart(item.cartId); }} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-wood-600 hover:text-red-500"><Minus size={14}/></button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateCartItemQuantity(item.cartId, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-wood-600 hover:text-green-500"><Plus size={14}/></button>
                             </div>
                          </div>
                       </div>
                    ))}
                    
                    <div className="flex justify-between items-center py-2 px-3 bg-wood-50 rounded-xl border border-wood-100">
                       <span className="text-sm font-bold text-wood-500 uppercase tracking-wider">{t('cover_charge', lang)}</span>
                       <span className="font-mono font-bold text-wood-900">€2.00</span>
                    </div>
                 </div>
              )}
           </div>
           
           <div className="p-6 border-t border-wood-100 bg-wood-50 pb-8">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-xl font-bold text-wood-900">{t('total', lang)}</span>
                 <span className="text-4xl font-western text-accent-600">€{getCartTotal().toFixed(2)}</span>
              </div>
              <button className="w-full bg-wood-900 text-white py-4 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 hover:bg-accent-600 transition-colors">
                 <Utensils size={24} /> {t('order_table', lang)}
              </button>
           </div>
        </div>

        {isAddonModalOpen && (
           <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-end md:justify-center p-0 md:p-4">
              <div className="bg-white w-full md:max-w-md h-[80vh] md:h-auto md:rounded-3xl rounded-t-3xl p-6 flex flex-col animate-in slide-in-from-bottom-20 duration-300">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-xl text-wood-900">{t('add_ingredient', lang)}</h4>
                    <button onClick={() => setIsAddonModalOpen(false)} className="p-2 bg-wood-50 rounded-full"><X/></button>
                 </div>
                 
                 <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wood-400" size={18}/>
                    <input 
                       type="text" 
                       placeholder={t('search_addon', lang)} 
                       value={addonSearch} 
                       onChange={(e) => setAddonSearch(e.target.value)} 
                       className="w-full bg-wood-50 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-accent-500 border border-wood-100"
                       autoFocus 
                    />
                 </div>
                 
                 <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredAddons.map(addon => (
                       <button key={addon.id} onClick={() => addAddonToItem(addon)} className="w-full flex justify-between items-center p-4 hover:bg-accent-50 hover:border-accent-200 border border-transparent rounded-xl transition-all text-left group">
                          <span className="font-medium text-wood-800 group-hover:text-accent-700">{addon.name}</span>
                          <span className="font-bold text-accent-600 bg-accent-50 px-2 py-1 rounded group-hover:bg-white">+€{addon.price.toFixed(2)}</span>
                       </button>
                    ))}
                    {filteredAddons.length === 0 && (
                       <div className="text-center py-8 text-wood-400">Nessun ingrediente trovato.</div>
                    )}
                 </div>
              </div>
           </div>
        )}
      </>
      );
  };

  const renderLogin = () => (
    <div className="min-h-screen bg-wood-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-wood-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-accent-500"></div>
        <div className="flex flex-col items-center text-center mb-8">
          <WesternLogo size="lg" url={customLogo} className="mb-4" />
          <h2 className="text-3xl font-western text-wood-900">{t('admin_area', lang)}</h2>
          <p className="text-wood-500 mt-2">{t('login_prompt', lang)}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-400" size={20} />
            <input 
              type="password" 
              value={adminPassword} 
              onChange={(e) => setAdminPassword(e.target.value)} 
              placeholder="PIN (1234)" 
              className="w-full bg-wood-50 text-center font-mono text-2xl tracking-widest py-4 rounded-xl border-2 border-wood-100 focus:outline-none focus:border-accent-500 focus:bg-white transition-all text-wood-900"
              autoFocus
            />
          </div>
          {loginError && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-pulse">
              <AlertCircle size={16} /> {loginError}
            </div>
          )}
          <button type="submit" className="w-full bg-accent-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accent-600 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {t('login_btn', lang)}
          </button>
        </form>
        <button onClick={() => setView('MENU')} className="w-full mt-4 py-3 text-wood-400 font-bold hover:text-wood-600 transition-colors">
          {t('back_to_menu', lang)}
        </button>
      </div>
    </div>
  );

  const renderDIY = () => {
    const currentStepConfig = DIY_OPTIONS.steps[diyStep];
    const { title, description } = getDIYStepContent(currentStepConfig, lang);

    return (
      <div className="container mx-auto px-4 py-8 pb-32" ref={diyHeaderRef}>
        <div className="bg-white rounded-3xl border border-wood-100 shadow-xl overflow-hidden">
          <div className="bg-wood-900 p-6 text-white text-center relative overflow-hidden">
             {/* Exit Button - Mobile optimized top-left */}
             <button 
                onClick={() => setActiveSubCategoryView(null)} 
                className="absolute top-4 left-4 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
             >
                <X size={24} />
             </button>

             <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000')" }}></div>
             <div className="relative z-10 pt-4">
                <h2 className="text-3xl font-western mb-2">{t('diy_title', lang)}</h2>
                <p className="text-wood-300">{t('diy_subtitle', lang)}</p>
                <div className="flex justify-center gap-2 mt-4">
                  {DIY_OPTIONS.steps.map((s, idx) => (
                    <div key={s.id} className={`h-1.5 rounded-full transition-all duration-500 ${idx <= diyStep ? 'w-8 bg-accent-500' : 'w-4 bg-wood-700'}`}></div>
                  ))}
                </div>
             </div>
          </div>

          <div className="p-6 md:p-8">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <span className="text-accent-600 font-bold tracking-widest text-xs uppercase mb-1 block">Step {diyStep + 1}/{DIY_OPTIONS.steps.length}</span>
                   <h3 className="text-2xl font-bold text-wood-900">{title}</h3>
                   <p className="text-wood-500">{description}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStepConfig.options.map((option: any) => {
                   const isSelected = diySelections[currentStepConfig.id]?.name === option.name;
                   return (
                     <button 
                       key={option.name}
                       onClick={() => handleDiySelection(currentStepConfig.id, option)}
                       className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${isSelected ? 'border-accent-500 bg-accent-50 shadow-lg scale-[1.02]' : 'border-wood-100 bg-wood-50 hover:border-accent-300 hover:bg-white'}`}
                     >
                        <div className="flex justify-between items-center mb-1">
                           <span className={`font-bold text-lg ${isSelected ? 'text-accent-700' : 'text-wood-800'}`}>{getDIYOptionContent(option, lang)}</span>
                           {option.price > 0 && <span className="font-mono font-bold text-wood-900">+€{option.price.toFixed(2)}</span>}
                        </div>
                        {isSelected && <div className="absolute top-4 right-4 text-accent-500"><Check size={20} /></div>}
                     </button>
                   );
                })}
             </div>

             <div className="flex justify-between items-center mt-10 pt-6 border-t border-wood-100" ref={diyControlsRef}>
                <button onClick={() => { if (diyStep > 0) setDiyStep(diyStep - 1); else setActiveSubCategoryView(null); }} className="text-wood-500 font-bold hover:text-wood-800 transition-colors flex items-center gap-2 px-4 py-2"><ChevronLeft size={20} /> {t('back', lang)}</button>
                <button onClick={handleDiyNext} disabled={!diySelections[currentStepConfig.id]} className="bg-wood-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-accent-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95">{diyStep === DIY_OPTIONS.steps.length - 1 ? (<>{t('add_to_cart', lang)} <Plus size={20} /></>) : (<>{t('add', lang)} <ArrowRight size={20} /></>)}</button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMenu = () => {
    if (activeCategory === ProductCategory.HAMBURGER && activeSubCategoryView === 'Hamburger "Fai da te"') { return renderDIY(); }

    const filteredItems = items.filter(item => {
      if (item.category === ProductCategory.AGGIUNTE) return false;
      if (activeCategory !== 'Tutti' && item.category !== activeCategory) return false;
      if (activeCategory === ProductCategory.HAMBURGER && activeSubCategoryView && item.subCategory !== activeSubCategoryView) return false;
      return checkFilters(item);
    });

    const highlightedItems = items.filter(i => (i.tags?.includes('Best Seller') || i.tags?.includes('Consigliato')) && i.category !== ProductCategory.AGGIUNTE);

    return (
      <div className="min-h-screen bg-wood-50 pb-40">
        {/* HERO */}
        <div className="relative h-96 bg-wood-900 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://oldwest.click/wp-content/uploads/2018/07/background1.jpg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-wood-900 via-transparent to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white pb-10 px-4 pt-16">
            <h1 className="text-4xl md:text-7xl font-western mb-4 shadow-sm drop-shadow-md tracking-wide pt-10">{t('hero_title', lang)}</h1>
            <div className="flex flex-col items-center gap-2 text-wood-200 text-base md:text-xl font-medium">
               <p className="flex items-center gap-2"><MapPin size={20} className="text-accent-500" /> Via G. Galilei 35 - Cameri (NO)</p>
               <p className="flex items-center gap-2 text-sm md:text-base opacity-80"><Clock size={16} /> 11:00 - 15:00 | 17:00 - 00:00</p>
            </div>
          </div>
        </div>

        {/* STICKY NAV */}
        <div className="sticky top-16 md:top-20 z-40 bg-wood-50/95 backdrop-blur-sm border-b border-wood-200 shadow-sm">
          <div className="container mx-auto px-4 py-4">
             {/* Carousel */}
             <div className="relative group">
                <button onClick={() => scrollCarousel('left', carouselRef)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center text-wood-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"><ChevronLeft size={18} /></button>
                <div ref={carouselRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 pt-1 px-1 cursor-grab active:cursor-grabbing" onMouseDown={(e) => handleMouseDown(e, carouselRef)} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={(e) => handleMouseMove(e, carouselRef)}>
                  <button id="btn-Tutti" onClick={() => handleCategoryClick('Tutti')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm shadow-sm select-none ${activeCategory === 'Tutti' ? 'bg-wood-900 text-white scale-105 ring-2 ring-wood-900 ring-offset-2' : 'bg-white text-wood-600 border border-wood-200 hover:border-wood-400'}`}><LayoutGrid size={16} /> {tCategory('Tutti', lang)}</button>
                  {CATEGORIES_LIST.map(cat => (<button key={cat} id={`btn-${cat}`} onClick={() => handleCategoryClick(cat)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm shadow-sm select-none ${activeCategory === cat ? 'bg-accent-500 text-white scale-105 ring-2 ring-accent-500 ring-offset-2' : 'bg-white text-wood-600 border border-wood-200 hover:border-accent-300 hover:text-accent-600'}`}><CategoryIcon category={cat} className="w-4 h-4" /> {tCategory(cat, lang)}</button>))}
                </div>
                <button onClick={() => scrollCarousel('right', carouselRef)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center text-wood-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"><ChevronRight size={18} /></button>
             </div>

             {/* Subcategories & Filters */}
             <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {activeCategory === ProductCategory.HAMBURGER && (<div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"><button onClick={() => setActiveSubCategoryView(null)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeSubCategoryView === null ? 'bg-wood-800 text-white' : 'bg-wood-200 text-wood-600 hover:bg-wood-300'}`}>{t('all', lang)}</button>{HAMBURGER_SUBCATEGORIES.map(sub => (<button key={sub} onClick={() => setActiveSubCategoryView(sub)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeSubCategoryView === sub ? 'bg-wood-800 text-white' : 'bg-wood-200 text-wood-600 hover:bg-wood-300'}`}>{sub}</button>))}</div>)}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide ml-auto">
                   <button onClick={() => setActiveFilters({...activeFilters, vegetarian: !activeFilters.vegetarian})} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${activeFilters.vegetarian ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-wood-200 text-wood-500 hover:border-wood-400'}`}><Leaf size={12} /> {t('filter_veg', lang)}</button>
                   <button onClick={() => setActiveFilters({...activeFilters, vegan: !activeFilters.vegan})} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${activeFilters.vegan ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-wood-200 text-wood-500 hover:border-wood-400'}`}><Sprout size={12} /> {t('filter_vegan', lang)}</button>
                   <button onClick={() => setActiveFilters({...activeFilters, spicy: !activeFilters.spicy})} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${activeFilters.spicy ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white border-wood-200 text-wood-500 hover:border-wood-400'}`}><Flame size={12} /> {t('filter_spicy', lang)}</button>
                </div>
             </div>
          </div>
        </div>

        {/* BANNER PROMO */}
        <div className="container mx-auto px-4 mt-6">
           <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-3 rounded-xl shadow-md text-center text-sm font-bold tracking-wide">
              ✨ Aggiunta ingredienti da € 1,00 a € 6,00 ✨
           </div>
        </div>

        {/* HIGHLIGHTS SECTION (IN EVIDENZA) */}
        {activeCategory === 'Tutti' && highlightedItems.length > 0 && (
          <div className="container mx-auto px-4 mt-8 mb-4">
            <h3 className="text-xl font-bold text-wood-900 mb-4 flex items-center gap-2">
              <Star size={20} className="text-accent-500" fill="currentColor" /> In Evidenza
            </h3>
            <div className="relative group/hl">
                <button onClick={() => scrollCarousel('left', highlightsRef)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center text-wood-600 opacity-0 group-hover/hl:opacity-100 transition-opacity disabled:opacity-0"><ChevronLeft size={18} /></button>
                <div ref={highlightsRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x px-1" onMouseDown={(e) => handleMouseDown(e, highlightsRef)} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={(e) => handleMouseMove(e, highlightsRef)}>
                  {highlightedItems.map(item => {
                     const { name } = getProductContent(item);
                     return (
                       <div key={item.id} className="snap-center shrink-0 w-48 bg-white rounded-2xl border border-wood-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col" onClick={() => { setActiveCategory(item.category); document.getElementById(`btn-${item.category}`)?.click(); }}>
                          <div className="h-32 bg-wood-50 relative">
                             {item.imageUrl ? (<img src={item.imageUrl} alt={name} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-wood-300"><UtensilsCrossed size={16} /></div>)}
                             <span className="absolute top-2 left-2 bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">{item.tags?.includes('Best Seller') ? 'BEST' : 'TOP'}</span>
                          </div>
                          <div className="p-3 flex flex-col flex-1">
                             <h4 className="font-bold text-sm text-wood-900 line-clamp-2 mb-1">{name}</h4>
                             <div className="mt-auto flex justify-between items-center">
                                <span className="font-mono font-bold text-accent-600 text-sm">€{item.price.toFixed(2)}</span>
                                <div className="bg-wood-50 p-1 rounded-full text-wood-400"><Plus size={12} /></div>
                             </div>
                          </div>
                       </div>
                     )
                  })}
                </div>
                <button onClick={() => scrollCarousel('right', highlightsRef)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center text-wood-600 opacity-0 group-hover/hl:opacity-100 transition-opacity disabled:opacity-0"><ChevronRight size={18} /></button>
            </div>
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="container mx-auto px-4 py-8">
           {activeCategory === 'Tutti' ? (
             // VISTA CATEGORIE (HOME)
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {CATEGORIES_LIST.map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => handleCategoryClick(cat)}
                     className="bg-white border-2 border-wood-100 hover:border-accent-500 rounded-3xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-xl transition-all group aspect-square"
                   >
                      <div className="w-14 h-14 bg-wood-50 rounded-full flex items-center justify-center text-wood-400 group-hover:bg-accent-50 group-hover:text-accent-500 transition-colors">
                         <CategoryIcon category={cat} className="w-7 h-7" />
                      </div>
                      <span className="font-western text-sm md:text-xl text-wood-900 text-center leading-tight">{tCategory(cat, lang)}</span>
                   </button>
                ))}
             </div>
           ) : (
             // VISTA PRODOTTI
             <>
               {filteredItems.length === 0 ? (
                 <div className="text-center py-20"><div className="inline-block p-6 bg-wood-100 rounded-full mb-4"><UtensilsCrossed size={40} className="text-wood-400" /></div><h3 className="text-xl font-bold text-wood-600">{t('no_products_section', lang)}</h3><p className="text-wood-400 mt-2">{t('select_category', lang)}</p></div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredItems.map(item => {
                     const { name, description } = getProductContent(item);
                     const isAdded = addedItemId === item.id;
                     return (
                       <div key={item.id} className="bg-white rounded-3xl border border-wood-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                         {/* Image */}
                         <div className="relative h-56 bg-wood-50 overflow-hidden">
                           {item.imageUrl ? (<img src={item.imageUrl} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />) : (<div className="w-full h-full flex items-center justify-center bg-wood-100"><WesternLogo size="lg" className="opacity-50 grayscale" /></div>)}
                           {item.tags && item.tags.length > 0 && (<div className="absolute top-4 left-4 flex flex-col gap-1">{item.tags.map(tag => (<span key={tag} className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm ${tag === 'Piccante' ? 'bg-red-500 text-white' : tag === 'Vegetariano' || tag === 'Vegano' ? 'bg-green-500 text-white' : 'bg-accent-500 text-white'}`}>{tag}</span>))}</div>)}
                           <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-sm border border-wood-100 flex items-center gap-1"><span className="text-xs font-bold text-wood-500">€</span><span className="text-xl font-western text-wood-900">{item.price.toFixed(2)}</span></div>
                         </div>
                         {/* Content */}
                         <div className="p-6 flex-1 flex flex-col">
                           <div className="flex justify-between items-start mb-2"><h3 className="text-xl font-bold text-wood-900 leading-tight">{name}</h3>{item.category === ProductCategory.HAMBURGER && item.subCategory && <span className="text-[10px] font-bold text-wood-400 bg-wood-50 px-2 py-1 rounded-md whitespace-nowrap">{item.subCategory}</span>}</div>
                           
                           <div className="flex-1 mb-4">
                              <p className="text-sm text-wood-500 line-clamp-3">{description}</p>
                              {/* Asterisco Info */}
                              {description.includes('*') && (
                                 <p className="text-[10px] text-wood-400 italic mt-1">* Prodotto surgelato</p>
                              )}
                           </div>
                           
                           {/* Allergeni Icons */}
                           {item.allergens && item.allergens.length > 0 && (
                             <div className="flex flex-wrap gap-1 mb-4 border-t border-wood-100 pt-2">
                               {item.allergens.map(a => (
                                 <div key={a} className="group/allergen relative p-1">
                                   <AllergenIcon type={a} className="w-4 h-4 text-wood-400" />
                                   <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-wood-800 text-white text-[10px] rounded opacity-0 group-hover/allergen:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">{a}</span>
                                 </div>
                               ))}
                             </div>
                           )}
                           {/* Action */}
                           <button onClick={() => addToCart(item)} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${isAdded ? 'bg-green-500 text-white scale-95' : 'bg-wood-900 text-white hover:bg-accent-600 shadow-wood-200'}`}>{isAdded ? <Check size={18} /> : <Plus size={18} />} {t('add_to_cart', lang)}</button>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
             </>
           )}
        </div>

        {/* FOOTER */}
        <div className="bg-wood-900 text-wood-300 py-12 border-t border-wood-800">
           <div className="container mx-auto px-4 text-center">
              <WesternLogo size="lg" className="mx-auto mb-6 opacity-80" />
              <div className="flex flex-col gap-2 items-center mb-6 font-bold text-white">
                 <div className="flex items-center gap-2"><Phone size={16} className="text-accent-500" /> 0321 510220</div>
                 <div className="flex items-center gap-2"><MapPin size={16} className="text-accent-500" /> Via G. Galilei 35 - Cameri (NO)</div>
              </div>
              <p className="text-xs opacity-50">&copy; {new Date().getFullYear()} Old West. {t('rights_reserved', lang)}</p>
           </div>
        </div>
      </div>
    );
  };

  const renderAdmin = () => {
    // Ordinamento alfabetico nel pannello admin
    const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
    const displayItems = activeCategory === 'Tutti' ? sortedItems : sortedItems.filter(i => i.category === activeCategory);

    return (
    <div className="min-h-screen bg-wood-50 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div><h1 className="text-3xl font-western text-wood-900">{t('admin_area', lang)}</h1><p className="text-wood-500">Gestione Menu & Impostazioni</p></div>
          <div className="flex gap-3"><button onClick={handleExportData} className="flex items-center gap-2 bg-white border border-wood-200 text-wood-600 px-4 py-2 rounded-xl hover:bg-wood-100 transition-colors"><Download size={18} /> Backup</button><label className="flex items-center gap-2 bg-white border border-wood-200 text-wood-600 px-4 py-2 rounded-xl hover:bg-wood-100 transition-colors cursor-pointer"><Upload size={18} /> Ripristina<input type="file" onChange={handleImportData} accept=".json" className="hidden" /></label><button onClick={() => setView('MENU')} className="bg-wood-900 text-white px-4 py-2 rounded-xl hover:bg-wood-800 transition-colors">Esci</button></div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-8 shadow-sm">
           <div className="flex items-start gap-4"><div className="p-3 bg-blue-100 rounded-full text-blue-600"><Database size={24} /></div><div className="flex-1"><h3 className="text-xl font-bold text-blue-900 mb-2">Database Cloud (Supabase)</h3><p className="text-blue-700 text-sm mb-4">L'applicazione è collegata al database online. Le modifiche sono visibili a tutti i clienti in tempo reale.</p><button onClick={handleSyncInitialData} disabled={isSyncing} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50">{isSyncing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />} Sincronizza Menu Iniziale</button><p className="text-[10px] text-blue-400 mt-2 italic">* Usare solo per caricare i prodotti di base la prima volta o per ripristinare.</p></div></div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-wood-100 mb-8">
           <h3 className="text-lg font-bold text-wood-900 mb-4 flex items-center gap-2"><Settings size={20} className="text-accent-500" /> Impostazioni Generali</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-wood-50 rounded-2xl p-6 border border-wood-100">
                 <h4 className="font-bold text-wood-800 mb-4 flex items-center gap-2"><ImageIcon size={18} /> Logo Ristorante</h4>
                 <div className="flex items-start gap-4">
                    <WesternLogo size="md" url={customLogo} />
                    <div className="flex-1">
                       <p className="text-xs text-wood-500 mb-3">Carica il tuo logo (PNG/JPG). Verrà ridimensionato automaticamente.</p>
                       <div className="flex gap-2 flex-wrap">
                          <label className="bg-white border border-wood-200 text-wood-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-wood-100 cursor-pointer transition-colors flex items-center gap-2">{isProcessingImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Carica Logo<input type="file" onChange={handleLogoUpload} accept="image/*" className="hidden" /></label>
                          {customLogo && (<><button onClick={handleSaveLogo} className="bg-accent-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-accent-600 transition-colors flex items-center gap-2"><Save size={12} /> Salva</button><button onClick={handleResetLogo} className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-2"><RotateCcw size={12} /> Reset</button></>)}
                       </div>
                    </div>
                 </div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100"><h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><Trash2 size={18} /> Area Pericolo</h4><p className="text-xs text-red-600 mb-4">Ripristina il menu ai valori di default. Tutte le modifiche andranno perse.</p><button onClick={handleFactoryReset} className="w-full bg-white border border-red-200 text-red-600 py-2 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-colors">Ripristino di Fabbrica</button></div>
           </div>
        </div>
        <div id="new-product-form" className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-accent-100 mb-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-accent-500"></div>
           <h3 className="text-2xl font-western text-wood-900 mb-6 flex items-center gap-2">{editingId ? <Pencil size={24} className="text-accent-500" /> : <Plus size={24} className="text-accent-500" />} {editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h3>
           <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Categoria</label><div className="relative"><select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as ProductCategory})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500">{CATEGORIES_LIST.concat([ProductCategory.AGGIUNTE]).map(cat => (<option key={cat} value={cat}>{tCategory(cat, lang)}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={16} /></div></div>
                    {newItem.category === ProductCategory.HAMBURGER && (<div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Sotto-Categoria</label><div className="relative"><select value={newItem.subCategory} onChange={e => setNewItem({...newItem, subCategory: e.target.value})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500">{HAMBURGER_SUBCATEGORIES.map(sub => (<option key={sub} value={sub}>{sub}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={16} /></div></div>)}
                 </div>
                 <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Nome Prodotto</label><input type="text" required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 font-medium" placeholder="Es. Old West Burger" /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Prezzo (€)</label><input type="number" step="0.01" required value={newItem.price} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 font-mono" /></div>
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Brand (Opzionale)</label><input type="text" value={newItem.brand || ''} onChange={e => setNewItem({...newItem, brand: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500" placeholder="Es. Chianina" /></div>
                 </div>
                 
                 {/* Allergens Section (Admin Checkboxes) */}
                 <div>
                    <label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-2">Allergeni</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-wood-50 p-3 rounded-xl border border-wood-200 max-h-40 overflow-y-auto">
                       {(Object.keys(ALLERGENS_CONFIG) as AllergenType[]).map(allergen => {
                          const isSelected = newItem.allergens?.includes(allergen);
                          return (
                             <button type="button" key={allergen} onClick={() => { const current = newItem.allergens || []; const updated = isSelected ? current.filter(a => a !== allergen) : [...current, allergen]; setNewItem({ ...newItem, allergens: updated }); }} className={`px-2 py-2 rounded-lg text-[10px] font-bold flex items-center gap-2 border transition-all text-left ${isSelected ? 'bg-red-100 border-red-200 text-red-700' : 'bg-white border-wood-200 text-wood-500 hover:bg-wood-100'}`}>
                                <div className="shrink-0"><AllergenIcon type={allergen} className="w-4 h-4" /></div>
                                {allergen}
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
        <div>
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-2xl font-western text-wood-900">Prodotti nel Menu ({items.length})</h3>
             <div className="relative"><select value={activeCategory} onChange={e => handleCategoryClick(e.target.value)} className="appearance-none bg-white border border-wood-200 rounded-full px-4 py-2 pr-8 text-sm font-bold text-wood-600 focus:outline-none">{['Tutti', ...CATEGORIES_LIST, ProductCategory.AGGIUNTE].map(cat => (<option key={cat} value={cat}>{tCategory(cat, lang)}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={14} /></div>
           </div>
           <div className="space-y-3">
              {displayItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-wood-100 shadow-sm flex items-center gap-4 group hover:border-accent-200 transition-colors">
                   <div className="w-12 h-12 bg-wood-50 rounded-lg overflow-hidden shrink-0">{item.imageUrl ? (<img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-wood-300"><UtensilsCrossed size={16} /></div>)}</div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><h4 className="font-bold text-wood-900 truncate">{item.name}</h4>{item.category === ProductCategory.HAMBURGER && item.subCategory && (<span className="text-[10px] bg-wood-100 text-wood-500 px-2 py-0.5 rounded-full whitespace-nowrap">{item.subCategory}</span>)}</div>
                      <p className="text-xs text-wood-400 truncate">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1"><span className="text-sm font-mono font-bold text-accent-600">€{item.price.toFixed(2)}</span><span className="text-[10px] text-wood-300 uppercase tracking-wider bg-wood-50 px-2 rounded-full">{tCategory(item.category, lang)}</span></div>
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
      {renderCartDrawer()}
      {renderFloatingCartBar()}

      <button onClick={scrollToTop} className={`fixed bottom-24 right-6 z-40 w-10 h-10 bg-wood-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-accent-600 hover:scale-110 ${showScrollTop && !isCartOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`} aria-label="Scroll to top"><ChevronUp size={20} /></button>
    </>
  );
}