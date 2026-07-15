import { MenuItem, ProductCategory, LanguageCode, AllergenType } from './types';

export const DATA_VERSION = '3.0'; // Versione Delivery

export const HAMBURGER_SUBCATEGORIES = [
  "Old West Special",
  "Vegetariano/Vegano",
  'Hamburger "Fai da te"',
  "Hamburger della Casa"
];

export const DRINK_SUBCATEGORIES = [
  "Acqua e Bibite",
  "Birre alla Spina",
  "Birre in Bottiglia",
  "Vini",
  "Caffetteria",
  "Amari e Digestivi"
];

export const ADDON_SUBCATEGORIES = [
  "Pizza",
  "Hamburger",
  "Generale"
];

export const HAMBURGER_SUBCATEGORIES_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Old West Special": { it: "Old West Special", en: "Old West Special", fr: "Spécial Old West", de: "Old West Spezial" },
  "Vegetariano/Vegano": { it: "Vegetariano/Vegano", en: "Vegetarian/Vegan", fr: "Végétarien/Végan", de: "Vegetarisch/Vegan" },
  'Hamburger "Fai da te"': { it: 'Hamburger "Fai da te"', en: 'Build Your Own Burger', fr: 'Créez Votre Burger', de: 'DIY Burger' },
  "Hamburger della Casa": { it: "Hamburger della Casa", en: "House Burgers", fr: "Burgers de la Maison", de: "Haus-Burger" }
};

export const SUBCATEGORY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Acqua e Bibite": { it: "Acqua e Bibite", en: "Water & Soft Drinks", fr: "Eau et Boissons", de: "Wasser und Erfrischungsgetränke" },
  "Birre alla Spina": { it: "Birre alla Spina", en: "Draft Beers", fr: "Bières Pression", de: "Bier vom Fass" },
  "Birre in Bottiglia": { it: "Birre in Bottiglia", en: "Bottled Beers", fr: "Bières en Bouteille", de: "Flaschenbiere" },
  "Vini": { it: "Vini", en: "Wines", fr: "Vins", de: "Weine" },
  "Caffetteria": { it: "Caffetteria", en: "Coffee", fr: "Café", de: "Kaffee" },
  "Amari e Digestivi": { it: "Amari e Digestivi", en: "Bitters & Digestifs", fr: "Amers et Digestifs", de: "Bitter und Digestifs" },
  "Old West Special": { it: "Old West Special", en: "Old West Special", fr: "Spécial Old West", de: "Old West Spezial" },
  "Vegetariano/Vegano": { it: "Vegetariano/Vegano", en: "Vegetarian/Vegan", fr: "Végétarien/Végan", de: "Vegetarisch/Vegan" },
  'Hamburger "Fai da te"': { it: 'Hamburger "Fai da te"', en: 'Build Your Own Burger', fr: 'Créez Votre Burger', de: 'DIY Burger' },
  "Hamburger della Casa": { it: "Hamburger della Casa", en: "House Burgers", fr: "Burgers de la Maison", de: "Haus-Burger" }
};

export const ALLERGENS_CONFIG: Record<AllergenType, { label: string, iconName: string }> = {
  'Glutine': { label: 'Cereali contenenti glutine (Grano)', iconName: 'Wheat' },
  'Crostacei': { label: 'Crostacei', iconName: 'Shell' },
  'Uova': { label: 'Uova e prodotti a base di uova', iconName: 'Egg' },
  'Pesce': { label: 'Pesce', iconName: 'Fish' },
  'Arachidi': { label: 'Arachidi', iconName: 'Nut' },
  'Soia': { label: 'Soia e prodotti a base di soia', iconName: 'Bean' },
  'Latte': { label: 'Latte e prodotti a base di latte', iconName: 'Milk' },
  'Frutta a guscio': { label: 'Frutta a guscio', iconName: 'Nut' },
  'Sedano': { label: 'Sedano', iconName: 'Leaf' },
  'Senape': { label: 'Senape', iconName: 'AlertCircle' },
  'Sesamo': { label: 'Semi di sesamo', iconName: 'CircleDot' },
  'Solfiti': { label: 'Solfiti', iconName: 'Wine' },
  'Lupini': { label: 'Lupini', iconName: 'Bean' },
  'Molluschi': { label: 'Molluschi', iconName: 'Shell' },
};

