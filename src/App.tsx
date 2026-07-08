import React, { useState, useEffect, useRef } from 'react';
import { 
  UtensilsCrossed, Pizza, Beef, Fish, Salad, Baby, Cookie, Beer, Settings, Plus, Minus, Trash2, LogOut, 
  ChevronLeft, ChevronRight, Lock, Utensils, Star, MapPin, Clock, Instagram, Facebook, Phone, LayoutGrid, 
  ArrowRight, Upload, Image as ImageIcon, Download, RotateCcw, Save, ChevronDown, ChevronUp, X, Loader2, 
  Pencil, RefreshCw, Wheat, CircleDot, Globe, Languages, Check, Leaf, Flame, Award, QrCode, Database, Sprout, ShoppingBag, 
  Milk, Egg, Nut, Bean, AlertCircle, Wine, Shell, Info, Search, Sandwich, Sparkles, Bike, Store, CheckCircle2, Copy, User, Mail, ShoppingCart, Undo, ReceiptText 
} from 'lucide-react';
import { MenuItem, ProductCategory, ViewState, LanguageCode, ActiveFilters, CartItem, AllergenType, ProductVariant, OrderType, PaymentMethod } from './types';
import { INITIAL_MENU_ITEMS, CATEGORIES_LIST, HAMBURGER_SUBCATEGORIES, DRINK_SUBCATEGORIES, TRUE_DIY_OPTIONS, HOUSE_BURGER_OPTIONS, UI_TRANSLATIONS, CATEGORY_TRANSLATIONS, SUBCATEGORY_TRANSLATIONS, HAMBURGER_SUBCATEGORIES_TRANSLATIONS, DATA_VERSION, ALLERGENS_CONFIG, EXTRA_INGREDIENTS_ITEMS, DELIVERY_ZONES, LUNCH_HOURS, DINNER_HOURS, ADDON_SUBCATEGORIES, HAMBURGER_SPECIAL_NAMES } from './constants';
import { supabase } from './supabase';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import logoOldWest from './assets/LOGO-OLD-WEST.png';

// Inizializza Stripe con la tua chiave pubblica di Test (Sostituisci con la tua pk_test_... reale!)
const stripePromise = loadStripe('pk_test_51TiIYsCXySNnuldcThqR3ZAY2XpOwaUEb7rdhJ663hAfI7IeKap5bJ3HnbUbUVknR62JWTk6NbuVgocFIdRNrWj800M7BvpfqR');

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
    case ProductCategory.HAMBURGER: return <Sandwich className={className} />;
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

const ALLERGEN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Glutine': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Crostacei': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  'Uova': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  'Pesce': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  'Arachidi': { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  'Soia': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  'Latte': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  'Frutta a guscio': { bg: 'bg-amber-100/50', text: 'text-amber-900', border: 'border-amber-300/50' },
  'Sedano': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Senape': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  'Sesamo': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Solfiti': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  'Lupini': { bg: 'bg-lime-50', text: 'text-lime-800', border: 'border-lime-200' },
  'Molluschi': { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
};

const DEFAULT_LOGO = logoOldWest;
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
const tSubCategory = (subCat: string, lang: LanguageCode): string => {
  if (SUBCATEGORY_TRANSLATIONS[subCat] && SUBCATEGORY_TRANSLATIONS[subCat][lang]) return SUBCATEGORY_TRANSLATIONS[subCat][lang];
  return subCat;
};
const tHamburgerSubCategory = (subCat: string, lang: LanguageCode): string => {
  if (HAMBURGER_SUBCATEGORIES_TRANSLATIONS[subCat] && HAMBURGER_SUBCATEGORIES_TRANSLATIONS[subCat][lang]) {
    return HAMBURGER_SUBCATEGORIES_TRANSLATIONS[subCat][lang];
  }
  return subCat;
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

// Funzione di traduzione degli ingredienti di base con il dizionario locale
const translateIngredient = (ing: string, lang: LanguageCode): string => {
  const dict: Record<string, Record<string, string>> = {
    'mozzarella': { en: 'Mozzarella', fr: 'Mozzarella', de: 'Mozzarella' },
    'pancetta': { en: 'Bacon', fr: 'Bacon', de: 'Speck' },
    'grana in cottura': { en: 'Baked Grana Cheese', fr: 'Grana cuit', de: 'Gebackener Grana' },
    'zucchine fritte': { en: 'Fried Zucchini', fr: 'Courgettes frites', de: 'Frittierte Zucchini' },
    'rucola': { en: 'Arugula', fr: 'Roquette', de: 'Rucola' },
    'gorgonzola': { en: 'Gorgonzola', fr: 'Gorgonzola', de: 'Gorgonzola' },
    'bacon': { en: 'Bacon', fr: 'Bacon', de: 'Speck' },
    'pomodorini secchi': { en: 'Dried Tomatoes', fr: 'Tomates séchées', de: 'Getrocknete Tomaten' },
    'salsa burger': { en: 'Burger Sauce', fr: 'Sauce burger', de: 'Burgersauce' },
    'cipolle': { en: 'Onions', fr: 'Oignons', de: 'Zwiebeln' },
    'insalata di lattuga e radicchio': { en: 'Lettuce & Radicchio Salad', fr: 'Salade laitue & radicchio', de: 'Salat mit Lattich & Radicchio' },
    'scamorza affumicata': { en: 'Smoked Scamorza', fr: 'Scamorza fumée', de: 'Geräucherter Scamorza' },
    'acciughe': { en: 'Anchovies', fr: 'Anchois', de: 'Sardellen' },
    'zucchine': { en: 'Zucchini', fr: 'Courgettes', de: 'Zucchini' },
    'pomodoro': { en: 'Tomato', fr: 'Tomate', de: 'Tomate' }
  };
  const key = ing.toLowerCase().trim();
  if (dict[key] && dict[key][lang]) {
    return dict[key][lang];
  }
  return ing;
};

// --- COMPONENTE RENDERIZZAZIONE CASSA SICURA STRIPE (SINGLE-PAGE APP - SENZA CONFLITTI DI FORM) ---
const StripeCheckoutForm = ({ clientSecret, onPaymentSuccess, cart, orderForm, tempReservationInfo }: { clientSecret: string; onPaymentSuccess: () => void; cart: any[]; orderForm: any; tempReservationInfo: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayClick = async (e: React.MouseEvent) => {
    e.preventDefault();  // Blocca comportamenti di default
    e.stopPropagation(); // Impedisce al click di salire verso il modulo esterno

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // SALVA IL CARRELLO E IL FORM IN LOCAL STORAGE UN ISTANTE PRIMA DI PAGARE
    localStorage.setItem('pending_checkout_cart', JSON.stringify(cart));
    localStorage.setItem('pending_checkout_form', JSON.stringify(orderForm));
    localStorage.setItem('pending_checkout_reservation', JSON.stringify(tempReservationInfo));

    // Conferma il pagamento su Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?payment_success=true`,
      },
      redirect: 'if_required' // Evita il reindirizzamento se la carta non richiede 3D Secure
    });

    if (error) {
      // In caso di errore di pagamento, cancella il salvataggio in sospeso
      localStorage.removeItem('pending_checkout_cart');
      localStorage.removeItem('pending_checkout_form');
      localStorage.removeItem('pending_checkout_reservation');

      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "Errore durante l'elaborazione del pagamento.");
      } else {
        setErrorMessage("Si è verificato un errore imprevisto.");
      }
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Pagamento completato con successo senza ricaricare la pagina!
      localStorage.removeItem('pending_checkout_cart');
      localStorage.removeItem('pending_checkout_form');
      onPaymentSuccess();
    }
  };

  return (
    // Sostituito <form> con <div> per eliminare l'annidamento illegale in HTML
    <div id="stripe-payment-form" className="space-y-4 mt-6 p-4 bg-white rounded-2xl text-black animate-in fade-in zoom-in-95 duration-300">
      <PaymentElement />
      {errorMessage && (
         <div className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-200">
            ⚠️ {errorMessage}
         </div>
      )}
      <button 
        type="button" // <--- IMPORTANTISSIMO: tipo "button", non "submit" per non attivare il modulo esterno!
        onClick={handlePayClick} 
        disabled={isProcessing || !stripe} 
        className="w-full bg-[#45856c] text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all disabled:opacity-50"
      >
         {isProcessing ? <Loader2 className="animate-spin" size={24} /> : "PAGA E INVIA ORDINE"}
      </button>
    </div>
  );
};

// --- COMPONENTE RENDERIZZAZIONE PAGINA DI BENVENUTO (LANDING - MULTILINGUA) ---
const LandingPage = ({ setView, setIsPreOrder, setTempReservationInfo, setReservationForm, profile, user, lang, t }: any) => {
  // Dizionario locale traduzioni della Landing Page
  const translations: Record<string, Record<string, string>> = {
    welcome: { it: 'Benvenuto!', en: 'Welcome!', fr: 'Bienvenue!', de: 'Willkommen!' },
    subtitle: { 
      it: 'Cosa possiamo fare per te oggi?', 
      en: 'What can we do for you today?', 
      fr: 'Que pouvons-nous faire pour vous aujourd\'hui?', 
      de: 'Was können wir heute für Sie tun?' 
    },
    ordina_title: { it: 'Ordina Online', en: 'Order Online', fr: 'Commander en ligne', de: 'Online bestellen' },
    ordina_sub: { it: 'A domicilio o asporto', en: 'Delivery or Takeaway', fr: 'À domicilio ou à emporter', de: 'Lieferung o. Abholung' },
    prenota_title: { it: 'Prenota Tavolo', en: 'Book a Table', fr: 'Réserver une table', de: 'Tisch reservieren' },
    prenota_sub: { it: 'Riserva un tavolo nel locale', en: 'Reserve a table in the restaurant', fr: 'Réservez une table', de: 'Tisch im Restaurant reservieren' },
    preordine_title: { it: 'Pre-ordine cibo', en: 'Pre-order food', fr: 'Précommande de repas', de: 'Essen vorbestellen' },
    preordine_sub: { it: 'Prenota tavolo + Piatti in anticipo', en: 'Book table + Dishes in advance', fr: 'Réserver table + Plats à l\'avance', de: 'Tisch buchen + Gerichte vorab' }
  };

  const getTxt = (key: string) => translations[key]?.[lang] || translations[key]?.['it'] || key;

  return (
    <div className="min-h-screen bg-dark-texture flex flex-col justify-between pt-24 pb-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-4 py-12 text-center animate-in fade-in duration-500">
         
         {/* BENVENUTO E SOTTOTITOLO TRADOTTI */}
         <div className="mb-12 select-none">
            <h1 className="text-5xl md:text-6xl font-western text-white tracking-wide mb-4 drop-shadow-lg">{getTxt('welcome')}</h1>
            <p className="text-wood-200 text-base md:text-lg font-medium tracking-wide">{getTxt('subtitle')}</p>
         </div>

         {/* I TRE PULSANTI ARROTONDATI TRADOTTI */}
         <div className="flex flex-col gap-6 w-full items-center">
            
            {/* PULSANTE 1: ORDINA ONLINE */}
            <button 
               type="button"
               onClick={() => {
                  setIsPreOrder(false);
                  setTempReservationInfo(null);
                  setView('MENU');
                  window.scrollTo(0,0);
               }}
               className="w-72 bg-[#45856c] hover:bg-[#366a55] text-white py-3.5 px-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-0.5 border border-white/5"
            >
               <span className="font-western text-xl tracking-wide uppercase leading-tight">{getTxt('ordina_title')}</span>
               <span className="text-[10px] text-wood-100 font-bold uppercase tracking-widest">{getTxt('ordina_sub')}</span>
            </button>

            {/* PULSANTE 2: PRENOTA TAVOLO */}
            <button 
               type="button"
               onClick={() => {
                  setIsPreOrder(false);
                  setTempReservationInfo(null);
                  setReservationForm({
                     customerName: profile?.full_name || '',
                     customerPhone: profile?.phone || '',
                     customerEmail: user?.email || '',
                     numPeople: 2,
                     date: '',
                     time: '19:30',
                     notes: ''
                  });
                  setView('BOOKING');
                  window.scrollTo(0,0);
               }}
               className="w-72 bg-[#45856c] hover:bg-[#366a55] text-white py-3.5 px-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-0.5 border border-white/5"
            >
               <span className="font-western text-xl tracking-wide uppercase leading-tight">{getTxt('prenota_title')}</span>
               <span className="text-[10px] text-wood-100 font-bold uppercase tracking-widest">{getTxt('prenota_sub')}</span>
            </button>

            {/* PULSANTE 3: PRE-ORDINE CIBO */}
            <button 
               type="button"
               onClick={() => {
                  setIsPreOrder(true);
                  setTempReservationInfo(null);
                  setReservationForm({
                     customerName: profile?.full_name || '',
                     customerPhone: profile?.phone || '',
                     customerEmail: user?.email || '',
                     numPeople: 2,
                     date: '',
                     time: '19:30',
                     notes: ''
                  });
                  setView('BOOKING');
                  window.scrollTo(0,0);
               }}
               className="w-72 bg-[#45856c] hover:bg-[#366a55] text-white py-3.5 px-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center justify-center gap-0.5 border border-white/5"
            >
               <span className="font-western text-xl tracking-wide uppercase leading-tight">{getTxt('preordine_title')}</span>
               <span className="text-[10px] text-wood-100 font-bold uppercase tracking-widest">{getTxt('preordine_sub')}</span>
            </button>

         </div>
      </div>

      {/* FOOTER MINIMALE */}
      <div className="bg-transparent text-wood-400 py-4 text-center shrink-0">
         <p className="text-[9px] font-bold uppercase tracking-wider">&copy; {new Date().getFullYear()} Old West. {t('rights_reserved', lang)}</p>
      </div>
    </div>
  );
};

