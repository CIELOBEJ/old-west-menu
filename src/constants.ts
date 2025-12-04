import { MenuItem, ProductCategory, LanguageCode, AllergenType } from './types';

export const DATA_VERSION = '2.6'; // Aggiornato

export const HAMBURGER_SUBCATEGORIES = [
  "Old West Special",
  "Vegetariano/Vegano",
  'Hamburger "Fai da te"'
];

export const DRINK_SUBCATEGORIES = [
  "Acqua e Bibite",
  "Birre alla Spina",
  "Birre in Bottiglia",
  "Vini",
  "Caffetteria",
  "Amari e Digestivi"
];

export const SUBCATEGORY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Acqua e Bibite": { it: "Acqua e Bibite", en: "Water & Soft Drinks", fr: "Eau et Boissons", de: "Wasser und Erfrischungsgetränke" },
  "Birre alla Spina": { it: "Birre alla Spina", en: "Draft Beers", fr: "Bières Pression", de: "Bier vom Fass" },
  "Birre in Bottiglia": { it: "Birre in Bottiglia", en: "Bottled Beers", fr: "Bières en Bouteille", de: "Flaschenbiere" },
  "Vini": { it: "Vini", en: "Wines", fr: "Vins", de: "Weine" },
  "Caffetteria": { it: "Caffetteria", en: "Coffee", fr: "Café", de: "Kaffee" }, // Modificato in "Coffee"
  "Amari e Digestivi": { it: "Amari e Digestivi", en: "Bitters & Digestifs", fr: "Amers et Digestifs", de: "Bitter und Digestifs" }
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
  'Anidride solforosa': { label: 'Anidride solforosa e solfiti', iconName: 'Wine' },
  'Lupini': { label: 'Lupini', iconName: 'Bean' },
  'Molluschi': { label: 'Molluschi', iconName: 'Shell' },
};

export const DIY_OPTIONS = {
  basePrice: 0,
  steps: [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
      title: "L'Opzione",
      description: "Arricchisci il gusto",
      translations: { en: { title: "The Option", description: "Enrich the taste" }, fr: { title: "L'Option", description: "Enrichissez le goût" }, de: { title: "Die Option", description: "Bereichern Sie den Geschmack" } },
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
      id: 4,
      title: "Il Contorno",
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
  'create_your_taste': { it: 'Crea il tuo gusto', en: 'Create your taste', fr: 'Créez votre goût', de: 'Kreieren Sie Ihren Geschmack' },
  'diy_title': { it: 'Crea il tuo Capolavoro', en: 'Create your Masterpiece', fr: "Créez votre Chef-d'œuvre", de: 'Kreieren Sie Ihr Meisterwerk' },
  'diy_subtitle': { it: "Segui i 4 passaggi per comporre l'hamburger perfetto.", en: 'Follow the 4 steps to build your perfect burger.', fr: 'Suivez les 4 étapes pour composer votre burger parfait.', de: 'Folgen Sie den 4 Schritten zum perfekten Burger.' },
  'total': { it: 'Totale', en: 'Total', fr: 'Total', de: 'Gesamt' },
  'order_table': { it: 'Ordina al Tavolo', en: 'Order at Table', fr: 'Commander à table', de: 'Am Tisch bestellen' },
  'filter_veg': { it: 'Vegetariano', en: 'Vegetarian', fr: 'Végétarien', de: 'Vegetarisch' },
  'filter_vegan': { it: 'Vegano', en: 'Vegan', fr: 'Végan', de: 'Vegan' },
  'filter_spicy': { it: 'Piccante', en: 'Spicy', fr: 'Épicé', de: 'Scharf' },
  'all': { it: 'Tutti', en: 'All', fr: 'Tout', de: 'Alle' },
  'my_order': { it: 'Il Mio Ordine', en: 'My Order', fr: 'Ma Commande', de: 'Meine Bestellung' },
  'review_order': { it: 'Rivedi Ordine', en: 'Review Order', fr: 'Voir la commande', de: 'Bestellung prüfen' },
  'show_staff': { it: 'Mostra al Cameriere', en: 'Show to Staff', fr: 'Montrer au serveur', de: 'Dem Kellner zeigen' },
  'add_ingredient': { it: 'Aggiungi Ingrediente', en: 'Add Ingredient', fr: 'Ajouter Ingrédient', de: 'Zutat hinzufügen' },
  'add_to_cart': { it: 'Aggiungi', en: 'Add', fr: 'Ajouter', de: 'Hinzufügen' },
  'add': { it: 'Avanti', en: 'Next', fr: 'Suivant', de: 'Weiter' },
  'cover_charge': { it: 'COPERTO', en: 'COVER CHARGE', fr: 'COUVERT', de: 'GEDECK' },
  'empty_cart': { it: 'Il carrello è vuoto', en: 'Cart is empty', fr: 'Le panier est vide', de: 'Der Warenkorb ist leer' },
  'search_addon': { it: 'Cerca ingrediente...', en: 'Search ingredient...', fr: 'Rechercher ingrédient...', de: 'Zutat suchen...' },
  'items': { it: 'articoli', en: 'items', fr: 'articles', de: 'artikel' },
  'frozen_explanation': { it: '* Prodotto congelato all\'origine', en: '* Frozen product', fr: '* Produit surgelé', de: '* Tiefkühlprodukt' },
  'rights_reserved': { it: 'All rights reserved', en: 'All rights reserved', fr: 'Tous droits réservés', de: 'Alle Rechte vorbehalten' },
  
  // Suggerimenti Cross-selling (Per il popup/toast)
  'suggestion_burger': { it: 'Ottimo con una Birra Media o Patatine!', en: 'Great with a Beer or Fries!', fr: 'Excellent avec une Bière ou des Frites!', de: 'Toll mit einem Bier oder Pommes!' },
  'suggestion_main': { it: 'Accompagnalo con un buon Vino Rosso', en: 'Pair it with a good Red Wine', fr: 'Accompagnez-le d\'un bon Vin Rouge', de: 'Passt gut zu einem Rotwein' },
  'suggestion_dessert': { it: 'Ideale con un Caffè o un Amaro', en: 'Perfect with Coffee or Digestif', fr: 'Idéal avec un Café ou un Digestif', de: 'Ideal mit Kaffee oder Digestif' },
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