// =========================================================================
// 1. HAMBURGER DELLA CASA (Tutti i passaggi a monoselezione)
// =========================================================================
export const HOUSE_BURGER_OPTIONS = {
  basePrice: 0,
  steps: [
    {
      id: "pane",
      isMulti: false,
      isOptional: false,
      title: "Il Pane",
      description: "Scegli la base perfetta",
      translations: {
        en: { title: "The Bread", description: "Choose the perfect base" },
        fr: { title: "Le Pain", description: "Choisissez la base parfaite" },
        de: { title: "Das Brot", description: "Wählen Sie die perfekte Basis" }
      },
      options: [
        { name: "PANINO preparato al momento", price: 0, translations: { en: { name: "Freshly prepared BUN" }, fr: { name: "PAIN préparé sur place" }, de: { name: "Frisch zubereitetes BRÖTCHEN" } } },
        { name: "FOCACCIA CALDA per hamburger servito al piatto", price: 0, translations: { en: { name: "WARM FOCACCIA for plated burger" }, fr: { name: "FOCACCIA CHAUDE pour burger sur assiette" }, de: { name: "WARME FOCACCIA für Burger auf dem Teller" } } }
      ]
    },
    {
      id: "carne",
      isMulti: false,
      isOptional: false,
      title: "La Carne",
      description: "Il cuore del tuo burger",
      translations: { en: { title: "The Meat", description: "The heart of your burger" }, fr: { title: "La Viande", description: "Le cœur de votre burger" }, de: { title: "Das Fleisch", description: "Das Herz Ihres Burgers" } },
      options: [
        { name: "Hamburger di fassona 270g", price: 9.00, translations: { en: { name: "Fassona Beef Burger 270g" }, fr: { name: "Burger de Bœuf Fassona 270g" }, de: { name: "Fassona Rindfleisch Burger 270g" } } },
        { name: "Hamburger di bufalo 220g", price: 8.00, translations: { en: { name: "Buffalo Burger 220g" }, fr: { name: "Burger de Buffle 220g" }, de: { name: "Büffel Burger 220g" } } },
        { name: "Hamburger di chianina 200g", price: 8.00, translations: { en: { name: "Chianina Beef Burger 200g" }, fr: { name: "Burger de Bœuf Chianina 200g" }, de: { name: "Chianina Rindfleisch Burger 200g" } } },
        { name: "Hamburger di angus 200g", price: 8.00, translations: { en: { name: "Angus Burger 200g" }, fr: { name: "Burger Angus 200g" }, de: { name: "Angus Burger 200g" } } },
        { name: "Hamburger di bovino 180g", price: 6.00, translations: { en: { name: "Beef Burger 180g" }, fr: { name: "Burger de Bœuf 180g" }, de: { name: "Rindfleisch Burger 180g" } } },
        { name: "Hamburger di bovino 100g", price: 5.00, translations: { en: { name: "Beef Burger 100g" }, fr: { name: "Burger de Bœuf 100g" }, de: { name: "Rindfleisch Burger 100g" } } },
        { name: "Hamburger di pollo 100g", price: 5.00, translations: { en: { name: "Chicken Burger 100g" }, fr: { name: "Burger de Poulet 100g" }, de: { name: "Hähnchen Burger 100g" } } },
        { name: "Hamburger di salamella 100g", price: 4.00, translations: { en: { name: "Sausage Burger 100g" }, fr: { name: "Burger de Saucisse 100g" }, de: { name: "Wurst Burger 100g" } } }
      ]
    },
    {
      id: "opzione",
      isMulti: false,
      isOptional: false,
      title: "L'Opzione",
      description: "Scegli la ricetta della casa",
      translations: { en: { title: "The Option", description: "Choose the house recipe" }, fr: { title: "L'Option", description: "Choisissez la recette de la maison" }, de: { title: "Die Option", description: "Wählen Sie das Hausrezept" } },
      options: [
        { name: "OPZIONE N°1: Cipolle rosse, Grana, Pomodorini, Salsa boscaiola", price: 4.00, translations: { en: { name: "OPTION #1: Red onions, Parmesan, Cherry tomatoes, Boscaiola sauce" }, fr: { name: "OPTION N°1: Oignons rouges, Grana, Tomates cerises, Sauce boscaiola" }, de: { name: "OPTION NR.1: Rote Zwiebeln, Grana, Kirschtomaten, Boscaiola-Soße" } } },
        { name: "OPZIONE N°2: Gorgonzola, Bacon, Lattuga, Pomodorini, Melanzane", price: 5.00, translations: { en: { name: "OPTION #2: Gorgonzola, Bacon, Lettuce, Cherry tomatoes, Eggplant" }, fr: { name: "OPTION N°2: Gorgonzola, Bacon, Laitue, Tomates cerises, Aubergines" }, de: { name: "OPTION NR.2: Gorgonzola, Speck, Salat, Kirschtomaten, Auberginen" } } },
        { name: "OPZIONE N°3: Cheddar, Bacon, Pomodorini secchi, Salsa burger, Cipolle", price: 5.00, translations: { en: { name: "OPTION #3: Cheddar, Bacon, Dried tomatoes, Burger sauce, Onions" }, fr: { name: "OPTION N°3: Cheddar, Bacon, Tomates séchées, Sauce burger, Oignons" }, de: { name: "OPTION NR.3: Cheddar, Speck, Getrocknete Tomaten, Burger-Soße, Zwiebeln" } } },
        { name: "OPZIONE N°4: Ketchup, Maionese, Pomodorini, Lattuga", price: 4.00, translations: { en: { name: "OPTION #4: Ketchup, Mayonnaise, Cherry tomatoes, Lettuce" }, fr: { name: "OPTION N°4: Ketchup, Mayonnaise, Tomates cerises, Laitue" }, de: { name: "OPTION NR.4: Ketchup, Mayonnaise, Kirschtomaten, Salat" } } },
        { name: "OPZIONE N°5: Ketchup, Maionese, Pomodorini, Lattuga, Bacon, Cipolle, Edamer", price: 6.50, translations: { en: { name: "OPTION #5: Ketchup, Mayonnaise, Tomatoes, Lettuce, Bacon, Onions, Edam" }, fr: { name: "OPTION N°5: Ketchup, Mayonnaise, Tomates, Laitue, Bacon, Oignons, Edam" }, de: { name: "OPTION NR.5: Ketchup, Mayonnaise, Tomaten, Salat, Speck, Zwiebeln, Edamer" } } },
        { name: "OPZIONE N°6: Ketchup, Maionese, Cheddar, Pomodorini, Lattuga, Zucchine, Salsa burger", price: 5.50, translations: { en: { name: "OPTION #6: Ketchup, Mayonnaise, Cheddar, Tomatoes, Lettuce, Zucchini, Burger sauce" }, fr: { name: "OPTION N°6: Ketchup, Mayonnaise, Cheddar, Tomates, Laitue, Courgettes, Sauce burger" }, de: { name: "OPTION NR.6: Ketchup, Mayonnaise, Cheddar, Tomaten, Salat, Zucchini, Burger-Soße" } } }
      ]
    },
    {
      id: "contorno",
      isMulti: false,
      isOptional: true,
      title: "Il Contorno (facoltativo)",
      description: "Per accompagnare",
      translations: { en: { title: "The Side Dish", description: "To accompany" }, fr: { title: "L'Accompagnement", description: "Pour accompagner" }, de: { title: "Die Beilage", description: "Zur Begleitung" } },
      options: [
        { name: "Patatine fritte", price: 5.00, translations: { en: { name: "French Fries" }, fr: { name: "Frites" }, de: { name: "Pommes Frites" } } },
        { name: "Pomodorini", price: 5.00, translations: { en: { name: "Cherry Tomatoes" }, fr: { name: "Tomates Cerises" }, de: { name: "Kirschtomaten" } } },
        { name: "Fagioli borlotti con cipolle crude", price: 5.00, translations: { en: { name: "Borlotti beans with raw onions" }, fr: { name: "Haricots Borlotti aux oignons crus" }, de: { name: "Borlotti-Bohnen mit rohen Zwiebeln" } } },
        { name: "Insalata di lattuga e radicchio", price: 5.00, translations: { en: { name: "Lettuce and Radicchio Salad" }, fr: { name: "Salade de Laitue et Radicchio" }, de: { name: "Salat aus Kopfsalat und Radicchio" } } },
        { name: "Mais e carote", price: 5.00, translations: { en: { name: "Corn and Carrots" }, fr: { name: "Maïs et Carottes" }, de: { name: "Mais und Karotten" } } },
        { name: "Grill di verdure", price: 5.00, translations: { en: { name: "Grilled Vegetables" }, fr: { name: "Légumes grillés" }, de: { name: "Gegrilltes Gemüse" } } }
      ]
    }
  ]
};