// --- COMPONENTE RENDERIZZAZIONE PRENOTAZIONE TAVOLO (MULTILINGUA) ---
const BookingPage = ({ reservationForm, setReservationForm, isSubmittingReservation, handleSubmitReservation, generateTimeSlots, setView, isPreOrder, lang, t }: any) => {
  const timeSlots = generateTimeSlots();

  // Dizionario locale traduzioni della pagina di prenotazione
  const translations: Record<string, Record<string, string>> = {
    title: { it: 'PRENOTA UN TAVOLO', en: 'BOOK A TABLE', fr: 'RÉSERVER UNE TABLE', de: 'TISCH RESERVIEREN' },
    subtitle_standard: { it: 'Riserva un tavolo nel locale', en: 'Reserve a table in the restaurant', fr: 'Réservez une table', de: 'Tisch im Restaurant reservieren' },
    subtitle_preorder: { 
      it: '* Passo 1: Riserva il tavolo prima di scegliere il cibo', 
      en: '* Step 1: Reserve your table before choosing your food', 
      fr: '* Étape 1 : Réservez votre table avant de choisir vos plats', 
      de: '* Schritt 1: Tisch reservieren, bevor Sie das Essen wählen' 
    },
    label_people: { it: 'Quante persone? *', en: 'How many people? *', fr: 'Combien de personnes ? *', de: 'Wie viele Personen? *' },
    label_name: { it: 'Nome e Cognome *', en: 'First & Last Name *', fr: 'Nom & Prénom *', de: 'Vor- & Nachname *' },
    label_phone: { it: 'Telefono per conferma *', en: 'Phone number for confirmation *', fr: 'Téléphone de confirmation *', de: 'Telefonnummer zur Bestätigung *' },
    label_date: { it: 'Data *', en: 'Date *', fr: 'Date *', de: 'Datum *' },
    label_time: { it: 'Ora *', en: 'Time *', fr: 'Heure *', de: 'Uhrzeit *' },
    label_notes: { it: 'Preferenze o note (Opzionale)', en: 'Preferences or notes (Optional)', fr: 'Préférences ou notes (Optionnel)', de: 'Wünsche oder Notizen (Optional)' },
    placeholder_notes: { it: 'Es. Seggiolone per bimbo, all\'aperto, ecc.', en: 'E.g. High chair, outdoors, etc.', fr: 'Ex. Chaise haute, en plein air, etc.', de: 'Z.B. Kinderhochstuhl, im Freien, etc.' },
    btn_cancel: { it: 'Annulla', en: 'Cancel', fr: 'Annuler', de: 'Abbrechen' },
    btn_confirm_preorder: { it: 'CONFERMA E PRE-ORDINA CIBO', en: 'CONFIRM AND PRE-ORDER FOOD', fr: 'CONFIRMER ET PRÉCOMMANDER LE REPAS', de: 'BESTÄTIGEN UND ESSEN VORBESTELLEN' },
    btn_confirm_standard: { it: 'CONFERMA PRENOTAZIONE TAVOLO', en: 'CONFIRM TABLE RESERVATION', fr: 'CONFIRMER LA RÉSERVATION DE LA TABLE', de: 'TISCHRESERVIERUNG BESTÄTIGEN' }
  };

  const getTxt = (key: string) => translations[key]?.[lang] || translations[key]?.['it'] || key;

  return (
    <div className="min-h-screen bg-wood-50 pt-20 pb-32">
      <div className="container mx-auto px-4 max-w-lg mt-8">
         <button type="button" onClick={() => setView('LANDING')} className="flex items-center gap-2 text-wood-500 hover:text-wood-900 font-bold mb-6 transition-colors">
            <ChevronLeft size={20} /> {getTxt('btn_cancel')}
         </button>

         <h2 className="text-3xl font-western text-wood-900 mb-2">{getTxt('title')}</h2>
         <p className="text-sm text-wood-500 mb-8 uppercase font-bold tracking-wider">
            {isPreOrder ? getTxt('subtitle_preorder') : getTxt('subtitle_standard')}
         </p>

         <form onSubmit={handleSubmitReservation} className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-wood-100 shadow-sm space-y-4">
               
               {/* Numero persone */}
               <div>
                  <label className="block text-xs font-bold text-wood-500 uppercase mb-2">{getTxt('label_people')}</label>
                  <div className="flex items-center gap-4 bg-wood-50 p-2 rounded-2xl w-fit border border-wood-100">
                     <button 
                        type="button" 
                        onClick={() => setReservationForm({ ...reservationForm, numPeople: Math.max(1, reservationForm.numPeople - 1) })}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-lg text-wood-700 hover:bg-wood-100"
                     >
                        -
                     </button>
                     <span className="text-xl font-bold w-12 text-center text-wood-900">{reservationForm.numPeople}</span>
                     <button 
                        type="button" 
                        onClick={() => setReservationForm({ ...reservationForm, numPeople: reservationForm.numPeople + 1 })}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-lg text-wood-700 hover:bg-wood-100"
                     >
                        +
                     </button>
                  </div>
               </div>

               {/* Anagrafica Cliente con Email per Conferma Opzionale */}
               <div className="grid grid-cols-1 gap-4 pt-2">
                  <div>
                     <label className="block text-xs font-bold text-wood-500 uppercase mb-1">{getTxt('label_name')}</label>
                     <input required type="text" value={reservationForm.customerName} onChange={e => setReservationForm({...reservationForm, customerName: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3" placeholder="Es. Rossi Mario" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <div>
                        <label className="block text-xs font-bold text-wood-500 uppercase mb-1">{getTxt('label_phone')}</label>
                        <input required type="tel" value={reservationForm.customerPhone} onChange={e => setReservationForm({...reservationForm, customerPhone: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3" placeholder="Es. 3331234567" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Email (Opzionale, per ricevere la conferma)</label>
                        <input type="email" value={reservationForm.customerEmail || ''} onChange={e => setReservationForm({...reservationForm, customerEmail: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3" placeholder="esempio@mail.com" />
                     </div>
                  </div>
               </div>

               {/* Giorno e Ora della Prenotazione */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                     <label className="block text-xs font-bold text-wood-500 uppercase mb-1">{getTxt('label_date')}</label>
                     <input required type="date" min={new Date().toISOString().split('T')[0]} value={reservationForm.date} onChange={e => setReservationForm({...reservationForm, date: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 font-bold text-wood-800" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-wood-500 uppercase mb-1">{getTxt('label_time')}</label>
                     <div className="relative">
                        <select value={reservationForm.time} onChange={e => setReservationForm({...reservationForm, time: e.target.value})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 pr-8 font-bold text-wood-800 focus:outline-none">
                           {timeSlots.map((time: string) => (
                              <option key={time} value={time}>{time}</option>
                           ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={16} />
                     </div>
                  </div>
               </div>

               {/* Note */}
               <div className="pt-2">
                  <label className="block text-xs font-bold text-wood-500 uppercase mb-1">{getTxt('label_notes')}</label>
                  <textarea rows={2} value={reservationForm.notes} onChange={e => setReservationForm({...reservationForm, notes: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl p-3 focus:outline-none focus:border-[#45856c] resize-none" placeholder={getTxt('placeholder_notes')}></textarea>
               </div>

            </div>

            <button type="submit" disabled={isSubmittingReservation} className="w-full bg-[#45856c] text-white py-4 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all disabled:opacity-50">
               {isSubmittingReservation ? <Loader2 className="animate-spin" size={24} /> : isPreOrder ? getTxt('btn_confirm_preorder') : getTxt('btn_confirm_standard')}
            </button>
         </form>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function App() {
  const [orderDate, setOrderFormDate] = useState('Oggi');
  const [items, setItems] = useState<MenuItem[]>([]);
  // Inizializza lo stato leggendo al volo la URL per evitare lo sfarfallio (flickering) all'avvio
  const [view, setView] = useState<ViewState>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('table') ? 'MENU' : 'LANDING';
  });
  const [successType, setSuccessType] = useState<'ORDER' | 'BOOKING'>('ORDER');
  const [activeCategory, setActiveCategory] = useState<string>('Tutti');
  const [activeSubCategoryView, setActiveSubCategoryView] = useState<string | null>(null);
  // Traccia quale sottocategoria delle bevande è attualmente aperta (null se sono tutte chiuse)
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; image_url: string | null }[]>([]);
  const [tempSelectedVariant, setTempSelectedVariant] = useState<any>(null);
  const [diyStep, setDiyStep] = useState(0);
  const [diySelections, setDiySelections] = useState<Record<string, any>>({});
  const [diySearchQuery, setDiySearchQuery] = useState("");
  const [diyType, setDiyType] = useState<'house' | 'diy' | null>(null);

  // Sincronizza il tipo di panino in base alla sottocategoria cliccata dall'utente
      useEffect(() => {
      if (activeSubCategoryView === 'Hamburger della Casa') {
         setDiyType('house');
      } else if (activeSubCategoryView === 'Hamburger "Fai da te"') {
         setDiyType('diy');
      } else {
         setDiyType(null);
      }
      }, [activeSubCategoryView]);

   // Gestione dello scorrimento fluido automatico quando si aprono le tendine delle bevande
      useEffect(() => {
      if (expandedSubCategory) {
         // Impostiamo un piccolissimo delay (120ms) per dare il tempo a React 
         // di chiudere la tendina precedente e ricalcolare le altezze del sito
         const timer = setTimeout(() => {
            const elementId = `subcat-${expandedSubCategory.replace(/\s+/g, '-')}`;
            const element = document.getElementById(elementId);
            
            if (element) {
            // Altezza del tuo header fisso/sticky in alto (es: 90px) per evitare che la tendina ci finisca sotto
            const headerOffset = 150; 
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
               top: offsetPosition,
               behavior: 'smooth' // Effetto scorrimento morbido e premium
            });
            }
         }, 120);

         return () => clearTimeout(timer);
      }
      }, [expandedSubCategory]);   

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingCartItemIndex, setEditingCartItemIndex] = useState<number | null>(null);
  const [addonSearch, setAddonSearch] = useState('');
  const [selectingVariantItem, setSelectingVariantItem] = useState<any | null>(null);
  const [variantSearchQuery, setVariantSearchQuery] = useState<string>("");
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
  const [adminSearchQuery, setAdminSearchQuery] = useState(''); // Stato per la ricerca dei prodotti in Admin
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [infoItem, setInfoItem] = useState<MenuItem | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [isFirstOrder, setIsFirstOrder] = useState<boolean>(false);
  const [suggestionToast, setSuggestionToast] = useState<{show: boolean, text: string}>({ show: false, text: '' });
  const getCustomerVariantPlaceholder = () => {
  if (!selectingVariantItem) return "Cerca...";
  
  const isDrink = selectingVariantItem.category === ProductCategory.BEVANDE;
  
  if (isDrink) {
    if (selectingVariantItem.subCategory === 'Amari e Digestivi') {
      return lang === 'it' 
         ? "Cerca amaro... (es: Montenegro, Braulio)" 
         : "Search digestif... (e.g., Montenegro, Braulio)";
    }
    if (selectingVariantItem.subCategory === 'Birre alla Spina' || selectingVariantItem.subCategory === 'Birre in Bottiglia') {
      return lang === 'it' 
         ? "Cerca formato... (es: Media, Piccola, Caraffa)" 
         : "Search size... (e.g., Medium, Small, Pitcher)";
    }
    if (selectingVariantItem.subCategory === 'Vini') {
      return lang === 'it' 
         ? "Cerca opzione... (es: Calice, Bottiglia)" 
         : "Search option... (e.g., Glass, Bottle)";
    }
    return lang === 'it' ? "Cerca..." : "Search...";
  }
  
  if (selectingVariantItem.category === ProductCategory.PIZZA) {
    return lang === 'it' 
       ? "Cerca dimensione... (es: Normale, Baby)" 
       : "Search size... (e.g., Regular, Kid)";
  }

  return lang === 'it' ? "Cerca..." : "Search...";
};
  
  // --- STATI AGGIUNTI PER L'AUTENTICAZIONE CLIENTE ---
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    city: DELIVERY_ZONES[0] || ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  // --- STATI AGGIUNTI PER IL CONTROLLO SOVRACCARICO E FASCE ORARIE ---
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);

  // --- STATI AGGIUNTI PER I PAGAMENTI ONLINE STRIPE ---
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializingStripe, setIsInitializingStripe] = useState(false);

  // --- STATI AGGIUNTI PER LA GESTIONE DEL CONTO UNICO AL TAVOLO ---
  const [tableSessionId, setTableSessionId] = useState<string | null>(null);
  const [hasPriorOrders, setHasPriorOrders] = useState(false); // Vero se il tavolo ha già ordinato in precedenza

   useEffect(() => {
  if (!tableSessionId) return;

  // 1. Controlla inizialmente se ci sono ordini non pagati per questa sessione
  const checkActiveOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('table_session_id', tableSessionId)
      .eq('payment_status', 'unpaid')
      .neq('status', 'cancelled');
      
    if (!error && data) {
      setHasPriorOrders(data.length > 0);
    }
  };
  checkActiveOrders();

  // 2. Ascolta in tempo reale quando lo staff chiude il conto o modifica gli ordini
  const channel = supabase
    .channel(`table-sync-${tableSessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Ascolta inserimenti, aggiornamenti e cancellazioni
        schema: 'public',
        table: 'orders',
        filter: `table_session_id=eq.${tableSessionId}`
      },
      async () => {
        // Ogni volta che cambia qualcosa negli ordini di questo tavolo, verifichiamo se ci sono ancora ordini non pagati
        const { data } = await supabase
          .from('orders')
          .select('id')
          .eq('table_session_id', tableSessionId)
          .eq('payment_status', 'unpaid')
          .neq('status', 'cancelled');

        if (data) {
          const ancoraUnpaid = data.length > 0;
          setHasPriorOrders(ancoraUnpaid);
          
          if (!ancoraUnpaid) {
            // Se non ci sono più ordini attivi non pagati (il tavolo è stato liberato dallo staff)
            localStorage.removeItem('activeOrderId');
            setActiveOrderId(null);
          }
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [tableSessionId]);


const [customModal, setCustomModal] = useState<{
  show: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  showCancel?: boolean;
} | null>(null);

  // --- STATI AGGIUNTI PER IL CONTO UNICO AL TAVOLO ---
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [billOrders, setBillOrders] = useState<any[]>([]);
  const [isRequestingBill, setIsRequestingBill] = useState(false);
  const [billClientSecret, setBillClientSecret] = useState<string | null>(null);
  const [isInitializingBillStripe, setIsInitializingBillStripe] = useState(false);

  // Scarica in tempo reale tutti gli ordini non pagati associati a questa sessione del tavolo
  const handleOpenBillModal = async () => {
    if (!tableSessionId) return;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('table_session_id', tableSessionId)
        .eq('payment_status', 'unpaid');
        
      if (error) throw error;
      if (data) {
        setBillOrders(data);
        setHasPriorOrders(data.length > 0);
        setBillClientSecret(null); // Resetta eventuali vecchie sessioni Stripe
        setIsBillModalOpen(true);
      }
    } catch (error) {
      console.error("Errore caricamento conto:", error);
      alert("Impossibile caricare il conto al momento. Riprova per favore.");
    }
  };

  // Invia la richiesta fisica di pagamento in contanti/bancomat al cameriere
  const handleRequestBillFromWaiter = async () => {
    if (!tableSessionId || billOrders.length === 0) return;
    setIsRequestingBill(true);
    try {
      const orderIds = billOrders.map(o => o.id);
      
      // Imposta il flag "bill_requested: true" su tutti gli ordini non pagati del tavolo
      const { error } = await supabase
        .from('orders')
        .update({ bill_requested: true })
        .in('id', orderIds);
        
      if (error) throw error;
      
      setCustomModal({
         show: true,
         title: "Richiesta Inviata!",
         message: "Un cameriere si avvicinerà a breve al tuo tavolo con il conto."
         });
      setIsBillModalOpen(false);
    } catch (error) {
      console.error("Errore richiesta conto:", error);
      alert("Impossibile inviare la richiesta del conto. Riprova.");
    } finally {
      setIsRequestingBill(false);
    }
  };

  // Inizializza Stripe per pagare il totale complessivo di tutti gli ordini unificati
  const handleInitBillStripePayment = async (totalAmount: number) => {
    setIsInitializingBillStripe(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount })
      });
      const data = await response.json();
      if (data.clientSecret) {
        setBillClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error("Errore inizializzazione Stripe Conto:", error);
    } finally {
      setIsInitializingBillStripe(false);
    }
  };

  // Conferma del pagamento del conto unico tramite Stripe online
  const handleConfirmConsolidatedPayment = async () => {
    if (billOrders.length === 0) return;
    try {
      const orderIds = billOrders.map(o => o.id);
      
      // Aggiorna in blocco tutti gli ordini come completati e pagati!
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'paid', status: 'completed' })
        .in('id', orderIds);
        
      if (error) throw error;

      // Se c'è una prenotazione tavolo associata, aggiorna lo stato anche lì
      const savedTableNum = localStorage.getItem('active_table_number');
      if (savedTableNum) {
         await supabase
           .from('reservations')
           .update({ status: 'confirmed' })
           .eq('table_session_id', tableSessionId)
           .eq('status', 'pending');
      }

      // Svuota e resetta la sessione locale del tavolo sul telefono (Tavolo libero!)
      localStorage.removeItem('active_table_session_id');
      localStorage.removeItem('active_table_number');
      setTableSessionId(null);
      setHasPriorOrders(false);
      setCart([]);
      setIsBillModalOpen(false);

      // Mostra la schermata di successo
      setSuccessType('ORDER');
      setView('ORDER_SUCCESS');
      
      setSuggestionToast({ show: true, text: "🎉 Pagamento completato in app! Grazie e arrivederci!" });
      setTimeout(() => setSuggestionToast({ show: false, text: '' }), 5000);
      window.scrollTo(0,0);
    } catch (error) {
      console.error("Errore chiusura conto unico:", error);
    }
  };

  // --- STATI AGGIUNTI PER LA PRENOTAZIONE TAVOLO & PRE-ORDINE ---
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [tempReservationInfo, setTempReservationInfo] = useState<any>(null);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    numPeople: 2,
    date: '',
    time: '19:30',
    notes: ''
  });

  // Gestisce la convalida ed il salvataggio della prenotazione del tavolo
  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReservation(true);

    try {
      if (isPreOrder) {
        // SCENARIO B (TAVOLO + PRE-ORDINE)
        setTempReservationInfo(reservationForm);
        
        // FORZIAMO I DATI DI CONSEGNA E IL TIPO ORDINE SU "TABLE"
        setOrderForm(prev => ({
           ...prev,
           orderType: 'table',    // <--- Forza a TAVOLO per azzerare consegna e calcolare il coperto x persone!
           paymentMethod: 'cash', // <--- Imposta il default a contanti al tavolo
           customerName: reservationForm.customerName,
           customerPhone: reservationForm.customerPhone,
           customerEmail: reservationForm.customerEmail
        }));

        setView('MENU');
        
        setSuggestionToast({ 
           show: true, 
           text: "🤠 Tavolo riservato! Ora aggiungi i tuoi piatti al carrello." 
        });
        setTimeout(() => setSuggestionToast({ show: false, text: '' }), 5000);
        window.scrollTo(0,0);
      
      } else {
        // SCENARIO A (PRENOTAZIONE CLASSICA): Salviamo direttamente nella tabella "reservations" di Supabase
        const newReservation = {
          customer_name: reservationForm.customerName,
          customer_phone: reservationForm.customerPhone,
          customer_email: reservationForm.customerEmail || null,
          reservation_date: reservationForm.date,
          reservation_time: reservationForm.time,
          num_people: reservationForm.numPeople,
          notes: reservationForm.notes,
          status: 'pending',
          user_id: user ? user.id : null
        };

        // Se è una prenotazione tavolo classica, salviamo direttamente nel DB
              const { error } = await supabase.from('reservations').insert([newReservation]);
              if (error) throw error;

              // AGGIUNTO: Salviamo la prenotazione classica in memoria temporanea per mostrarla a schermo!
              setTempReservationInfo(reservationForm);
              
              // AGGIUNTO: Specifichiamo che è una prenotazione del tavolo
              setSuccessType('BOOKING'); 

              // Mostriamo la schermata di successo
              setView('ORDER_SUCCESS');
              window.scrollTo(0,0);
      }
    } catch (error) {
      console.error("Errore salvataggio prenotazione:", error);
      alert("Errore durante la prenotazione del tavolo. Riprova per favore.");
    } finally {
      setIsSubmittingReservation(false);
    }
  };

  

  // Verifica se questo tavolo ha già effettuato ordini non pagati in questa sessione
  const checkIfHasPriorOrders = async () => {
    if (!tableSessionId) return;
    try {
      const { data } = await supabase
        .from('orders')
        .select('id')
        .eq('table_session_id', tableSessionId)
        .eq('payment_status', 'unpaid')
        .limit(1);
      
      if (data && data.length > 0) {
        setHasPriorOrders(true);
      } else {
        setHasPriorOrders(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Controlla la presenza di ordini precedenti ogni volta che si va al checkout
  useEffect(() => {
    if (tableSessionId && view === 'CHECKOUT') {
      checkIfHasPriorOrders();
    }
  }, [tableSessionId, view]);

  // --- STATI AGGIUNTI PER IL CALCOLO CHILOMETRICO DELLA CONSEGNA ---
  const [speseConsegna, setSpeseConsegna] = useState<number>(2.00); 
  const [distanzaRilevata, setDistanzaRilevata] = useState<number | null>(null);
  const [erroreIndirizzo, setErroreIndirizzo] = useState<string | null>(null);
  const [isCalcolandoDistanza, setIsCalcolandoDistanza] = useState<boolean>(false);
  
  // --- STATI AGGIUNTI PER PERSONALIZZAZIONE PRODOTTI E CONTORNI ---
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [customizingItemIndex, setCustomizingItemIndex] = useState<number | null>(null);
  const [tempIngredientsQty, setTempIngredientsQty] = useState<Record<string, number>>({});

  const [isSideDishModalOpen, setIsSideDishModalOpen] = useState(false);
  const [sideDishItemIndex, setSideDishItemIndex] = useState<number | null>(null);

  // --- STATI AGGIUNTI PER LA GESTIONE BEVANDA OMAGGIO NELLE PIZZE ---
  const [isFreeDrinkModalOpen, setIsFreeDrinkModalOpen] = useState(false);
  const [freeDrinkItemIndex, setFreeDrinkItemIndex] = useState<number | null>(null);

  const openFreeDrinkModal = (index: number) => {
    setFreeDrinkItemIndex(index);
    setIsFreeDrinkModalOpen(true);
  };

  const selectFreeDrink = (drinkName: string) => {
    if (freeDrinkItemIndex === null) return;
    const newCart = [...cart];
    newCart[freeDrinkItemIndex] = {
      ...newCart[freeDrinkItemIndex],
      selectedFreeDrink: drinkName
    };
    setCart(newCart);
    setIsFreeDrinkModalOpen(false);
    setFreeDrinkItemIndex(null);
  };

  // Genera dinamicamente tutti gli orari possibili ogni 15 minuti basandosi sulle aperture reali del locale
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    
    // Pranzo: 11:45 - 14:30
    let h = 11, m = 45;
    while (h < 14 || (h === 14 && m <= 30)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += 15;
      if (m >= 60) { m = 0; h += 1; }
    }
    
    // Cena: 18:45 - 22:30
    h = 18; m = 45;
    while (h < 22 || (h === 22 && m <= 30)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += 15;
      if (m >= 60) { m = 0; h += 1; }
    }
    
    return slots;
  };

  // Filtra gli orari passati o imminenti se l'ordine è per "Oggi" (richiede minimo 30 min di preparazione)
  const getAvailableSlots = (allSlots: string[], dateChoice: string): string[] => {
    if (dateChoice !== 'Oggi') return allSlots;
    
    const now = new Date();
    const limitTimeInMinutes = now.getHours() * 60 + now.getMinutes() + 30; // Ora attuale + 30 min
    
    return allSlots.filter(slot => {
      const [sh, sm] = slot.split(':').map(Number);
      return (sh * 60 + sm) >= limitTimeInMinutes;
    });
  };

  // Interroga Supabase per calcolare se una fascia è sovraccarica (Max 4 consegne OPPURE Max 12 pizze)
  const checkSlotCapacities = async (selectedDateLabel: string) => {
    setIsCheckingSlots(false);
    try {
      const targetDate = new Date();
      if (selectedDateLabel === 'Domani') {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      const dateStr = targetDate.toISOString().slice(0, 10); // AAAA-MM-DD
      
      const startOfDay = `${dateStr}T00:00:00.000Z`;
      const endOfDay = `${dateStr}T23:59:59.999Z`;

      // Scarica gli ordini attivi di quel giorno specifico
      const { data, error } = await supabase
        .from('orders')
        .select('delivery_time, cart_items, status')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .neq('status', 'cancelled');

      if (error) throw error;

      if (data) {
        const slotsCount: Record<string, { orders: number; pizzas: number }> = {};
        
        data.forEach(order => {
          const time = order.delivery_time;
          if (!time || time === 'Il prima possibile') return;
          
          if (!slotsCount[time]) {
            slotsCount[time] = { orders: 0, pizzas: 0 };
          }
          
          slotsCount[time].orders += 1;
          
          // Conta le pizze presenti in quell'ordine
          const pizzasCount = order.cart_items?.reduce((sum: number, item: any) => {
            if (item.category === 'Pizza') return sum + item.quantity;
            return sum;
          }, 0) || 0;
          
          slotsCount[time].pizzas += pizzasCount;
        });

        // Individua le fasce sature (>= 4 ordini o >= 12 pizze)
        const blocked: string[] = [];
        Object.entries(slotsCount).forEach(([time, stats]) => {
          if (stats.orders >= 4 || stats.pizzas >= 12) {
             blocked.push(time);
          }
        });
        
        setBlockedSlots(blocked);
      }
    } catch (err) {
      console.error("Errore nel calcolo della congestione:", err);
    }
  };

  // Attiva il controllo di congestione ogni volta che si apre il checkout o cambia giorno
  useEffect(() => {
    if (view === 'CHECKOUT') {
      checkSlotCapacities(orderDate);
    }
  }, [view, orderDate]);

   // Effetto per caricare l'utente e il suo profilo all'avvio
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profileData) setProfile(profileData);
      }
    };
    loadSession();

    // Ascolta i cambiamenti di autenticazione (Login / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profileData) setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Precompila automaticamente il form di spedizione con i dati del profilo salvati
  useEffect(() => {
    if (profile && user) {
      setOrderForm(prev => ({
        ...prev,
        customerName: profile.full_name || '',
        customerEmail: user.email || '',
        customerPhone: profile.phone || '',
        deliveryAddress: profile.address || '',
        deliveryCity: profile.city || prev.deliveryCity
      }));
    }
  }, [profile, user]);

  const [userOrders, setUserOrders] = useState<any[]>([]); // Memorizza lo storico ordini dell'utente
  const [userReservations, setUserReservations] = useState<any[]>([]); // Memorizza le prenotazioni dell'utente
   
  // Scarica la lista degli ordini e delle prenotazioni associati al profilo dell'utente loggato
  const fetchUserOrders = async () => {
    if (!user) return;
    try {
      // Scarica gli ordini
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (ordersData) setUserOrders(ordersData);

      // Scarica le prenotazioni dei tavoli
      const { data: resData } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('reservation_date', { ascending: false })
        .limit(10); // Limita a 10 per motivi di marketing!
      if (resData) setUserReservations(resData);

    } catch (error) {
      console.error("Errore nel caricamento dei dati utente:", error);
    }
  };

  // Rinfresca gli ordini dell'utente ogni volta che apre il suo profilo
  useEffect(() => {
    if (isProfileOpen && user) {
      fetchUserOrders();
    }
  }, [isProfileOpen, user]);

  // Registrazione utente + Inserimento record nella tabella dei profili
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsProcessingAuth(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password
      });

      if (error) throw error;

      if (data.user) {
        const profilePayload = {
          id: data.user.id,
          full_name: authForm.fullName,
          phone: authForm.phone,
          address: authForm.address,
          city: authForm.city
        };

        const { error: profileError } = await supabase.from('profiles').insert([profilePayload]);

        if (profileError) throw profileError;

        // IMPOSTA IMMEDIATAMENTE IL PROFILO IN LOCALE (Evita di vedere i campi vuoti)
        setProfile(profilePayload);

        // TOAST NOTIFICA AL POSTO DEL POPUP DI WINDOWS
        setSuggestionToast({ 
           show: true, 
           text: "🎉 REGISTRAZIONE COMPLETATA CON SUCCESSO! 🎉" 
        });
        setTimeout(() => setSuggestionToast({ show: false, text: '' }), 4000);

        setIsAuthModalOpen(false);
        setAuthForm({ email: '', password: '', fullName: '', phone: '', address: '', city: DELIVERY_ZONES[0] || '' });
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Errore durante la registrazione.");
    } finally {
      setIsProcessingAuth(false);
    }
  };

  // Login classico email/password
  const handleLoginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsProcessingAuth(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password
      });

      if (error) throw error;

      setIsAuthModalOpen(false);
      setAuthForm({ email: '', password: '', fullName: '', phone: '', address: '', city: DELIVERY_ZONES[0] || '' });
    } catch (err: any) {
      console.error(err);
      setAuthError("Email o password errati.");
    } finally {
      setIsProcessingAuth(false);
    }
  };

  // Aggiornamento dei dati personali dal pannello utente con notifica fluttuante
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAuthError(null);
    setIsProcessingAuth(true);

    try {
      const { error } = await supabase.from('profiles').update({
        full_name: authForm.fullName,
        phone: authForm.phone,
        address: authForm.address,
        city: authForm.city
      }).eq('id', user.id);

      if (error) throw error;

      // Rinfresca il profilo locale
      const { data: updatedProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (updatedProfile) setProfile(updatedProfile);

      // SOSTITUZIONE ALERT DI WINDOWS CON IL TUO TOAST FLUTTUANTE
      setSuggestionToast({ 
         show: true, 
         text: "💾 DATI PERSONALI AGGIORNATI CON SUCCESSO! 💾" 
      });
      setTimeout(() => setSuggestionToast({ show: false, text: '' }), 3000);

    } catch (err: any) {
      console.error(err);
      setAuthError("Errore durante l'aggiornamento.");
    } finally {
      setIsProcessingAuth(false);
    }
  };

  const handleLogoutUser = async () => {
    if (window.confirm("Sei sicuro di voler uscire dal tuo account?")) {
      await supabase.auth.signOut();
      setIsProfileOpen(false);
    }
  };

  // CHECKOUT STATE AGGIORNATO (Aggiunto tableNumber)
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderType: 'delivery' as OrderType,
    deliveryAddress: '',
    deliveryCity: DELIVERY_ZONES[0] || '',
    deliveryTime: 'Il prima possibile',
    paymentMethod: 'cash' as PaymentMethod,
    notes: '',
    tableNumber: '' 
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);



  // Contatta la tua API serverless su Vercel per generare l'intenzione di pagamento segreta
const handleInitStripePayment = async () => {
  // Rimosso il setOrderForm da qui!
  setIsInitializingStripe(true);
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: getGrandTotal() })
    });
    const data = await response.json();
    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
      
      setTimeout(() => {
         const stripeFormElement = document.getElementById('stripe-payment-form');
         if (stripeFormElement) {
            stripeFormElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
      }, 600);
    } else {
      alert("Errore nell'inizializzazione della cassa online. Riprova.");
    }
  } catch (error) {
    console.error("Errore inizializzazione Stripe:", error);
    alert("Impossibile contattare il server dei pagamenti. Scegli un altro metodo.");
  } finally {
    setIsInitializingStripe(false);
  }
};

  // Se il cliente modifica le opzioni di consegna (cambiando il totale) mentre Stripe è attivo,
  // ricalcola e aggiorna automaticamente l'intenzione di pagamento per addebitare la cifra esatta
  useEffect(() => {
    if (orderForm.paymentMethod === 'stripe' && view === 'CHECKOUT') {
      handleInitStripePayment();
    }
  }, [orderForm.deliveryCity, orderForm.orderType, orderForm.paymentMethod, view]);
  

// Apre la modale per personalizzare (Togliere/Aggiungere ingredienti base)
  const openCustomizationModal = (index: number) => {
    setCustomizingItemIndex(index);
    const cartItem = cart[index];
    
    // Ricaviamo gli ingredienti base splittando la descrizione per virgola
    const baseIngredients = cartItem.description 
      ? cartItem.description.split(',').map(i => i.trim()).filter(i => i && !i.includes('*'))
      : [];
      
    const initialQty: Record<string, number> = {};
    baseIngredients.forEach(ing => {
      if (cartItem.removedIngredients?.includes(ing)) {
        initialQty[ing] = 0;
      } else {
        // CONTROLLO DI MEMORIA: Verifichiamo se tra gli extra salvati c'è già questo raddoppio
        const isDouble = cartItem.selectedAddons?.some((add: any) => 
          add.name.toLowerCase().includes(ing.toLowerCase()) || 
          ing.toLowerCase().includes(add.name.toLowerCase())
        );
        initialQty[ing] = isDouble ? 2 : 1;
      }
    });
    
    setTempIngredientsQty(initialQty);
    setAddonSearch(''); // Resetta la barra di ricerca ingredienti extra
    setIsCustomizationModalOpen(true);
  };

  // Salva le personalizzazioni nel carrello senza duplicare i dati
  const handleConfirmCustomization = () => {
    if (customizingItemIndex === null) return;
    const newCart = [...cart];
    const item = { ...newCart[customizingItemIndex] };
    
    // Ricaviamo gli ingredienti base di questo piatto specifico
    const baseIngredients = item.description 
      ? item.description.split(',').map(i => i.trim()).filter(i => i && !i.includes('*'))
      : [];
    
    // 1. PULIZIA AUTOMATICA DOPPIONI: Rimuoviamo dagli addon gli extra degli ingredienti base 
    // per poterli ricalcolare, lasciando però intatti gli extra cercati da tastiera (es: Scamorza)
    const cleanedAddons = (item.selectedAddons || []).filter((add: any) => {
      const isBaseExtra = baseIngredients.some(ing => {
        const addonName = add.name.toLowerCase();
        const baseName = ing.toLowerCase();
        return addonName.includes(baseName) || baseName.includes(addonName);
      });
      return !isBaseExtra; // Teniamo solo gli ingredienti indipendenti inseriti dalla ricerca
    });
    
    const removed: string[] = [];
    const extraAddonsToAppend: MenuItem[] = [];
    
    Object.entries(tempIngredientsQty).forEach(([ing, qty]) => {
      if (qty === 0) {
        removed.push(ing);
      } else if (qty > 1) {
        // Cerca se esiste l'aggiunta corrispondente nel database
        const extraItem = items.find(i => 
          i.category === ProductCategory.AGGIUNTE && 
          (i.name.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(i.name.toLowerCase()))
        );
        if (extraItem) {
          extraAddonsToAppend.push(extraItem);
        } else {
          extraAddonsToAppend.push({
            id: `extra-base-${ing}-${Date.now()}`,
            name: `${ing} Extra`,
            description: '',
            price: 1.50,
            category: ProductCategory.AGGIUNTE,
            isAvailable: true
          });
        }
      }
    });
    
    item.removedIngredients = removed;
    item.selectedAddons = [...cleanedAddons, ...extraAddonsToAppend]; // Uniamo gli extra rimasti e i nuovi raddoppi
    
    newCart[customizingItemIndex] = item;
    setCart(newCart);
    setIsCustomizationModalOpen(false);
    setCustomizingItemIndex(null);
  };

  // Apre la modale per la scelta del contorno compreso
  const openSideDishModal = (index: number) => {
    setSideDishItemIndex(index);
    setIsSideDishModalOpen(true);
  };

  // Salva il contorno nel carrello
  const selectSideDish = (sideDishName: string) => {
    if (sideDishItemIndex === null) return;
    const newCart = [...cart];
    newCart[sideDishItemIndex] = {
      ...newCart[sideDishItemIndex],
      selectedSideDish: sideDishName
    };
    setCart(newCart);
    setIsSideDishModalOpen(false);
    setSideDishItemIndex(null);
  };

  // Funzione matematica per calcolare i KM in linea d'aria (Formula di Haversine)
  const calcolaDistanzaInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raggio medio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Ritorna i km reali
  };

  // Funzione per contattare OpenStreetMap (Nominatim) e settare la corretta tariffa
  const handleCalcolaSpeseConsegna = async (via: string, citta: string) => {
    if (!via || !citta) return;
    
    setIsCalcolandoDistanza(true);
    setErroreIndirizzo(null);
    
    // Uniamo la via con il comune selezionato limitando le ricerche in Italia
    const query = `${via}, ${citta}, Italy`;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { 'User-Agent': 'OldWestOnlineApp/1.0 (info@oldwest.click)' } }
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const destLat = parseFloat(data[0].lat);
        const destLon = parseFloat(data[0].lon);
        
        // Coordinate ristorante Cameri (Via G. Galilei 35)
        const localeLat = 45.49955;
        const localeLon = 8.67277;
        
        const km = calcolaDistanzaInKm(localeLat, localeLon, destLat, destLon);
        setDistanzaRilevata(km);
        
        // APPLICAZIONE TARIFFE RICHIESTE:
        let costo = 2.00; // Fino a 4km
        
        if (km > 4 && km <= 8) {
          costo = 5.00; // Da 4 a 8 km
        } else if (km > 8 && km <= 15) {
          costo = 8.00; // Da 8 a 15 km
        } else if (km > 15) {
          setErroreIndirizzo(`La tua posizione (~${km.toFixed(1)} km) supera il nostro limite massimo di consegna di 15km.`);
          setSpeseConsegna(0);
          setIsCalcolandoDistanza(false);
          return;
        }
        
        setSpeseConsegna(costo);
      } else {
        setErroreIndirizzo("Indirizzo non trovato. Verifica di aver inserito via e civico correttamente.");
        setSpeseConsegna(2.00);
      }
    } catch (error) {
      console.error("Errore Nominatim API:", error);
      setErroreIndirizzo("Impossibile verificare la via. Verrà applicata una tariffa forfettaria.");
      setSpeseConsegna(2.50);
    } finally {
      setIsCalcolandoDistanza(false);
    }
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const diyControlsRef = useRef<HTMLDivElement>(null); 
  const diyHeaderRef = useRef<HTMLDivElement>(null); 
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (error) throw error;
      if (data && data.length > 0) setItems(data); 
      else setItems([...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS]);
    } catch (error) { console.error('Error fetching data:', error); setItems([...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS]); } finally { setIsDataLoaded(true); }
  };

  // Effetto iniziale di caricamento dati e lettura automatica QR del tavolo
  useEffect(() => {
    fetchItems();
    
    const savedLogo = localStorage.getItem('oldWestLogoUrl');
    if (savedLogo) setCustomLogo(savedLogo);
    
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCategories();

    // LEGGERE IL TAVOLO DAL QR CODE DELLA URL (ES: ?table=5)
    const urlParams = new URLSearchParams(window.location.search);
    const tableParam = urlParams.get('table'); // Legge il parametro "?table=5" [8]

   if (tableParam) {
      // 1. Configura il carrello in modalità Tavolo e fissa il numero del tavolo in automatico! [1]
      setOrderForm(prev => ({
        ...prev,
        orderType: 'table',
        tableNumber: tableParam
      }));

      // 2. GESTIONE SESSIONE TAVOLO INTELLIGENTE (CONTO UNICO)
      const initTableSession = async () => {
        // Cerca in tempo reale se esiste già un conto aperto non pagato per questo tavolo su Supabase [1]
        const { data, error } = await supabase
          .from('orders')
          .select('table_session_id, customer_name')
          .eq('order_type', 'table')
          .eq('payment_status', 'unpaid')
          .ilike('customer_name', `%TAVOLO ${tableParam}%`)
          .limit(1);

        let session = '';

        if (!error && data && data.length > 0) {
          // CASO 1: C'è un conto attivo dello staff (pre-ordine o ordine in corso) [1]
          session = data[0].table_session_id;
          setHasPriorOrders(true); // Attiva subito lo scontrino rosso pulsante!

          // ESTRAZIONE E SINCRONIZZAZIONE AUTOMATICA DEL NOME
          const rawName = data[0].customer_name;
          const parsedName = rawName
            .replace("AGGIUNTE - ", "")
            .replace(/TAVOLO\s+\d+/i, "")
            .replace(/[()]/g, "") // Rimuove le parentesi tonde
            .trim();

          if (parsedName && parsedName !== "Ospite") {
            setOrderForm(prev => ({
              ...prev,
              customerName: parsedName // Imposta automaticamente "Alexandra" nel modulo
            }));
          }

        } else {
          // CASO 2: Nessun conto attivo nel database. Controlliamo se ne abbiamo una salvata in locale [1]
          const localSession = localStorage.getItem('active_table_session_id');
          const savedTableNum = localStorage.getItem('active_table_number');
          
          if (localSession && savedTableNum === tableParam) {
            session = localSession;
          } else {
            // Altrimenti generiamo una nuova sessione da zero per il primo ordine [1]
            session = `session-${tableParam}-${Math.random().toString(36).substring(2, 9)}`;
          }
          setHasPriorOrders(false);
        }

        // Memorizziamo la sessione corretta sia nello stato che nel localStorage [1]
        setTableSessionId(session);
        localStorage.setItem('active_table_session_id', session);
        localStorage.setItem('active_table_number', tableParam);
      };

      // Avvia l'inizializzazione della sessione
      initTableSession();

      // 3. SALTA LA LANDING PAGE e proietta il cliente direttamente nel MENÙ!
      setView('MENU');
      window.scrollTo(0,0);
    } else {
      // Se NON c'è il parametro tavolo (ordine classico da casa), controlla se c'è un ordine attivo da tracciare [1]
      const savedOrderId = localStorage.getItem('activeOrderId');
      if (savedOrderId) {
        const checkOrder = async () => {
           const { data } = await supabase.from('orders').select('*').eq('id', savedOrderId).single();
           if (data && data.status !== 'completed' && data.status !== 'cancelled') {
              setActiveOrderId(data.id);
              setCurrentOrder(data);
              setView('TRACKING');
           } else {
              localStorage.removeItem('activeOrderId');
           }
        };
        checkOrder();
      }
    }
  }, []);

  useEffect(() => {
  // Se l'utente è al tavolo (orderForm.tableNumber è popolato) e non ha ancora un ID sessione locale
  if (orderForm.tableNumber && !tableSessionId) {
    const connectToActiveTableSession = async () => {
      // Cerca se esiste un ordine attivo non pagato per questo specifico tavolo
      const { data, error } = await supabase
        .from('orders')
        .select('table_session_id')
        .eq('order_type', 'table')
        .eq('payment_status', 'unpaid')
        .ilike('customer_name', `%TAVOLO ${orderForm.tableNumber}%`) // Cerca "TAVOLO 5" (case-insensitive)
        .limit(1);

      if (!error && data && data.length > 0) {
        const activeSid = data[0].table_session_id;
        
        // Collega istantaneamente il telefono del cliente a questa sessione usando le tue chiavi locali!
        setTableSessionId(activeSid);
        localStorage.setItem('active_table_session_id', activeSid);
        localStorage.setItem('active_table_number', orderForm.tableNumber);
        setHasPriorOrders(true); // Sblocca la cassa rapida in 1-Click!
      }
    };
    
    connectToActiveTableSession();
  }
}, [orderForm.tableNumber, tableSessionId]); // Monitora i cambiamenti del numero tavolo o della sessione

  useEffect(() => { const handleScroll = () => { if (window.scrollY > 300) setShowScrollTop(true); else setShowScrollTop(false); }; window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  useEffect(() => { if (diyType && diyHeaderRef.current) { diyHeaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, [diyStep, diyType]);
  useEffect(() => {
    if (view === 'TRACKING' && activeOrderId) {
      const channel = supabase
        .channel('order-tracking')
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${activeOrderId}` }, 
          (payload) => {
            setCurrentOrder(payload.new);
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [view, activeOrderId]);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => { if (!ref.current) return; setIsDragging(true); setStartX(e.pageX - ref.current.offsetLeft); setScrollLeft(ref.current.scrollLeft); };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>) => { if (!isDragging || !ref.current) return; e.preventDefault(); const x = e.pageX - ref.current.offsetLeft; const walk = (x - startX) * 2; ref.current.scrollLeft = scrollLeft - walk; };
  const scrollCarousel = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => { if (ref.current) { const scrollAmount = 300; ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' }); } };
  const getProductContent = (item: MenuItem | Partial<MenuItem>) => { if (lang === 'it') return { name: item.name || '', description: item.description || '' }; const trans = item.translations?.[lang]; return { name: trans?.name || item.name || '', description: trans?.description || item.description || '' }; };
  const getOptionName = (opt: any, lang: LanguageCode) => {
  // Se l'oggetto ha la proprietà 'category', significa che è un MenuItem del database.
  // In questo caso usiamo la tua funzione getProductContent
  if (opt.category) {
    return getProductContent(opt).name;
  }
  // Altrimenti, se è un'opzione statica del constants.ts, usiamo getDIYOptionContent
  return getDIYOptionContent(opt, lang);
};
  const checkFilters = (item: MenuItem) => {
    if (activeFilters.vegetarian) { const isVeg = item.tags?.includes('Vegetariano') || item.tags?.includes('Vegano') || item.category === ProductCategory.CONTORNI || (item.category === ProductCategory.PIZZA && (item.name === 'Vegetariana' || item.name === 'Margherita' || item.name === 'Marinara' || item.name === 'Verdure')); if (!isVeg) return false; }
    if (activeFilters.vegan) { const isVegan = item.tags?.includes('Vegano') || (item.category === ProductCategory.CONTORNI && item.name !== 'Patatine Fritte') || (item.category === ProductCategory.PIZZA && item.name === 'Marinara'); if (!isVegan) return false; }
    if (activeFilters.spicy) { const nameLower = item.name.toLowerCase(); if (nameLower.includes('salamella') && !item.tags?.includes('Piccante')) return false; const isSpicy = item.tags?.includes('Piccante') || item.description.toLowerCase().includes('piccante') || item.description.toLowerCase().includes('nduja'); if (!isSpicy) return false; }
    if (activeFilters.bestseller) { const isBest = item.tags?.includes('Best Seller') || item.tags?.includes('Consigliato'); if (!isBest) return false; }
    return true;
  };

  const handleCategoryClick = (cat: string) => { setActiveCategory(cat); setActiveSubCategoryView(null); if (view === 'MENU') { const listStart = 300; if (window.scrollY > listStart) window.scrollTo({ top: listStart, behavior: 'smooth' }); } };
  useEffect(() => { const activeBtn = document.getElementById(`btn-${activeCategory}`); if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeCategory]);
  
  const getCrossSellSuggestion = (item: MenuItem) => {
      if (item.category === ProductCategory.HAMBURGER || item.category === ProductCategory.PIZZA) return t('suggestion_burger', lang);
      if (item.category === ProductCategory.SECONDI || item.category === ProductCategory.PESCE) return t('suggestion_main', lang);
      if (item.category === ProductCategory.DOLCI) return t('suggestion_dessert', lang);
      return null;
  };

  const addToCart = (item: MenuItem, variant?: ProductVariant) => {
    setAddedItemId(item.id); setTimeout(() => setAddedItemId(null), 1000);
    const existingItemIndex = cart.findIndex((i) => i.id === item.id && (variant ? i.selectedVariant?.name === variant.name : !i.selectedVariant) && (!i.selectedAddons || i.selectedAddons.length === 0));
    if (existingItemIndex > -1) { const newCart = [...cart]; newCart[existingItemIndex].quantity += 1; setCart(newCart); } else { setCart([...cart, { ...item, cartId: Math.random().toString(), quantity: 1, selectedVariant: variant }]); }
    const suggText = getCrossSellSuggestion(item);
    if (suggText) { setSuggestionToast({ show: true, text: suggText }); setTimeout(() => setSuggestionToast({ show: false, text: '' }), 2000); }
  };

  const handleAddToCartClick = (item: any) => {
  const catName = item.category?.toUpperCase() || "";
  const subCatName = item.subCategory?.toUpperCase() || "";
  const prodName = item.name?.toUpperCase() || "";

  // Rileva se si tratta di una bibita singola (senza varianti) che necessita del servizio bar
  const isSingleDrinkWithService = 
    catName === "BEVANDE" && 
    (!item.variants || item.variants.length === 0) &&
    (
      subCatName.includes("BIBIT") || 
      subCatName.includes("LATTIN") ||
      subCatName.includes("ACQUA") ||
      prodName.includes("COCA") || 
      prodName.includes("FANTA") || 
      prodName.includes("SPRITE") ||
      prodName.includes("COLA") ||
      prodName.includes("CHINOTTO") ||
      prodName.includes("LEMON") ||
      prodName.includes("TONICA") ||
      prodName.includes("ESTATHE")
    );

  if (item.variants && item.variants.length > 0) {
    // Se il prodotto ha varianti (come gli Amari o le Pizze), apre il modale
    setSelectingVariantItem(item);
    setVariantSearchQuery(""); // Svuota ricerche precedenti
  } else if (isSingleDrinkWithService) {
    // Se è una bibita singola, apriamo il modale e impostiamo una variante fittizia ("dummy")
    // Questo farà saltare la Fase 1 e aprirà direttamente la Fase 2 di scelta servizio!
    setSelectingVariantItem(item);
    setTempSelectedVariant({ name: "Standard", price: item.price, isDummy: true });
  } else {
    // Altrimenti lo aggiunge direttamente (Pizze, Hamburger, Dolci, ecc.)
    addToCart(item);
  }
};
  
  const removeFromCart = (cartId: string) => setCart(cart.filter(i => i.cartId !== cartId));
  const updateCartItemQuantity = (cartId: string, delta: number) => { setCart(cart.map(item => { if (item.cartId === cartId) { const newQty = item.quantity + delta; return newQty > 0 ? { ...item, quantity: newQty } : item; } return item; })); };
  const openAddonModal = (index: number) => { setEditingCartItemIndex(index); setAddonSearch(''); setIsAddonModalOpen(true); };
  const addAddonToItem = (addon: MenuItem) => { if (editingCartItemIndex === null) return; const newCart = [...cart]; const updatedItem = { ...newCart[editingCartItemIndex] }; const currentAddons = updatedItem.selectedAddons || []; updatedItem.selectedAddons = [...currentAddons, addon]; newCart[editingCartItemIndex] = updatedItem; setCart(newCart); setIsAddonModalOpen(false); setEditingCartItemIndex(null); };
  const removeAddonFromItem = (cartItemIndex: number, addonIndex: number) => {
    const newCart = [...cart];
    const updatedItem = { ...newCart[cartItemIndex] };
    
    if (updatedItem.selectedAddons) {
      // Creiamo una copia della lista ingredienti e togliamo quello specifico
      const newAddons = [...updatedItem.selectedAddons];
      newAddons.splice(addonIndex, 1); 
      updatedItem.selectedAddons = newAddons;
      
      // Aggiorniamo il carrello
      newCart[cartItemIndex] = updatedItem;
      setCart(newCart);
    }
  };

  // --- NUOVA LOGICA TOTALI ---
  const getCartItemsTotal = () => { 
      return cart.reduce((sum, item) => { 
          const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price; 
          const addonsPrice = item.selectedAddons?.reduce((aSum, addon) => aSum + Number(addon.price), 0) || 0; 
          return sum + (itemPrice + addonsPrice) * item.quantity; 
      }, 0); 
  };

  const getCoverCharge = () => {
     if (orderForm.orderType === 'table') {
        // Se è un'aggiunta (hasPriorOrders è true), il coperto è 0!
        if (hasPriorOrders) return 0; 
        
        const hasFood = cart.some(item => item.category !== ProductCategory.BEVANDE);
        return hasFood && cart.length > 0 ? (tempReservationInfo ? tempReservationInfo.numPeople * 2.00 : 2.00) : 0;
     }
     return 0;
  };

  const checkFirstOrderPromotion = async (phone: string) => {
  // Avviamo il controllo solo se il numero di telefono sembra completo (almeno 9 cifre)
  if (phone.trim().length < 9) {
    setIsFirstOrder(false);
    return;
  }

  try {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('customer_phone', phone.trim())
      .neq('status', 'cancelled'); // Escludiamo dal conteggio eventuali ordini annullati

    if (error) throw error;

    // Se il conteggio degli ordini passati è esattamente 0, è il suo primo ordine!
    setIsFirstOrder(count === 0);
  } catch (error) {
    console.error("Errore nel controllo promozione lancio:", error);
    setIsFirstOrder(false); // In caso di errore, per sicurezza applichiamo la tariffa standard
  }
};

  const getDeliveryFee = () => {
    // Solo se l'ordine è 'delivery' applico il costo, altrimenti è 0
    if (orderForm.orderType !== 'delivery') return 0;
    // Se è la promozione del primo ordine, restituiamo 0 (consegna gratis!)
  return isFirstOrder ? 0 : speseConsegna;
  };

  const getGrandTotal = () => getCartItemsTotal() + getCoverCharge() + getDeliveryFee();

  const handleDiySelection = (stepId: string, option: any, isMulti = false) => {
  setDiySelections(prev => {
    if (!isMulti) {
      // MONOSELEZIONE: Sostituisce la selezione precedente
      return { ...prev, [stepId]: option };
    } else {
      // MULTISELEZIONE: Aggiunge o rimuove dall'array
      const currentSelections = (prev[stepId] as any[]) || [];
      const exists = currentSelections.some(item => item.name === option.name);
      
      if (exists) {
        return {
          ...prev,
          [stepId]: currentSelections.filter(item => item.name !== option.name)
        };
      } else {
        return {
          ...prev,
          [stepId]: [...currentSelections, option]
        };
      }
    }
  });

  // Mantiene lo scorrimento fluido verso i controlli
  setTimeout(() => { 
    diyControlsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
  }, 200);
};

  const handleDiyNext = () => {
  const activeConfig = diyType === 'house' ? HOUSE_BURGER_OPTIONS : TRUE_DIY_OPTIONS;

  if (diyStep < activeConfig.steps.length - 1) {
    setDiyStep(diyStep + 1);
  } else {
    // 1. CALCOLO DEL PREZZO TOTALE COMPRESO DI TUTTO
    // Sommiamo pane + carne + tutti i condimenti scelti + contorno direttamente qui.
    const totalPrice = activeConfig.basePrice + activeConfig.steps.reduce((acc, step) => {
      const selected = diySelections[step.id];
      if (!selected) return acc;

      if (step.isMulti) {
        const multiPrice = (selected as any[]).reduce((sum, item) => sum + Number(item.price), 0);
        return acc + multiPrice;
      } else {
        return acc + Number(selected.price);
      }
    }, 0);

    // 2. COMPOSIZIONE DELLA DESCRIZIONE DETTAGLIATA
    const description = activeConfig.steps.map(step => {
      const selected = diySelections[step.id];
      if (!selected) return '';

      if (step.isMulti) {
        const labelStep = step.title;
        const multiNames = (selected as any[])
          .map(item => getOptionName(item, lang))
          .join(', ');
        
        return multiNames ? `${labelStep}: ${multiNames}` : '';
      } else {
        const optionName = getOptionName(selected, lang);
        
        if (step.id === 'contorno') {
          return `Contorno: ${optionName}`;
        }
        return `${optionName}`;
      }
    }).filter(Boolean).join(' + ');

    // 3. CREAZIONE DELL'OGGETTO CARRELLO
    const diyItem: any = {
      id: `diy-${Date.now()}`,
      name: diyType === 'house' 
        ? (lang === 'it' ? "Hamburger della Casa" : (lang === 'fr' ? "Burger de la Maison" : "House Burger")) 
        : t('create_your_taste', lang),
      description: description,
      price: totalPrice, // <--- Il prezzo di 15.00€ comprende già tutto
      category: ProductCategory.HAMBURGER,
      isAvailable: true,
      imageUrl: diyType === 'house' 
        ? 'https://oldwest.click/wp-content/uploads/2020/02/hamburger-della-casa.jpg' 
        : 'https://oldwest.click/wp-content/uploads/2020/02/hamburger-fai-da-te.jpg',
      
      // Impostiamo selectedAddons vuoto per evitare doppioni grafici e tentativi di frode del cliente
      selectedAddons: [] 
    };

    addToCart(diyItem);
    
    // Reset dello stato
    setDiySelections({});
    setDiyStep(0);
    setDiyType(null);
    setActiveSubCategoryView(null);
  }
};

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (adminPassword === '1234') { setView('ADMIN'); setAdminPassword(''); setLoginError(''); setActiveCategory('Tutti'); setLang('it'); } else { setLoginError('PIN non valido'); } };
  const handleSaveItem = async (e: React.FormEvent) => { e.preventDefault(); if (!newItem.name || !newItem.price) return; const itemToSave = { name: newItem.name, description: newItem.description, price: Number(newItem.price), category: newItem.category, subCategory: newItem.category === ProductCategory.HAMBURGER || newItem.category === ProductCategory.BEVANDE ? newItem.subCategory : undefined, imageUrl: newItem.imageUrl, isAvailable: newItem.isAvailable !== undefined ? newItem.isAvailable : true, tags: newItem.tags || [], brand: newItem.brand || null, variants: newItem.variants || null, translations: newItem.translations || null, allergens: newItem.allergens || [] }; try { if (editingId) { await supabase.from('menu_items').update(itemToSave).eq('id', editingId); alert('Prodotto modificato!'); } else { await supabase.from('menu_items').insert([itemToSave]); alert('Prodotto aggiunto!'); } fetchItems(); setEditingId(null); setNewItem({ category: ProductCategory.HAMBURGER, subCategory: HAMBURGER_SUBCATEGORIES[0], isAvailable: true, name: '', description: '', price: 0, imageUrl: '', translations: {}, brand: undefined, variants: undefined, allergens: [] }); setAdminLang('it'); } catch (error) { console.error(error); alert('Errore database.'); } };
  const handleEditItem = (item: MenuItem) => { setNewItem({ ...item }); setEditingId(item.id); setAdminLang('it'); document.getElementById('new-product-form')?.scrollIntoView({ behavior: 'smooth' }); };
  const handleCancelEdit = () => { setEditingId(null); setNewItem({ category: ProductCategory.HAMBURGER, subCategory: HAMBURGER_SUBCATEGORIES[0], isAvailable: true, name: '', description: '', price: 0, imageUrl: '', translations: {}, brand: undefined, variants: undefined, allergens: [] }); setAdminLang('it'); };
  const handleDeleteItem = async (id: string, e?: React.MouseEvent) => { if (e) { e.preventDefault(); e.stopPropagation(); } if (window.confirm('Eliminare?')) { try { await supabase.from('menu_items').delete().eq('id', id); fetchItems(); if (editingId === id) handleCancelEdit(); } catch (error) { console.error(error); alert('Errore eliminazione.'); } } };
  const handleDuplicateItem = async (item: MenuItem, e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (window.confirm(`Vuoi duplicare il prodotto "${item.name}"?`)) {   // Creiamo l'oggetto copiando i campi ma escludendo l'ID originale (Supabase ne genererà uno nuovo)
   const duplicatedItem = {
        name: `${item.name} - Copia`,
        description: item.description || '',
        price: item.price,
        category: item.category,
        subCategory: item.subCategory || null,
        imageUrl: item.imageUrl || null,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        tags: item.tags || [],
        brand: item.brand || null,
        variants: item.variants || null,
        translations: item.translations || null,
        allergens: item.allergens || []
      };

      try {
        const { error } = await supabase.from('menu_items').insert([duplicatedItem]);
        if (error) throw error;
        alert('Prodotto duplicato con successo!');
        fetchItems(); // Ricarica la lista aggiornata dal database
      } catch (error) {
        console.error("Errore durante la duplicazione:", error);
        alert('Errore durante la duplicazione del prodotto.');
      }
    }
  };
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { setIsProcessingImage(true); try { const url = await uploadImageToSupabase(file); if(url) setCustomLogo(url); } catch(e){alert('Errore upload');} finally{setIsProcessingImage(false);} } };
  const handleSaveLogo = () => { if(customLogo) { localStorage.setItem('oldWestLogoUrl', customLogo); alert('Logo salvato!'); } };
  const handleResetLogo = () => { if(window.confirm('Reset logo?')) { setCustomLogo(''); localStorage.removeItem('oldWestLogoUrl'); } };
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { setIsProcessingImage(true); try { const url = await uploadImageToSupabase(file); if(url) setNewItem({...newItem, imageUrl: url}); } catch(e){alert('Errore upload');} finally{setIsProcessingImage(false);} } };
  const handleRemoveProductImage = () => setNewItem({...newItem, imageUrl: ''});
  const handleSyncInitialData = async () => { if (window.confirm("Sovrascrivere database con dati iniziali?")) { setIsSyncing(true); try { const itemsToSync = [...INITIAL_MENU_ITEMS, ...EXTRA_INGREDIENTS_ITEMS].map(i => ({ name: i.name, description: i.description, price: i.price, category: i.category, "subCategory": i.subCategory||null, "imageUrl": i.imageUrl||null, brand: i.brand||null, "isAvailable": true, tags: i.tags||[], variants: i.variants||null, translations: i.translations||null, allergens: i.allergens||[] })); const { error } = await supabase.from('menu_items').insert(itemsToSync); if (error) throw error; alert("Sincronizzato!"); fetchItems(); } catch (e: any) { alert("Errore sync: " + e.message); } finally { setIsSyncing(false); } } };
  const handleExportData = () => { const dataStr = JSON.stringify(items, null, 2); const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr); const link = document.createElement('a'); link.setAttribute('href', dataUri); link.setAttribute('download', `backup_${new Date().toISOString().slice(0,10)}.json`); link.click(); };
  const handleImportData = () => alert("Import locale disabilitato. Usa sync cloud.");
  const handleFactoryReset = () => alert("Reset locale disabilitato. Gestisci da DB.");

// FUNZIONE UNIFICATA PER L'INVIO DELL'ORDINE (SUPPORTA ANCHE IL RECUPERO POST-PAGAMENTO STRIPE)
  const handleSubmitOrder = async (
    e?: React.FormEvent, 
    customCart?: any[], 
    customForm?: any,
    isFastAddon = false
    ) => {
    if (e) e.preventDefault();
    setIsSubmittingOrder(true);

    
    // Se passati (dopo il pagamento), usa i dati recuperati dal localStorage, altrimenti usa lo stato corrente
    const activeCart = customCart || cart;
    const activeForm = customForm || orderForm;

    const finalCustomerName = activeForm.orderType === 'table' 
      ? `TAVOLO ${activeForm.tableNumber} (${activeForm.customerName || 'Ospite'})` 
      : activeForm.customerName;
    const finalPhone = activeForm.orderType === 'table' ? 'N/D' : activeForm.customerPhone;
    const isDeliveryOrTakeaway = activeForm.orderType === 'delivery' || activeForm.orderType === 'takeaway';
    const hasMissingFreeDrinks = activeCart.some(item => {
      const isBimbi = item.category === ProductCategory.BIMBI;
      return (isBimbi && !item.selectedFreeDrink) || (isDeliveryOrTakeaway && item.category === ProductCategory.PIZZA && !item.selectedFreeDrink);
    });
    
    if (hasMissingFreeDrinks) {
      alert("Seleziona la bevanda omaggio per tutti i piatti che la richiedono prima di procedere!");
      setIsSubmittingOrder(false);
      return;
    }

    try {
      let finalDeliveryFee = getDeliveryFee();

         // 1. CALCOLIAMO I TOTALI IN MODO UNIFICATO ED ESATTO
      const cartTotal = activeCart.reduce((sum: number, item: any) => { 
          const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price; 
          const addonsPrice = item.selectedAddons?.reduce((aSum: number, addon: any) => aSum + Number(addon.price), 0) || 0; 
          return sum + (itemPrice + addonsPrice) * item.quantity; 
      }, 0);

      const coverCharge = getCoverCharge(); // <--- USA DIRETTAMENTE LA FUNZIONE UNIFICATA (Sarà 6,00 €!)
      const finalTotalAmount = cartTotal + coverCharge + finalDeliveryFee; // <--- RISOLTO!

         // =========================================================================
      if (isPreOrder && tempReservationInfo) {
        const preparedCartItems = activeCart.map((item: any) => {
          const virtualAddons = [...(item.selectedAddons || [])];
          if (item.removedIngredients && item.removedIngredients.length > 0) {
            item.removedIngredients.forEach((ing: string) => {
              virtualAddons.push({
                id: `virtual-removed-${ing}-${Date.now()}`,
                name: `SENZA ${ing.toUpperCase()}`,
                description: '',
                price: 0,
                category: 'Ingredienti Extra',
                isAvailable: true
              });
            });
          }

          if (item.brand === "Contorno compreso" && item.selectedSideDish) {
            virtualAddons.push({
               id: `virtual-side-${item.selectedSideDish}-${Date.now()}`,
               name: `CONTORNO: ${item.selectedSideDish.toUpperCase()}`,
               description: '',
               price: 0,
               category: 'Ingredienti Extra',
               isAvailable: true
            });
         }
          // AGGIUNTO: Genera la comanda virtuale per la bibita omaggio anche nei pre-ordini
            const isFocaccia = item.name.toLowerCase() === "focaccia";
            const isPizza = item.category === ProductCategory.PIZZA && !isFocaccia;;
            const isBimbi = item.category === ProductCategory.BIMBI;
            const isDeliveryOrTakeaway = activeForm.orderType === 'delivery' || activeForm.orderType === 'takeaway';
            
            if (((isDeliveryOrTakeaway && isPizza) || isBimbi) && item.selectedFreeDrink) {
               virtualAddons.push({
               id: `virtual-drink-${item.selectedFreeDrink}-${Date.now()}`,
               name: `OMAGGIO: ${item.selectedFreeDrink.toUpperCase()}`,
               description: '',
               price: 0,
               category: 'Ingredienti Extra',
               isAvailable: true
               });
            }

          return { ...item, selectedAddons: virtualAddons };
        });

        const newReservation = {
          customer_name: tempReservationInfo.customerName,
          customer_phone: tempReservationInfo.customerPhone,
          customer_email: tempReservationInfo.customerEmail || null,
          reservation_date: tempReservationInfo.date,
          reservation_time: tempReservationInfo.time,
          num_people: tempReservationInfo.numPeople,
          notes: tempReservationInfo.notes,
          status: 'pending',
          pre_order_cart_items: preparedCartItems, // Salva il cibo qui dentro!
          total_amount: finalTotalAmount,          // Salva il totale corretto con i coperti compresi!
          user_id: user ? user.id : null
        };

        const { error: resError } = await supabase.from('reservations').insert([newReservation]);
        if (resError) throw resError;

        // Pulizia memoria temporanea e reindirizzamento al successo
        localStorage.removeItem('pending_checkout_cart');
        localStorage.removeItem('pending_checkout_form');
        setCart([]);
        setTempReservationInfo(null);
        setIsPreOrder(false);
        setSuccessType('BOOKING'); // Mostra la schermata di successo prenotazione
        setView('ORDER_SUCCESS');
        window.scrollTo(0,0);
        setIsSubmittingOrder(false);
        return; // <--- ESCI IMMEDIATAMENTE SENZA INSERIRE IN "ORDERS"!
      }

      // Se è a domicilio ed il calcolo chilometrico d'emergenza non è ancora stato eseguito (solo per ordine in tempo reale)
      if (!customForm && activeForm.orderType === 'delivery' && distanzaRilevata === null) {
        const query = `${activeForm.deliveryAddress}, ${activeForm.deliveryCity}, Italy`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
          { headers: { 'User-Agent': 'OldWestOnlineApp/1.0 (info@oldwest.click)' } }
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          const destLat = parseFloat(data[0].lat);
          const destLon = parseFloat(data[0].lon);
          const km = calcolaDistanzaInKm(45.49955, 8.67277, destLat, destLon);
          
          if (km > 15) {
            alert(`La tua posizione (~${km.toFixed(1)} km) supera il nostro limite massimo di consegna (15km). L'ordine non può essere completato.`);
            setIsSubmittingOrder(false);
            return;
          }
          
          let costo = 2.00;
          if (km > 5 && km <= 10) costo = 5.00;
          else if (km > 10 && km <= 15) costo = 8.00;
          
          // Se è la promozione primo ordine, azzeriamo il costo applicato
          const costoApplicato = isFirstOrder ? 0 : costo;
          finalDeliveryFee = costoApplicato;
          setSpeseConsegna(costoApplicato);
          setDistanzaRilevata(km);
          setErroreIndirizzo(null);
        } else {
          alert("Indirizzo di consegna non riconosciuto. Verifica via e civico prima di procedere.");
          setIsSubmittingOrder(false);
          return;
        }
      }

      // Se c'è un blocco di errore attivo legato alla distanza, fermiamo l'invio
      if (orderForm.orderType === 'delivery' && erroreIndirizzo && !customForm) {
        alert(erroreIndirizzo);
        setIsSubmittingOrder(false);
        return;
      }

      // Preparazione modificatori virtuali per lo staff
      const preparedCartItems = activeCart.map((item: any) => {
        const virtualAddons = [...(item.selectedAddons || [])];
        if (item.removedIngredients && item.removedIngredients.length > 0) {
          item.removedIngredients.forEach((ing: string) => {
            virtualAddons.push({
              id: `virtual-removed-${ing}-${Date.now()}`,
              name: `SENZA ${ing.toUpperCase()}`,
              description: '',
              price: 0,
              category: 'Ingredienti Extra',
              isAvailable: true
            });
          });
        }
        const isFocaccia = item.name.toLowerCase() === "focaccia";
        const isPizza = item.category === ProductCategory.PIZZA && !isFocaccia;
        const isBimbi = item.category === ProductCategory.BIMBI;
        const isDeliveryOrTakeaway = activeForm.orderType === 'delivery' || activeForm.orderType === 'takeaway';
        
        // Genera la comanda virtuale per la bibita omaggio (per i bimbi sempre, per le pizze solo a domicilio/asporto)
        if (((isDeliveryOrTakeaway && isPizza) || isBimbi) && item.selectedFreeDrink) {
          virtualAddons.push({
            id: `virtual-drink-${item.selectedFreeDrink}-${Date.now()}`,
            name: `OMAGGIO: ${item.selectedFreeDrink.toUpperCase()}`,
            description: '',
            price: 0,
            category: 'Ingredienti Extra',
            isAvailable: true
          });
        }

       // NUOVO: Genera la comanda virtuale per il contorno compreso dello Staff
         if (item.brand === "Contorno compreso" && item.selectedSideDish) {
            virtualAddons.push({
               id: `virtual-side-${item.selectedSideDish}-${Date.now()}`,
               name: `CONTORNO: ${item.selectedSideDish.toUpperCase()}`,
               description: '',
               price: 0,
               category: 'Ingredienti Extra',
               isAvailable: true
            });
         }

        return { ...item, selectedAddons: virtualAddons };
      });
       
      // Genera una nuova sessione unica per il tavolo se è il primo ordine assoluto e l'utente ha scansionato il QR
         let activeTableSessionId = tableSessionId;
         if (activeForm.orderType === 'table' && !activeTableSessionId) {
         activeTableSessionId = `session-${activeForm.tableNumber}-${Date.now()}`;
         }

      const isAddition = tableSessionId !== null && hasPriorOrders; 
       // Nota: se il carrello ha prodotti e c'è una sessione, è un'aggiunta.
      const newOrder = {
        // Se è un'aggiunta successiva al tavolo, appendiamo "AGGIUNTA" al nome del cliente in modo che si stampi in cucina!
        customer_name: finalCustomerName,
        customer_phone: finalPhone,
        customer_email: activeForm.customerEmail,
        order_type: activeForm.orderType,
        delivery_address: activeForm.orderType === 'delivery' ? activeForm.deliveryAddress : null,
        delivery_city: activeForm.orderType === 'delivery' ? activeForm.deliveryCity : null,
        delivery_time: activeForm.orderType === 'table' ? 'Immediato' : activeForm.deliveryTime,
        payment_method: activeForm.paymentMethod,
        total_amount: finalTotalAmount,
        cart_items: preparedCartItems,
        status: 'pending',
        notes: activeForm.notes,
        user_id: user ? user.id : null,
        
        // NUOVI CAMPI PER LA GESTIONE DEL CONTO UNICO E AGGIUNTE AL TAVOLO
        table_session_id: activeTableSessionId, // Collega l'ordine a questa specifica sessione del tavolo!
        payment_status: activeForm.paymentMethod === 'stripe' ? 'paid' : 'unpaid', // Segna come pagato solo se pagano con Stripe!
        is_addition: isAddition
      };

      // Se c'è una prenotazione tavolo in sospeso (Scenario Pre-ordine), la salviamo nel database di Supabase
      if (tempReservationInfo) {
        const newReservation = {
          customer_name: tempReservationInfo.customerName,
          customer_phone: tempReservationInfo.customerPhone,
          customer_email: tempReservationInfo.customerEmail || null,
          reservation_date: tempReservationInfo.date,
          reservation_time: tempReservationInfo.time,
          num_people: tempReservationInfo.numPeople,
          notes: `PRE-ORDINE ASSOCIATO. Nota cliente: ${tempReservationInfo.notes}`,
          status: 'pending',
          pre_order_cart_items: preparedCartItems, // Salviamo il pre-ordine di cibo anche dentro alla prenotazione!
          user_id: user ? user.id : null
        };
        
        // Salva la prenotazione tavolo in parallelo
        await supabase.from('reservations').insert([newReservation]);
      }

      const { data: dbData, error } = await supabase.from('orders').insert([newOrder]).select();

      if (error) throw error;
      
      if (dbData && dbData[0]) {
        setActiveOrderId(dbData[0].id);
        localStorage.setItem('activeOrderId', dbData[0].id);
        setCurrentOrder(dbData[0]);
        setCart([]);
        // AGGIUNTO: Pulisce la memoria del tavolo se l'ordine ha successo
        setTempReservationInfo(null);
        setIsPreOrder(false);
        
        if (customForm) {
          // Se è un recupero post-pagamento Stripe, puliamo la memoria temporanea ed eliminiamo i parametri dall'URL
          localStorage.removeItem('pending_checkout_cart');
          localStorage.removeItem('pending_checkout_form');
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (activeForm.orderType === 'table' && activeTableSessionId) {
            setTableSessionId(activeTableSessionId);
            localStorage.setItem('tableSessionId', activeTableSessionId);
            setHasPriorOrders(true); // Sblocca la cassa rapida per i giri successivi!
         }

        if (!isFastAddon) {
          setView('TRACKING');
          window.scrollTo(0,0);
        }

      }
    } catch (err) {
      console.error(err);
      alert('Errore nell\'invio dell\'ordine. Riprova per favore.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Recupera l'ordine in sospeso dopo il reindirizzamento riuscito di Stripe (Senza Duplicazione Codice)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPaymentSuccess = urlParams.get('payment_success') === 'true';

    if (isPaymentSuccess) {
      const pendingCart = localStorage.getItem('pending_checkout_cart');
      const pendingForm = localStorage.getItem('pending_checkout_form');
      const pendingRes = localStorage.getItem('pending_checkout_reservation');

      if (pendingCart && pendingForm) {
        const parsedCart = JSON.parse(pendingCart);
        const parsedForm = JSON.parse(pendingForm);

        // RIPRISTINA LA PRENOTAZIONE IN MEMORIA PRIMA DI INVIARE!
        if (pendingRes) {
          setTempReservationInfo(JSON.parse(pendingRes));
        }
        
        // CHIAMA LA FUNZIONE UNICA PASSANDO I DATI SALVATI NEL LOCAL STORAGE!
        handleSubmitOrder(undefined, parsedCart, parsedForm);
      }
    }
  }, [user, speseConsegna]);
  
  // --- RENDER FUNCTIONS ---

  const renderHeader = () => {
    const isDeliveryOrTakeaway = orderForm.orderType === 'delivery' || orderForm.orderType === 'takeaway';
    
    return (
      <nav className="print:hidden fixed top-0 left-0 right-0 z-50 bg-wood-900 shadow-md">
        <div className="container mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          
          {/* LOGO E TITOLO (STABILE E DIRITTO) */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setView('LANDING'); window.scrollTo(0,0); }}>
             <WesternLogo size="md" url={customLogo} />
             <div className="flex flex-col"><span className="font-western text-xl text-white tracking-wide leading-none">OLD WEST</span><span className="text-[10px] uppercase tracking-[0.2em] text-accent-500 font-bold">Cameri</span></div>
          </div>

          <div className="flex items-center gap-3">

             {/* NUOVO PULSANTE: IL MIO CONTO UNIFICATO AL TAVOLO (FOTO 2) */}
             {tableSessionId && (
                <button 
                   type="button"
                   onClick={handleOpenBillModal} 
                   className="w-10 h-10 rounded-full flex items-center justify-center text-wood-400 hover:text-white hover:bg-wood-800 transition-all relative"
                   title="Il Mio Conto Unificato"
                >
                   <ReceiptText size={20} className={hasPriorOrders ? 'text-orange-400' : ''} />
                   {/* Un piccolo pallino arancione lampeggiante avvisa il cliente se ha consumazioni non pagate in corso */}
                   {hasPriorOrders && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse border border-wood-950"></span>
                   )}
                </button>
             )}
             
             {/* 1. FRECCIA CURVA DI RITORNO ALLA HOME (Invisibile sulla Landing e se siamo al Tavolo!) */}
               {view !== 'LANDING' && !tableSessionId && (
                  <button 
                     type="button"
                     onClick={() => { setView('LANDING'); window.scrollTo(0,0); }} 
                     className="w-8 h-8 rounded-full flex items-center justify-center bg-[#45856c] text-white hover:bg-[#346a54] transition-all hover:scale-105 active:scale-95 shadow-sm ml-2 mr-0.5 shrink-0"
                     title="Torna alla schermata iniziale"
                  >
                     <Undo size={14} />
                  </button>
               )}

             {/* 2. MENU LINGUE (Mostrato solo nelle visualizzazioni principali) */}
             {(view === 'LANDING' || view === 'MENU' || view === 'CHECKOUT') && (
                <div className="relative">
                   {isLangMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)}></div>}
                   <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-2 bg-wood-800 hover:bg-wood-700 transition-colors pl-3 pr-2 py-1.5 rounded-xl border border-wood-700 text-white"><span className="text-xl leading-none">{LANGUAGES_CONFIG.find(l => l.code === lang)?.flag}</span><ChevronDown size={14} className={`text-wood-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} /></button>
                   {isLangMenuOpen && (<div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-wood-100 overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200">{LANGUAGES_CONFIG.map((l) => (<button key={l.code} onClick={() => { setLang(l.code as LanguageCode); setIsLangMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 hover:bg-wood-50 transition-colors text-left ${lang === l.code ? 'bg-accent-50 text-accent-700' : 'text-wood-700'}`}><div className="flex items-center gap-3"><span className="text-2xl leading-none shadow-sm rounded-sm">{l.flag}</span><span className="text-sm font-bold">{l.label}</span></div>{lang === l.code && <Check size={16} />}</button>))}</div>)}
                </div>
             )}

             {/* 3. TASTO CARRELLO (Mostrato solo nel MENU) */}
             {view === 'MENU' && (
                <button 
                   type="button"
                   onClick={() => setIsCartOpen(true)} 
                   className="w-10 h-10 rounded-full flex items-center justify-center text-wood-400 hover:text-white hover:bg-wood-800 transition-all relative"
                   title="Apri Carrello"
                >
                   <ShoppingCart size={20} />
                   {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#45856c] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] animate-bounce shadow-sm border border-wood-950">
                         {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                   )}
                </button>
             )}

             {/* 4. OMINO PROFILO UTENTE (Mostrato nelle visualizzazioni principali) */}
             {(view === 'LANDING' || view === 'MENU' || view === 'CHECKOUT') && (
                <button 
                   type="button"
                   onClick={() => {
                      if (user) {
                         setAuthForm({
                            email: user.email || '',
                            password: '',
                            fullName: profile?.full_name || '',
                            phone: profile?.phone || '',
                            address: profile?.address || '',
                            city: profile?.city || DELIVERY_ZONES[0] || ''
                         });
                         setIsProfileOpen(true);
                      } else {
                         setAuthMode('LOGIN');
                         setAuthForm({ email: '', password: '', fullName: '', phone: '', address: '', city: DELIVERY_ZONES[0] || '' });
                         setIsAuthModalOpen(true);
                      }
                   }} 
                   className="w-10 h-10 rounded-full flex items-center justify-center text-wood-400 hover:text-white hover:bg-wood-800 transition-all"
                   title="Area Personale / Accedi"
                >
                   <User size={22} className={user ? 'text-[#45856c]' : ''} />
                </button>
             )}
          </div>
        </div>
      </nav>
    );
  };

  const renderFloatingCartBar = () => {
     if (cart.length === 0 || isCartOpen || view !== 'MENU') return null;
     const itemCount = cart.reduce((a, b) => a + b.quantity, 0);
     const total = getCartItemsTotal(); // FIX: Sulla barra flottante mostriamo solo i prodotti, senza coperto

     return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40 animate-in slide-in-from-bottom-20 duration-300">
           <button onClick={() => setIsCartOpen(true)} className="w-full bg-wood-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-wood-700 hover:bg-wood-800 transition-colors relative group">
              <div className="absolute left-4 bg-accent-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">{itemCount}</div>
              <span className="font-bold text-sm text-wood-100 mx-auto uppercase tracking-widest">{t('review_order', lang)}</span>
              <span className="absolute right-4 font-bold text-lg font-mono">€{total.toFixed(2)}</span>
           </button>
        </div>
     );
  };

  const renderCartDrawer = () => {
    // --- DIZIONARIO TRADUZIONI LOCALI PER IL CARRELLO ---
    const labelSenza = lang === 'it' ? 'SENZA' : lang === 'en' ? 'WITHOUT' : lang === 'fr' ? 'SANS' : 'OHNE';
    const labelContorno = lang === 'it' ? 'Contorno' : lang === 'en' ? 'Side dish' : lang === 'fr' ? 'Accompagnement' : 'Beilage';
    const labelOmaggio = lang === 'it' ? 'Omaggio' : lang === 'en' ? 'Free drink' : lang === 'fr' ? 'Boisson offerte' : 'Gratis getränk';
    const labelScegliContorno = lang === 'it' ? 'Scegli il contorno' : lang === 'en' ? 'Choose side dish' : lang === 'fr' ? 'Choisir l\'accompagnement' : 'Beilage wählen';
    const labelScegliOmaggio = lang === 'it' ? 'Scegli bibita omaggio' : lang === 'en' ? 'Choose free drink' : lang === 'fr' ? 'Choisir boisson' : 'Gratis getränk scegliere';
    const labelObbligatorio = lang === 'it' ? 'Obbligatorio' : lang === 'en' ? 'Required' : lang === 'fr' ? 'Obligatoire' : 'Erforderlich';
    const labelModifica = lang === 'it' ? 'Modifica' : lang === 'en' ? 'Change' : lang === 'fr' ? 'Modifier' : 'Bearbeiten';
    const labelScegliContorniOmaggi = lang === 'it' ? 'Scegli contorni/omaggi per procedere' : lang === 'en' ? 'Choose side dishes/free drinks to proceed' : lang === 'fr' ? 'Choisissez accompagnements/boissons pour procéder' : 'Beilagen/Gratisgetränke wählen';
    const labelPersonalizzaProdotto = lang === 'it' ? 'Personalizza prodotto' : lang === 'en' ? 'Customize product' : lang === 'fr' ? 'Personnaliser le prodotto' : 'Produkt anpassen';
    const labelDoppio = lang === 'it' ? 'Doppio' : lang === 'en' ? 'Double' : lang === 'fr' ? 'Double' : 'Doppelt';

    // Recuperiamo il prodotto che stiamo modificando dal carrello... (il resto del tuo codice continua qui) 

    // Recuperiamo il prodotto che stiamo modificando dal carrello
    const itemBeingEdited = editingCartItemIndex !== null ? cart[editingCartItemIndex] : null;

    // Filtriamo gli ingredienti extra in base alla categoria del prodotto
  // Filtriamo gli ingredienti extra in base alla categoria del prodotto
  const addons = items.filter(i => {
    if (i.category !== ProductCategory.AGGIUNTE) return false;
    if (!itemBeingEdited) return true; // Controllo di sicurezza se l'articolo è nullo

    const prodName = itemBeingEdited.name?.toUpperCase() || "";
    const prodCategory = itemBeingEdited.category?.toUpperCase() || "";

    // MODIFICA APPLICATA QUI (aggiunto ": any"):
    let logicalCategory: any = itemBeingEdited.category; 

    // Fallback A: Se il nome è nella lista degli speciali, lo trattiamo come "Hamburger"
    const isSpecialHamburger = HAMBURGER_SPECIAL_NAMES.some(
      specialName => specialName.toUpperCase() === prodName
    );

    if (isSpecialHamburger) {
      logicalCategory = "Hamburger";
    }
    // Fallback B: Se la categoria contiene "PIZZA" o "PIZZE" (es: Pizze Speciali)
    else if (prodCategory.includes("PIZZA") || prodCategory.includes("PIZZE")) {
      logicalCategory = "Pizza";
    }
    // Fallback C: Se la categoria contiene "HAMBURGER" o "PANINI"
    else if (prodCategory.includes("HAMBURGER") || prodCategory.includes("PANINI")) {
      logicalCategory = "Hamburger";
    }

    // Mostriamo gli Extra Generali o quelli del reparto specifico (Pizza o Hamburger)
    return i.subCategory === "Generale" || i.subCategory === logicalCategory;
  });
      const filteredAddons = addons.filter((a: any) => 
         a.name.toLowerCase().includes(addonSearch.toLowerCase())
      );

      return (
      <>
        {isCartOpen && <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />}
        <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl transform transition-transform duration-300 z-50 max-h-[90vh] flex flex-col ${isCartOpen ? 'translate-y-0' : 'translate-y-full'}`}>
           <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-2xl font-western text-wood-900 flex items-center gap-2"><ShoppingCart size={24} /> {t('my_order', lang)}</h3>
                 <button onClick={() => setIsCartOpen(false)} className="p-2 bg-wood-100 rounded-full hover:bg-wood-200 transition-colors"><X size={20}/></button>
              </div>
              
               {cart.length === 0 ? (<div className="text-center py-10 text-wood-400">{t('empty_cart', lang)}</div>) : (
                 <div className="space-y-6">
                    {cart.map((item, index) => {
                       const requiresSideDish = item.brand === "Contorno compreso";
                       const isPizzaOrBurger = (item.category === ProductCategory.HAMBURGER || item.category === ProductCategory.PIZZA) && !item.id.startsWith('diy-');
                       const isDeliveryOrTakeaway = orderForm.orderType === 'delivery' || orderForm.orderType === 'takeaway';

                       return (
                        <div key={item.cartId} className="flex justify-between items-start border-b border-wood-100 pb-6">
                           <div className="flex-1 pr-4">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold text-wood-900 text-lg">{item.quantity}x {getProductContent(item).name}</span>
                              </div>
                              {item.selectedVariant && <span className="text-xs bg-wood-100 px-2 py-0.5 rounded text-wood-600 block w-fit mb-1">{item.selectedVariant.name}</span>}
                              {item.id.startsWith('diy-') && (<p className="text-xs italic text-wood-500 mb-2 leading-relaxed">{item.description}</p>)}
                              
                              {/* LISTA INGREDIENTI RIMOSSI IN ROSSO */}
                              {item.removedIngredients && item.removedIngredients.length > 0 && (
                                 <div className="text-xs font-bold text-red-600 mt-1 mb-2 space-y-0.5 uppercase tracking-wide">
                                    {item.removedIngredients.map((ing, rIdx) => (
                                       <div key={rIdx} className="flex items-center gap-1">
                                          <span>- {labelSenza} {ing}</span>
                                          <button 
                                             onClick={() => {
                                                const newCart = [...cart];
                                                const updated = { ...newCart[index] };
                                                updated.removedIngredients = updated.removedIngredients?.filter(i => i !== ing);
                                                newCart[index] = updated;
                                                setCart(newCart);
                                             }} 
                                             className="text-red-400 hover:text-red-600 p-0.5"
                                             title="Ripristina ingrediente"
                                          >
                                             <X size={10} />
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              )}

                              {/* LISTA INGREDIENTI EXTRA AGGIUNTI */}
                              {item.selectedAddons && item.selectedAddons.length > 0 && (
                                 <div className="text-sm text-[#45856c] mt-1 space-y-1">
                                    {item.selectedAddons.map((add, addonIdx) => (
                                       <div key={addonIdx} className="flex items-center gap-3 group">
                                          <div className="flex items-center gap-1 font-medium">
                                             <Plus size={10} /> {add.name}
                                             {/* Mostra il prezzo tra parentesi solo se è maggiore di zero! */}
                                             {Number(add.price) > 0 && ` (+€${Number(add.price).toFixed(2)})`}
                                             </div>
                                          <button onClick={() => removeAddonFromItem(index, addonIdx)} className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center shadow-sm border border-red-100" title="Rimuovi"><Trash2 size={12} /></button>
                                       </div>
                                    ))}
                                 </div>
                              )}

                              {/* SEZIONE CONTORNO COMPRESO TRADOTTA */}
                            {requiresSideDish && (
                              <div className="mt-2">
                                 {item.selectedSideDish ? (
                                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs font-bold px-3 py-1.5 rounded-xl w-fit">
                                       <Check size={14} className="text-green-600" />
                                       <span>{labelContorno}: {item.selectedSideDish.toUpperCase()}</span>
                                       <button onClick={() => openSideDishModal(index)} className="text-wood-400 hover:text-[#45856c] ml-2 font-bold underline">{labelModifica}</button>
                                    </div>
                                 ) : (
                                    <button 
                                       onClick={() => openSideDishModal(index)} 
                                       className="text-xs font-bold bg-orange-50 border border-orange-200 text-orange-600 rounded-xl px-3 py-2 flex items-center gap-1.5 hover:bg-orange-100 transition-colors animate-pulse"
                                    >
                                       <AlertCircle size={14} /> * {labelScegliContorno} ({labelObbligatorio})
                                    </button>
                                 )}
                              </div>
                            )}

                              {/* SEZIONE BEVANDA OMAGGIO TRADOTTA */}
                            {/* SEZIONE BEVANDA OMAGGIO (Dinamica: per le pizze solo a casa/asporto, per il menu bimbi sempre!) */}
                              {(() => {
                                 const isFocaccia = item.name.toLowerCase() === "focaccia";
                                 const isPizza = item.category === ProductCategory.PIZZA && !isFocaccia;
                                 const isBimbi = item.category === ProductCategory.BIMBI;
                                 
                                 // Mostra il pulsante se è un menu bimbi, OPPURE se è una pizza ma l'ordine è a casa/asporto
                                 const showDrinkButton = isBimbi || (isDeliveryOrTakeaway && isPizza);

                                 return showDrinkButton && (
                                    <div className="mt-2 animate-in fade-in duration-300">
                                       {item.selectedFreeDrink ? (
                                          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs font-bold px-3 py-1.5 rounded-xl w-fit">
                                             <Check size={14} className="text-green-600" />
                                             <span>{labelOmaggio}: {item.selectedFreeDrink.toUpperCase()}</span>
                                             <button type="button" onClick={() => openFreeDrinkModal(index)} className="text-wood-400 hover:text-[#45856c] ml-2 font-bold underline">{labelModifica}</button>
                                          </div>
                                       ) : (
                                          <button 
                                             type="button"
                                             onClick={() => openFreeDrinkModal(index)} 
                                             className="text-xs font-bold bg-orange-50 border border-orange-200 text-orange-600 rounded-xl px-3 py-2 flex items-center gap-1.5 hover:bg-orange-100 transition-colors animate-pulse"
                                          >
                                             <AlertCircle size={14} /> * {labelScegliOmaggio} ({labelObbligatorio})
                                          </button>
                                       )}
                                    </div>
                                 );
                              })()}

                              {/* TASTO PERSONALIZZA PRODOTTO (Sostituisce Tasto Aggiungi e traduce) */}
                              {isPizzaOrBurger && (
                                 <button 
                                    onClick={() => openCustomizationModal(index)} 
                                    className="text-xs font-bold text-wood-500 mt-3 flex items-center gap-1.5 hover:text-accent-600 transition-colors border border-wood-200 rounded-xl px-3 py-1.5 w-fit bg-wood-50 hover:bg-white"
                                 >
                                    <Pencil size={12}/> {labelPersonalizzaProdotto}
                                 </button>
                              )}
                           </div>
                           <div className="flex flex-col items-end gap-3">
                              <span className="font-mono font-bold text-lg">€{((item.selectedVariant ? item.selectedVariant.price : item.price) * item.quantity + (item.selectedAddons?.reduce((s, a) => s + Number(a.price), 0) || 0) * item.quantity).toFixed(2)}</span>
                              <div className="flex items-center gap-3 bg-wood-50 rounded-xl p-1 shadow-inner"><button onClick={() => { if(item.quantity > 1) updateCartItemQuantity(item.cartId, -1); else removeFromCart(item.cartId); }} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-wood-600 hover:text-red-500"><Minus size={14}/></button><span className="text-sm font-bold w-4 text-center">{item.quantity}</span><button onClick={() => updateCartItemQuantity(item.cartId, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-wood-600 hover:text-green-500"><Plus size={14}/></button></div>
                          </div>
                        </div>
                       );
                    })}
                 </div>
              )}
           </div>
           <div className="p-6 border-t border-wood-100 bg-wood-50 pb-8">
              <div className="flex justify-between items-center mb-6"><span className="text-xl font-bold text-wood-900">{t('total', lang)}</span><span className="text-4xl font-western text-accent-600">€{getCartItemsTotal().toFixed(2)}</span></div>
              {(() => {
                 const isDeliveryOrTakeaway = orderForm.orderType === 'delivery' || orderForm.orderType === 'takeaway';
                 const hasMissingSideDishes = cart.some(item => item.brand === "Contorno compreso" && !item.selectedSideDish);
                 const hasMissingFreeDrinks = cart.some(item => {
                     const isFocaccia = item.name.toLowerCase() === "focaccia";
                     const isPizza = item.category === ProductCategory.PIZZA && !isFocaccia;
                     const isBimbi = item.category === ProductCategory.BIMBI;
                     return (isBimbi && !item.selectedFreeDrink) || (isDeliveryOrTakeaway && isPizza && !item.selectedFreeDrink);
                     });
                 const isButtonDisabled = hasMissingSideDishes || hasMissingFreeDrinks;

                 // CAPOLAVORO UX: Se l'utente è al tavolo con consumazioni già in corso, sblocca la cassa rapida in 1-Click! [1, 5]
                 const isFastTableAddon = tableSessionId !== null && hasPriorOrders;

                 const handleButtonClick = async () => {
                    if (isButtonDisabled) {
                       alert("Seleziona i contorni e le bibite omaggio per procedere!");
                       return;
                    }
                    
                    if (isFastTableAddon) {
                       // AGGIUNTA RAPIDA (1-Click): Non serve il checkout form, invia subito!
                       const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                       await handleSubmitOrder(fakeEvent, undefined, undefined, true);
                       
                       setSuggestionToast({ show: true, text: "🚀 Aggiunta inviata allo staff!" });
                       setTimeout(() => setSuggestionToast({ show: false, text: '' }), 4000);
                       setIsCartOpen(false); // Chiudi solo il carrello
                    } else {
                       // PRIMO ORDINE O ASPORTO: Va al checkout
                       setIsCartOpen(false);
                       setView('CHECKOUT');
                       window.scrollTo(0,0);
                    }
                 };

                 const buttonLabel = isButtonDisabled 
                    ? "Scegli contorni/omaggi per procedere" 
                    : isFastTableAddon 
                      ? "Invia Aggiunta (1-Click)" // <--- Testo chiaro e immediato [5]
                      : t('show_staff', lang);

                 return (
                    <button 
                      type="button"
                      onClick={handleButtonClick} 
                      disabled={isButtonDisabled}
                      className={`w-full py-4 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                         isButtonDisabled 
                         ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60' 
                         : 'bg-[#45856c] text-white hover:bg-opacity-90'
                      }`}
                    >
                       <ShoppingCart size={24} /> {buttonLabel}
                    </button>
                 );
              })()}
           </div>
        </div>

            {suggestionToast.show && (
            <div style={{
               position: 'fixed',
               bottom: '90px',             // Lo posiziona in basso, sopra la navigazione
               left: '50%',
               transform: 'translateX(-50%)',
               backgroundColor: '#45856c', // Un bel verde scuro (stile Old West)
               color: '#ffffff',
               padding: '12px 24px',
               borderRadius: '30px',       // Arrotondato ai lati
               boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Un po' di ombra per farlo risaltare
               zIndex: 9999,               // Si assicura che stia sopra a qualsiasi altro elemento
               fontWeight: 'bold',
               fontSize: '14px',
               textAlign: 'center',
               whiteSpace: 'pre-line',       // Evita che il testo vada a capo
               width: 'max-content',       // Si allarga quanto la riga di testo più lunga
               maxWidth: '90vw',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '8px'
            }}>
               {suggestionToast.text}
            </div>
            )}

        {isAddonModalOpen && (
         <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full md:max-w-md h-[85vh] md:h-auto md:max-h-[80vh] md:rounded-3xl rounded-t-3xl p-6 flex flex-col shadow-2xl overflow-hidden">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-xl text-wood-900">{t('add_ingredient', lang)}</h4>
                  <button onClick={() => setIsAddonModalOpen(false)} className="p-2 bg-wood-50 rounded-full"><X/></button>
               </div>
               
               {/* BARRA DI RICERCA */}
               <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wood-400" size={18}/>
                  <input 
                     type="text" 
                     placeholder={t('search_addon', lang)} 
                     value={addonSearch} 
                     onChange={(e) => setAddonSearch(e.target.value)} 
                     className="w-full bg-white border border-[#45856c]/30 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#45856c] focus:border-transparent transition-all" 
                  />
               </div>
               
               {/* LISTA SCORREVOLE (FIXATA) */}
               <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {filteredAddons.map(addon => (
                     <button key={addon.id} onClick={() => addAddonToItem(addon)} className="w-full flex justify-between items-center p-4 hover:bg-green-50 rounded-2xl transition-all border border-transparent hover:border-[#45856c]/20 group">
                        <span className="font-medium text-wood-800 group-hover:text-[#45856c]">{addon.name}</span>
                        <span className="font-mono font-bold text-[#45856c] bg-[#45856c]/10 px-3 py-1 rounded-full text-sm">+€{addon.price.toFixed(2)}</span>
                     </button>
                  ))}
                  {filteredAddons.length === 0 && (
                     <div className="text-center py-10 text-wood-400">Nessun ingrediente trovato.</div>
                  )}
               </div>
            </div>
         </div>
      )}
      </>
      );
  };

  const renderCheckout = () => {
    const timeSlots = [t('asap', lang), "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];
    const deliveryFee = getDeliveryFee();
    const coverCharge = getCoverCharge();

    return (
      <div className="min-h-screen bg-wood-50 pt-20 pb-32">
        <div className="container mx-auto px-4 max-w-2xl mt-8">
           <button onClick={() => { setView('MENU'); setIsCartOpen(true); }} className="flex items-center gap-2 text-wood-500 hover:text-wood-900 font-bold mb-6 transition-colors">
              <ChevronLeft size={20} /> {t('back', lang)}
           </button>

           <h2 className="text-3xl font-western text-wood-900 mb-8"> {t(isPreOrder ? 'checkout_title_booking' : 'checkout_title', lang)}</h2>

           <form onSubmit={handleSubmitOrder} className="space-y-8">
              
              {/* SE È UN PRE-ORDINE (TAVOLO + CIBO), MOSTRA IL RIEPILOGO COMPATTO CON LISTA PRODOTTI E L'AVVISO DI CANCELLAZIONE */}
              {isPreOrder && tempReservationInfo ? (
                 <div className="bg-white p-6 rounded-3xl border border-wood-100 shadow-sm space-y-4 animate-in fade-in duration-300">
                    <h3 className="font-bold text-lg text-[#45856c] uppercase tracking-wide border-b border-wood-100 pb-2">Riepilogo Tavolo Riservato</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-wood-800">
                       <div><span className="block text-xs font-bold text-wood-400 uppercase">Nome</span><span className="font-bold text-base uppercase text-wood-900">{tempReservationInfo.customerName}</span></div>
                       <div><span className="block text-xs font-bold text-wood-400 uppercase">Telefono</span><span className="font-bold text-base text-wood-900">{tempReservationInfo.customerPhone}</span></div>
                       <div><span className="block text-xs font-bold text-wood-400 uppercase">Ospiti al Tavolo</span><span className="font-bold text-base text-[#45856c]">{tempReservationInfo.numPeople} Persone</span></div>
                       <div><span className="block text-xs font-bold text-wood-400 uppercase">Giorno e Ora</span><span className="font-bold text-base text-orange-600">{new Date(tempReservationInfo.date).toLocaleDateString('it-IT')} - alle ore {tempReservationInfo.time}</span></div>
                    </div>

                    {/* LISTA DEI PRODOTTI IN PRE-ORDINE (FOTO 2) */}
                    <div className="mt-4 pt-4 border-t border-wood-100">
                       <span className="block text-xs font-bold text-wood-400 uppercase mb-2">Piatti in Pre-ordine:</span>
                       <div className="space-y-1 bg-wood-50 p-3 rounded-2xl border border-wood-100 font-bold text-sm text-wood-800">
                          {cart.map((item, idx) => (
                             <div key={idx} className="flex justify-between">
                                <span>{item.quantity}x {getProductContent(item).name}</span>
                                <span className="font-mono text-xs text-wood-500">€{((item.selectedVariant ? item.selectedVariant.price : item.price) * item.quantity).toFixed(2)}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="mt-4 p-4 bg-orange-50/50 border border-orange-200/50 rounded-2xl text-xs text-orange-800 font-bold leading-relaxed flex items-start gap-2">
                       <AlertCircle size={18} className="shrink-0 mt-0.5" />
                       <p>⚠️ In caso di imprevisti o cancellazione della prenotazione, vi preghiamo gentilmente di avvisare il locale il prima possibile telefonando al numero 0321 510220.</p>
                    </div>
                 </div>
              ) : (
               <>

              {/* TIPO DI ORDINE E TAVOLO (DINAMICO SE SCANSIONATO DA QR CODE) */}
              <div className="bg-white p-6 rounded-3xl border border-wood-100 shadow-sm space-y-4">
                 <h3 className="font-bold text-lg text-wood-900 mb-4">{t(orderForm.orderType === 'table' ? 'table_details' : 'order_type', lang)}</h3>
                 
                 {/* Se NON c'è un tavolo pre-compilato da URL, mostra i 3 pulsanti di scelta classica */}
                 {!orderForm.tableNumber ? (
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                       <button type="button" onClick={() => setOrderForm({...orderForm, orderType: 'takeaway'})} className={`p-2 md:p-4 rounded-xl border-2 flex flex-col items-center gap-1 md:gap-2 transition-all ${orderForm.orderType === 'takeaway' ? 'border-[#45856c] bg-[#45856c]/10 text-[#45856c]' : 'border-wood-200 text-wood-500 hover:border-wood-300'}`}>
                          <Store size={24} />
                          <span className="text-[11px] md:text-sm font-bold text-center">{t('type_takeaway', lang)}</span>
                       </button>
                       <button type="button" onClick={() => setOrderForm({...orderForm, orderType: 'delivery'})} className={`p-2 md:p-4 rounded-xl border-2 flex flex-col items-center gap-1 md:gap-2 transition-all ${orderForm.orderType === 'delivery' ? 'border-[#45856c] bg-[#45856c]/10 text-[#45856c]' : 'border-wood-200 text-wood-500 hover:border-wood-300'}`}>
                          <Bike size={24} />
                          <span className="text-[11px] md:text-sm font-bold text-center">{t('type_delivery', lang)}</span>
                       </button>
                    </div>
                 ) : (
                    // Se c'è un tavolo rilevato da QR, mostra un badge fisso ed elegante
                    <div className="bg-[#45856c]/5 border border-[#45856c]/20 p-4 rounded-2xl flex items-center gap-3 text-[#45856c] font-black text-sm uppercase select-none animate-in fade-in">
                       <Utensils size={20} />
                       <span>Ordinazione al Tavolo {orderForm.tableNumber}</span>
                    </div>
                 )}

                 {/* Se l'ordine è al tavolo (tramite QR o scelta manuale) */}
                 {orderForm.orderType === 'table' && (
                    <div className="mt-4 pt-4 border-t border-wood-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                       {/* Campo Nome obbligatorio al tavolo */}
                       <div>
                          <label className="block text-xs font-bold text-wood-500 uppercase mb-1">{t('ref_name', lang)}</label>
                          <input 
                             required 
                             type="text" 
                             placeholder="Es. Mario" 
                             value={orderForm.customerName} 
                             onChange={e => setOrderForm({...orderForm, customerName: e.target.value})} 
                             className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#45856c] font-medium" 
                          />
                       </div>

                       {/* Campo Numero del Tavolo (bloccato e disabilitato se letto da QR) */}
                       <div>
                          <label className="block text-xs font-bold text-wood-500 uppercase mb-1">{t('table_num', lang)}</label>
                          <input 
                             required 
                             disabled={!!orderForm.tableNumber} // Blinda l'input se il numero viene dal QR code! [8]
                             type="number" 
                             placeholder="Es. 5" 
                             value={orderForm.tableNumber} 
                             onChange={e => setOrderForm({...orderForm, tableNumber: e.target.value})} 
                             className={`w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#45856c] font-black text-lg text-center ${
                                orderForm.tableNumber ? 'opacity-60 cursor-not-allowed' : ''
                             }`} 
                          />
                       </div>
                    </div>
                 )}
              </div>

              {/* DATI CLIENTE (SPARISCE COMPLETAMENTE SE SIAMO AL TAVOLO) */}
              {orderForm.orderType !== 'table' && (() => {
               // LOGICA CHIUSURA: Definiamo se il locale è chiuso ora
               const oraAttuale = new Date().getHours();
               const isChiusoOra = (oraAttuale < 11 || (oraAttuale >= 15 && oraAttuale < 17) || oraAttuale >= 23);
               
               return (
                  <div className="bg-white p-6 rounded-3xl border border-wood-100 shadow-sm space-y-6 animate-in fade-in">
                     <h3 className="font-bold text-lg text-wood-900 mb-2">{t('your_data', lang)}</h3>
                     
                     {/* Messaggio Locale Chiuso (appare solo se è orario di chiusura e hai scelto 'Oggi') */}
                     {isChiusoOra && orderDate === 'Oggi' && (
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-800 text-sm flex items-start gap-3">
                           <Info size={20} className="shrink-0 mt-0.5" />
                           <p>🤠 <strong>Siamo chiusi al momento!</strong><br/>Puoi comunque inviare l'ordine: lo riceveremo alla prossima apertura.</p>
                        </div>
                     )}

                     {/* Nome e Telefono */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-wood-500 uppercase mb-1">{t('name', lang)} *</label><input required type="text" value={orderForm.customerName} onChange={e => setOrderForm({...orderForm, customerName: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:border-[#45856c]" /></div>
                        <div>
                           <label className="block text-xs font-bold text-wood-500 uppercase mb-1">
                              {orderForm.orderType === 'delivery' ? 'Email *' : 'Email (Opzionale)'}
                           </label>
                           <input 
                              required={orderForm.orderType === 'delivery'} 
                              type="email" 
                              value={orderForm.customerEmail} 
                              onChange={e => setOrderForm({...orderForm, customerEmail: e.target.value})} 
                              className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:border-[#45856c]" 
                           />
                        </div>
                        {/* SOSTITUISCI IL BLOCCO DEL TELEFONO CON QUESTO: */}
                           <div>
                              <label className="block text-xs font-bold text-wood-500 uppercase mb-1">
                                 {t('phone', lang)} *
                              </label>
                              <input 
                                 required 
                                 type="tel" 
                                 value={orderForm.customerPhone} 
                                 onChange={e => {
                                    const newPhone = e.target.value;
                                    setOrderForm({...orderForm, customerPhone: newPhone});
                                    
                                    // Avvia il controllo sul database solo se il numero ha almeno 9 cifre
                                    if (newPhone.trim().length >= 9) {
                                       checkFirstOrderPromotion(newPhone);
                                    } else {
                                       setIsFirstOrder(false); // Resetta la promo se il numero viene cancellato
                                    }
                                 }} 
                                 className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:border-[#45856c]" 
                              />

                              {/* DOMANDA 3: IL BANNER PROMOZIONALE LO INSERIAMO DIRETTAMENTE QUI SOTTO! */}
                              {isFirstOrder && orderForm.orderType === 'delivery' && (
                                 <div className="mt-2 bg-green-50 border border-green-200 p-3 rounded-xl text-green-800 text-[11px] font-bold text-center animate-in fade-in duration-200">
                                    🎉 Promozione Lancio: Consegna gratuita applicata sul tuo primo ordine!
                                 </div>
                              )}
                           </div>
                     </div>

                     {/* Comune e Indirizzo (Solo per Consegna) */}
                     {orderForm.orderType === 'delivery' && (
                        <div className="space-y-4 pt-2 border-t border-wood-50">
                           <div className="space-y-3">
                              <label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-2">
                                 {t('city', lang)} *
                              </label>
                              {/* SELEZIONE COMUNE IN CAROSELLO ORIZZONTALE FLUIDO */}
                              <div className="relative group/zone mt-2">
                                 <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 pt-1 px-1 cursor-grab active:cursor-grabbing select-none">
                                    {DELIVERY_ZONES.map((cityName) => {
                                       const isSelected = orderForm.deliveryCity === cityName;
                                       return (
                                          <button
                                             key={cityName}
                                             type="button"
                                             onClick={() => {
                                                setOrderForm({ ...orderForm, deliveryCity: cityName });
                                                // Resetta la convalida della distanza al cambio del comune
                                                setDistanzaRilevata(null);
                                                setErroreIndirizzo(null);
                                             }}
                                             className={`px-5 py-3 rounded-full border-2 text-sm font-bold whitespace-nowrap transition-all duration-300 shrink-0 shadow-sm flex items-center gap-2 select-none ${
                                                isSelected
                                                ? 'border-[#45856c] bg-[#45856c] text-white shadow-md scale-105'
                                                : 'border-wood-100 bg-white text-wood-700 hover:border-[#45856c]/30 hover:text-[#45856c]'
                                             }`}
                                          >
                                             <span>{cityName}</span>
                                             {isSelected && <Check size={14} className="text-white" />}
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>
                           </div>

                           {/* Campo Indirizzo con Calcolo Chilometrico Integrato */}
                           <div>
                              <label className="block text-xs font-bold text-wood-500 uppercase mb-1">{t('address', lang)} *</label>
                              <div className="flex gap-2">
                                 <input 
                                    required 
                                    type="text" 
                                    value={orderForm.deliveryAddress} 
                                    onChange={e => {
                                       setOrderForm({...orderForm, deliveryAddress: e.target.value});
                                       // Resettiamo lo stato di convalida non appena l'utente digita una modifica
                                       setDistanzaRilevata(null);
                                       setErroreIndirizzo(null);
                                    }} 
                                    className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#45856c]" 
                                    placeholder="Via Galileo 35 (specifica via e numero civico)" 
                                 />
                                 <button
                                    type="button"
                                    onClick={() => handleCalcolaSpeseConsegna(orderForm.deliveryAddress, orderForm.deliveryCity)}
                                    disabled={isCalcolandoDistanza || !orderForm.deliveryAddress}
                                    className="px-4 py-3 bg-wood-900 text-white rounded-xl font-bold text-xs hover:bg-[#45856c] transition-colors shrink-0 disabled:opacity-50 flex items-center gap-2"
                                 >
                                    {isCalcolandoDistanza ? <Loader2 className="animate-spin" size={16} /> : "CALCOLA KM"}
                                 </button>
                              </div>

                              {/* Feedback Visivo sullo Stato della Consegna */}
                              {distanzaRilevata !== null && !erroreIndirizzo && (
                                 <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                                    <CheckCircle2 size={16} className="text-green-600" />
                                    <span>Indirizzo verificato! Distanza: {distanzaRilevata.toFixed(1)} km. Costo consegna: €{speseConsegna.toFixed(2)}</span>
                                 </div>
                              )}

                              {erroreIndirizzo && (
                                 <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                                    <AlertCircle size={16} className="text-red-600" />
                                    <span>{erroreIndirizzo}</span>
                                 </div>
                              )}
                           </div>
                        </div>
                     )}

                     {/* --- NUOVA SEZIONE DATA E ORARIO (CHIPS) --- */}
                     <div className="pt-4 border-t border-wood-50">
                        <label className="block text-xs font-bold text-wood-500 uppercase mb-3">Quando?</label>
                        <div className="flex gap-2 mb-6">
                           {['Oggi', 'Domani'].map(d => (
                              <button key={d} type="button" onClick={() => setOrderFormDate(d)} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${orderDate === d ? 'border-[#45856c] bg-[#45856c] text-white shadow-md' : 'border-wood-100 bg-wood-50 text-wood-400'}`}>{d}</button>
                           ))}
                        </div>

                        <label className="block text-xs font-bold text-wood-500 uppercase mb-3">{t('time', lang)}</label>
                        <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1 bg-wood-50/50 rounded-2xl border border-wood-100 p-3">
                           {/* Pulsante 'Il prima possibile' (disponibile solo per oggi) */}
                           {orderDate === 'Oggi' && (
                              <button 
                                 type="button" 
                                 onClick={() => setOrderForm({...orderForm, deliveryTime: 'Il prima possibile'})} 
                                 className={`px-4 py-2 rounded-full font-bold text-[10px] border-2 transition-all ${orderForm.deliveryTime === 'Il prima possibile' ? 'border-[#45856c] bg-[#45856c] text-white shadow-sm' : 'border-white bg-white text-wood-500 shadow-sm'}`}
                              >
                                 IL PRIMA POSSIBILE
                              </button>
                           )}
                           
                           {/* Generazione dinamica a 15 minuti con blocco di congestione */}
                           {(() => {
                              const baseSlots = generateTimeSlots();
                              const availableSlots = getAvailableSlots(baseSlots, orderDate);

                              return availableSlots.map(time => {
                                 const isBlocked = blockedSlots.includes(time);
                                 const isSelected = orderForm.deliveryTime === time;

                                 return (
                                    <button 
                                       key={time} 
                                       type="button" 
                                       disabled={isBlocked}
                                       onClick={() => setOrderForm({...orderForm, deliveryTime: time})} 
                                       className={`px-4 py-2 rounded-full font-bold text-xs border-2 transition-all ${
                                          isBlocked
                                          ? 'border-gray-100 bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                                          : isSelected 
                                            ? 'border-[#45856c] bg-[#45856c] text-white shadow-sm font-black' 
                                            : 'border-white bg-white text-wood-500 shadow-sm'
                                       }`}
                                       title={isBlocked ? "Fascia oraria satura" : "Seleziona orario"}
                                    >
                                       {time} {isBlocked && " (Pieno)"}
                                    </button>
                                 );
                              });
                           })()}
                        </div>
                     </div>
                     
                  </div>
               )
               })()}
              </>
              )}

              {/* METODO DI PAGAMENTO E NOTE (2 OPZIONI SE TAVOLO/PRE-ORDINE, 3 SE ASPORTO/CONSEGNA) */}
              <div className="bg-white p-6 rounded-3xl border border-wood-100 shadow-sm">
                 <h3 className="font-bold text-lg text-wood-900 mb-4">{t('payment', lang)}</h3>
                 <div className="flex flex-col gap-3">
                    
                    {isPreOrder || orderForm.orderType === 'table' ? (
                       // SE È TAVOLO (O PRE-ORDINE): SOLO "PAGA AL TAVOLO" (CASH/POS INSIEME)
                       <label className="flex items-center gap-3 p-4 border border-wood-200 rounded-xl cursor-pointer hover:bg-wood-50">
                          <input 
                             type="radio" 
                             name="payment" 
                             value="cash" 
                             checked={orderForm.paymentMethod === 'cash'} 
                             onChange={() => setOrderForm({...orderForm, paymentMethod: 'cash'})} 
                             className="w-5 h-5 accent-[#45856c]" 
                          />
                          <div className="flex flex-col">
                             <span className="font-bold text-wood-900">{t('pay_at_table_title', lang)}</span>
                        <span className="text-xs text-wood-400 font-medium">{t('pay_at_table_desc', lang)}</span>
                          </div>
                       </label>
                    ) : (
                       // SE È CONSEGNA O ASPORTO: LE 2 OPZIONI CLASSICHE FISICHE DI PRIMA
                       <>
                          <label className="flex items-center gap-3 p-4 border border-wood-200 rounded-xl cursor-pointer hover:bg-wood-50">
                             <input type="radio" name="payment" value="cash" checked={orderForm.paymentMethod === 'cash'} onChange={() => setOrderForm({...orderForm, paymentMethod: 'cash'})} className="w-5 h-5 accent-[#45856c]" />
                             <span className="font-medium text-wood-900">{t('cash', lang)}</span>
                          </label>
                          <label className="flex items-center gap-3 p-4 border border-wood-200 rounded-xl cursor-pointer hover:bg-wood-50">
                             <input type="radio" name="payment" value="pos" checked={orderForm.paymentMethod === 'pos'} onChange={() => setOrderForm({...orderForm, paymentMethod: 'pos'})} className="w-5 h-5 accent-[#45856c]" />
                             <span className="font-medium text-wood-900">Bancomat / Carta (al ritiro)</span>
                          </label>
                       </>
                    )}
                    
                    {/* OPZIONE STRIPE ONLINE (COMUNE A TUTTI I FLUSSI) */}
                    <label className="flex items-center gap-3 p-4 border border-[#45856c]/30 rounded-xl cursor-pointer hover:bg-green-50/30 transition-colors">
                       <input 
                          type="radio" 
                          name="payment" 
                          value="stripe" 
                          checked={orderForm.paymentMethod === 'stripe'} 
                          onChange={() => setOrderForm(prev => ({ ...prev, paymentMethod: 'stripe' }))}
                          className="w-5 h-5 accent-[#45856c]" 
                       />
                       <div className="flex flex-col">
                          <span className="font-bold text-wood-900"> {t('stripe_pay_title', lang)}</span>
                          <span className="text-xs text-wood-400 font-medium">{t('stripe_pay_desc', lang)}</span>
                       </div>
                    </label>
                 </div>
                 
                 <div className="mt-4"><label className="block text-xs font-bold text-wood-500 uppercase mb-1">{t('notes', lang)}</label><textarea rows={2} value={orderForm.notes} onChange={e => setOrderForm({...orderForm, notes: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl p-3 focus:outline-none focus:border-[#45856c] focus:ring-1 focus:ring-[#45856c] resize-none" placeholder={t('notes', lang)}></textarea></div>
              </div>

              {/* RIEPILOGO TOTALE */}
              {/* RIEPILOGO TOTALE */}
              <div className="bg-wood-900 p-6 rounded-3xl text-white shadow-xl">
                 <div className="space-y-2 mb-4 border-b border-wood-700 pb-4">
                    <div className="flex justify-between items-center text-wood-300"><span>{t('subtotal_prod', lang)}</span><span>€{getCartItemsTotal().toFixed(2)}</span></div>
                    {coverCharge > 0 && <div className="flex justify-between items-center text-wood-300"><span>{t('cover_charge', lang)}</span><span>€{coverCharge.toFixed(2)}</span></div>}
                    {deliveryFee > 0 && <div className="flex justify-between items-center text-wood-300"><span>{t('delivery_fee', lang)}</span><span>€{deliveryFee.toFixed(2)}</span></div>}
                 </div>
                 <div className="flex justify-between items-end mb-6">
                    <span className="text-xl font-bold uppercase tracking-wider">{t('total', lang)}</span>
                    <span className="text-4xl font-western text-accent-500">€{getGrandTotal().toFixed(2)}</span>
                 </div>
                 
                 {/* STRIPE ELEMENT / PULSANTE CLASSICO DINAMICO */}
                 {orderForm.paymentMethod === 'stripe' ? (
                    isInitializingStripe ? (
                       <div className="flex flex-col items-center justify-center py-4 gap-2 text-accent-500">
                          <Loader2 className="animate-spin" size={32} />
                          <span className="text-xs font-bold uppercase tracking-wider">Inizializzazione cassa sicura...</span>
                       </div>
                    ) : clientSecret ? (
                       <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret, locale: lang }}>
                          <StripeCheckoutForm 
                             clientSecret={clientSecret}
                             cart={cart}
                             orderForm={orderForm}
                             tempReservationInfo={tempReservationInfo}
                             onPaymentSuccess={() => {
                                // Quando la transazione di Stripe ha successo, simula il submit del form e salva l'ordine su Supabase!
                                const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                                handleSubmitOrder(fakeEvent);
                             }} 
                          />
                       </Elements>
                    ) : (
                       <div className="text-center py-2 text-xs text-red-400 font-bold uppercase">
                          Seleziona o compila l'indirizzo per caricare la cassa online.
                       </div>
                    )
                   ) : (
                    <button type="submit" disabled={isSubmittingOrder} className="w-full bg-[#45856c] text-white py-4 rounded-xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all disabled:opacity-50">
                       {isSubmittingOrder ? <Loader2 className="animate-spin" size={24} /> : <>{t('send_order', lang)} <ArrowRight size={24} /></>}
                    </button>
                 )}
              </div>
           </form>
        </div>
      </div>
    );
  };

  const renderOrderSuccess = () => {
    const isBooking = successType === 'BOOKING';

    return (
      <div className="min-h-screen bg-[#45856c] flex flex-col items-center justify-center p-4 text-white text-center">
         <div className="bg-white/10 p-8 rounded-full mb-8 animate-in zoom-in duration-500">
            <CheckCircle2 size={80} className="text-white" />
         </div>
         
         <h1 className="text-5xl font-western mb-4">
            {isBooking ? 'Tavolo Riservato!' : 'Ordine Inviato!'}
         </h1>
         
         <div className="text-xl opacity-90 max-w-md mx-auto mb-12 space-y-2">
            {isBooking ? (
               <>
                  <p>
                     {isPreOrder 
                        ? 'Grazie, la tua richiesta di prenotazione con pre-ordine di cibo è stata ricevuta dallo staff.' 
                        : 'Grazie, la tua richiesta di prenotazione del tavolo è stata ricevuta dallo staff.'
                     }
                  </p>
                  {tempReservationInfo && (
                     <p className="font-bold text-orange-200 mt-2">
                        Ti aspettiamo il {new Date(tempReservationInfo.date).toLocaleDateString('it-IT')} alle ore {tempReservationInfo.time}!
                     </p>
                  )}
               </>
            ) : (
               <p>Il tuo ordine è stato ricevuto con successo dalla cucina.</p>
            )}
         </div>
         
         <button 
            type="button"
            onClick={() => { 
               // PULISCE LE MEMORIE TEMPORANEE AL RITORNO ALLA HOME
               setTempReservationInfo(null);
               setIsPreOrder(false);
               setView('LANDING'); 
               window.scrollTo(0,0); 
            }} 
            className="bg-white text-[#45856c] px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
         >
            Torna alla Home
         </button>
      </div>
    );
  };
  const renderDIY = () => {
  const activeConfig = diyType === 'house' ? HOUSE_BURGER_OPTIONS : TRUE_DIY_OPTIONS;
  const currentStepConfig = activeConfig.steps[diyStep];
  const { title, description } = getDIYStepContent(currentStepConfig, lang);

  // TITOLO E SOTTOTITOLO TRADOTTI IN TEMPO REALE (Risolto per le foto 1 e 3)
  const wizardTitle = diyType === 'house'
    ? (lang === 'it' ? "Hamburger della Casa" : (lang === 'fr' ? "Burgers de la Maison" : "House Burgers"))
    : (lang === 'it' ? "Hamburger Fai da te" : (lang === 'fr' ? "Créez Votre Burger" : "Build Your Own Burger"));

  const wizardSubtitle = diyType === 'house'
    ? (lang === 'it' ? "Scegli pane, carne, ricetta della casa e contorno" : (lang === 'fr' ? "Choisissez le pain, la viande, la recette de la maison et l'accompagnement" : "Choose bread, meat, house recipe and side dish"))
    : (lang === 'it' ? "Scegli pane, carne e condisci a tuo piacimento" : (lang === 'fr' ? "Choisissez le pain, la viande et assaisonnez à votre goût" : "Choose bread, meat and season to your liking"));

  // ==========================================
  // CARICAMENTO DINAMICO DELLE OPZIONI DAL DATABASE
  let stepOptions = currentStepConfig.options as any[];
  
  if (currentStepConfig.id === 'condimenti') {
    // Filtra gli ingredienti extra dal database caricati in "items"
    stepOptions = items.filter(item => 
      item.category === ProductCategory.AGGIUNTE && 
      item.subCategory === 'Hamburger' &&
      item.isAvailable
    );
  }
  // ==========================================

  // Calcolo dello stato del pulsante "Avanti"
  const currentSelection = diySelections[currentStepConfig.id];
  const isStepEmpty = currentStepConfig.isMulti
    ? (!currentSelection || currentSelection.length === 0)
    : !currentSelection;

  const isNextDisabled = !currentStepConfig.isOptional && isStepEmpty;

  return (
    <div className="container mx-auto px-4 py-8 pb-32" ref={diyHeaderRef}>
      <div className="bg-white rounded-3xl border border-wood-100 shadow-xl overflow-hidden">
        
        {/* Header del Wizard */}
        <div className="bg-wood-900 p-6 text-white text-center relative overflow-hidden">
           <button onClick={() => { setActiveSubCategoryView(null); setDiyType(null); }} className="absolute top-12 left-3 z-50 bg-wood-900 text-white p-3 rounded-full shadow-2xl border-2 border-white/20 hover:scale-110 transition-transform" aria-label="Chiudi"><X size={28} /></button>
           <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000')" }}></div>
           
           <div className="relative z-10 pt-12">
              <h2 className="text-3xl font-western mb-2">
               {wizardTitle}
               </h2>
               <p className="text-wood-300">
               {wizardSubtitle}
               </p>
              
              <div className="flex justify-center gap-2 mt-4">
                 {activeConfig.steps.map((s, idx) => (
                    <div key={s.id} className={`h-1.5 rounded-full transition-all duration-500 ${idx <= diyStep ? 'w-8 bg-accent-500' : 'w-4 bg-wood-700'}`}></div>
                 ))}
              </div>
           </div>
        </div>

        {/* Corpo dello Step */}
        <div className="p-6 md:p-8">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <span className="text-accent-600 font-bold tracking-widest text-xs uppercase mb-1 block">Step {diyStep + 1}/{activeConfig.steps.length}</span>
                 <h3 className="text-2xl font-bold text-wood-900">{title}</h3>
                 <p className="text-wood-500">{description}</p>
              </div>
           </div>

           {/* SEZIONE OPZIONI DINAMICA */}
           {currentStepConfig.id === 'condimenti' ? (
             // ELENCO SCORREVOLE CON RICERCA (PER IL VERO FAI DA TE - STEP 3)
             <div className="flex flex-col h-[350px] md:h-[400px]">
                
                {/* Barra di ricerca interna allo step */}
                <div className="mb-4 relative shrink-0">
                   <input
                      type="text"
                      placeholder="Cerca ingrediente (es: bacon, cheddar...)"
                      value={diySearchQuery}
                      onChange={(e) => setDiySearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-wood-100 rounded-2xl text-sm focus:outline-none focus:border-accent-500 bg-wood-50"
                   />
                </div>
                
                {/* Lista scrollabile dei prodotti database */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                   {stepOptions
                      .filter(opt => {
                         const optionName = getOptionName(opt, lang);
                         return optionName.toLowerCase().includes(diySearchQuery.toLowerCase());
                      })
                      .map((option: any) => {
                         const isSelected = (diySelections[currentStepConfig.id] as any[])?.some(item => item.name === option.name);
                         const optionName = getOptionName(option, lang);

                         return (
                            <div 
                               key={option.id || option.name}
                               onClick={() => handleDiySelection(currentStepConfig.id, option, true)}
                               className={`flex justify-between items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                  isSelected 
                                     ? 'border-accent-500 bg-accent-50/50' 
                                     : 'border-wood-100 bg-white hover:bg-wood-50'
                               }`}
                            >
                               <div className="flex flex-col">
                                  <span className="font-bold text-wood-800 text-base">{optionName}</span>
                                  {option.price > 0 && <span className="text-xs text-[#45856c] font-mono font-bold">+€{option.price.toFixed(2)}</span>}
                               </div>
                               
                               <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected ? 'bg-accent-500 border-accent-500 text-white' : 'border-wood-300'
                                }`}>
                                  {isSelected && <Check size={14} />}
                               </div>
                            </div>
                         );
                      })}
                   {stepOptions.filter(opt => getOptionName(opt, lang).toLowerCase().includes(diySearchQuery.toLowerCase())).length === 0 && (
                     <p className="text-center text-gray-400 text-sm py-8">Nessun ingrediente trovato.</p>
                   )}
                </div>
             </div>
           ) : (
             // LAYOUT CLASSICO A GRIGLIA (PER PANE, CARNE E CONTORNO)
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stepOptions.map((option: any) => {
                   const isSelected = diySelections[currentStepConfig.id]?.name === option.name;
                   const optionName = getOptionName(option, lang);

                   return (
                      <button 
                         key={option.name} 
                         onClick={() => handleDiySelection(currentStepConfig.id, option, false)} 
                         className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                            isSelected 
                               ? 'border-accent-500 bg-accent-50 shadow-lg scale-[1.02]' 
                               : 'border-wood-100 bg-wood-50 hover:border-accent-300 hover:bg-white'
                         }`}
                      >
                         <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-start gap-2">
                               <span className={`font-bold text-lg leading-tight ${isSelected ? 'text-accent-700' : 'text-wood-800'}`}>
                                  {optionName}
                               </span>
                               {option.price > 0 && (
                                  <span className="font-mono font-bold text-[#45856c] shrink-0 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-wood-100">
                                     +€{option.price.toFixed(2)}
                                  </span>
                               )}
                            </div>
                         </div>
                         {isSelected && <div className="absolute top-4 right-4 text-accent-500"><Check size={20} /></div>}
                      </button>
                   );
                })}
             </div>
           )}

           {/* Controlli di navigazione inferiori */}
           <div className="flex justify-between items-center mt-10 pt-6 border-t border-wood-100" ref={diyControlsRef}>
              <button 
                 onClick={() => { 
                    if (diyStep > 0) setDiyStep(diyStep - 1); 
                    else { setActiveSubCategoryView(null); setDiyType(null); }
                 }} 
                 className="text-wood-500 font-bold hover:text-wood-800 transition-colors flex items-center gap-2 px-4 py-2"
              >
                 <ChevronLeft size={20} /> {t('back', lang)}
              </button>
              
              <button 
                 onClick={handleDiyNext} 
                 disabled={isNextDisabled} 
                 className="bg-wood-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-accent-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                 {diyStep === activeConfig.steps.length - 1 
                    ? (<>{t('add_to_cart', lang)} <Plus size={20} /></>) 
                    : (<>{t('add', lang)} <ArrowRight size={20} /></>)
                 }
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

const renderMenu = () => {
    // Mostra il costruttore se l'utente clicca su uno dei due tipi di hamburger personalizzabili
      if (activeCategory === ProductCategory.HAMBURGER && (activeSubCategoryView === 'Hamburger "Fai da te"' || activeSubCategoryView === 'Hamburger della Casa')) { 
      return renderDIY(); 
      }
    const hasActiveFilters = activeFilters.vegetarian || activeFilters.vegan || activeFilters.spicy || activeFilters.bestseller;
    const filteredItems = items.filter(item => {
      if (item.category === ProductCategory.AGGIUNTE) return false;
      if (activeCategory === 'Tutti' && hasActiveFilters) { return checkFilters(item); }
      if (activeCategory !== 'Tutti' && item.category !== activeCategory) return false;
      if (activeCategory === ProductCategory.HAMBURGER && activeSubCategoryView && item.subCategory !== activeSubCategoryView) return false;
      return checkFilters(item);
    });
    // ALGORITMO DI ORDINAMENTO INTELLIGENTE DEI PRODOTTI
    const sortedFilteredItems = [...filteredItems].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      // Regola 1: Qualsiasi prodotto della "Settimana" sale immediatamente al numero 1 in cima
      const isWeeklyA = nameA.includes("settimana");
      const isWeeklyB = nameB.includes("settimana");
      if (isWeeklyA && !isWeeklyB) return -1;
      if (!isWeeklyA && isWeeklyB) return 1;
      
      // Regola 2: Solo per le Pizze, ordina alfabeticamente dalla A alla Z tutti gli altri elementi
      if (activeCategory === ProductCategory.PIZZA) {
        return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
      }
      
      // Per le altre categorie (es. Hamburger) mantieni l'ordine predefinito del database
      return 0;
    });
    if (activeCategory === 'Tutti' && hasActiveFilters) { const categoryOrder = Object.values(ProductCategory); filteredItems.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)); }
    const highlightedItems = items.filter(i => (i.tags?.includes('Best Seller') || i.tags?.includes('Consigliato')) && i.category !== ProductCategory.AGGIUNTE);

    return (
      <div className="min-h-screen bg-wood-50 flex flex-col justify-between">
        <div className="flex-1 pb-20">
          {/* HERO */}
          <div className="relative h-96 bg-wood-900 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/restaurant-bg.jpg')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-wood-900 via-transparent to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white pb-10 px-4 pt-16"><h1 className="text-4xl md:text-7xl font-western mb-4 shadow-sm drop-shadow-md tracking-wide pt-10">{t('hero_title', lang)}</h1><div className="flex flex-col items-center gap-2 text-wood-200 text-base md:text-xl font-medium"><p className="flex items-center gap-2"><MapPin size={20} className="text-accent-500" /> Via G. Galilei 35 - Cameri (NO)</p><p className="flex items-center gap-2 text-sm md:text-base opacity-80"><Clock size={16} /> 11:00 - 15:00 | 17:00 - 00:00</p></div></div>
          </div>

          {/* BARRA FILTRI STICKY */}
          <div className="sticky top-16 md:top-20 z-40 bg-wood-50/95 backdrop-blur-sm border-b border-wood-200 shadow-sm">
            <div className="container mx-auto px-4 py-4">
               <div className="relative group">
                  <button onClick={() => scrollCarousel('left', carouselRef)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center text-wood-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"><ChevronLeft size={18} /></button>
                  <div ref={carouselRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 pt-1 px-1 cursor-grab active:cursor-grabbing" onMouseDown={(e) => handleMouseDown(e, carouselRef)} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={(e) => handleMouseMove(e, carouselRef)}><button id="btn-Tutti" onClick={() => handleCategoryClick('Tutti')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm shadow-sm select-none ${activeCategory === 'Tutti' ? 'bg-wood-900 text-white scale-105 ring-2 ring-wood-900 ring-offset-2' : 'bg-white text-wood-600 border border-wood-200 hover:border-wood-400'}`}><LayoutGrid size={16} /> {tCategory('Tutti', lang)}</button>{CATEGORIES_LIST.map(cat => (<button key={cat} id={`btn-${cat}`} onClick={() => handleCategoryClick(cat)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm shadow-sm select-none ${activeCategory === cat ? 'bg-accent-500 text-white scale-105 ring-2 ring-accent-500 ring-offset-2' : 'bg-white text-wood-600 border border-wood-200 hover:border-accent-300 hover:text-accent-600'}`}><CategoryIcon category={cat} className="w-4 h-4" /> {tCategory(cat, lang)}</button>))}</div>
                  <button onClick={() => scrollCarousel('right', carouselRef)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center text-wood-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"><ChevronRight size={18} /></button>
               </div>
               <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {activeCategory === ProductCategory.HAMBURGER && (<div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"><button onClick={() => setActiveSubCategoryView(null)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeSubCategoryView === null ? 'bg-wood-800 text-white' : 'bg-wood-200 text-wood-600 hover:bg-wood-300'}`}>{t('all', lang)}</button>{HAMBURGER_SUBCATEGORIES.map(sub => (<button key={sub} onClick={() => setActiveSubCategoryView(sub)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${activeSubCategoryView === sub ? 'bg-wood-800 text-white' : 'bg-wood-200 text-wood-600 hover:bg-wood-300'}`}>{tHamburgerSubCategory(sub, lang)}</button>))}</div>)}
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide ml-auto">
                     <button onClick={() => setActiveFilters({...activeFilters, vegetarian: !activeFilters.vegetarian})} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${activeFilters.vegetarian ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-wood-200 text-wood-500 hover:border-wood-400'}`}><Leaf size={12} /> {t('filter_veg', lang)}</button>
                     <button onClick={() => setActiveFilters({...activeFilters, vegan: !activeFilters.vegan})} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${activeFilters.vegan ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-wood-200 text-wood-500 hover:border-wood-400'}`}><Sprout size={12} /> {t('filter_vegan', lang)}</button>
                     <button onClick={() => setActiveFilters({...activeFilters, spicy: !activeFilters.spicy})} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${activeFilters.spicy ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white border-wood-200 text-wood-500 hover:border-wood-400'}`}><Flame size={12} /> {t('filter_spicy', lang)}</button>
                  </div>
               </div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-6">
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-3 rounded-xl shadow-md text-center text-sm font-bold tracking-wide">
              ✨ Aggiunta ingredienti da € 1,00 a € 6,00 ✨
            </div>
          </div>

          {/* IN EVIDENZA */}
          {activeCategory === 'Tutti' && !hasActiveFilters && highlightedItems.length > 0 && (
            <div className="container mx-auto px-4 mt-8 mb-4">
              <h3 className="text-xl font-bold text-wood-900 mb-4 flex items-center gap-2"><Star size={20} className="text-accent-500" fill="currentColor" /> In Evidenza</h3>
              <div className="relative group/hl">
                  <button type="button" onClick={() => scrollCarousel('left', highlightsRef)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center text-wood-600 opacity-0 group-hover/hl:opacity-100 transition-opacity disabled:opacity-0"><ChevronLeft size={18} /></button>
                  <div ref={highlightsRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x px-1" onMouseDown={(e) => handleMouseDown(e, highlightsRef)} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={(e) => handleMouseMove(e, highlightsRef)}>{highlightedItems.map(item => { 
     const { name } = getProductContent(item);
     const isAdded = addedItemId === item.id;

     return (
       <div 
         key={item.id} 
         className="snap-center shrink-0 w-48 bg-white rounded-2xl border border-wood-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer"
         onClick={() => setInfoItem(item)}
       >
          <div className="h-32 bg-wood-50 relative">
             {item.imageUrl ? (
                <img src={item.imageUrl} alt={name} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-wood-300">
                   <UtensilsCrossed size={16} />
                </div>
             )}
             <span className="absolute top-2 left-2 bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                {item.tags?.includes('Best Seller') ? 'BEST' : 'TOP'}
             </span>
          </div>
          
          <div className="p-3 flex flex-col flex-1">
             <h4 className="font-bold text-sm text-wood-900 line-clamp-2 mb-1">{name}</h4>
             <div className="mt-auto flex justify-between items-center">
                <span className="font-mono font-bold text-accent-600 text-sm">€{item.price.toFixed(2)}</span>
                <button 
                   type="button"
                   onClick={(e) => { 
                      e.stopPropagation();
                      addToCart(item); 
                   }}
                   className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${isAdded ? 'bg-green-500 text-white' : 'bg-wood-900 text-white hover:bg-[#45856c]'}`}
                >
                   {isAdded ? <Check size={14} /> : <Plus size={14} />}
                </button>
             </div>
          </div>
       </div>
     ) 
  })}</div>
                  <button type="button" onClick={() => scrollCarousel('right', highlightsRef)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 rounded-full shadow-md flex items-center justify-center text-wood-600 opacity-0 group-hover/hl:opacity-100 transition-opacity disabled:opacity-0"><ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          {/* GRID DELLE CATEGORIE O PRODOTTI */}
          <div className="container mx-auto px-4 py-8">
             {activeCategory === 'Tutti' && !hasActiveFilters ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {CATEGORIES_LIST.map(cat => {
                    // Controlla se a questa categoria corrisponde una foto reale sul database
                    const catData = categories.find(c => c.id === cat);
                    const imageUrl = catData?.image_url;

                    return (
                       <div 
                          key={cat} 
                          onClick={() => handleCategoryClick(cat)} 
                          className="bg-white rounded-3xl border border-wood-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col aspect-square hover:scale-105 cursor-pointer group"
                       >
                          {/* 3/4 SUPERIORE: FOTO REALE DEL PIATTO (O BLOCCO VERDE CON ICONA SE VUOTA) */}
                          <div className="h-3/4 w-full bg-wood-50 relative overflow-hidden">
                             {imageUrl ? (
                                <img 
                                   src={imageUrl} 
                                   alt={cat} 
                                   className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                />
                             ) : (
                                <div className="w-full h-full bg-[#45856c] flex items-center justify-center text-white">
                                   <CategoryIcon category={cat} className="w-10 h-10 md:w-12 md:h-12" />
                                </div>
                             )}
                          </div>

                          {/* 1/4 INFERIORE: NOME DELLA CATEGORIA CENTRATO E MAIUSCOLO */}
                          <div className="h-1/4 w-full bg-white flex items-center justify-center p-2 border-t border-wood-50">
                             <span className="font-western text-xs sm:text-base text-wood-900 text-center leading-none truncate uppercase tracking-wider">
                                {tCategory(cat, lang)}
                             </span>
                          </div>
                       </div>
                    );
                 })}
               </div>
             ) : (
               <>
                 {activeCategory === ProductCategory.BEVANDE ? (
                  <div className="space-y-4">
                     {DRINK_SUBCATEGORIES.map(subCat => {
                        const subCatItems = filteredItems.filter(i => i.subCategory === subCat);
                        if (subCatItems.length === 0) return null;
                        
                        // Controlliamo se questa specifica sottocategoria è attualmente aperta
                        const isExpanded = expandedSubCategory === subCat;

                        return (
                           <div key={subCat}id={`subcat-${subCat.replace(/\s+/g, '-')}`} className="bg-white rounded-2xl border border-wood-100 overflow-hidden shadow-sm transition-all duration-300">
                              
                              {/* INTESTAZIONE CLICCABILE (RIGA DELLA TENDINA) */}
                              <div 
                                 onClick={() => setExpandedSubCategory(prev => prev === subCat ? null : subCat)}
                                 className="flex justify-between items-center cursor-pointer p-4 hover:bg-wood-50 transition-colors select-none"
                              >
                                 <h3 className="text-xl font-western text-wood-900 leading-none">
                                    {tSubCategory(subCat, lang)}
                                 </h3>
                                 
                                 {/* Freccetta animata che ruota di 180° se espansa */}
                                 <ChevronDown 
                                    size={20} 
                                    className={`text-wood-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                                 />
                              </div>

                              {/* CONTENUTO SCORREVOLE A COMPARSA FLUIDA */}
                              {isExpanded && (
                                 <div className="p-4 pt-0 border-t border-wood-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top-3 duration-300">
                                    {subCatItems.map(item => {
                                       const { name, description } = getProductContent(item);
                                       const isAdded = addedItemId === item.id;

                                       // Controllo di sicurezza per le bevande da asporto/consegna
                                       const isDineInOnlyDrink = item.subCategory !== "Acqua e Bibite" && item.subCategory !== "Birre in Bottiglia";
                                       const isUnavailableForDelivery = (tableSessionId === null && !isPreOrder) && isDineInOnlyDrink;

                                       return (
                                          <div key={item.id} className="bg-wood-50/50 rounded-2xl border border-wood-100 overflow-hidden p-4 flex justify-between items-center gap-4 hover:shadow-sm transition-all">
                                             <div className="flex-1 min-w-0">
                                                <div className="flex flex-col items-start">
                                                   <h4 className="font-bold text-wood-900 leading-tight truncate w-full">{name}</h4>
                                                   {item.brand && <span className="text-xs text-accent-600 font-bold mt-0.5">{item.brand}</span>}
                                                </div>
                                                {description && <p className="text-xs text-wood-500 mt-1 line-clamp-2">{description}</p>}
                                             </div>
                                             <div className="flex items-center gap-3 shrink-0">
                                                <span className="font-western text-xl text-wood-900">€{item.price.toFixed(2)}</span>
                                                
                                                {/* Nel ciclo delle bevande, sostituisci il vecchio controllo con questa chiamata pulita: */}
                                                {isUnavailableForDelivery ? (
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1.5 rounded-lg select-none whitespace-nowrap">
                                                   Solo al tavolo 🍷
                                                </span>
                                                ) : (
                                                <button 
                                                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCartClick(item); }} 
                                                   className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                                                      isAdded ? 'bg-green-500 text-white' : 'bg-wood-900 text-white hover:bg-accent-600'
                                                   }`}
                                                >
                                                   {isAdded ? <Check size={18} /> : <Plus size={18} />}
                                                </button>
                                                )}
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>
                              )}
                           </div>
                        )
                     })}
                       {filteredItems.filter(i => !i.subCategory).length > 0 && (
                          <div>
                             <h3 className="text-2xl font-western text-wood-900 mb-4 border-b-2 border-wood-200 pb-2 inline-block">Altro</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredItems.filter(i => !i.subCategory).map(item => {
                                   const { name, description } = getProductContent(item);
                                   const isAdded = addedItemId === item.id;
                                   return (
                                     <div key={item.id} className="bg-white rounded-2xl border border-wood-100 overflow-hidden shadow-sm p-4 flex justify-between items-center gap-4 hover:shadow-md transition-all">
                                        <div className="flex-1 min-w-0"><div className="flex flex-col items-start"><h4 className="font-bold text-wood-900 leading-tight truncate w-full">{name}</h4>{item.brand && <span className="text-xs text-accent-600 font-bold mt-0.5">{item.brand}</span>}</div>{description && <p className="text-xs text-wood-500 mt-1 line-clamp-2">{description}</p>}</div>
                                        <div className="flex items-center gap-3 shrink-0"><span className="font-western text-xl text-wood-900">€{item.price.toFixed(2)}</span><button onClick={() => addToCart(item)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${isAdded ? 'bg-green-500 text-white' : 'bg-wood-900 text-white hover:bg-accent-600'}`}>{isAdded ? <Check size={18} /> : <Plus size={18} />}</button></div>
                                     </div>
                                   );
                                })}
                             </div>
                          </div>
                       )}
                     </div>
                 ) : (
                   <>
                     {filteredItems.length === 0 ? (
                       <div className="text-center py-20"><div className="inline-block p-6 bg-wood-100 rounded-full mb-4"><UtensilsCrossed size={40} className="text-wood-400" /></div><h3 className="text-xl font-bold text-wood-600">{t('no_products_section', lang)}</h3><p className="text-wood-400 mt-2">{t('select_category', lang)}</p></div>
                     ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {sortedFilteredItems.map(item => {
                           const { name, description } = getProductContent(item);
                           const isAdded = addedItemId === item.id;
                           const isDrink = item.category === ProductCategory.BEVANDE;

                            // ==========================================
                           // CONTROLLO DI SICUREZZA PER LE BEVANDE DA CASA (AGGIUNTO ANCHE QUI)
                           const isDineInOnlyDrink = isDrink && item.subCategory !== "Acqua e Bibite" && item.subCategory !== "Birre in Bottiglia";
                           const isUnavailableForDelivery = (tableSessionId === null && !isPreOrder) && isDineInOnlyDrink;
                           // ==========================================

                           return (
                             <div key={item.id} onClick={(e) => { const target = e.target as HTMLElement; if (target.closest('button')) return; setInfoItem(item);}} className="bg-white rounded-3xl border border-wood-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer">
                               {!isDrink && (
                                 <div className="relative h-56 bg-wood-50 overflow-hidden">
                                   {item.imageUrl ? (<img src={item.imageUrl} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />) : (<div className="w-full h-full flex items-center justify-center bg-wood-100"><WesternLogo size="lg" className="opacity-50 grayscale" /></div>)}
                                   {item.tags && item.tags.length > 0 && (<div className="absolute top-4 left-4 flex flex-col gap-1">{item.tags.map(tag => (<span key={tag} className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm ${tag === 'Piccante' ? 'bg-red-500 text-white' : tag === 'Vegetariano' || tag === 'Vegano' ? 'bg-green-500 text-white' : 'bg-accent-500 text-white'}`}>{tag}</span>))}</div>)}
                                   <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-sm border border-wood-100 flex items-center gap-1"><span className="text-xs font-bold text-wood-500">€</span><span className="text-xl font-western text-wood-900">{item.price.toFixed(2)}</span></div>
                                 </div>
                               )}
                               <div className="p-6 flex-1 flex flex-col">
                                 <div className="flex justify-between items-start mb-2"><div className="flex-1 min-w-0"><h3 className="text-xl font-bold text-wood-900 leading-tight break-words">{name}</h3>{item.brand && <p className="text-accent-600 font-bold text-sm mb-1">{item.brand}</p>}{item.category === ProductCategory.HAMBURGER && item.subCategory && <span className="text-[10px] font-bold text-wood-400 bg-wood-50 px-2 py-1 rounded-md whitespace-nowrap">{item.subCategory}</span>}</div>{isDrink && (<div className="flex items-center gap-1 pl-2 shrink-0"><span className="text-sm font-bold text-wood-500">€</span><span className="text-xl font-western text-wood-900">{item.price.toFixed(2)}</span></div>)}</div>
                                 <div className="flex-1 mb-4">{description && <p className="text-sm text-wood-500 line-clamp-3">{description}</p>}{description.includes('*') && (<p className="text-[10px] text-wood-400 italic mt-1">* Prodotto surgelato</p>)}</div>
                                 {/* BLOCCO ALLERGENI CON BADGE COMPATTI E INTELLIGENTI */}
                                    {item.allergens && item.allergens.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4 border-t border-wood-100 pt-2">
                                       {item.allergens.map(a => {
                                          // Recuperiamo i colori coordinati per l'allergene corrente (con un fallback grigio per sicurezza)
                                          const colors = ALLERGEN_COLORS[a] || { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' };

                                          return (
                                          <div 
                                             key={a} 
                                             className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${colors.bg} ${colors.text} ${colors.border} shadow-sm transition-transform hover:scale-105`}
                                          >
                                             {/* 
                                                La tua icona Lucide personalizzata erediterà automaticamente il colore del testo del badge,
                                                diventando coordinata e bellissima (es: l'icona del Glutine sarà color ambra)!
                                             */}
                                             <AllergenIcon type={a} className="w-3.5 h-3.5 shrink-0" />
                                             <span>{a}</span>
                                          </div>
                                          );
                                       })}
                                    </div>
                                    )}
                                 {/* APPLICAZIONE DEL BLOCCO CONDIZIONALE SUL PULSANTE DI AGGIUNTA IN FONDO ALLA SCHEDA */}
                                 {/* Nel ciclo delle schede grandi in fondo (pizze, hamburger speciali, ecc.): */}
                                 {isUnavailableForDelivery ? (
                                 <div className="w-full py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl font-bold text-center text-sm select-none">
                                    Solo consumazione al tavolo 🍷
                                 </div>
                                 ) : (
                                 <button 
                                    type="button"
                                    // Richiama la nostra nuova funzione filtro!
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCartClick(item); }} 
                                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg ${
                                       isAdded ? 'bg-green-500 text-white scale-95' : 'bg-wood-900 text-white hover:bg-accent-600 shadow-wood-200'
                                    }`}
                                 >
                                    {isAdded ? <Check size={18} /> : <Plus size={18} />} {t('add_to_cart', lang)}
                                 </button>
                                 )}
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     )}
                   </>
                 )}
               </>
             )}
          </div>
        </div>

        
        {/* FOOTER SCURO COMPLETO CON EMAIL, SOCIAL E PAGINE LEGALI */}
        <div className="bg-wood-900 text-wood-300 pt-12 pb-32 border-t border-wood-800 shrink-0">
          <div className="container mx-auto px-4 text-center">
            
            <WesternLogo size="md" className="mx-auto mb-6 opacity-80" />
            
            {/* CONTATTI DETTAGLIATI (TELEFONO, INDIRIZZO E EMAIL CLICCABILE) */}
            <div className="flex flex-col gap-2 items-center mb-6 font-bold text-white text-sm">
              <div className="flex items-center gap-2">
                 <Phone size={16} className="text-accent-500" /> 
                 <a href="tel:0321510220" className="hover:underline">0321 510220</a>
              </div>
              <div className="flex items-center gap-2">
                 <MapPin size={16} className="text-accent-500" /> Via G. Galilei 35 - Cameri (NO)
              </div>
              <div className="flex items-center gap-2 hover:text-accent-500 transition-colors">
                 <Mail size={16} className="text-accent-500" /> 
                 <a href="mailto:oldwestconsegne@gmail.com" className="hover:underline">contatto@oldwest.click</a>
              </div>
            </div>

            {/* SEZIONE SOCIAL CON EFFETTO HOVER */}
            <div className="flex justify-center gap-4 mb-8">
               <a 
                  href="https://www.facebook.com/OldWestCameri/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 bg-wood-800 rounded-full text-white hover:bg-[#45856c] hover:scale-110 transition-all shadow-md" 
                  title="Seguici su Facebook"
               >
                  <Facebook size={18} />
               </a>
               <a 
                  href="https://www.instagram.com/oldwest_cameri/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 bg-wood-800 rounded-full text-white hover:bg-[#45856c] hover:scale-110 transition-all shadow-md" 
                  title="Seguici su Instagram"
               >
                  <Instagram size={18} />
               </a>
            </div>

            {/* COPYRIGHT */}
            <p className="text-xs opacity-75">&copy; {new Date().getFullYear()} Old West. {t('rights_reserved', lang)}</p>
            <p className="text-[10px] opacity-40 tracking-wider uppercase">
            Design by CIELOBEJ STUDIO
            </p>
            
            {/* SEZIONE LINK LEGALI STATICI OSPITATI NELLA CARTELLA PUBLIC */}
            <div className="flex justify-center gap-3 mt-4 text-[10px] opacity-60 hover:opacity-75 transition-opacity font-bold uppercase tracking-wider">
               <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a>
               <span>•</span>
               <a href="/cookie.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Cookie Policy</a>
               <span>•</span>
               <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="hover:underline">Termini e Condizioni</a>
            </div>

          </div>
        </div>

      </div>
    );
  };
  const renderLogin = () => (
    <div className="min-h-screen bg-wood-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-4 border-wood-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-accent-500"></div>
        <div className="flex flex-col items-center text-center mb-8"><WesternLogo size="lg" url={customLogo} className="mb-4" /><h2 className="text-3xl font-western text-wood-900">{t('admin_area', lang)}</h2><p className="text-wood-500 mt-2">{t('login_prompt', lang)}</p></div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-400" size={20} /><input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="PIN (1234)" className="w-full bg-wood-50 text-center font-mono text-2xl tracking-widest py-4 rounded-xl border-2 border-wood-100 focus:outline-none focus:border-accent-500 focus:bg-white transition-all text-wood-900" autoFocus /></div>
          {loginError && (<div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-pulse"><AlertCircle size={16} /> {loginError}</div>)}
          <button type="submit" className="w-full bg-accent-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-accent-600 hover:scale-[1.02] active:scale-[0.98] transition-all">{t('login_btn', lang)}</button>
        </form>
        <button onClick={() => setView('MENU')} className="w-full mt-4 py-3 text-wood-400 font-bold hover:text-wood-600 transition-colors">{t('back_to_menu', lang)}</button>
      </div>
    </div>
  );

  const renderAdmin = () => {
    const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
    
    // LOGICA DI FILTRAGGIO E RICERCA AVANZATA
    const displayItems = sortedItems.filter(i => {
      // 1. Filtro per Categoria o Sottocategoria Extra
      let matchesCategory = true;
      if (activeCategory !== 'Tutti') {
        if (activeCategory === 'Aggiunte - Hamburger') {
          matchesCategory = i.category === ProductCategory.AGGIUNTE && i.subCategory === 'Hamburger';
        } else if (activeCategory === 'Aggiunte - Pizza') {
          matchesCategory = i.category === ProductCategory.AGGIUNTE && i.subCategory === 'Pizza';
        } else if (activeCategory === 'Aggiunte - Generale') {
          matchesCategory = i.category === ProductCategory.AGGIUNTE && i.subCategory === 'Generale';
        } else {
          matchesCategory = i.category === activeCategory;
        }
      }
      
      // 2. Filtro di ricerca per Nome (Cerca prodotto ed extra)
      const matchesSearch = i.name.toLowerCase().includes(adminSearchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });

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
                    <div className="flex-1"><p className="text-xs text-wood-500 mb-3">Carica il tuo logo (PNG/JPG).</p><div className="flex gap-2 flex-wrap"><label className="bg-white border border-wood-200 text-wood-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-wood-100 cursor-pointer transition-colors flex items-center gap-2">{isProcessingImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Carica Logo<input type="file" onChange={handleLogoUpload} accept="image/*" className="hidden" /></label>{customLogo && (<><button onClick={handleSaveLogo} className="bg-accent-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-accent-600 transition-colors flex items-center gap-2"><Save size={12} /> Salva</button><button onClick={handleResetLogo} className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-2"><RotateCcw size={12} /> Reset</button></>)}</div></div>
                 </div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100"><h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><Trash2 size={18} /> Area Pericolo</h4><p className="text-xs text-red-600 mb-4">Ripristina il menu ai valori di default.</p><button onClick={handleFactoryReset} className="w-full bg-white border border-red-200 text-red-600 py-2 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-colors">Ripristino di Fabbrica</button></div>
           </div>
        </div>
        <div id="new-product-form" className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-accent-100 mb-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-accent-500"></div>
           <h3 className="text-2xl font-western text-wood-900 mb-6 flex items-center gap-2">{editingId ? <Pencil size={24} className="text-accent-500" /> : <Plus size={24} className="text-accent-500" />} {editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h3>
           <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Categoria</label><div className="relative"><select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as ProductCategory})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500">{[...CATEGORIES_LIST, ProductCategory.AGGIUNTE].map(cat => (<option key={cat} value={cat}>{tCategory(cat, lang)}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={16} /></div></div>
                    {(newItem.category === ProductCategory.HAMBURGER || newItem.category === ProductCategory.BEVANDE) && (<div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Sotto-Categoria</label><div className="relative"><select value={newItem.subCategory} onChange={e => setNewItem({...newItem, subCategory: e.target.value})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500">{(newItem.category === ProductCategory.HAMBURGER ? HAMBURGER_SUBCATEGORIES : DRINK_SUBCATEGORIES).map(sub => (<option key={sub} value={sub}>{sub}</option>))}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={16} /></div></div>)}
                 </div>
                 <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Nome Prodotto</label><input type="text" required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 font-medium" placeholder="Es. Old West Burger" /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Prezzo (€)</label><input type="number" step="0.01" required value={newItem.price} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 font-mono" /></div>
                    <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-1">Brand (Opzionale)</label><input type="text" value={newItem.brand || ''} onChange={e => setNewItem({...newItem, brand: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500" placeholder="Es. Chianina" /></div>
                 </div>
                 <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-2">Allergeni</label><div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-wood-50 p-3 rounded-xl border border-wood-200 max-h-40 overflow-y-auto">{(Object.keys(ALLERGENS_CONFIG) as AllergenType[]).map(allergen => { const isSelected = newItem.allergens?.includes(allergen); return (<button type="button" key={allergen} onClick={() => { const current = newItem.allergens || []; const updated = isSelected ? current.filter(a => a !== allergen) : [...current, allergen]; setNewItem({ ...newItem, allergens: updated }); }} className={`px-2 py-2 rounded-lg text-[10px] font-bold flex items-center gap-2 border transition-all text-left ${isSelected ? 'bg-red-100 border-red-200 text-red-700' : 'bg-white border-wood-200 text-wood-500 hover:bg-wood-100'}`}><div className="shrink-0"><AllergenIcon type={allergen} className="w-4 h-4" /></div>{allergen}</button>) })}</div></div>
                 <div><label className="block text-xs font-bold text-wood-500 uppercase tracking-wider mb-2">Etichette</label><div className="flex flex-wrap gap-2">{['Vegetariano', 'Vegano', 'Piccante', 'Best Seller', 'Consigliato', 'Senza Glutine'].map(tag => { const isActive = newItem.tags?.includes(tag); return (<button type="button" key={tag} onClick={() => { const currentTags = newItem.tags || []; const newTags = isActive ? currentTags.filter(t => t !== tag) : [...currentTags, tag]; setNewItem({...newItem, tags: newTags}); }} className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${isActive ? 'bg-accent-500 border-accent-500 text-white' : 'bg-white border-wood-200 text-wood-500 hover:border-accent-300'}`}>{tag}</button>); })}</div></div>
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
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <h3 className="text-2xl font-western text-wood-900 shrink-0">
               Prodotti nel Menu ({displayItems.length})
             </h3>
             
             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* BARRA DI RICERCA PRODOTTO ED EXTRA */}
                <div className="relative flex-1 sm:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wood-400" size={16}/>
                   <input 
                      type="text" 
                      placeholder="Cerca prodotto o extra..." 
                      value={adminSearchQuery} 
                      onChange={(e) => setAdminSearchQuery(e.target.value)} 
                      className="w-full bg-white border border-wood-200 rounded-full py-2 pl-9 pr-8 text-sm outline-none focus:ring-1 focus:ring-[#45856c] focus:border-[#45856c]" 
                   />
                   {adminSearchQuery && (
                     <button type="button" onClick={() => setAdminSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 hover:text-wood-600">
                       <X size={14} />
                     </button>
                   )}
                </div>

                {/* TENDINA CATEGORIE CON SOTTOCATEGORIE EXTRA INCOPORATE */}
                <div className="relative shrink-0">
                   <select 
                      value={activeCategory} 
                      onChange={e => handleCategoryClick(e.target.value)} 
                      className="appearance-none bg-white border border-wood-200 rounded-full px-4 py-2 pr-8 text-sm font-bold text-wood-600 focus:outline-none w-full sm:w-auto"
                   >
                     <option value="Tutti">Tutte le Categorie</option>
                     {CATEGORIES_LIST.map(cat => (
                         <option key={cat} value={cat}>{tCategory(cat, lang)}</option>
                     ))}
                     <option value={ProductCategory.AGGIUNTE}>Tutti gli Ingredienti Extra</option>
                     {/* Sotto-Filtri per gli Extra richiesti da te */}
                     <option value="Aggiunte - Hamburger">Extra - Hamburger</option>
                     <option value="Aggiunte - Pizza">Extra - Pizza</option>
                     <option value="Aggiunte - Generale">Extra - Generale</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={14} />
                </div>
             </div>
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
                   <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {/* BOTTONE MODIFICA */}
                      <button onClick={() => handleEditItem(item)} className="w-8 h-8 rounded-lg bg-wood-100 text-wood-600 flex items-center justify-center hover:bg-accent-500 hover:text-white transition-colors" title="Modifica"><Pencil size={14} /></button>
                      
                      {/* NUOVO BOTTONE DUPLICA */}
                      <button onClick={(e) => handleDuplicateItem(item, e)} className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors animate-in fade-in" title="Duplica"><Copy size={14} /></button>
                      
                      {/* BOTTONE ELIMINA */}
                      <button onClick={(e) => handleDeleteItem(item.id, e)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Elimina"><Trash2 size={14} /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )};

  const renderTracking = () => {
    if (!currentOrder) return null;

    const isTableOrder = currentOrder.order_type === 'table';

    const statusSteps = [
      { id: 'pending', label: 'Inviato', icon: Check },
      { id: 'preparing', label: 'In Preparazione', icon: Utensils },
      { id: 'shipped', label: orderForm.orderType === 'delivery' ? 'In Consegna' : 'Pronto al Ritiro', icon: Bike },
      { id: 'completed', label: 'Consegnato', icon: CheckCircle2 }
    ];

    const currentStepIndex = statusSteps.findIndex(s => s.id === currentOrder.status);
    const displayCustomerName = currentOrder?.customer_name
  ? currentOrder.customer_name
      .replace("AGGIUNTA - ", "")
      .replace("AGGIUNTE - ", "")
      .replace(/TAVOLO\s+\d+/i, "")
      .replace(/[()]/g, "")
      .trim()
  : (orderForm.customerName || "Ospite");

    return (
      <div className="min-h-screen bg-wood-50 pt-24 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-wood-100 animate-in fade-in duration-300">
          
          {/* HEADER */}
          <div className="bg-[#45856c] p-8 text-white text-center">
            <CheckCircle2 size={48} className="mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-western uppercase tracking-wider">
               {isTableOrder ? 'Ordine in Preparazione!' : 'Ordine Ricevuto!'}
            </h2>
            <p className="opacity-90 text-sm mt-2">
                {isTableOrder
                   ? `Grazie ${displayCustomerName}, mettiti comodo!` // <--- Molto più semplice ed elegante! [1]
                   : `Grazie ${displayCustomerName}, stiamo lavorando per te.`
                }
             </p>
          </div>

          <div className="p-6 md:p-8">
            
            {isTableOrder ? (
               // SCENARIO AL TAVOLO: NESSUNA LINEA STRADALE COINVOLTA! (FOTO 3 RIVISITATA) [5]
               <div className="space-y-6 text-center py-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                     <span className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Stato Ordinazione</span>
                     <span className="text-2xl font-western text-green-800 animate-pulse">IN PREPARAZIONE 🍳</span>
                  </div>
                  
                  <p className="text-sm text-wood-600 leading-relaxed font-medium">
                     La cucina ha ricevuto le tue consumazioni. Le serviremo direttamente al tuo tavolo non appena saranno pronte!
                  </p>

                  {/* RIEPILOGO DEI PIATTI ORDINATI */}
                  <div className="mt-6 pt-6 border-t border-wood-100 text-left">
                     <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block mb-2">Piatti in preparazione:</span>
                     <div className="space-y-1.5 bg-wood-50 p-3 rounded-2xl border border-wood-100 font-mono text-xs text-wood-700">
                        {currentOrder.cart_items?.map((item: any, idx: number) => (
                           <div key={idx} className="flex justify-between">
                              <span>{item.quantity}x {item.name.toUpperCase()}</span>
                           </div>
                        ))}
                      </div>
                   </div>
                </div>
             ) : (
                // SCENARIO STRADALE CLASSICO (DELIVERY / TAKEAWAY)
                <div className="relative space-y-8">
                  {statusSteps.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step.id} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isDone ? 'bg-[#45856c]' : 'bg-wood-100'}`}>
                          <step.icon size={20} className={isDone ? 'text-white' : 'text-wood-300'} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold ${isDone ? 'text-wood-900' : 'text-wood-300'} ${isCurrent ? 'text-lg text-[#45856c]' : ''}`}>
                            {step.label}
                          </p>
                          {isCurrent && step.id !== 'completed' && (
                            <span className="text-xs text-wood-400 animate-pulse">In corso...</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-wood-100 -z-10"></div>
                  <div className="absolute left-5 top-5 w-0.5 bg-[#45856c] -z-10 transition-all duration-1000" style={{ height: `${(currentStepIndex / 3) * 100}%` }}></div>
                </div>
             )}

             <button 
               onClick={() => { setView('MENU'); setActiveOrderId(null); }}
               className="w-full mt-12 py-4 text-wood-400 font-bold hover:text-wood-600 transition-colors border-2 border-wood-50 rounded-2xl"
             >
               Torna al Menu
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderHeader()}
      {view === 'LANDING' && (
         <LandingPage 
            customLogo={customLogo} 
            setView={setView} 
            setIsPreOrder={setIsPreOrder} 
            setTempReservationInfo={setTempReservationInfo} 
            setReservationForm={setReservationForm} 
            profile={profile} 
            user={user} 
            lang={lang} 
            t={t} 
            DELIVERY_ZONES={DELIVERY_ZONES} 
         />
      )}
      
      {view === 'BOOKING' && (
         <BookingPage 
            reservationForm={reservationForm} 
            setReservationForm={setReservationForm} 
            isSubmittingReservation={isSubmittingReservation} 
            handleSubmitReservation={handleSubmitReservation} 
            generateTimeSlots={generateTimeSlots} 
            setView={setView} 
            isPreOrder={isPreOrder} 
            lang={lang} 
            t={t} 
         />
      )}
      {view === 'MENU' && renderMenu()}
      {view === 'CHECKOUT' && renderCheckout()}
      {view === 'ORDER_SUCCESS' && renderOrderSuccess()}
      {view === 'LOGIN' && renderLogin()}
      {view === 'ADMIN' && renderAdmin()}
      {view === 'TRACKING' && renderTracking()}
      {renderCartDrawer()}
      {renderFloatingCartBar()}

      {(view === 'MENU' || view === 'CHECKOUT') && (
         <button onClick={scrollToTop} className={`fixed bottom-24 right-6 z-40 w-10 h-10 bg-wood-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-accent-600 hover:scale-110 ${showScrollTop && !isCartOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`} aria-label="Scroll to top"><ChevronUp size={20} /></button>
      )}
      {/* POPUP DETTAGLI PRODOTTO IN EVIDENZA (CON TRADUZIONI) */}
      {infoItem && (() => {
        // Questa riga recupera nome e descrizione nella lingua corretta
        const { name, description } = getProductContent(infoItem);
        
        return (
          <div className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setInfoItem(null)}>
            <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <div className="relative h-48 bg-wood-100">
                {infoItem.imageUrl ? (
                  <img src={infoItem.imageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-wood-300"><UtensilsCrossed size={40}/></div>
                )}
                <button onClick={() => setInfoItem(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6">
                {/* Visualizziamo 'name' e 'description' tradotti */}
                <h3 className="text-2xl font-bold text-wood-900 mb-1">{name}</h3>
                {infoItem.brand && <p className="text-[#45856c] font-bold mb-3">{infoItem.brand}</p>}
                <p className="text-wood-600 leading-relaxed mb-6">{description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-wood-100">
                   <span className="text-2xl font-western text-wood-900">€{infoItem.price.toFixed(2)}</span>
                   <button 
                     onClick={() => { addToCart(infoItem); setInfoItem(null); }}
                     className="bg-[#45856c] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all active:scale-95"
                   >
                     <Plus size={18}/> {t('add_to_cart', lang)}
                   </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

            {/* ================= MODALE DI PERSONALIZZAZIONE PRODOTTO (MCDONALD STYLE) ================= */}
      {isCustomizationModalOpen && customizingItemIndex !== null && (() => {
         const item = cart[customizingItemIndex];
         const baseIngredients = item.description 
           ? item.description.split(',').map(i => i.trim()).filter(i => i && !i.includes('*'))
           : [];  
          // 2. RECUPERIAMO LA DESCRIZIONE TRADOTTA DAL DATABASE (usata per lo schermo del cliente)
         const translatedDesc = getProductContent(item).description;
         const translatedIngredients = translatedDesc
           ? translatedDesc.split(',').map(i => i.trim()).filter(i => i && !i.includes('*'))
           : [];

         const labelCustomizeSubtitle = lang === 'it' ? 'Personalizza il tuo prodotto' : lang === 'en' ? 'Customize your product' : lang === 'fr' ? 'Personnalisez votre produit' : 'Produkt anpassen';
         const labelIngredientsIncluded = lang === 'it' ? 'Ingredienti inclusi:' : lang === 'en' ? 'Ingredients included:' : lang === 'fr' ? 'Ingrédients inclus:' : 'Inbegriffene Zutaten:';
         const labelWantToAddMore = lang === 'it' ? 'Vuoi aggiungere altro?' : lang === 'en' ? 'Want to add more?' : lang === 'fr' ? 'Voulez-vous ajouter autre chose?' : 'Möchten Sie mehr aggiungere?';
         const labelCancel = lang === 'it' ? 'Annulla' : lang === 'en' ? 'Cancel' : lang === 'fr' ? 'Annuler' : 'Abbrechen';
         const labelConfirm = lang === 'it' ? 'Conferma' : lang === 'en' ? 'Confirm' : lang === 'fr' ? 'Confirmer' : 'Bestätigen';
         const labelDoppio = lang === 'it' ? 'Doppio' : lang === 'en' ? 'Double' : lang === 'fr' ? 'Double' : 'Doppelt';

         // Filtriamo gli ingredienti extra da cercare in base alla categoria
         const addons = items.filter(i => {
           if (i.category !== ProductCategory.AGGIUNTE) return false;
           return i.subCategory === "Generale" || i.subCategory === item.category;
         });
         const filteredAddons = addons.filter(a => a.name.toLowerCase().includes(addonSearch.toLowerCase()));

         return (
            <div className="fixed inset-0 bg-black/60 z-[70] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
               <div className="bg-white w-full md:max-w-md h-[90vh] md:h-auto md:max-h-[85vh] md:rounded-3xl rounded-t-3xl p-6 flex flex-col shadow-2xl overflow-hidden">
                  
                  <div className="text-center mb-4 pb-4 border-b border-wood-100">
                     <h4 className="font-western text-2xl text-wood-900 leading-none uppercase">{getProductContent(item).name}</h4>
                     <p className="text-xs text-wood-400 font-bold uppercase mt-1">{labelCustomizeSubtitle}</p>
                  </div>

                  {/* INGREDIENTI DI BASE (- 1 +) */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                     {baseIngredients.length > 0 && (
                        <div className="space-y-3 bg-wood-50/50 p-4 rounded-2xl border border-wood-100">
                           <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block mb-1">{labelIngredientsIncluded}</span>
                           {baseIngredients.map((ing, idx) => { // <--- AGGIUNTO IL PARAMETRO "idx"
                              const qty = tempIngredientsQty[ing] ?? 1;
                              
                              // RECUPERA AUTOMATICAMENTE IL TERMINE DALLA DESCRIZIONE TRADOTTA CORRISPONDENTE
                              const translatedIngredient = translatedIngredients[idx] || ing;

                              return (
                                 <div key={ing} className="flex justify-between items-center py-1">
                                    <span className={`font-bold text-sm uppercase transition-colors ${qty === 0 ? 'line-through text-red-500 opacity-60' : qty > 1 ? 'text-[#45856c]' : 'text-wood-800'}`}>
                                       {translatedIngredient} {qty > 1 && <span className="text-xs font-normal">({labelDoppio})</span>}
                                    </span>
                                    
                                    <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm border border-wood-100">
                                       <button 
                                          type="button"
                                          onClick={() => setTempIngredientsQty(prev => ({ ...prev, [ing]: Math.max(0, qty - 1) }))}
                                          className="w-7 h-7 flex items-center justify-center bg-wood-50 rounded text-wood-600 hover:text-red-500 font-bold"
                                       >
                                          -
                                       </button>
                                       <span className="text-xs font-bold w-4 text-center">{qty}</span>
                                       <button 
                                          type="button"
                                          onClick={() => setTempIngredientsQty(prev => ({ ...prev, [ing]: Math.min(2, qty + 1) }))}
                                          className="w-7 h-7 flex items-center justify-center bg-wood-50 rounded text-wood-600 hover:text-green-500 font-bold"
                                       >
                                          +
                                       </button>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     )}

                     {/* RICERCA EXTRA AGGIUNTI */}
                     <div className="mt-6">
                        <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block mb-2">{labelWantToAddMore}</span>
                        <div className="relative mb-3">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wood-400" size={16}/>
                           <input 
                              type="text" 
                              placeholder={t('search_addon', lang)} 
                              value={addonSearch} 
                              onChange={(e) => setAddonSearch(e.target.value)} 
                              className="w-full bg-wood-50 border border-wood-200 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-[#45856c] focus:border-[#45856c]" 
                           />
                        </div>

                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                           {filteredAddons.map(addon => {
                              // RECUPERIAMO IL NOME TRADOTTO IN AUTOMATICO DAL DATABASE
                              const { name } = getProductContent(addon);
                              
                              return (
                              <button 
                                 type="button"
                                 key={addon.id} 
                                 onClick={() => {
                                    const newCart = [...cart];
                                    const updatedItem = { ...newCart[customizingItemIndex] };
                                    updatedItem.selectedAddons = [...(updatedItem.selectedAddons || []), addon];
                                    newCart[customizingItemIndex] = updatedItem;
                                    setCart(newCart);
                                    setAddonSearch('');
                                    
                                    setSuggestionToast({ 
                                       show: true, 
                                       text: `AGGIUNTO: ${name.toUpperCase()}` // Usa il nome tradotto anche nel toast fluttuante!
                                    });
                                    setTimeout(() => setSuggestionToast({ show: false, text: '' }), 2500);
                                 }} 
                                 className="w-full flex justify-between items-center p-3 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-[#45856c]/20 text-left"
                              >
                                 <span className="text-sm font-medium text-wood-700">{name}</span>
                                 <span className="font-mono font-bold text-xs text-[#45856c] bg-[#45856c]/10 px-2 py-1 rounded-lg">+€{addon.price.toFixed(2)}</span>
                              </button>
                           )})}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-wood-100">
                     <button 
                        type="button" 
                        onClick={() => { setIsCustomizationModalOpen(false); setCustomizingItemIndex(null); }} 
                        className="py-3 rounded-xl font-bold text-wood-500 bg-wood-50 hover:bg-wood-100"
                     >
                        {labelCancel}
                     </button>
                     <button 
                        type="button" 
                        onClick={handleConfirmCustomization} 
                        className="py-3 rounded-xl font-bold text-white bg-[#45856c] hover:bg-opacity-90"
                     >
                        {labelConfirm}
                     </button>
                  </div>
               </div>
            </div>
         );
      })()}


      {/* ================= MODALE DI SELEZIONE CONTORNO COMPRESO ================= */}
      {isSideDishModalOpen && sideDishItemIndex !== null && (() => {
         // Carichiamo dinamicamente tutti i contorni disponibili nel menu dell'applicazione
         const availableSideDishes = items.filter(i => i.category === ProductCategory.CONTORNI && i.isAvailable !== false);

         return (
            <div className="fixed inset-0 bg-black/60 z-[70] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
               <div className="bg-white w-full md:max-w-md max-h-[75vh] md:rounded-3xl rounded-t-3xl p-6 flex flex-col shadow-2xl overflow-hidden">
                  
                  <div className="text-center mb-6 pb-4 border-b border-wood-100">
                     <h4 className="font-western text-2xl text-wood-900 leading-none">SCEGLI IL CONTORNO</h4>
                     <p className="text-xs text-orange-500 font-bold uppercase mt-1">* Seleziona il contorno incluso nel piatto (0,00 €)</p>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                     {availableSideDishes.map((side) => {
                        const currentItem = cart[sideDishItemIndex];
                        const isSelected = currentItem.selectedSideDish === side.name;

                        return (
                           <button 
                              type="button"
                              key={side.id} 
                              onClick={() => selectSideDish(side.name)}
                              className={`w-full flex justify-between items-center p-4 rounded-2xl border-2 text-left transition-all ${
                                 isSelected 
                                 ? 'border-[#45856c] bg-[#45856c]/5 shadow-sm font-bold' 
                                 : 'border-wood-100 hover:border-wood-300 bg-wood-50/50'
                              }`}
                           >
                              <span className={isSelected ? 'text-[#45856c]' : 'text-wood-800'}>{side.name}</span>
                              <span className="text-xs font-bold text-[#45856c] bg-[#45856c]/10 px-3 py-1 rounded-full uppercase">Incluso</span>
                           </button>
                        );
                     })}
                     {availableSideDishes.length === 0 && (
                        <p className="text-center py-10 text-wood-400">Nessun contorno disponibile nel menu.</p>
                     )}
                  </div>

                  <div className="pt-4 border-t border-wood-100">
                     <button 
                        type="button" 
                        onClick={() => { setIsSideDishModalOpen(false); setSideDishItemIndex(null); }} 
                        className="w-full py-3 rounded-xl font-bold text-wood-500 bg-wood-50 hover:bg-wood-100"
                     >
                        Annulla
                     </button>
                  </div>
               </div>
            </div>
         );
      })()}

      {/* ================= MODALE DI SELEZIONE BEVANDA OMAGGIO (PIZZA) ================= */}
      {isFreeDrinkModalOpen && freeDrinkItemIndex !== null && (() => {
         // Filtriamo dinamicamente le bibite dal database che contengono "33" o "lattina" nel nome, o hanno un prezzo basso
         // Filtro sobrio: escludiamo esplicitamente acqua, caffè, liquori e altre birre specifiche
         // Filtro con limite di prezzo a 3.00 € compresi (minore o uguale)
         const dbDrinks = items.filter(i => 
           i.category === ProductCategory.BEVANDE && 
           i.isAvailable !== false &&
           !i.name.toLowerCase().includes("acqua") &&
           !i.name.toLowerCase().includes("caffè") &&
           !i.name.toLowerCase().includes("caffe") &&
           !i.name.toLowerCase().includes("corretto") &&
           i.price <= 3.00 && // <--- AGGIORNATO: include le bibite da 3.00 € ed esclude le birre più costose
           (i.name.toLowerCase().includes("33") || i.name.toLowerCase().includes("lattina"))
         );

         // Costruiamo le opzioni di scelta pre-appendendo l'opzione generica "Birra Lattina" richiesta
         const availableDrinks = [
           { id: 'custom-beer', name: 'Birra Lattina' },
           ...dbDrinks
         ];

         return (
            <div className="fixed inset-0 bg-black/60 z-[70] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
               <div className="bg-white w-full md:max-w-md max-h-[75vh] md:rounded-3xl rounded-t-3xl p-6 flex flex-col shadow-2xl overflow-hidden">
                  
                  <div className="text-center mb-6 pb-4 border-b border-wood-100">
                     <h4 className="font-western text-2xl text-wood-900 leading-none">BEVANDA OMAGGIO</h4>
                     <p className="text-xs text-orange-500 font-bold uppercase mt-1">* Seleziona una bibita 33cl o Birra inclusa con la pizza</p>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                     {availableDrinks.map((drink) => {
                        const currentItem = cart[freeDrinkItemIndex];
                        const isSelected = currentItem.selectedFreeDrink === drink.name;

                        return (
                           <button 
                              type="button"
                              key={drink.id} 
                              onClick={() => selectFreeDrink(drink.name)}
                              className={`w-full flex justify-between items-center p-4 rounded-2xl border-2 text-left transition-all ${
                                 isSelected 
                                 ? 'border-[#45856c] bg-[#45856c]/5 shadow-sm font-bold' 
                                 : 'border-wood-100 hover:border-wood-300 bg-wood-50/50'
                              }`}
                           >
                              <span className={isSelected ? 'text-[#45856c]' : 'text-wood-800'}>{drink.name}</span>
                              <span className="text-xs font-bold text-[#45856c] bg-[#45856c]/10 px-3 py-1 rounded-full uppercase">Omaggio</span>
                           </button>
                        );
                     })}
                  </div>

                  <div className="pt-4 border-t border-wood-100">
                     <button 
                        type="button" 
                        onClick={() => { setIsFreeDrinkModalOpen(false); setFreeDrinkItemIndex(null); }} 
                        className="w-full py-3 rounded-xl font-bold text-wood-500 bg-wood-50 hover:bg-wood-100"
                     >
                        Annulla
                     </button>
                  </div>
               </div>
            </div>
         );
      })()}

      {/* ================= MODALE DI VISUALIZZAZIONE E PAGAMENTO CONTO UNICO AL TAVOLO ================= */}
      {isBillModalOpen && tableSessionId && (() => {
         // Calcola il totale complessivo sommando i total_amount di tutti gli ordini non pagati della sessione
         const billTotal = billOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

         // Raggruppa e unifica i cibi ordinati in modo ordinato per la ricevuta a schermo
         const consolidatedItems: Record<string, { quantity: number; name: string }> = {};
         let totalPizzasAndBurgers = 0;
         
         billOrders.forEach(order => {
            order.cart_items?.forEach((item: any) => {
               if (consolidatedItems[item.name]) {
                  consolidatedItems[item.name].quantity += item.quantity;
               } else {
                  consolidatedItems[item.name] = {
                     quantity: item.quantity,
                     name: item.name
                  };
               }
               if (item.category === 'Pizza' || item.category === ProductCategory.HAMBURGER) {
                  totalPizzasAndBurgers += item.quantity;
               }
            });
         });

         const itemsList = Object.values(consolidatedItems);

         return (
            <div className="fixed inset-0 bg-black/60 z-[70] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
               <div className="relative bg-white w-full md:max-w-md max-h-[90vh] md:rounded-3xl rounded-t-3xl p-6 flex flex-col shadow-2xl overflow-hidden text-left">
                    <button 
                        type="button"
                        onClick={() => setIsBillModalOpen(false)}
                        className="absolute top-4 right-4 text-wood-500 hover:text-wood-800 transition-colors p-2 z-50 text-xl font-bold"
                        title="Chiudi"
                     >
                        ✕
                     </button>
                  <div className="text-center mb-6 pb-4 border-b border-wood-100 shrink-0">
                     <h4 className="font-western text-2xl text-wood-900 leading-none">IL MIO CONTO</h4>
                     <p className="text-xs text-[#45856c] font-black uppercase mt-1">Riepilogo Consolidato Tavolo {localStorage.getItem('active_table_number')}</p>
                  </div>

                  {/* CONTENUTO SCORREVOLE RICEVUTA */}
                  <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar pb-6">
                     
                     {billOrders.length === 0 ? (
                        <p className="text-center py-10 text-wood-400 italic">Non ci sono consumazioni registrate in questo momento.</p>
                     ) : (
                        <div className="space-y-4">
                           <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block border-b border-wood-100 pb-1">Elementi ordinati:</span>
                           <div className="space-y-2.5 bg-wood-50 p-4 rounded-2xl border border-wood-100 font-bold text-sm text-wood-800">
                              {itemsList.map((item, idx) => (
                              <div key={idx} className="flex flex-col border-b border-gray-50/50 pb-2 last:border-0">
                              <div className="flex justify-between">
                                 <span>{item.quantity}x {item.name.toUpperCase()}</span>
                              </div>
                              
                              {/* Aggiunto il cast (item as any) per superare il controllo di TypeScript */}
                              {(item as any).selectedVariant && (
                                 <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-sans block w-fit mt-1 font-bold uppercase tracking-wider">
                                    {(item as any).selectedVariant.name.toUpperCase()}
                                 </span>
                              )}

                              {/* Aggiunto il cast (item as any) per superare il controllo di TypeScript */}
                              {(item as any).selectedAddons && (item as any).selectedAddons.length > 0 && (
                                 <div className="flex flex-col gap-0.5 mt-1 pl-2">
                                    {(item as any).selectedAddons.map((add: any, i: number) => (
                                    <span key={i} className="text-[10px] text-[#45856c] font-sans font-bold uppercase tracking-wider block text-left">
                                       + {add.name.toUpperCase()}
                                    </span>
                                    ))}
                                 </div>
                              )}
                              </div>
                              ))}
                              
                              {/* Riga del Coperto moltiplicato se presente una prenotazione */}
                              {totalPizzasAndBurgers > 0 && tempReservationInfo && (
                                 <div className="flex justify-between border-t border-wood-200/50 pt-2 text-wood-500 font-medium">
                                    <span>COPERTO (x{tempReservationInfo.numPeople} Persone)</span>
                                    <span>€{(tempReservationInfo.numPeople * 2.00).toFixed(2)}</span>
                                 </div>
                              )}
                           </div>
                        </div>
                     )}

                     {/* METODI DI ADDEBITO DEL CONTO COERENTI (CAMERIERE O STRIPE IN APP) */}
                     {billOrders.length > 0 && !billClientSecret && (
                        <div className="space-y-3 pt-2">
                           <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block">Come vuoi saldare il conto?</span>
                           
                           {/* OPZIONE 1: RICHIEDI IL CONTO AL CAMERIERE */}
                           <button 
                              type="button"
                              onClick={handleRequestBillFromWaiter}
                              disabled={isRequestingBill}
                              className="w-full text-left p-4 border-2 border-wood-200 rounded-2xl hover:bg-wood-50 transition-colors flex flex-col gap-0.5"
                           >
                              <span className="font-bold text-wood-900">Chiama il cameriere al tavolo</span>
                              <span className="text-xs text-wood-400 font-medium">Il cameriere si avvicinerà con il POS o il resto</span>
                           </button>

                           {/* OPZIONE 2: PAGA IN APP CON STRIPE */}
                           <button 
                              type="button"
                              onClick={() => handleInitBillStripePayment(billTotal)}
                              disabled={isInitializingBillStripe}
                              className="w-full text-left p-4 border border-[#45856c]/30 rounded-xl hover:bg-green-50/30 transition-colors flex flex-col gap-0.5"
                           >
                              <span className="font-bold text-wood-900">Paga ora in App con Carta</span>
                              <span className="text-xs text-wood-400 font-medium">Sotto sotto trovi Google/Apple Pay e Carte di Credito</span>
                           </button>
                        </div>
                     )}

                     {/* ELEMENTO DI PAGAMENTO STRIPE INTEGRATO NELLA MODALE CONTO */}
                     {billClientSecret && (
                        <div className="mt-4 pt-4 border-t border-wood-100 animate-in fade-in duration-300">
                           <Elements stripe={stripePromise} options={{ clientSecret: billClientSecret, locale: lang }}>
                              <StripeCheckoutForm 
                                 clientSecret={billClientSecret} 
                                 cart={cart}
                                 orderForm={orderForm}
                                 tempReservationInfo={tempReservationInfo}
                                 onPaymentSuccess={handleConfirmConsolidatedPayment} // Chiude e salda tutti gli ordini in blocco!
                              />
                           </Elements>
                        </div>
                     )}

                  </div>

                  {/* TOTALE COMPLESSIVO FISSO IN BASSO */}
                  <div className="p-4 bg-wood-900 rounded-2xl text-white shadow-md flex justify-between items-center shrink-0 mt-4">
                     <span className="text-sm font-bold uppercase tracking-wider">Totale Conto</span>
                     <span className="text-3xl font-western text-accent-500">€{billTotal.toFixed(2)}</span>
                  </div>

               </div>
            </div>
         );
      })()}

       {customModal && customModal.show && (
         <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center transform scale-in duration-200">
               <h3 className="font-bold text-lg text-gray-900 mb-2">{customModal.title}</h3>
               <p className="text-gray-600 text-sm mb-6">{customModal.message}</p>
               
               <div className="flex justify-center gap-3">
               {customModal.showCancel && (
                  <button
                     type="button"
                     onClick={() => setCustomModal(null)}
                     className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50"
                  >
                     Annulla
                  </button>
               )}
               <button
                  type="button"
                  onClick={() => {
                     if (customModal.onConfirm) customModal.onConfirm();
                     setCustomModal(null);
                  }}
                  className="px-6 py-2 bg-wood-700 hover:bg-wood-800 text-white rounded-xl text-sm font-medium"
               >
                  Ok
               </button>
               </div>
            </div>
         </div>
         )}


{/* POPUP SELEZIONE VARIANTE E SERVIZIO PERSONALIZZATO */}
{selectingVariantItem && (
  <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
      
      {/* Intestazione */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 shrink-0">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            {tempSelectedVariant 
              ? `${tempSelectedVariant.name}` 
              : `Scegli ${getProductContent(selectingVariantItem).name}`}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">
            {tempSelectedVariant 
              ? "Come desideri servire la bevanda?" 
              : "Seleziona la tua variante preferita"}
          </p>
        </div>
        <button 
          onClick={() => {
            setSelectingVariantItem(null);
            setTempSelectedVariant(null);
            setVariantSearchQuery("");
          }} 
          className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
        >
          ✕
        </button>
      </div>

      {/* BARRA DI RICERCA - MOSTRATA SOLO IN FASE 1 SE NON È PIZZA E CI SONO PIÙ DI 3 OPZIONI */}
      {!tempSelectedVariant && selectingVariantItem.category !== 'Pizza' && selectingVariantItem.variants.length > 3 && (
        <div className="my-4 shrink-0 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wood-400" size={16}/>
          <input
            type="text"
            placeholder={getCustomerVariantPlaceholder()} 
            value={variantSearchQuery}
            onChange={(e) => setVariantSearchQuery(e.target.value)}
            className="w-full bg-wood-50 border border-wood-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
      )}

      {/* SEZIONE CONTENUTO: TERNARIO TRA FASE 2 (SERVIZIO) E FASE 1 (LISTA PRODOTTI) */}
      {tempSelectedVariant ? (
        /* ========================================== */
        /* FASE 2: OPZIONI DI SERVIZIO AL TAVOLO / BANCO */
        /* ========================================== */
        <div className="py-4 space-y-3 flex-1 flex flex-col justify-center animate-in fade-in duration-200">
          {(() => {
            const catName = selectingVariantItem.category?.toUpperCase() || "";
            const subCatName = selectingVariantItem.subCategory?.toUpperCase() || "";
            const prodName = selectingVariantItem.name?.toUpperCase() || "";
            
            const isCoffeeMode = 
              catName === "BEVANDE" && 
              (
                subCatName.includes("CAFFE") || 
                subCatName.includes("CAFFETTERIA") || 
                prodName.includes("CAFFE") || 
                prodName.includes("ESPRESSO")
              );

            const isSpiritMode = 
              catName === "BEVANDE" && 
              !isCoffeeMode &&
              (
                subCatName.includes("AMARO") || 
                subCatName.includes("DIGESTIV") || 
                subCatName.includes("LIQUOR") || 
                subCatName.includes("BRANDY") || 
                subCatName.includes("COGNAC") || 
                subCatName.includes("WHISKY") || 
                subCatName.includes("VODKA") || 
                subCatName.includes("RUM") || 
                subCatName.includes("DISTILLAT") || 
                subCatName.includes("GRAPPA") || 
                subCatName.includes("APERITIV") ||
                subCatName.includes("VERMOUTH") ||
                prodName.includes("AMARO") || 
                prodName.includes("WHISKY") || 
                prodName.includes("RUM") || 
                prodName.includes("GRAPPA")
              );

            let serviceOptions = [];
            let labelText = "";

            if (isCoffeeMode) {
              labelText = "Opzione per il caffè:";
              serviceOptions = [
                { label: "Caffè Normale", name: "Normale" },
                { label: "Caffè Ristretto", name: "Ristretto" },
                { label: "Macchiato Caldo", name: "Macchiato caldo" },
                { label: "Macchiato Freddo", name: "Macchiato freddo" },
                { label: "Schiumato", name: "Schiumato" }
              ];
            } else if (isSpiritMode) {
              labelText = "Opzione di servizio distillati / amari:";
              serviceOptions = [
                { label: "Liscio", name: "Liscio" },
                { label: "Con Ghiaccio", name: "Con ghiaccio" }
              ];
            } else {
              labelText = "Opzione di servizio bibite / analcolici:";
              serviceOptions = [
                { label: "Liscio", name: "Liscio" },
                { label: "Con Ghiaccio", name: "Con ghiaccio" },
                { label: "Con Limone", name: "Con limone" },
                { label: "Ghiaccio & Limone", name: "Ghiaccio & limone" }
              ];
            }

            return (
              <>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-2">
                  {labelText}
                </p>
                <div className="flex flex-col gap-2">
                  {serviceOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => {
                        const addonServizio = { name: opt.name, price: 0 };
                        
                        // Verifichiamo se si tratta della variante fittizia della bibita singola
                        const isDummy = tempSelectedVariant?.isDummy;

                        const finalItem = {
                           ...selectingVariantItem,
                           price: isDummy ? Number(selectingVariantItem.price) : Number(tempSelectedVariant.price),
                           selectedAddons: [addonServizio]
                        };

                        // Se è una variante fittizia, passiamo "null" come variante a addToCart,
                        // così nel carrello e sullo scontrino non comparirà alcuna dicitura "Standard"
                        addToCart(finalItem, isDummy ? null : tempSelectedVariant);
                        
                        setSelectingVariantItem(null);
                        setTempSelectedVariant(null);
                        setVariantSearchQuery("");
                        }}
                      className="flex items-center p-3.5 rounded-xl border-2 border-gray-200 hover:border-[#45856c] hover:bg-green-50/80 transition-all gap-4 active:scale-95 shadow-sm text-left animate-in fade-in"
                    >
                      <span className="font-bold text-sm text-gray-800">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            );
          })()}

          {/* Pulsante per tornare indietro alla lista delle varianti */}
          <button
            onClick={() => setTempSelectedVariant(null)}
            className="mt-3 text-xs font-semibold text-gray-500 hover:text-gray-800 text-center underline py-1 animate-in fade-in"
          >
            ← Torna alla lista dei prodotti
          </button>
        </div>
      ) : (
        /* ========================================== */
        /* FASE 1: LISTA DELLE OPZIONI ORIGINALI (CON RICERCA) */
        /* ========================================== */
        <div className={`flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar ${selectingVariantItem.variants.length <= 3 ? 'mt-4' : ''}`}>
          {selectingVariantItem.variants
            .filter((v: any) => v.name.toLowerCase().includes(variantSearchQuery.toLowerCase()))
            .map((variant: any) => (
              <div 
                key={variant.name}
                onClick={() => {
                  const catName = selectingVariantItem.category?.toUpperCase() || "";
                  const subCatName = selectingVariantItem.subCategory?.toUpperCase() || "";
                  const prodName = selectingVariantItem.name?.toUpperCase() || "";
                  const variantName = variant.name?.toUpperCase() || "";
                  
                  // Verifica se l'articolo è un caffè/caffetteria
                  const isCoffee = 
                    catName === "BEVANDE" && 
                    (
                      subCatName.includes("CAFFE") || 
                      subCatName.includes("CAFFETTERIA") || 
                      prodName.includes("CAFFE") || 
                      prodName.includes("ESPRESSO") || 
                      prodName.includes("GINSENG") || 
                      prodName.includes("ORZO")
                    );

                  // Escludiamo il macchiato per il Caffè Corretto
                  const isCorretto = prodName.includes("CORRETTO") || variantName.includes("CORRETTO");

                  // Verifica se l'articolo è un liquore/amaro/spirits o bibita
                  const isDrinkWithService = 
                    catName === "BEVANDE" && 
                    !isCoffee && 
                    (
                      subCatName.includes("AMARO") || 
                      subCatName.includes("DIGESTIV") || 
                      subCatName.includes("LIQUOR") || 
                      subCatName.includes("BRANDY") || 
                      subCatName.includes("COGNAC") || 
                      subCatName.includes("WHISKY") || 
                      subCatName.includes("VODKA") || 
                      subCatName.includes("RUM") || 
                      subCatName.includes("DISTILLAT") || 
                      subCatName.includes("GRAPPA") || 
                      subCatName.includes("BIBIT") || 
                      subCatName.includes("LATTIN") ||
                      prodName.includes("AMARO") || 
                      prodName.includes("COCA") || 
                      prodName.includes("FANTA") || 
                      prodName.includes("SPRITE") ||
                      prodName.includes("COLA")
                    );

                  if (isCoffee && !isCorretto) {
                    setTempSelectedVariant(variant);
                  } else if (isDrinkWithService) {
                    setTempSelectedVariant(variant);
                  } else {
                    const finalItem = {
                      ...selectingVariantItem,
                      price: Number(variant.price)
                    };
                    addToCart(finalItem, variant); 
                    setSelectingVariantItem(null);
                    setVariantSearchQuery("");
                  }
                }}
                className="flex justify-between items-center p-4 rounded-xl border border-wood-100 hover:bg-wood-50 hover:border-accent-300 cursor-pointer transition-all duration-200"
              >
                <span className="font-bold text-wood-800 text-sm">{variant.name}</span>
                <span className="font-western text-base text-[#45856c]">€{Number(variant.price).toFixed(2)}</span>
              </div>
            ))}
          {selectingVariantItem.variants.filter((v: any) => v.name.toLowerCase().includes(variantSearchQuery.toLowerCase())).length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">Nessuna opzione disponibile.</p>
          )}
        </div>
      )}

    </div>
  </div>
)}

      {/* ================= MODALE DI ACCESSO / REGISTRAZIONE UTENTE ================= */}
      {isAuthModalOpen && (
         <div className="fixed inset-0 bg-black/60 z-[70] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full md:max-w-md max-h-[90vh] md:max-h-[85vh] md:rounded-3xl rounded-t-3xl p-6 flex flex-col shadow-2xl overflow-y-auto custom-scrollbar">
               
               <div className="flex justify-between items-center mb-6">
                  <h4 className="font-western text-2xl text-wood-900 uppercase">
                     {authMode === 'LOGIN' ? 'Accedi al tuo Account' : 'Crea un Account'}
                  </h4>
                  <button type="button" onClick={() => setIsAuthModalOpen(false)} className="p-2 bg-wood-50 rounded-full"><X/></button>
               </div>

               {authError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2">
                     <AlertCircle size={16} className="text-red-600" />
                     <span>{authError}</span>
                  </div>
               )}

               <form onSubmit={authMode === 'LOGIN' ? handleLoginUser : handleRegister} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Email *</label>
                     <input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-2.5 text-sm" placeholder="esempio@mail.com" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Password *</label>
                     <input required type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Scegli una password" />
                  </div>

                  {authMode === 'REGISTER' && (
                     <div className="space-y-4 pt-4 border-t border-wood-100 animate-in fade-in duration-300">
                        <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block">Dati di consegna preferiti (Salvati per i prossimi ordini):</span>
                        <div>
                           <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Nome e Cognome *</label>
                           <input required type="text" value={authForm.fullName} onChange={e => setAuthForm({...authForm, fullName: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Rossi Mario" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Telefono *</label>
                              <input required type="tel" value={authForm.phone} onChange={e => setAuthForm({...authForm, phone: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-2.5 text-sm" placeholder="3331234567" />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Comune *</label>
                              <div className="relative">
                                 <select value={authForm.city} onChange={e => setAuthForm({...authForm, city: e.target.value})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-2.5 text-sm pr-8">
                                    {DELIVERY_ZONES.map((cityName) => (
                                       <option key={cityName} value={cityName}>{cityName}</option>
                                    ))}
                                 </select>
                                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={14} />
                              </div>
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Indirizzo di consegna *</label>
                           <input required type="text" value={authForm.address} onChange={e => setAuthForm({...authForm, address: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Via Rossi 45" />
                        </div>
                     </div>
                  )}

                  <button type="submit" disabled={isProcessingAuth} className="w-full bg-[#45856c] text-white py-3 rounded-xl font-bold shadow-md hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                     {isProcessingAuth ? <Loader2 className="animate-spin" size={18} /> : authMode === 'LOGIN' ? 'Accedi' : 'Registrati ed Entra'}
                  </button>
               </form>

               <div className="mt-6 pt-4 border-t border-wood-100 text-center text-sm">
                  {authMode === 'LOGIN' ? (
                     <p className="text-wood-500">Non hai ancora un account? <button type="button" onClick={() => { setAuthMode('REGISTER'); setAuthError(null); }} className="text-[#45856c] font-bold underline">Registrati ora</button></p>
                  ) : (
                     <p className="text-wood-500">Hai già un account? <button type="button" onClick={() => { setAuthMode('LOGIN'); setAuthError(null); }} className="text-[#45856c] font-bold underline">Accedi</button></p>
                  )}
               </div>
            </div>
         </div>
      )}


      {/* ================= MODALE PROFILO UTENTE CON STORICO ORDINI E TRACKING ================= */}
      {isProfileOpen && user && (
         <div className="fixed inset-0 bg-black/60 z-[70] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full md:max-w-md h-[90vh] md:rounded-3xl rounded-t-3xl p-6 flex flex-col shadow-2xl overflow-hidden">
               
               <div className="flex justify-between items-center mb-6 border-b border-wood-100 pb-4 shrink-0">
                  <div>
                     <h4 className="font-western text-2xl text-wood-900 leading-none">IL MIO PROFILO</h4>
                     <span className="text-xs text-wood-400 font-semibold">{user.email}</span>
                  </div>
                  <button type="button" onClick={() => setIsProfileOpen(false)} className="p-2 bg-wood-50 rounded-full"><X/></button>
               </div>

               {authError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2 shrink-0">
                     <AlertCircle size={16} className="text-red-600" />
                     <span>{authError}</span>
                  </div>
               )}

               {/* CONTENITORE SCORREVOLE */}
               <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar pb-6">
                  
                  {/* MODULO DATI DI SPEDIZIONE */}
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                     <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block border-b border-wood-100 pb-1">I tuoi dati di spedizione preferiti:</span>
                     <div>
                        <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Nome e Cognome *</label>
                        <input required type="text" value={authForm.fullName} onChange={e => setAuthForm({...authForm, fullName: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-2 text-sm font-bold text-wood-800" />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div>
                           <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Telefono *</label>
                           <input required type="tel" value={authForm.phone} onChange={e => setAuthForm({...authForm, phone: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-2 text-sm font-bold text-wood-800" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Comune *</label>
                           <div className="relative">
                              <select value={authForm.city} onChange={e => setAuthForm({...authForm, city: e.target.value})} className="w-full appearance-none bg-wood-50 border border-wood-200 rounded-xl px-4 py-2 text-sm font-bold text-wood-800 pr-8">
                                 {DELIVERY_ZONES.map((cityName) => (
                                    <option key={cityName} value={cityName}>{cityName}</option>
                                 ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-wood-400 pointer-events-none" size={14} />
                           </div>
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-wood-500 uppercase mb-1">Indirizzo di consegna *</label>
                        <input required type="text" value={authForm.address} onChange={e => setAuthForm({...authForm, address: e.target.value})} className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-2 text-sm font-bold text-wood-800" />
                     </div>

                     <div className="flex gap-2 justify-end pt-2">
                        <button type="submit" disabled={isProcessingAuth} className="bg-[#45856c] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-opacity-90 flex items-center gap-1.5 transition-all">
                           {isProcessingAuth ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Salva Dati</>}
                        </button>
                     </div>
                  </form>

                  {/* SEZIONE 1: I MIEI ORDINI */}
                  <div className="space-y-3 pt-4 border-t border-wood-100">
                     <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block border-b border-wood-50 pb-1">I Miei Ordini:</span>
                     {userOrders.length === 0 ? (
                        <p className="text-xs text-wood-400 italic text-center py-2">Non hai ancora effettuato ordini online.</p>
                     ) : (
                        <div className="space-y-2">
                           {userOrders.map((order) => {
                              const isActive = order.status !== 'completed' && order.status !== 'cancelled';
                              return (
                                 <div key={order.id} className="p-3 bg-wood-50 rounded-2xl border border-wood-100 flex justify-between items-center gap-2">
                                    <div className="min-w-0">
                                       <span className="text-[10px] text-wood-400 font-bold block">
                                          {new Date(order.created_at).toLocaleDateString('it-IT')}
                                       </span>
                                       <span className="font-bold text-wood-800 text-xs block truncate mt-0.5">
                                          €{Number(order.total_amount).toFixed(2)} ({order.order_type === 'delivery' ? 'Consegna' : 'Ritiro'})
                                       </span>
                                    </div>
                                    {isActive ? (
                                       <button 
                                          type="button" 
                                          onClick={() => {
                                             setActiveOrderId(order.id);
                                             localStorage.setItem('activeOrderId', order.id);
                                             setCurrentOrder(order);
                                             setIsProfileOpen(false);
                                             setView('TRACKING');
                                          }}
                                          className="bg-[#45856c] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow-md hover:bg-opacity-90 flex items-center gap-1 animate-pulse shrink-0"
                                       >
                                          <Clock size={12} /> Segui
                                       </button>
                                    ) : (
                                       <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                          {order.status === 'completed' ? 'Finito' : 'Annullato'}
                                       </span>
                                    )}
                                 </div>
                              );
                           })}
                        </div>
                     )}
                  </div>

                  {/* SEZIONE 2: LE MIE PRENOTAZIONI TAVOLI (FOTO 1) */}
                  <div className="space-y-3 pt-4 border-t border-wood-100">
                     <span className="text-[10px] font-bold text-wood-400 uppercase tracking-widest block border-b border-wood-50 pb-1">Le Mie Prenotazioni:</span>
                     {userReservations.length === 0 ? (
                        <p className="text-xs text-wood-400 italic text-center py-2">Nessuna prenotazione passata registrata.</p>
                     ) : (
                        <div className="space-y-2">
                           {userReservations.map((res) => {
                              const isPending = res.status === 'pending';
                              const isConfirmed = res.status === 'confirmed';

                              return (
                                 <div key={res.id} className="p-3 bg-wood-50 rounded-2xl border border-wood-100 flex justify-between items-center gap-2">
                                    <div className="min-w-0">
                                       <span className="text-[10px] text-wood-400 font-bold block">
                                          {new Date(res.reservation_date).toLocaleDateString('it-IT')} - {res.reservation_time}
                                       </span>
                                       <span className="font-bold text-wood-800 text-xs block truncate mt-0.5">
                                          Tavolo per {res.num_people} persone
                                       </span>
                                    </div>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                                       isConfirmed ? 'bg-green-100 text-green-700' : 
                                       isPending ? 'bg-orange-100 text-orange-700 animate-pulse' : 
                                       'bg-red-100 text-red-700'
                                    }`}>
                                       {isConfirmed ? 'Confermata' : isPending ? 'In Attesa' : 'Annullata'}
                                    </span>
                                 </div>
                              );
                           })}
                        </div>
                     )}
                  </div>
               </div>

               {/* SEZIONE LOGOUT IN FONDO FISSA */}
               <div className="pt-4 border-t border-wood-100 shrink-0">
                  <button type="button" onClick={handleLogoutUser} className="w-full py-3 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 flex items-center justify-center gap-2">
                     <LogOut size={16} /> Disconnetti Account
                  </button>
               </div>
            </div>
         </div>
      )}

    </>
  );
}