// =========================================================================
// 2. IL VERO HAMBURGER FAI DA TE (Farcitura multipla a piacimento)
// =========================================================================
export const TRUE_DIY_OPTIONS = {
  basePrice: 0,
  steps: [
    {
      id: "pane",
      isMulti: false,
      isOptional: false,
      title: "Il Pane",
      description: "Scegli la base perfetta",
      translations: {
        en: { title: "The Bread", description: "Choose the perfect base" },
        fr: { title: "Le Pain", description: "Choisissez la base parfaite" },
        de: { title: "Das Brot", description: "Wählen Sie die perfekte Basis" }
      },
      options: [
        { name: "PANINO preparato al momento", price: 0, translations: { en: { name: "Freshly prepared BUN" }, fr: { name: "PAIN préparé sur place" }, de: { name: "Frisch zubereitetes BRÖTCHEN" } } },
        { name: "FOCACCIA CALDA per hamburger servito al piatto", price: 0, translations: { en: { name: "WARM FOCACCIA for plated burger" }, fr: { name: "FOCACCIA CHAUDE pour burger sur assiette" }, de: { name: "WARME FOCACCIA für Burger auf dem Teller" } } }
      ]
    },
    {
      id: "carne",
      isMulti: false,
      isOptional: false,
      title: "La Carne",
      description: "Il cuore del tuo burger",
      translations: { en: { title: "The Meat", description: "The heart of your burger" }, fr: { title: "La Viande", description: "Le cœur de votre burger" }, de: { title: "Das Fleisch", description: "Das Herz Ihres Burgers" } },
      options: [
        { name: "Hamburger di fassona 270g", price: 9.00, translations: { en: { name: "Fassona Beef Burger 270g" }, fr: { name: "Burger de Bœuf Fassona 270g" }, de: { name: "Fassona Rindfleisch Burger 270g" } } },
        { name: "Hamburger di bufalo 220g", price: 8.00, translations: { en: { name: "Buffalo Burger 220g" }, fr: { name: "Burger de Buffle 220g" }, de: { name: "Büffel Burger 220g" } } },
        { name: "Hamburger di chianina 200g", price: 8.00, translations: { en: { name: "Chianina Beef Burger 200g" }, fr: { name: "Burger de Bœuf Chianina 200g" }, de: { name: "Chianina Rindfleisch Burger 200g" } } },
        { name: "Hamburger di angus 200g", price: 8.00, translations: { en: { name: "Angus Burger 200g" }, fr: { name: "Burger Angus 200g" }, de: { name: "Angus Burger 200g" } } },
        { name: "Hamburger di bovino 180g", price: 6.00, translations: { en: { name: "Beef Burger 180g" }, fr: { name: "Burger de Bœuf 180g" }, de: { name: "Rindfleisch Burger 180g" } } },
        { name: "Hamburger di bovino 100g", price: 5.00, translations: { en: { name: "Beef Burger 100g" }, fr: { name: "Burger de Bœuf 100g" }, de: { name: "Rindfleisch Burger 100g" } } },
        { name: "Hamburger di pollo 100g", price: 5.00, translations: { en: { name: "Chicken Burger 100g" }, fr: { name: "Burger de Poulet 100g" }, de: { name: "Hähnchen Burger 100g" } } },
        { name: "Hamburger di salamella 100g", price: 4.00, translations: { en: { name: "Sausage Burger 100g" }, fr: { name: "Burger de Saucisse 100g" }, de: { name: "Wurst Burger 100g" } } }
      ]
    },
    {
      id: "condimenti",
      isMulti: true, // <--- ATTIVA LA MULTISELEZIONE
      isOptional: true, // <--- Facoltativo: l'utente può decidere di non mettere condimenti extra
      title: "La Farcitura",
      description: "Condisci a tuo piacimento (scelta multipla)",
      translations: { 
        en: { title: "Toppings", description: "Season to your liking (multiple choice)" }, 
        fr: { title: "Garnitures", description: "Assaisonnez à votre goût (choix multiple)" }, 
        de: { title: "Zutaten", description: "Nach Belieben würzen (Mehrfachauswahl)" } 
      },
      options: []
    },
    {
      id: "contorno",
      isMulti: false,
      isOptional: true,
      title: "Il Contorno (facoltativo)",
      description: "Per accompagnare",
      translations: { en: { title: "The Side Dish", description: "To accompany" }, fr: { title: "L'Accompagnement", description: "Pour accompagner" }, de: { title: "Die Beilage", description: "Zur Begleitung" } },
      options: [
        { name: "Patatine fritte", price: 5.00, translations: { en: { name: "French Fries" }, fr: { name: "Frites" }, de: { name: "Pommes Frites" } } },
        { name: "Pomodorini", price: 5.00, translations: { en: { name: "Cherry Tomatoes" }, fr: { name: "Tomates Cerises" }, de: { name: "Kirschtomaten" } } },
        { name: "Fagioli borlotti con cipolle crude", price: 5.00, translations: { en: { name: "Borlotti beans with raw onions" }, fr: { name: "Haricots Borlotti aux oignons crus" }, de: { name: "Borlotti-Bohnen mit rohen Zwiebeln" } } },
        { name: "Insalata di lattuga e radicchio", price: 5.00, translations: { en: { name: "Lettuce and Radicchio Salad" }, fr: { name: "Salade de Laitue et Radicchio" }, de: { name: "Salat aus Kopfsalat und Radicchio" } } },
        { name: "Mais e carote", price: 5.00, translations: { en: { name: "Corn and Carrots" }, fr: { name: "Maïs et Carottes" }, de: { name: "Mais und Karotten" } } },
        { name: "Grill di verdure", price: 5.00, translations: { en: { name: "Grilled Vegetables" }, fr: { name: "Légumes grillés" }, de: { name: "Gegrilltes Gemüse" } } }
      ]
    }
  ]
};

// --- NUOVO: ZONE DI CONSEGNA ---
export const DELIVERY_ZONES: string[] = [
  "Cameri",
  "Galliate",
  "Bellinzago Novarese",
  "Oleggio",
  "Caltignaga",
  "Veveri",
  "Cavagliano"
];

export const UI_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'menu_title': { it: 'Menu Digitale', en: 'Digital Menu', fr: 'Menu Numérique', de: 'Digitales Menü' },
  'back_to_menu': { it: 'Torna al Menu', en: 'Back to Menu', fr: 'Retour au Menu', de: 'Zurück zum Menü' },
  'admin_area': { it: 'Area Staff', en: 'Staff Area', fr: 'Espace Staff', de: 'Mitarbeiterbereich' },
  'login_prompt': { it: 'Accedi per gestire il menu digitale', en: 'Login to manage the digital menu', fr: 'Connectez-vous pour gérer le menu', de: 'Anmelden zur Menüverwaltung' },
  'login_btn': { it: 'Accedi', en: 'Login', fr: 'Connexion', de: 'Anmelden' },
  'back': { it: 'Indietro', en: 'Back', fr: 'Retour', de: 'Zurück' },
  'hero_title': { it: 'Il Gusto Autentico', en: 'The Authentic Taste', fr: 'Le Goût Authentique', de: 'Der Authentische Geschmack' },
  'no_products_section': { it: 'Nessun prodotto disponibile in questa sezione.', en: 'No products available in this section.', fr: 'Aucun produit disponible dans cette section.', de: 'Keine Produkte in diesem Bereich verfügbar.' },
  'select_category': { it: 'Seleziona una categoria', en: 'Select a category', fr: 'Sélectionnez une catégorie', de: 'Wählen Sie eine Kategorie' },
  'create_your_taste': { it: 'Hamburger fai da te', en: 'DIY Burger', fr: 'Burger sur mesure', de: 'Burger selbst zusammenstellen' },
  'diy_title': { it: 'Crea il tuo Capolavoro', en: 'Create your Masterpiece', fr: "Créez votre Chef-d'œuvre", de: 'Kreieren Sie Ihr Meisterwerk' },
  'diy_subtitle': { it: "Segui i 4 passaggi per comporre l'hamburger perfetto.", en: 'Follow the 4 steps to build your perfect burger.', fr: 'Suivez les 4 étapes pour composer votre burger parfait.', de: 'Folgen Sie den 4 Schritten zum perfekten Burger.' },
  'total': { it: 'Totale', en: 'Total', fr: 'Total', de: 'Gesamt' },
  'filter_veg': { it: 'Vegetariano', en: 'Vegetarian', fr: 'Végétarien', de: 'Vegetarisch' },
  'filter_vegan': { it: 'Vegano', en: 'Vegan', fr: 'Végan', de: 'Vegan' },
  'filter_spicy': { it: 'Piccante', en: 'Spicy', fr: 'Épicé', de: 'Scharf' },
  'all': { it: 'Tutti', en: 'All', fr: 'Tout', de: 'Alle' },
  'my_order': { it: 'Il Mio Ordine', en: 'My Order', fr: 'Ma Commande', de: 'Meine Bestellung' },
  'review_order': { it: 'Rivedi Ordine', en: 'Review Order', fr: 'Voir la commande', de: 'Bestellung prüfen' },
  'show_staff': { it: 'Procedi all\'Ordine', en: 'Proceed to Checkout', fr: 'Passer la commande', de: 'Zur Kasse' },
  'add_ingredient': { it: 'Aggiungi Ingrediente', en: 'Add Ingredient', fr: 'Ajouter Ingrédient', de: 'Zutat hinzufügen' },
  'add_to_cart': { it: 'Aggiungi', en: 'Add', fr: 'Ajouter', de: 'Hinzufügen' },
  'add': { it: 'Avanti', en: 'Next', fr: 'Suivant', de: 'Weiter' },
  'cover_charge': { it: 'COPERTO', en: 'COVER CHARGE', fr: 'COUVERT', de: 'GEDECK' },
  'empty_cart': { it: 'Il carrello è vuoto', en: 'Cart is empty', fr: 'Le panier est vide', de: 'Der Warenkorb ist leer' },
  'search_addon': { it: 'Cerca ingrediente...', en: 'Search ingredient...', fr: 'Rechercher ingrédient...', de: 'Zutat suchen...' },
  'items': { it: 'articoli', en: 'items', fr: 'articles', de: 'artikel' },
  'frozen_explanation': { it: '* Prodotto congelato all\'origine', en: '* Frozen product', fr: '* Produit surgelé', de: '* Tiefkühlprodukt' },
  'rights_reserved': { it: 'All rights reserved', en: 'All rights reserved', fr: 'Tous droits réservés', de: 'Alle Rechte vorbehalten' },
  'suggestion_burger': { it: 'Ottimo con una Birra Media o Patatine!', en: 'Great with a Beer or Fries!', fr: 'Excellent avec une Bière ou des Frites!', de: 'Toll mit einem Bier oder Pommes!' },
  'suggestion_red_wine': {
  it: 'Accompagnalo con un buon Vino Rosso',
  en: 'Pair it with a good Red Wine',
  fr: 'Accompagnez-le d\'un bon Vin Rouge',
  de: 'Passt gut zu einem Rotwein'
},
'suggestion_white_wine': {
  it: 'Accompagnalo con un buon Vino Bianco',
  en: 'Pair it with a good White Wine',
  fr: 'Accompagnez-le d\'un bon Vin Blanc',
  de: 'Passt gut zu einem Weißwein'
},
  'suggestion_dessert': { it: 'Ideale con un Caffè o un Amaro', en: 'Perfect with Coffee or Digestif', fr: 'Idéal avec un Café ou un Digestif', de: 'Ideal mit Kaffee oder Digestif' },
  
  // Traduzioni corte per i bottoni Checkout
  'type_table': { it: 'Al Tavolo', en: 'Table', fr: 'À table', de: 'Am Tisch' },
  'type_takeaway': { it: 'Ritiro', en: 'Pickup', fr: 'Retrait', de: 'Abholung' },
  'type_delivery': { it: 'Consegna', en: 'Delivery', fr: 'Livraison', de: 'Lieferung' },

  // --- TRADUZIONI CHECKOUT ---
  'ref_name': { it: 'Nome di riferimento *', en: 'Reference Name *', fr: 'Nom de référence *', de: 'Referenzname *' },
  'table_num': { it: 'Numero del Tavolo *', en: 'Table Number *', fr: 'Numéro de la table *', de: 'Tischnummer *' },
  'subtotal_prod': { it: 'Subtotale Prodotti', en: 'Products Subtotal', fr: 'Sous-total des produits', de: 'Produkte-Zwischensumme' },
  'pay_at_table_title': { it: 'Paga al tavolo (Contanti / Bancomat)', en: 'Pay at table (Cash / Card)', fr: 'Payer à table (Espèces / Carte)', de: 'Am Tisch bezahlen (Bargeld / Karte)' },
  'pay_at_table_desc': { it: 'Pagherai comodamente in cassa o al tavolo a fine pasto', en: 'You can pay easily at the counter or at your table after dining', fr: 'Vous paierez facilement à la caisse ou à votre table après le repas', de: 'Sie zahlen bequem an der Kasse oder am Tisch nach dem Essen' },
  'stripe_pay_desc': { it: 'Pagamento online protetto e crittografato', en: 'Secure and encrypted online payment', fr: 'Paiement en ligne sécurisé et crypté', de: 'Sichere und verschlüsselte Online-Zahlung' },
  'stripe_pay_title': { it: 'Carta di Debito o Credito / Apple Pay / Google Pay', en: 'Debit or Credit Card / Apple Pay / Google Pay', fr: 'Carte de débit ou de crédit / Apple Pay / Google Pay', de: 'Debit- oder Kreditkarte / Apple Pay / Google Pay' },
  'table_details': { it: 'Dettagli Tavolo', en: 'Table Details', fr: 'Détails de la table', de: 'Tischdetails' },
  'checkout_title_booking': { it: 'Dettagli Prenotazione', en: 'Booking Details', fr: 'Détails de la réservation', de: 'Buchungsdetails' },
  'checkout_title': { it: 'Dettagli Ordine', en: 'Order Details', fr: 'Détails de la commande', de: 'Bestelldetails' },
  'order_type': { it: 'Come vuoi ricevere l\'ordine?', en: 'How do you want your order?', fr: 'Comment voulez-vous recevoir votre commande?', de: 'Wie möchten Sie Ihre Bestellung?' },
  'takeaway': { it: 'Ritiro al Locale', en: 'Takeaway', fr: 'À emporter', de: 'Abholung' },
  'delivery': { it: 'Consegna a Domicilio', en: 'Delivery', fr: 'Livraison à domicile', de: 'Lieferung' },
  'your_data': { it: 'I tuoi dati', en: 'Your Details', fr: 'Vos coordonnées', de: 'Ihre Daten' },
  'name': { it: 'Nome e Cognome', en: 'Full Name', fr: 'Nom et Prénom', de: 'Vor- und Nachname' },
  'phone': { it: 'Numero di Telefono', en: 'Phone Number', fr: 'Numéro de téléphone', de: 'Telefonnummer' },
  'address': { it: 'Indirizzo completo (Via, Civico)', en: 'Full Address', fr: 'Adresse complète', de: 'Vollständige Adresse' },
  'city': { it: 'Comune di consegna', en: 'Delivery City', fr: 'Ville de livraison', de: 'Lieferstadt' },
  'delivery_fee': { it: 'Costo consegna', en: 'Delivery Fee', fr: 'Frais de livraison', de: 'Liefergebühr' },
  'time': { it: 'Orario desiderato', en: 'Desired Time', fr: 'Heure souhaitée', de: 'Gewünschte Zeit' },
  'asap': { it: 'Il prima possibile', en: 'As soon as possible', fr: 'Dès que possible', de: 'So schnell wie möglich' },
  'payment': { it: 'Metodo di Pagamento', en: 'Payment Method', fr: 'Mode de paiement', de: 'Zahlungsmethode' },
  'cash': { it: 'Contanti (alla consegna/ritiro)', en: 'Cash', fr: 'Espèces', de: 'Bargeld' },
  'pos': { it: 'Bancomat / Carta (ritiro)', en: 'Card / POS', fr: 'Carte bancaire', de: 'Kartenzahlung' },
  'notes': { it: 'Note per la cucina o fattorino (es. Suonare Rossi, resto di 50€)', en: 'Notes (e.g. Ring Rossi, change for €50)', fr: 'Notes', de: 'Notizen' },
  'send_order': { it: 'Invia Ordine', en: 'Send Order', fr: 'Envoyer la commande', de: 'Bestellung senden' },
  'order_success_title': { it: 'Ordine Inviato!', en: 'Order Sent!', fr: 'Commande envoyée!', de: 'Bestellung gesendet!' },
  'order_success_msg': { it: 'Il tuo ordine è stato ricevuto con successo dalla cucina.', en: 'Your order has been successfully received.', fr: 'Votre commande a été reçue avec succès.', de: 'Ihre Bestellung wurde erfolgreich empfangen.' },
  'back_home': { it: 'Torna alla Home', en: 'Back to Home', fr: 'Retour à l\'accueil', de: 'Zurück zur Startseite' }
};

export const CATEGORY_TRANSLATIONS: Record<ProductCategory, Record<LanguageCode, string>> = {
  [ProductCategory.HAMBURGER]: { it: 'Hamburger', en: 'Burgers', fr: 'Burgers', de: 'Burger' },
  [ProductCategory.PIZZA]: { it: 'Pizza', en: 'Pizza', fr: 'Pizza', de: 'Pizza' },
  [ProductCategory.SECONDI]: { it: 'Secondi piatti', en: 'Main Courses', fr: 'Plats Principaux', de: 'Hauptgerichte' },
  [ProductCategory.PESCE]: { it: 'Piatti a base di pesce', en: 'Fish Dishes', fr: 'Plats de Poisson', de: 'Fischgerichte' },
  [ProductCategory.ANTIPASTI]: { it: 'Antipasti e Insalate', en: 'Appetizers & Salads', fr: 'Entrées & Salades', de: 'Vorspeisen & Salate' },
  [ProductCategory.BIMBI]: { it: 'Menu Bimbi', en: 'Kids Menu', fr: 'Menu Enfants', de: 'Kindermenü' },
  [ProductCategory.CONTORNI]: { it: 'Contorni', en: 'Side Dishes', fr: 'Accompagnements', de: 'Beilagen' },
  [ProductCategory.DOLCI]: { it: 'Dolci', en: 'Desserts', fr: 'Desserts', de: 'Desserts' },
  [ProductCategory.BEVANDE]: { it: 'Bevande', en: 'Drinks', fr: 'Boissons', de: 'Getränke' },
  [ProductCategory.AGGIUNTE]: { it: 'Ingredienti Extra', en: 'Extra Ingredients', fr: 'Ingrédients Supplémentaires', de: 'Zusätzliche Zutaten' }
};

export const HAMBURGER_SPECIAL_NAMES = [
  "Hamburger della Settimana",
  "Porky's Piadizza",
  "Old West",
  "Veneto",
  "Lombardo",
  "Emiliano",
  "Siciliano",
  "Piemontese",
  "Uruguay",
  "Valdostano",
  "Campano",
  "Laziale",
  "Italia",
  "Calabrese"
];

export const EXTRA_INGREDIENTS_ITEMS: MenuItem[] = [
  { id: 'agg1', name: 'Funghi', description: '', price: 1.00, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg2', name: 'Doppia Mozzarella', description: '', price: 1.50, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg3', name: 'Salame Piccante', description: '', price: 1.50, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg4', name: 'Patatine Fritte', description: '', price: 2.00, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg5', name: 'Uovo', description: '', price: 1.00, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg6', name: 'Bacon', description: '', price: 1.50, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg7', name: 'Cipolla', description: '', price: 1.00, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg8', name: 'Gorgonzola', description: '', price: 1.50, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg9', name: 'Rucola', description: '', price: 1.00, category: ProductCategory.AGGIUNTE, isAvailable: true },
  { id: 'agg10', name: 'Scaglie di Grana', description: '', price: 1.50, category: ProductCategory.AGGIUNTE, isAvailable: true },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = []; 
export const CATEGORIES_LIST = Object.values(ProductCategory).filter(c => c !== ProductCategory.AGGIUNTE);

export const LUNCH_HOURS = ["11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
export const DINNER_HOURS = ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];