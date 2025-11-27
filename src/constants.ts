import { MenuItem, ProductCategory, LanguageCode } from './types';
export const DATA_VERSION = '1.8'; // Version bump to force update with all new beverages
export const HAMBURGER_SUBCATEGORIES = [
"Old West Special",
"Vegetariano/Vegano",
'Hamburger "Fai da te"'
];
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
{
name: "PANINO preparato al momento",
price: 0,
translations: {
en: { name: "Freshly prepared BUN" },
fr: { name: "PAIN préparé sur place" },
de: { name: "Frisch zubereitetes BRÖTCHEN" }
}
},
{
name: "FOCACCIA CALDA per hamburger servito al piatto",
price: 0,
translations: {
en: { name: "WARM FOCACCIA for plated burger" },
fr: { name: "FOCACCIA CHAUDE pour burger sur assiette" },
de: { name: "WARME FOCACCIA für Burger auf dem Teller" }
}
}
]
},
{
id: 2,
title: "La Carne",
description: "Il cuore del tuo burger",
translations: {
en: { title: "The Meat", description: "The heart of your burger" },
fr: { title: "La Viande", description: "Le cœur de votre burger" },
de: { title: "Das Fleisch", description: "Das Herz Ihres Burgers" }
},
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
translations: {
en: { title: "The Option", description: "Enrich the taste" },
fr: { title: "L'Option", description: "Enrichissez le goût" },
de: { title: "Die Option", description: "Bereichern Sie den Geschmack" }
},
options: [
{
name: "OPZIONE N°1: Cipolle rosse cotte (sfumate con aceto balsamico), Grana in scaglie, Pomodorini conditi, Salsa boscaiola",
price: 4.00,
translations: {
en: { name: "OPTION #1: Cooked red onions (with balsamic vinegar), Parmesan flakes, Seasoned cherry tomatoes, Boscaiola sauce" },
fr: { name: "OPTION N°1: Oignons rouges cuits (au vinaigre balsamique), Copeaux de Grana, Tomates cerises assaisonnées, Sauce boscaiola" },
de: { name: "OPTION NR.1: Gekochte rote Zwiebeln (mit Balsamico), Grana-Flocken, Gewürzte Kirschtomaten, Boscaiola-Soße" }
}
},
{
name: "OPZIONE N°2: Gorgonzola, Bacon, Julienne di lattuga, Pomodorini conditi, Melanzane fritte",
price: 5.00,
translations: {
en: { name: "OPTION #2: Gorgonzola, Bacon, Lettuce julienne, Seasoned cherry tomatoes, Fried eggplant" },
fr: { name: "OPTION N°2: Gorgonzola, Bacon, Julienne de laitue, Tomates cerises assaisonnées, Aubergines frites" },
de: { name: "OPTION NR.2: Gorgonzola, Speck, Salatstreifen, Gewürzte Kirschtomaten, Gebratene Auberginen" }
}
},
{
name: "OPZIONE N°3: Cheddar, Bacon, Pomodorini secchi, Salsa burger, Cipolle rosse cotte (sfumate con aceto balsamico)",
price: 5.00,
translations: {
en: { name: "OPTION #3: Cheddar, Bacon, Dried tomatoes, Burger sauce, Cooked red onions (with balsamic vinegar)" },
fr: { name: "OPTION N°3: Cheddar, Bacon, Tomates séchées, Sauce burger, Oignons rouges cuits (au vinaigre balsamique)" },
de: { name: "OPTION NR.3: Cheddar, Speck, Getrocknete Tomaten, Burger-Soße, Gekochte rote Zwiebeln (mit Balsamico)" }
}
},
{
name: "OPZIONE N°4: Ketchup, Maionese, Pomodorini, Lattuga",
price: 4.00,
translations: {
en: { name: "OPTION #4: Ketchup, Mayonnaise, Cherry tomatoes, Lettuce" },
fr: { name: "OPTION N°4: Ketchup, Mayonnaise, Tomates cerises, Laitue" },
de: { name: "OPTION NR.4: Ketchup, Mayonnaise, Kirschtomaten, Salat" }
}
},
{
name: "OPZIONE N°5: Ketchup, Maionese, Pomodorini, Lattuga, Bacon, Cipolle rosse cotte (sfumate con aceto balsamico), Edamer",
price: 6.50,
translations: {
en: { name: "OPTION #5: Ketchup, Mayonnaise, Cherry tomatoes, Lettuce, Bacon, Cooked red onions (with balsamic vinegar), Edam cheese" },
fr: { name: "OPTION N°5: Ketchup, Mayonnaise, Tomates cerises, Laitue, Bacon, Oignons rouges cuits (au vinaigre balsamique), Edam" },
de: { name: "OPTION NR.5: Ketchup, Mayonnaise, Kirschtomaten, Salat, Speck, Gekochte rote Zwiebeln (mit Balsamico), Edamer" }
}
},
{
name: "OPZIONE N°6: Ketchup, Maionese, Cheddar, Pomodorini, Lattuga, Zucchine fritte, Salsa burger",
price: 5.50,
translations: {
en: { name: "OPTION #6: Ketchup, Mayonnaise, Cheddar, Cherry tomatoes, Lettuce, Fried zucchini, Burger sauce" },
fr: { name: "OPTION N°6: Ketchup, Mayonnaise, Cheddar, Tomates cerises, Laitue, Courgettes frites, Sauce burger" },
de: { name: "OPTION NR.6: Ketchup, Mayonnaise, Cheddar, Kirschtomaten, Salat, Gebratene Zucchini, Burger-Soße" }
}
}
]
},
{
id: 4,
title: "Il Contorno",
description: "Per accompagnare",
translations: {
en: { title: "The Side Dish", description: "To accompany" },
fr: { title: "L'Accompagnement", description: "Pour accompagner" },
de: { title: "Die Beilage", description: "Zur Begleitung" }
},
options: [
{ name: "Patatine fritte", price: 5.00, translations: { en: { name: "French Fries" }, fr: { name: "Frites" }, de: { name: "Pommes Frites" } } },
{ name: "Pomodorini", price: 5.00, translations: { en: { name: "Cherry Tomatoes" }, fr: { name: "Tomates Cerises" }, de: { name: "Kirschtomaten" } } },
{ name: "Fagioli borlotti con cipolle crude", price: 5.00, translations: { en: { name: "Borlotti beans with raw onions" }, fr: { name: "Haricots Borlotti aux oignons crus" }, de: { name: "Borlotti-Bohnen mit rohen Zwiebeln" } } },
{ name: "Insalata di lattuga e radicchio", price: 5.00, translations: { en: { name: "Lettuce and Radicchio Salad" }, fr: { name: "Salade de Laitue et Radicchio" }, de: { name: "Salat aus Kopfsalat und Radicchio" } } },
{ name: "Mais e carote", price: 5.00, translations: { en: { name: "Corn and Carrots" }, fr: { name: "Maïs et Carottes" }, de: { name: "Mais und Karotten" } } },
{ name: "Grill di verdure: Melanzane, Zucchine, Peperoni", price: 5.00, translations: { en: { name: "Grilled Vegetables: Eggplant, Zucchini, Peppers" }, fr: { name: "Légumes grillés: Aubergines, Courgettes, Poivrons" }, de: { name: "Gegrilltes Gemüse: Auberginen, Zucchini, Paprika" } } }
]
}
]
};
// --- TRANSLATIONS ---
export const UI_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
// Navigation & General
'menu_title': { it: 'Menu Digitale', en: 'Digital Menu', fr: 'Menu Numérique', de: 'Digitales Menü' },
'back_to_menu': { it: 'Torna al Menu', en: 'Back to Menu', fr: 'Retour au Menu', de: 'Zurück zum Menü' },
'admin_area': { it: 'Area Staff', en: 'Staff Area', fr: 'Espace Staff', de: 'Mitarbeiterbereich' },
'login_prompt': { it: 'Accedi per gestire il menu digitale', en: 'Login to manage the digital menu', fr: 'Connectez-vous pour gérer le menu', de: 'Anmelden zur Menüverwaltung' },
'login_btn': { it: 'Accedi', en: 'Login', fr: 'Connexion', de: 'Anmelden' },
'back': { it: 'Indietro', en: 'Back', fr: 'Retour', de: 'Zurück' },
'open_hours': { it: '11:00 - 15:00 | 17:00 - 00:00', en: '11:00 - 15:00 | 17:00 - 00:00', fr: '11h00 - 15h00 | 17h00 - 00h00', de: '11:00 - 15:00 | 17:00 - 00:00' },
// Menu View
'hero_title': { it: 'Il Gusto Autentico', en: 'The Authentic Taste', fr: 'Le Goût Authentique', de: 'Der Authentische Geschmack' },
'updating_menu': { it: 'Menu in aggiornamento', en: 'Menu updating', fr: 'Menu en mise à jour', de: 'Menü wird aktualisiert' },
'check_back': { it: 'Torna a trovarci presto!', en: 'Check back soon!', fr: 'Revenez bientôt!', de: 'Kommen Sie bald wieder!' },
'products_count': { it: 'prodotti', en: 'products', fr: 'produits', de: 'Produkte' },
'products_available': { it: 'prodotti disponibili', en: 'products available', fr: 'produits disponibles', de: 'verfügbare Produkte' },
'no_products_section': { it: 'Nessun prodotto disponibile in questa sezione.', en: 'No products available in this section.', fr: 'Aucun produit disponible dans cette section.', de: 'Keine Produkte in diesem Bereich verfügbar.' },
'select_category': { it: 'Seleziona una categoria', en: 'Select a category', fr: 'Sélectionnez une catégorie', de: 'Wählen Sie eine Kategorie' },
'classics': { it: 'Classici', en: 'Classics', fr: 'Classiques', de: 'Klassiker' },
'options': { it: 'Opzioni', en: 'Options', fr: 'Options', de: 'Optionen' },
'create_your_taste': { it: 'Crea il tuo gusto', en: 'Create your taste', fr: 'Créez votre goût', de: 'Kreieren Sie Ihren Geschmack' },
'diy_title': { it: 'Crea il tuo Capolavoro', en: 'Create your Masterpiece', fr: "Créez votre Chef-d'œuvre", de: 'Kreieren Sie Ihr Meisterwerk' },
'diy_subtitle': { it: "Segui i 4 passaggi per comporre l'hamburger perfetto.", en: 'Follow the 4 steps to build your perfect burger.', fr: 'Suivez les 4 étapes pour composer votre burger parfait.', de: 'Folgen Sie den 4 Schritten zum perfekten Burger.' },
'total': { it: 'Totale', en: 'Total', fr: 'Total', de: 'Gesamt' },
'base_price': { it: 'Prezzo base', en: 'Base price', fr: 'Prix de base', de: 'Grundpreis' },
'order_table': { it: 'Ordina al Tavolo', en: 'Order at Table', fr: 'Commander à table', de: 'Am Tisch bestellen' },
'highlight_title': { it: 'In Evidenza', en: 'Highlights', fr: 'En Vedette', de: 'Highlights' },
'filter_veg': { it: 'Vegetariano', en: 'Vegetarian', fr: 'Végétarien', de: 'Vegetarisch' },
'filter_vegan': { it: 'Vegano', en: 'Vegan', fr: 'Végan', de: 'Vegan' },
'filter_spicy': { it: 'Piccante', en: 'Spicy', fr: 'Épicé', de: 'Scharf' },
'filter_best': { it: 'Best Seller', en: 'Best Seller', fr: 'Meilleures Ventes', de: 'Bestseller' },
'scan_me': { it: 'Scansiona per il Menu', en: 'Scan for Menu', fr: 'Scannez pour le Menu', de: 'Scannen für Menü' },
// Categories (Generic)
'all': { it: 'Tutti', en: 'All', fr: 'Tout', de: 'Alle' },
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
};
export const INITIAL_MENU_ITEMS: MenuItem[] = [
// --- BEVANDE (NO FOTO) ---
{
id: 'bev1',
name: 'Acqua',
description: 'Naturale / Frizzante',
price: 1.50,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
variants: [
{ name: '50 cl', price: 1.50 },
{ name: '100 cl', price: 2.00 }
],
translations: {
en: { name: 'Water', description: 'Still / Sparkling' },
fr: { name: 'Eau', description: 'Plate / Gazeuse' },
de: { name: 'Wasser', description: 'Still / Sprudelnd' }
}
},
{
id: 'bev3',
name: 'Bibite 33cl',
description: '',
price: 3.00,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
translations: {
en: { name: 'Soft Drinks 33cl', description: '' },
fr: { name: 'Boissons Gazeuses 33cl', description: '' },
de: { name: 'Erfrischungsgetränke 33cl', description: '' }
}
},
{
id: 'bev4',
name: 'Bibite 45 cl',
description: '',
price: 3.50,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
translations: {
en: { name: 'Soft Drinks 45 cl', description: '' },
fr: { name: 'Boissons Gazeuses 45 cl', description: '' },
de: { name: 'Erfrischungsgetränke 45 cl', description: '' }
}
},
{
id: 'bev5',
name: 'Birra Bionda Leggera alla Spina',
description: 'Bionda leggera gradi 5,5',
brand: 'HACHER - PSCHORR Munich Gold',
price: 3.00,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
variants: [
{ name: 'Piccola 20cl', price: 3.00 },
{ name: 'Media 40cl', price: 5.50 }
],
translations: {
en: { name: 'Light Draft Beer', description: 'Light blonde 5.5 degrees' },
fr: { name: 'Bière Pression Légère', description: 'Blonde légère 5,5 degrés' },
de: { name: 'Helles Bier vom Fass', description: 'Helles 5,5 Grad' }
}
},
{
id: 'bev7',
name: 'Birra Bionda Doppio Malto alla Spina',
description: 'Bionda doppio malto gradi 8',
brand: 'DOLOMITI - BIRRA ITALIANA',
price: 3.50,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
variants: [
{ name: 'Piccola 20cl', price: 3.50 },
{ name: 'Media 40cl', price: 6.50 }
],
translations: {
en: { name: 'Double Malt Draft Beer', description: 'Double malt blonde 8 degrees' },
fr: { name: 'Bière Double Malt Pression', description: 'Blonde double malt 8 degrés' },
de: { name: 'Doppelbock vom Fass', description: 'Doppelbock 8 Grad' }
}
},
{
id: 'bev8',
name: 'Birra Rossa Doppio Malto alla Spina',
description: 'Rossa doppio malto gradi 7,9',
brand: 'PAULANER SALVATOR',
price: 3.50,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
variants: [
{ name: 'Piccola 20cl', price: 3.50 },
{ name: 'Media 40cl', price: 6.50 }
],
translations: {
en: { name: 'Red Double Malt Draft Beer', description: 'Red double malt 7.9 degrees' },
fr: { name: 'Bière Rouge Double Malt Pression', description: 'Rouge double malt 7,9 degrés' },
de: { name: 'Rotes Doppelbock vom Fass', description: 'Rotes Doppelbock 7,9 Grad' }
}
},
{
id: 'bev9',
name: 'Birra Cruda alla Spina',
description: 'Bionda cruda gradi 5,5',
brand: 'PAULANER HEFE - WEIẞBIER',
price: 3.50,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
variants: [
{ name: 'Piccola 20cl', price: 3.50 },
{ name: 'Media 40cl', price: 6.50 }
],
translations: {
en: { name: 'Raw Draft Beer', description: 'Raw blonde 5.5 degrees' },
fr: { name: 'Bière Crue Pression', description: 'Blonde crue 5,5 degrés' },
de: { name: 'Unfiltriertes Bier vom Fass', description: 'Helles Unfiltriertes 5,5 Grad' }
}
},
{
id: 'bev10',
name: 'Birre in Bottiglia 33cl',
description: '',
price: 5.00,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
translations: {
en: { name: 'Bottled Beers 33cl', description: '' },
fr: { name: 'Bières en Bouteille 33cl', description: '' },
de: { name: 'Flaschenbiere 33cl', description: '' }
}
},
{
id: 'bev11',
name: 'Vino in Bottiglia 75cl',
description: '',
price: 16.00,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
translations: {
en: { name: 'Bottled Wine 75cl', description: '' },
fr: { name: 'Vin en Bouteille 75cl', description: '' },
de: { name: 'Flaschenwein 75cl', description: '' }
}
},
{
id: 'bev12',
name: 'Vino Spumante Millesimato 75cl',
description: '',
price: 20.00,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
translations: {
en: { name: 'Vintage Sparkling Wine 75cl', description: '' },
fr: { name: 'Vin Mousseux Millésimé 75cl', description: '' },
de: { name: 'Jahrgangssekt 75cl', description: '' }
}
},
{
id: 'bev13',
name: 'Vino Sfuso Rosso/Bianco',
description: '',
price: 5.00,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
variants: [
{ name: '1/4 L', price: 5.00 },
{ name: '1/2 L', price: 7.00 },
{ name: '1 L', price: 13.00 }
],
translations: {
en: { name: 'House Wine Red/White', description: '' },
fr: { name: 'Vin Maison Rouge/Blanc', description: '' },
de: { name: 'Hauswein Rot/Weiß', description: '' }
}
},
{
id: 'bev14',
name: 'Caffè',
description: '',
price: 2.00,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
translations: {
en: { name: 'Espresso', description: '' },
fr: { name: 'Café', description: '' },
de: { name: 'Espresso', description: '' }
}
},
{
id: 'bev15',
name: 'Caffè Corretto',
description: '',
price: 2.50,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
translations: {
en: { name: 'Caffè Corretto', description: '' },
fr: { name: 'Café Corretto', description: '' },
de: { name: 'Caffè Corretto', description: '' }
}
},
{
id: 'bev16',
name: 'Amari',
description: '',
price: 3.50,
category: ProductCategory.BEVANDE,
imageUrl: '',
isAvailable: true,
translations: {
en: { name: 'Bitters/Digestifs', description: '' },
fr: { name: 'Digestifs', description: '' },
de: { name: 'Bitter/Digestifs', description: '' }
}
},
// --- HAMBURGER ---
{
id: '1',
name: 'Old West',
description: "Bufalo (220g), 'Nduja, Bacon, Peperoni, Olive infornate, Brie, Lattuga e Salsa boscaiola",
price: 17.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/hamburger-old-west.jpg',
isAvailable: true,
tags: ['Best Seller'],
translations: {
en: { name: 'Old West', description: "Buffalo (220g), 'Nduja, Bacon, Peppers, Baked Olives, Brie, Lettuce and Boscaiola Sauce" },
fr: { name: 'Old West', description: "Buffle (220g), 'Nduja, Bacon, Poivrons, Olives au four, Brie, Laitue et Sauce Boscaiola" },
de: { name: 'Old West', description: "Büffel (220g), 'Nduja, Speck, Paprika, Gebackene Oliven, Brie, Salat und Boscaiola-Sauce" }
}
},
{
id: '12',
name: 'Veneto',
description: 'Fassona (270g) sfumata con grappa e aceto balsamico, Scaglie di grana, Radicchio, Lardo, Ketchup, Peperoni grigliati',
price: 15.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/Veneto.jpg',
isAvailable: true,
translations: {
en: { name: 'Veneto', description: 'Fassona (270g) blended with grappa and balsamic vinegar, Grana flakes, Radicchio, Lard, Ketchup, Grilled peppers' },
fr: { name: 'Veneto', description: 'Fassona (270g) au grappa et vinaigre balsamique, Copeaux de Grana, Radicchio, Lard, Ketchup, Poivrons grillés' },
de: { name: 'Veneto', description: 'Fassona (270g) mit Grappa und Balsamico, Grana-Flocken, Radicchio, Schmalz, Ketchup, Gegrillte Paprika' }
}
},
{
id: '13',
name: 'Lombardo',
description: 'Chianina (200g), Asparagi, Uovo fritto, Grana grattugiato, Burro fuso',
price: 14.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/Lombardo.jpg',
isAvailable: true,
translations: {
en: { name: 'Lombardo', description: 'Chianina (200g), Asparagus, Fried Egg, Grated Grana, Melted Butter' },
fr: { name: 'Lombardo', description: 'Chianina (200g), Asperges, Œuf au plat, Grana râpé, Beurre fondu' },
de: { name: 'Lombardo', description: 'Chianina (200g), Spargel, Spiegelei, Geriebener Grana, Geschmolzene Butter' }
}
},
{
id: '14',
name: 'Emiliano',
description: 'Fassona (270g), Prosciutto crudo, Grana, Asparagi, Sugo di pomodoro con funghi porcini',
price: 15.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/emiliano.jpg',
isAvailable: true,
translations: {
en: { name: 'Emiliano', description: 'Fassona (270g), Raw Ham, Grana, Asparagus, Tomato Sauce with Porcini Mushrooms' },
fr: { name: 'Emiliano', description: 'Fassona (270g), Jambon Cru, Grana, Asperges, Sauce Tomate aux Cèpes' },
de: { name: 'Emiliano', description: 'Fassona (270g), Rohschinken, Grana, Spargel, Tomatensauce mit Steinpilzen' }
}
},
{
id: '15',
name: 'Siciliano',
description: 'Bufalo (220g), Peperoni fritti, Cipolle fritte, Pomodorini fritti, Olive infornate, Scaglie di pecorino',
price: 15.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/Siciliano.jpg',
isAvailable: true,
translations: {
en: { name: 'Siciliano', description: 'Buffalo (220g), Fried Peppers, Fried Onions, Fried Cherry Tomatoes, Baked Olives, Pecorino Flakes' },
fr: { name: 'Siciliano', description: 'Buffle (220g), Poivrons frits, Oignons frits, Tomates cerises frites, Olives au four, Copeaux de Pecorino' },
de: { name: 'Siciliano', description: 'Büffel (220g), Gebratene Paprika, Gebratene Zwiebeln, Gebratene Kirschtomaten, Gebackene Oliven, Pecorino-Flocken' }
}
},
{
id: '16',
name: 'Piemontese',
description: 'Fassona (270g), Taleggio, Funghi porcini, Maionese, Verza condita (olio, sale, pepe)',
price: 15.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/Piemontese-1.jpg',
isAvailable: true,
translations: {
en: { name: 'Piemontese', description: 'Fassona (270g), Taleggio Cheese, Porcini Mushrooms, Mayonnaise, Seasoned Cabbage' },
fr: { name: 'Piemontese', description: 'Fassona (270g), Taleggio, Cèpes, Mayonnaise, Chou assaisonné' },
de: { name: 'Piemontese', description: 'Fassona (270g), Taleggio, Steinpilze, Mayonnaise, Gewürzter Wirsing' }
}
},
{
id: '17',
name: 'Uruguay',
description: 'Angus (200g), Lattuga, Pomodorini, Maionese, Fontina, Bacon, Prosciutto crudo',
price: 16.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/URUGUAY.jpg',
isAvailable: true,
translations: {
en: { name: 'Uruguay', description: 'Angus (200g), Lettuce, Cherry Tomatoes, Mayonnaise, Fontina, Bacon, Raw Ham' },
fr: { name: 'Uruguay', description: 'Angus (200g), Laitue, Tomates cerises, Mayonnaise, Fontina, Bacon, Jambon Cru' },
de: { name: 'Uruguay', description: 'Angus (200g), Salat, Kirschtomaten, Mayonnaise, Fontina, Speck, Rohschinken' }
}
},
{
id: '18',
name: 'Valdostano',
description: 'Angus (200g), Fontina, Prosciutto cotto, Funghi champignon, Maionese',
price: 13.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/Valdostano.jpg',
isAvailable: true,
translations: {
en: { name: 'Valdostano', description: 'Angus (200g), Fontina, Cooked Ham, Champignon Mushrooms, Mayonnaise' },
fr: { name: 'Valdostano', description: 'Angus (200g), Fontina, Jambon Cuit, Champignons de Paris, Mayonnaise' },
de: { name: 'Valdostano', description: 'Angus (200g), Fontina, Gekochter Schinken, Champignons, Mayonnaise' }
}
},
{
id: '19',
name: 'Calabrese',
description: 'Chianina (200g), Coppa, ‘Nduja, Salsa boscaiola, Melanzane fritte, Peperoncino',
price: 14.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/CALABRESE-.jpg',
isAvailable: true,
translations: {
en: { name: 'Calabrese', description: 'Chianina (200g), Coppa, ‘Nduja, Boscaiola Sauce, Fried Eggplant, Chili Pepper' },
fr: { name: 'Calabrese', description: 'Chianina (200g), Coppa, ‘Nduja, Sauce Boscaiola, Aubergines frites, Piment' },
de: { name: 'Calabrese', description: 'Chianina (200g), Coppa, ‘Nduja, Boscaiola-Sauce, Gebratene Auberginen, Chili' }
}
},
{
id: '20',
name: 'Campano',
description: 'Bufalo (220g), Mozzarella di bufala, Friarielli, Salsa boscaiola',
price: 13.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/Campano-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Campano', description: 'Buffalo (220g), Buffalo Mozzarella, Friarielli (Broccoli Rabe), Boscaiola Sauce' },
fr: { name: 'Campano', description: 'Buffle (220g), Mozzarella de Buffle, Friarielli, Sauce Boscaiola' },
de: { name: 'Campano', description: 'Büffel (220g), Büffelmozzarella, Stängelkohl, Boscaiola-Sauce' }
}
},
{
id: '21',
name: 'Laziale',
description: 'Bufalo (220g), Guanciale, Uovo fritto, Scaglie di pecorino',
price: 13.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/Lazio-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Laziale', description: 'Buffalo (220g), Guanciale (Cured Pork Cheek), Fried Egg, Pecorino Flakes' },
fr: { name: 'Laziale', description: 'Buffle (220g), Guanciale, Œuf au plat, Copeaux de Pecorino' },
de: { name: 'Laziale', description: 'Büffel (220g), Guanciale, Spiegelei, Pecorino-Flocken' }
}
},
{
id: '22',
name: 'Italia',
description: 'Bufalo (220g), Scaglie di pecorino, Basilico, Pomodorini, Mozzarella di bufala, Speck',
price: 15.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2018/07/20180708_192345.jpg',
isAvailable: true,
translations: {
en: { name: 'Italia', description: 'Buffalo (220g), Pecorino Flakes, Basil, Cherry Tomatoes, Buffalo Mozzarella, Speck' },
fr: { name: 'Italia', description: 'Buffle (220g), Copeaux de Pecorino, Basilic, Tomates cerises, Mozzarella de Buffle, Speck' },
de: { name: 'Italia', description: 'Büffel (220g), Pecorino-Flocken, Basilikum, Kirschtomaten, Büffelmozzarella, Speck' }
}
},
{
id: '23',
name: "Porky's Piadizza",
description: 'Piadizza piastrata con burro, Hamburger di salsiccia casereccia, Cheddar, ‘Nduja, Lattuga, Bacon e Pancetta piastrata, Salsa barbecue',
price: 15.00,
category: ProductCategory.HAMBURGER,
subCategory: "Old West Special",
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/porkys-hamb-della-sett-05.11.jpeg',
isAvailable: true,
translations: {
en: { name: "Porky's Piadizza", description: 'Grilled Piadizza with butter, Sausage Burger, Cheddar, ‘Nduja, Lettuce, Bacon and Grilled Pancetta, BBQ Sauce' },
fr: { name: "Porky's Piadizza", description: 'Piadizza grillée au beurre, Burger de Saucisse, Cheddar, ‘Nduja, Laitue, Bacon et Pancetta grillée, Sauce Barbecue' },
de: { name: "Porky's Piadizza", description: 'Gegrillte Piadizza mit Butter, Wurst-Burger, Cheddar, ‘Nduja, Salat, Speck und gegrillter Pancetta, Barbecue-Sauce' }
}
},
{
id: '24',
name: 'Panino Vegetariano',
description: 'Melanzane fritte, Mozzarella di bufala, Pomodorini pachino, Lattuga, Basilico o menta (se di stagione), Salsa dressing con yogurt. (Contorno compreso)',
price: 13.00,
category: ProductCategory.HAMBURGER,
subCategory: "Vegetariano/Vegano",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/vegetariano1.jpg',
isAvailable: true,
tags: ['Vegetariano'],
translations: {
en: { name: 'Vegetarian Sandwich', description: 'Fried Eggplant, Buffalo Mozzarella, Cherry Tomatoes, Lettuce, Basil or Mint, Yogurt Dressing. (Side included)' },
fr: { name: 'Sandwich Végétarien', description: 'Aubergines frites, Mozzarella de Buffle, Tomates cerises, Laitue, Basilic ou Menthe, Sauce au yaourt. (Accompagnement inclus)' },
de: { name: 'Vegetarisches Sandwich', description: 'Gebratene Auberginen, Büffelmozzarella, Kirschtomaten, Salat, Basilikum oder Minze, Joghurt-Dressing. (Beilage inklusive)' }
}
},
{
id: '25',
name: 'Burger Vegano',
description: 'Burger (100g), Lattuga, Cipolle rosse cotte (sfumate, con aceto balsamico), Melanzane fritte, Pomodorini conditi, Ketchup',
price: 12.00,
category: ProductCategory.HAMBURGER,
subCategory: "Vegetariano/Vegano",
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/vegano-scaled.jpg',
isAvailable: true,
tags: ['Vegano'],
translations: {
en: { name: 'Vegan Burger', description: 'Burger (100g), Lettuce, Cooked Red Onions, Fried Eggplant, Seasoned Cherry Tomatoes, Ketchup' },
fr: { name: 'Burger Végan', description: 'Burger (100g), Laitue, Oignons Rouges Cuits, Aubergines Frites, Tomates Cerises Assaisonnées, Ketchup' },
de: { name: 'Veganer Burger', description: 'Burger (100g), Salat, Gekochte Rote Zwiebeln, Gebratene Auberginen, Gewürzte Kirschtomaten, Ketchup' }
}
},
// --- PIZZE ---
{ id: 'p1', name: 'Americana', description: 'Pomodoro, Mozzarella, Salsiccia e Patatine fritte*', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/americana-scaled.jpg', isAvailable: true, translations: { en: { name: 'Americana', description: 'Tomato, Mozzarella, Sausage and French Fries*' }, fr: { name: 'Americana', description: 'Tomate, Mozzarella, Saucisse et Frites*' }, de: { name: 'Americana', description: 'Tomate, Mozzarella, Wurst und Pommes Frites*' } } },
{ id: 'p2', name: 'Angela', description: 'Pomodoro, Mozzarella, Tonno e Patatine fritte*', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/angela-scaled.jpg', isAvailable: true, translations: { en: { name: 'Angela', description: 'Tomato, Mozzarella, Tuna and French Fries*' }, fr: { name: 'Angela', description: 'Tomate, Mozzarella, Thon et Frites*' }, de: { name: 'Angela', description: 'Tomate, Mozzarella, Thunfisch und Pommes Frites*' } } },
{ id: 'p3', name: 'Apache', description: 'Pomodoro, Mozzarella, Bresaola, Rucola e Scaglie di grana (fuori cottura)', price: 12.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/apache-scaled.jpg', isAvailable: true, translations: { en: { name: 'Apache', description: 'Tomato, Mozzarella, Bresaola, Arugula and Grana Flakes' }, fr: { name: 'Apache', description: 'Tomate, Mozzarella, Bresaola, Roquette et Copeaux de Grana' }, de: { name: 'Apache', description: 'Tomate, Mozzarella, Bresaola, Rucola und Grana-Flocken' } } },
{ id: 'p4', name: 'Buffalo Bill', description: 'Mozzarella, Mozzarella di bufala e Pomodorini', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2018/06/buffalo-bill.jpg', isAvailable: true, translations: { en: { name: 'Buffalo Bill', description: 'Mozzarella, Buffalo Mozzarella and Cherry Tomatoes' }, fr: { name: 'Buffalo Bill', description: 'Mozzarella, Mozzarella de Buffle et Tomates Cerises' }, de: { name: 'Buffalo Bill', description: 'Mozzarella, Büffelmozzarella und Kirschtomaten' } } },
{ id: 'p5', name: 'Calamari', description: 'Pomodoro, Mozzarella e Calamari fritti*', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/calamari-scaled.jpg', isAvailable: true, translations: { en: { name: 'Calamari', description: 'Tomato, Mozzarella and Fried Calamari*' }, fr: { name: 'Calamari', description: 'Tomate, Mozzarella et Calamars Frits*' }, de: { name: 'Calamari', description: 'Tomate, Mozzarella und Frittierte Calamari*' } } },
{ id: 'p6', name: 'Calzone', description: 'Pomodoro, Mozzarella e Prosciutto cotto', price: 9.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/calzone-scaled.jpg', isAvailable: true, translations: { en: { name: 'Calzone', description: 'Tomato, Mozzarella and Cooked Ham' }, fr: { name: 'Calzone', description: 'Tomate, Mozzarella et Jambon Cuit' }, de: { name: 'Calzone', description: 'Tomate, Mozzarella und Gekochter Schinken' } } },
{ id: 'p7', name: 'Calzone Farcito', description: 'Pomodoro, Mozzarella, Prosciutto cotto, Carciofi e Funghi champignon', price: 12.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/calzone-scaled.jpg', isAvailable: true, translations: { en: { name: 'Calzone Farcito', description: 'Tomato, Mozzarella, Cooked Ham, Artichokes and Champignon Mushrooms' }, fr: { name: 'Calzone Farcito', description: 'Tomate, Mozzarella, Jambon Cuit, Artichauts et Champignons' }, de: { name: 'Calzone Farcito', description: 'Tomate, Mozzarella, Gekochter Schinken, Artischocken und Champignons' } } },
{ id: 'p8', name: 'Capricciosa', description: 'Pomodoro, Mozzarella, Funghi champignon, Olive nere e Prosciutto cotto', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/capricciosa-scaled.jpg', isAvailable: true, translations: { en: { name: 'Capricciosa', description: 'Tomato, Mozzarella, Champignon Mushrooms, Black Olives and Cooked Ham' }, fr: { name: 'Capricciosa', description: 'Tomate, Mozzarella, Champignons, Olives Noires et Jambon Cuit' }, de: { name: 'Capricciosa', description: 'Tomate, Mozzarella, Champignons, Schwarze Oliven und Gekochter Schinken' } } },
{ id: 'p9', name: 'Cheyenne', description: 'Pomodoro, Mozzarella, Tonno e Cipolle rosse', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/cheyenne-scaled.jpg', isAvailable: true, translations: { en: { name: 'Cheyenne', description: 'Tomato, Mozzarella, Tuna and Red Onions' }, fr: { name: 'Cheyenne', description: 'Tomate, Mozzarella, Thon et Oignons Rouges' }, de: { name: 'Cheyenne', description: 'Tomate, Mozzarella, Thunfisch und Rote Zwiebeln' } } },
{ id: 'p10', name: 'Cimella', description: 'Pomodoro, Mozzarella, Friarielli, Salamella e Scaglie di grana (in cottura)', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/cimella-scaled.jpg', isAvailable: true, translations: { en: { name: 'Cimella', description: 'Tomato, Mozzarella, Friarielli, Sausage and Grana Flakes' }, fr: { name: 'Cimella', description: 'Tomate, Mozzarella, Friarielli, Saucisse et Copeaux de Grana' }, de: { name: 'Cimella', description: 'Tomate, Mozzarella, Stängelkohl, Wurst und Grana-Flocken' } } },
{ id: 'p11', name: 'Cotto', description: 'Pomodoro, Mozzarella e Prosciutto cotto', price: 8.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/cotto-scaled.jpg', isAvailable: true, translations: { en: { name: 'Cotto', description: 'Tomato, Mozzarella and Cooked Ham' }, fr: { name: 'Cotto', description: 'Tomate, Mozzarella et Jambon Cuit' }, de: { name: 'Cotto', description: 'Tomate, Mozzarella und Gekochter Schinken' } } },
{ id: 'p12', name: 'Crudo', description: 'Pomodoro, Mozzarella e prosciutto crudo', price: 9.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/crudo-scaled.jpg', isAvailable: true, translations: { en: { name: 'Crudo', description: 'Tomato, Mozzarella and Raw Ham' }, fr: { name: 'Crudo', description: 'Tomate, Mozzarella et Jambon Cru' }, de: { name: 'Crudo', description: 'Tomate, Mozzarella und Rohschinken' } } },
{ id: 'p13', name: 'Cotto e Funghi', description: 'Pomodoro, Mozzarella, Prosciutto cotto e Funghi champignon', price: 9.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/COTTO-FUNGHI-scaled.jpg', isAvailable: true, translations: { en: { name: 'Cotto e Funghi', description: 'Tomato, Mozzarella, Cooked Ham and Champignon Mushrooms' }, fr: { name: 'Cotto e Funghi', description: 'Tomate, Mozzarella, Jambon Cuit et Champignons' }, de: { name: 'Cotto e Funghi', description: 'Tomate, Mozzarella, Gekochter Schinken und Champignons' } } },
{ id: 'p14', name: 'Comanche', description: 'Pomodoro, Mozzarella, Brie e Speck', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/comanches-scaled.jpg', isAvailable: true, translations: { en: { name: 'Comanche', description: 'Tomato, Mozzarella, Brie and Speck' }, fr: { name: 'Comanche', description: 'Tomate, Mozzarella, Brie et Speck' }, de: { name: 'Comanche', description: 'Tomate, Mozzarella, Brie und Speck' } } },
{ id: 'p15', name: 'Contadina', description: 'Pomodoro, Mozzarella, Gorgonzola e Rucola', price: 9.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/contadina-scaled.jpg', isAvailable: true, translations: { en: { name: 'Contadina', description: 'Tomato, Mozzarella, Gorgonzola and Arugula' }, fr: { name: 'Contadina', description: 'Tomate, Mozzarella, Gorgonzola et Roquette' }, de: { name: 'Contadina', description: 'Tomate, Mozzarella, Gorgonzola und Rucola' } } },
{ id: 'p16', name: 'Dakota', description: 'Mozzarella, Gorgonzola e Pere', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/dakota-scaled.jpg', isAvailable: true, translations: { en: { name: 'Dakota', description: 'Mozzarella, Gorgonzola and Pears' }, fr: { name: 'Dakota', description: 'Mozzarella, Gorgonzola et Poires' }, de: { name: 'Dakota', description: 'Mozzarella, Gorgonzola und Birnen' } } },
{ id: 'p17', name: 'Diavola', description: 'Pomodoro, Mozzarella e Salame piccante', price: 8.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/diavola-scaled.jpg', isAvailable: true, translations: { en: { name: 'Diavola', description: 'Tomato, Mozzarella and Spicy Salami' }, fr: { name: 'Diavola', description: 'Tomate, Mozzarella et Salami Piquant' }, de: { name: 'Diavola', description: 'Tomate, Mozzarella und Scharfe Salami' } } },
{ id: 'p18', name: 'Estate', description: 'Focaccia bianca, Grand Salade: Lattuga, Radicchio, Pomodorini, Tonno, Mozzarella di bufala e Olive nere', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/ESTATE-rotated.jpg', isAvailable: true, translations: { en: { name: 'Estate', description: 'White Focaccia, Grand Salade: Lettuce, Radicchio, Cherry Tomatoes, Tuna, Buffalo Mozzarella and Black Olives' }, fr: { name: 'Estate', description: 'Focaccia Blanche, Grande Salade: Laitue, Radicchio, Tomates Cerises, Thon, Mozzarella de Buffle et Olives Noires' }, de: { name: 'Estate', description: 'Weiße Focaccia, Großer Salat: Salat, Radicchio, Kirschtomaten, Thunfisch, Büffelmozzarella und Schwarze Oliven' } } },
{ id: 'p19', name: 'Fantasia', description: 'Pomodoro, Tonno, Zucchine, Funghi porcini, Pomodorini conditi (olio, sale, origano) e Scaglie di grana (in cottura)', price: 14.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/fantasia-scaled.jpg', isAvailable: true, translations: { en: { name: 'Fantasia', description: 'Tomato, Tuna, Zucchini, Porcini Mushrooms, Seasoned Cherry Tomatoes and Grana Flakes' }, fr: { name: 'Fantasia', description: 'Tomate, Thon, Courgettes, Cèpes, Tomates Cerises Assaisonnées et Copeaux de Grana' }, de: { name: 'Fantasia', description: 'Tomate, Thunfisch, Zucchini, Steinpilze, Gewürzte Kirschtomaten und Grana-Flocken' } } },
{ id: 'p20', name: 'Farcita', description: 'Mozzarella, Prosciutto crudo, Pomodorini e Rucola', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/farcita-scaled.jpg', isAvailable: true, translations: { en: { name: 'Farcita', description: 'Mozzarella, Raw Ham, Cherry Tomatoes and Arugula' }, fr: { name: 'Farcita', description: 'Mozzarella, Jambon Cru, Tomates Cerises et Roquette' }, de: { name: 'Farcita', description: 'Mozzarella, Rohschinken, Kirschtomaten und Rucola' } } },
{ id: 'p21', name: 'Ferilli', description: 'Pomodoro, Salame piccante, Rucola e 250g di Mozzarella di bufala', price: 14.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/ferilli.jpg', isAvailable: true, translations: { en: { name: 'Ferilli', description: 'Tomato, Spicy Salami, Arugula and 250g Buffalo Mozzarella' }, fr: { name: 'Ferilli', description: 'Tomate, Salami Piquant, Roquette et 250g de Mozzarella de Buffle' }, de: { name: 'Ferilli', description: 'Tomate, Scharfe Salami, Rucola und 250g Büffelmozzarella' } } },
{ id: 'p22', name: 'Frutti di Mare', description: 'Pomodoro, Mozzarella e Frutti di mare', price: 13.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/frutti-di-mare-scaled.jpg', isAvailable: true, translations: { en: { name: 'Frutti di Mare', description: 'Tomato, Mozzarella and Seafood' }, fr: { name: 'Frutti di Mare', description: 'Tomate, Mozzarella et Fruits de Mer' }, de: { name: 'Frutti di Mare', description: 'Tomate, Mozzarella und Meeresfrüchte' } } },
{ id: 'p23', name: 'Greca', description: 'Pomodoro, Mozzarella e Olive nere', price: 8.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/greca-scaled.jpg', isAvailable: true, translations: { en: { name: 'Greca', description: 'Tomato, Mozzarella and Black Olives' }, fr: { name: 'Greca', description: 'Tomate, Mozzarella et Olives Noires' }, de: { name: 'Greca', description: 'Tomate, Mozzarella und Schwarze Oliven' } } },
{ id: 'p24', name: 'Mare e Monti', description: 'Pomodoro, Mozzarella, Frutti di mare e Funghi porcini', price: 15.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/MARE-E-MONTI-scaled.jpg', isAvailable: true, translations: { en: { name: 'Mare e Monti', description: 'Tomato, Mozzarella, Seafood and Porcini Mushrooms' }, fr: { name: 'Mare e Monti', description: 'Tomate, Mozzarella, Fruits de Mer et Cèpes' }, de: { name: 'Mare e Monti', description: 'Tomate, Mozzarella, Meeresfrüchte und Steinpilze' } } },
{ id: 'p25', name: 'Marinara', description: 'Pomodoro, Aglio, Olio e Origano', price: 6.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/marinara-scaled.jpg', isAvailable: true, translations: { en: { name: 'Marinara', description: 'Tomato, Garlic, Oil and Oregano' }, fr: { name: 'Marinara', description: 'Tomate, Ail, Huile et Origan' }, de: { name: 'Marinara', description: 'Tomate, Knoblauch, Öl und Oregano' } } },
{ id: 'p26', name: 'Margherita', description: 'Pomodoro, Mozzarella', price: 7.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/margherita-scaled.jpg', isAvailable: true, translations: { en: { name: 'Margherita', description: 'Tomato, Mozzarella' }, fr: { name: 'Margherita', description: 'Tomate, Mozzarella' }, de: { name: 'Margherita', description: 'Tomate, Mozzarella' } } },
{ id: 'p27', name: 'Napoli', description: 'Pomodoro, Mozzarella, Acciughe e Origano', price: 8.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/napoli-scaled.jpg', isAvailable: true, translations: { en: { name: 'Napoli', description: 'Tomato, Mozzarella, Anchovies and Oregano' }, fr: { name: 'Napoli', description: 'Tomate, Mozzarella, Anchois et Origan' }, de: { name: 'Napoli', description: 'Tomate, Mozzarella, Sardellen und Oregano' } } },
{ id: 'p28', name: 'Navajo', description: 'Pomodoro, Mozzarella, Zucchine grigliate e Code di gamberi', price: 12.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/navajo-scaled.jpg', isAvailable: true, translations: { en: { name: 'Navajo', description: 'Tomato, Mozzarella, Grilled Zucchini and Shrimp Tails' }, fr: { name: 'Navajo', description: 'Tomate, Mozzarella, Courgettes Grillées et Queues de Crevettes' }, de: { name: 'Navajo', description: 'Tomate, Mozzarella, Gegrillte Zucchini und Garnelenschwänze' } } },
{ id: 'p29', name: 'Novità', description: 'Pomodoro, Mozzarella, Scamorza affumicata e Pancetta', price: 9.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/novita-scaled.jpg', isAvailable: true, translations: { en: { name: 'Novità', description: 'Tomato, Mozzarella, Smoked Scamorza and Pancetta' }, fr: { name: 'Novità', description: 'Tomate, Mozzarella, Scamorza Fumée et Pancetta' }, de: { name: 'Novità', description: 'Tomate, Mozzarella, Geräucherter Scamorza und Pancetta' } } },
{ id: 'p30', name: 'Old West', description: 'Pomodoro, Mozzarella, Salamella, Funghi porcini e Pomodorini', price: 12.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2018/08/old-west-8.png', isAvailable: true, translations: { en: { name: 'Old West', description: 'Tomato, Mozzarella, Sausage, Porcini Mushrooms and Cherry Tomatoes' }, fr: { name: 'Old West', description: 'Tomate, Mozzarella, Saucisse, Cèpes et Tomates Cerises' }, de: { name: 'Old West', description: 'Tomate, Mozzarella, Wurst, Steinpilze und Kirschtomaten' } } },
{ id: 'p31', name: 'Parmigiana', description: 'Pomodoro, Mozzarella, Prosciutto cotto, Melanzane grigliate e Scaglie di grana (in cottura)', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/parmigiana-scaled.jpg', isAvailable: true, translations: { en: { name: 'Parmigiana', description: 'Tomato, Mozzarella, Cooked Ham, Grilled Eggplant and Grana Flakes' }, fr: { name: 'Parmigiana', description: 'Tomate, Mozzarella, Jambon Cuit, Aubergines Grillées et Copeaux de Grana' }, de: { name: 'Parmigiana', description: 'Tomate, Mozzarella, Gekochter Schinken, Gegrillte Auberginen und Grana-Flocken' } } },
{ id: 'p32', name: 'Patate', description: 'Pomodoro, Mozzarella e Patatine fritte*', price: 9.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/patatine-scaled.jpg', isAvailable: true, translations: { en: { name: 'Patate', description: 'Tomato, Mozzarella and French Fries*' }, fr: { name: 'Patate', description: 'Tomate, Mozzarella et Frites*' }, de: { name: 'Patate', description: 'Tomate, Mozzarella und Pommes Frites*' } } },
{ id: 'p33', name: 'Primavera', description: 'Pomodoro, Mozzarella e Pomodorini conditi (olio, sale e origano)', price: 8.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/primavera-scaled.jpg', isAvailable: true, translations: { en: { name: 'Primavera', description: 'Tomato, Mozzarella and Seasoned Cherry Tomatoes' }, fr: { name: 'Primavera', description: 'Tomate, Mozzarella et Tomates Cerises Assaisonnées' }, de: { name: 'Primavera', description: 'Tomate, Mozzarella und Gewürzte Kirschtomaten' } } },
{ id: 'p34', name: 'Pugliese', description: 'Pomodoro, Mozzarella e Cipolle rosse', price: 8.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/pugliese-scaled.jpg', isAvailable: true, translations: { en: { name: 'Pugliese', description: 'Tomato, Mozzarella and Red Onions' }, fr: { name: 'Pugliese', description: 'Tomate, Mozzarella et Oignons Rouges' }, de: { name: 'Pugliese', description: 'Tomate, Mozzarella und Rote Zwiebeln' } } },
{ id: 'p35', name: '4 Formaggi', description: 'Pomodoro, Mozzarella, Gorgonzola, Fontina e Scaglie di grana (in cottura)', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/4-formaggi-scaled.jpg', isAvailable: true, translations: { en: { name: '4 Cheeses', description: 'Tomato, Mozzarella, Gorgonzola, Fontina and Grana Flakes' }, fr: { name: '4 Fromages', description: 'Tomate, Mozzarella, Gorgonzola, Fontina et Copeaux de Grana' }, de: { name: '4 Käse', description: 'Tomate, Mozzarella, Gorgonzola, Fontina und Grana-Flocken' } } },
{ id: 'p36', name: '4 Stagioni', description: 'Pomodoro, Mozzarella, Funghi champignon, Carciofi e Prosciutto cotto', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/4-STAGIONI-scaled.jpg', isAvailable: true, translations: { en: { name: '4 Seasons', description: 'Tomato, Mozzarella, Champignon Mushrooms, Artichokes and Cooked Ham' }, fr: { name: '4 Saisons', description: 'Tomate, Mozzarella, Champignons, Artichauts et Jambon Cuit' }, de: { name: '4 Jahreszeiten', description: 'Tomate, Mozzarella, Champignons, Artischocken und Gekochter Schinken' } } },
{ id: 'p37', name: 'Ricoperta', description: 'Mozzarella, Prosciutto cotto e Fontina (due pagnottelle)', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/ricoperta-scaled.jpg', isAvailable: true, translations: { en: { name: 'Ricoperta', description: 'Mozzarella, Cooked Ham and Fontina' }, fr: { name: 'Ricoperta', description: 'Mozzarella, Jambon Cuit et Fontina' }, de: { name: 'Ricoperta', description: 'Mozzarella, Gekochter Schinken und Fontina' } } },
{ id: 'p38', name: 'Rinforzata', description: 'Pomodoro, Mozzarella, Salame piccante, Gorgonzola e Cipolle rosse', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/rinforzata-scaled.jpg', isAvailable: true, translations: { en: { name: 'Rinforzata', description: 'Tomato, Mozzarella, Spicy Salami, Gorgonzola and Red Onions' }, fr: { name: 'Rinforzata', description: 'Tomate, Mozzarella, Salami Piquant, Gorgonzola et Oignons Rouges' }, de: { name: 'Rinforzata', description: 'Tomate, Mozzarella, Scharfe Salami, Gorgonzola und Rote Zwiebeln' } } },
{ id: 'p39', name: 'Romana', description: 'Pomodoro, Mozzarella, Acciughe, Capperi e Olive nere', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/romana-scaled.jpg', isAvailable: true, translations: { en: { name: 'Romana', description: 'Tomato, Mozzarella, Anchovies, Capers and Black Olives' }, fr: { name: 'Romana', description: 'Tomate, Mozzarella, Anchois, Câpres et Olives Noires' }, de: { name: 'Romana', description: 'Tomate, Mozzarella, Sardellen, Kapern und Schwarze Oliven' } } },
{ id: 'p40', name: 'Siciliana', description: 'Pomodoro, Acciughe, Capperi e Olive nere', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/SICILIANA.png', isAvailable: true, translations: { en: { name: 'Siciliana', description: 'Tomato, Anchovies, Capers and Black Olives' }, fr: { name: 'Siciliana', description: 'Tomate, Anchois, Câpres et Olives Noires' }, de: { name: 'Siciliana', description: 'Tomate, Sardellen, Kapern und Schwarze Oliven' } } },
{ id: 'p41', name: 'Sioux', description: 'Pomodoro, Mozzarella, Panna e Speck', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/sioux-scaled.jpg', isAvailable: true, translations: { en: { name: 'Sioux', description: 'Tomato, Mozzarella, Cream and Speck' }, fr: { name: 'Sioux', description: 'Tomate, Mozzarella, Crème et Speck' }, de: { name: 'Sioux', description: 'Tomate, Mozzarella, Sahne und Speck' } } },
{ id: 'p42', name: 'Tedesca', description: 'Pomodoro, Mozzarella, Wurstel e Patatine fritte*', price: 10.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/TEDESCA.png', isAvailable: true, translations: { en: { name: 'Tedesca', description: 'Tomato, Mozzarella, Frankfurter and French Fries*' }, fr: { name: 'Tedesca', description: 'Tomate, Mozzarella, Saucisse et Frites*' }, de: { name: 'Tedesca', description: 'Tomate, Mozzarella, Wurst und Pommes Frites*' } } },
{ id: 'p43', name: 'Toro Seduto', description: 'Pomodoro, Mozzarella, Prosciutto cotto, Funghi porcini e Scaglie di grana (fuori cottura)', price: 12.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/toro-scaled.jpg', isAvailable: true, translations: { en: { name: 'Toro Seduto', description: 'Tomato, Mozzarella, Cooked Ham, Porcini Mushrooms and Grana Flakes' }, fr: { name: 'Toro Seduto', description: 'Tomate, Mozzarella, Jambon Cuit, Cèpes et Copeaux de Grana' }, de: { name: 'Toro Seduto', description: 'Tomate, Mozzarella, Gekochter Schinken, Steinpilze und Grana-Flocken' } } },
{ id: 'p44', name: 'Vegetariana', description: 'Pomodoro, Mozzarella, Zucchine e Melanzane grigliate, Pomodorini e Rucola', price: 12.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2018/08/vegetariana.jpg', isAvailable: true, translations: { en: { name: 'Vegetariana', description: 'Tomato, Mozzarella, Grilled Zucchini and Eggplant, Cherry Tomatoes and Arugula' }, fr: { name: 'Vegetariana', description: 'Tomate, Mozzarella, Courgettes et Aubergines Grillées, Tomates Cerises et Roquette' }, de: { name: 'Vegetariana', description: 'Tomate, Mozzarella, Gegrillte Zucchini und Auberginen, Kirschtomaten und Rucola' } } },
{ id: 'p45', name: 'Verdure', description: 'Pomodoro, Mozzarella, Melanzane, Zucchine e Peperoni grigliati', price: 11.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/verdure-scaled.jpg', isAvailable: true, translations: { en: { name: 'Verdure', description: 'Tomato, Mozzarella, Grilled Eggplant, Zucchini and Peppers' }, fr: { name: 'Verdure', description: 'Tomate, Mozzarella, Aubergines, Courgettes et Poivrons Grillés' }, de: { name: 'Verdure', description: 'Tomate, Mozzarella, Gegrillte Auberginen, Zucchini und Paprika' } } },
{ id: 'p46', name: 'Viennese', description: 'Pomodoro, Mozzarella, Gorgonzola, Speck e Rucola', price: 12.00, category: ProductCategory.PIZZA, imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/viennese-scaled.jpg', isAvailable: true, translations: { en: { name: 'Viennese', description: 'Tomato, Mozzarella, Gorgonzola, Speck and Arugula' }, fr: { name: 'Viennese', description: 'Tomate, Mozzarella, Gorgonzola, Speck et Roquette' }, de: { name: 'Viennese', description: 'Tomate, Mozzarella, Gorgonzola, Speck und Rucola' } } },
// --- SECONDI PIATTI ---
{
id: 's1',
name: 'Tagliata di Angus Irlandese',
description: 'Tagliata di pregiato Angus Irlandese servita al piatto. (contorno compreso)',
price: 22.00,
category: ProductCategory.SECONDI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/335-225-tagliata-di-angus.jpg',
isAvailable: true,
translations: {
en: { name: 'Irish Angus Steak', description: 'Fine Irish Angus Steak served plated. (side included)' },
fr: { name: "Tagliata d'Angus Irlandais", description: "Tagliata d'Angus Irlandais servie sur assiette. (accompagnement inclus)" },
de: { name: 'Irisches Angus-Steak', description: 'Feines irisches Angus-Steak auf dem Teller serviert. (Beilage inklusive)' }
}
},
{
id: 's2',
name: 'Tagliata di Abanico Iberico',
description: 'Taglio saporito di suino iberico. (contorno compreso)',
price: 18.00,
category: ProductCategory.SECONDI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2019/11/abanico-iberico.png',
isAvailable: true,
translations: {
en: { name: 'Iberian Abanico Steak', description: 'Tasty cut of Iberian pork. (side included)' },
fr: { name: "Tagliata d'Abanico Ibérique", description: 'Coupe savoureuse de porc ibérique. (accompagnement inclus)' },
de: { name: 'Iberisches Abanico-Steak', description: 'Leckeres Stück vom iberischen Schwein. (Beilage inklusive)' }
}
},
{
id: 's3',
name: 'Tagliata di Bufalo',
description: 'Carne magra e saporita, ricca di ferro. (contorno compreso)',
price: 19.00,
category: ProductCategory.SECONDI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/06/tagliata-di-bufalo-2-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Buffalo Steak', description: 'Lean and tasty meat, rich in iron. (side included)' },
fr: { name: 'Tagliata de Buffle', description: 'Viande maigre et savoureuse, riche en fer. (accompagnement inclus)' },
de: { name: 'Büffel-Steak', description: 'Mageres und schmackhaftes Fleisch, reich an Eisen. (Beilage inklusive)' }
}
},
{
id: 's4',
name: 'Tagliata di Manzo',
description: 'Classica tagliata di manzo selezionato. (contorno compreso)',
price: 18.00,
category: ProductCategory.SECONDI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/Manzo-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Beef Steak', description: 'Classic selected beef steak. (side included)' },
fr: { name: 'Tagliata de Bœuf', description: 'Tagliata classique de bœuf sélectionné. (accompagnement inclus)' },
de: { name: 'Rindersteak', description: 'Klassisches ausgewähltes Rindersteak. (Beilage inklusive)' }
}
},
{
id: 's5',
name: 'Costolette di Agnello',
description: 'Tenere costolette di agnello alla griglia. (contorno compreso)',
price: 16.00,
category: ProductCategory.SECONDI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/costolette.jpg',
isAvailable: true,
translations: {
en: { name: 'Lamb Chops', description: 'Tender grilled lamb chops. (side included)' },
fr: { name: "Côtelettes d'Agneau", description: "Tendres côtelettes d'agneau grillées. (accompagnement inclus)" },
de: { name: 'Lammkoteletts', description: 'Zarte gegrillte Lammkoteletts. (Beilage inklusive)' }
}
},
{
id: 's6',
name: 'Tomahawk',
description: "Prezzo all'etto. (contorno compreso)",
price: 7.00,
category: ProductCategory.SECONDI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2019/11/tomahawk.jpg',
isAvailable: true,
translations: {
en: { name: 'Tomahawk', description: "Price per 100g. (side included)" },
fr: { name: 'Tomahawk', description: "Prix aux 100g. (accompagnement inclus)" },
de: { name: 'Tomahawk', description: "Preis pro 100g. (Beilage inklusive)" }
}
},
{
id: 's7',
name: 'Tagliere Degustazione',
description: '100g Angus, Costolette di agnello, 100g Bufalo, 100g Abanico Iberico, 100g Manzo. (contorno compreso)',
price: 30.00,
category: ProductCategory.SECONDI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/04/TAGLIERE-DEGUSTAZIONE.jpeg',
isAvailable: true,
tags: ['Consigliato'],
translations: {
en: { name: 'Tasting Platter', description: '100g Angus, Lamb Chops, 100g Buffalo, 100g Iberian Abanico, 100g Beef. (side included)' },
fr: { name: 'Planche de Dégustation', description: "100g Angus, Côtelettes d'agneau, 100g Buffle, 100g Abanico Ibérique, 100g Bœuf. (accompagnement inclus)" },
de: { name: 'Verkostungsplatte', description: '100g Angus, Lammkoteletts, 100g Büffel, 100g Iberisches Abanico, 100g Rind. (Beilage inklusive)' }
}
},
// --- PESCE ---
{
id: 'f1',
name: 'Insalata di Mare',
description: 'Code di gamberi, Polpo, Seppia e Cozze',
price: 16.00,
category: ProductCategory.PESCE,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/insala-di-mare.jpg',
isAvailable: true,
translations: {
en: { name: 'Seafood Salad', description: 'Shrimp Tails, Octopus, Cuttlefish and Mussels' },
fr: { name: 'Salade de Fruits de Mer', description: 'Queues de crevettes, Poulpe, Seiche et Moules' },
de: { name: 'Meeresfrüchtesalat', description: 'Garnelenschwänze, Oktopus, Tintenfisch und Muscheln' }
}
},
{
id: 'f2',
name: 'Cocktail di Gamberetti',
description: 'Code di gamberi e Salsa rosa',
price: 14.00,
category: ProductCategory.PESCE,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/cocktail.jpg',
isAvailable: true,
translations: {
en: { name: 'Shrimp Cocktail', description: 'Shrimp Tails and Pink Sauce' },
fr: { name: 'Cocktail de Crevettes', description: 'Queues de crevettes et Sauce Rose' },
de: { name: 'Garnelen-Cocktail', description: 'Garnelenschwänze und Cocktailsauce' }
}
},
{
id: 'f3',
name: 'Fritto Misto',
description: 'Code di gamberi, Anelli di calamari, Ciuffi di calamari e Latterini',
price: 17.00,
category: ProductCategory.PESCE,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/fritto-misto.jpg',
isAvailable: true,
translations: {
en: { name: 'Mixed Fried Seafood', description: 'Shrimp Tails, Calamari Rings, Calamari Tentacles and Whitebait' },
fr: { name: 'Friture Mixte', description: 'Queues de crevettes, Anneaux de calamars, Tentacules de calamars et Friture de poissons' },
de: { name: 'Gemischte Frittierte Meeresfrüchte', description: 'Garnelenschwänze, Tintenfischringe, Tintenfischtentakel und Weißfisch' }
}
},
{
id: 'f4',
name: 'Calamari Fritti',
description: 'Anelli di calamari fritti dorati',
price: 15.00,
category: ProductCategory.PESCE,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/porz-calamari-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Fried Calamari', description: 'Golden fried calamari rings' },
fr: { name: 'Calamars Frits', description: 'Anneaux de calamars frits dorés' },
de: { name: 'Frittierte Tintenfischringe', description: 'Goldgelb frittierte Tintenfischringe' }
}
},
// --- ANTIPASTI E INSALATE ---
{
id: 'a1',
name: 'Tagliere di Affettati',
description: 'Prosciutto crudo, Prosciutto cotto, Coppa',
price: 13.00,
category: ProductCategory.ANTIPASTI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/tagliere-aff.jpg',
isAvailable: true,
translations: {
en: { name: 'Cold Cuts Platter', description: 'Raw Ham, Cooked Ham, Coppa' },
fr: { name: 'Planche de Charcuterie', description: 'Jambon Cru, Jambon Cuit, Coppa' },
de: { name: 'Aufschnittplatte', description: 'Rohschinken, Gekochter Schinken, Coppa' }
}
},
{
id: 'a2',
name: 'Porzione di Gorgonzola',
description: 'Porzione di Gorgonzola servita al piatto.',
price: 7.00,
category: ProductCategory.ANTIPASTI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/porz-zola.jpg',
isAvailable: true,
translations: {
en: { name: 'Gorgonzola Portion', description: 'Portion of Gorgonzola served plated.' },
fr: { name: 'Portion de Gorgonzola', description: 'Portion de Gorgonzola servie sur assiette.' },
de: { name: 'Portion Gorgonzola', description: 'Portion Gorgonzola auf dem Teller serviert.' }
}
},
{
id: 'a3',
name: 'Caprese',
description: 'Mozzarella di bufala 125g, Pomodorini, Olive nere e Rucola',
price: 10.00,
category: ProductCategory.ANTIPASTI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2018/08/caprese-1.jpg',
isAvailable: true,
translations: {
en: { name: 'Caprese', description: 'Buffalo Mozzarella 125g, Cherry Tomatoes, Black Olives and Arugula' },
fr: { name: 'Caprese', description: 'Mozzarella de Buffle 125g, Tomates cerises, Olives noires et Roquette' },
de: { name: 'Caprese', description: 'Büffelmozzarella 125g, Kirschtomaten, Schwarze Oliven und Rucola' }
}
},
{
id: 'a4',
name: 'Grand Salade (Tonno)',
description: 'Insalata verde, Radicchio, Pomodorini, Tonno, Mozzarella di bufala, Olive nere',
price: 10.00,
category: ProductCategory.ANTIPASTI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/20190613_135906-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Grand Salad (Tuna)', description: 'Green Salad, Radicchio, Cherry Tomatoes, Tuna, Buffalo Mozzarella, Black Olives' },
fr: { name: 'Grande Salade (Thon)', description: 'Salade verte, Radicchio, Tomates cerises, Thon, Mozzarella de Buffle, Olives noires' },
de: { name: 'Großer Salat (Thunfisch)', description: 'Grüner Salat, Radicchio, Kirschtomaten, Thunfisch, Büffelmozzarella, Schwarze Oliven' }
}
},
{
id: 'a5',
name: 'Grand Salade (Pollo)',
description: 'Insalata verde, Radicchio, Pomodorini, Pollo, Mozzarella di bufala, Olive nere',
price: 11.00,
category: ProductCategory.ANTIPASTI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/20190613_135906-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Grand Salad (Chicken)', description: 'Green Salad, Radicchio, Cherry Tomatoes, Chicken, Buffalo Mozzarella, Black Olives' },
fr: { name: 'Grande Salade (Poulet)', description: 'Salade verte, Radicchio, Tomates cerises, Poulet, Mozzarella de Buffle, Olives noires' },
de: { name: 'Großer Salat (Hähnchen)', description: 'Grüner Salat, Radicchio, Kirschtomaten, Hähnchen, Büffelmozzarella, Schwarze Oliven' }
}
},
// --- MENU BIMBI ---
{
id: 'b1',
name: 'Cotoletta di Pollo',
description: 'Patatine fritte + Bibita comprese.',
price: 13.00,
category: ProductCategory.BIMBI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/cotoletta-di-pollo.png',
isAvailable: true,
translations: {
en: { name: 'Chicken Cutlet', description: 'French Fries + Drink included.' },
fr: { name: 'Escalope de Poulet', description: 'Frites + Boisson incluses.' },
de: { name: 'Hähnchenschnitzel', description: 'Pommes Frites + Getränk inklusive.' }
}
},
{
id: 'b2',
name: 'Hamburger di Pollo (100g)',
description: 'Patatine fritte + Bibita comprese.',
price: 13.00,
category: ProductCategory.BIMBI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/335-225-menu-bimbi-hamb-polo.jpg',
isAvailable: true,
translations: {
en: { name: 'Chicken Burger (100g)', description: 'French Fries + Drink included.' },
fr: { name: 'Burger de Poulet (100g)', description: 'Frites + Boisson incluses.' },
de: { name: 'Hähnchen Burger (100g)', description: 'Pommes Frites + Getränk inklusive.' }
}
},
{
id: 'b3',
name: 'Hamburger di Bovino (100g)',
description: 'Patatine fritte + Bibita comprese.',
price: 13.00,
category: ProductCategory.BIMBI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/100-BOVINO-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Beef Burger (100g)', description: 'French Fries + Drink included.' },
fr: { name: 'Burger de Bœuf (100g)', description: 'Frites + Boisson incluses.' },
de: { name: 'Rindfleisch Burger (100g)', description: 'Pommes Frites + Getränk inklusive.' }
}
},
{
id: 'b4',
name: 'Nuggets (6 pezzi)',
description: 'Patatine fritte + Bibita comprese.',
price: 13.00,
category: ProductCategory.BIMBI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/nuggets-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Nuggets (6 pieces)', description: 'French Fries + Drink included.' },
fr: { name: 'Nuggets (6 pièces)', description: 'Frites + Boisson incluses.' },
de: { name: 'Nuggets (6 Stück)', description: 'Pommes Frites + Getränk inklusive.' }
}
},
{
id: 'b5',
name: 'Margherita Baby',
description: 'Patatine fritte + Bibita comprese.',
price: 13.00,
category: ProductCategory.BIMBI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/marghe-baby-con-pata.png',
isAvailable: true,
translations: {
en: { name: 'Margherita Baby', description: 'French Fries + Drink included.' },
fr: { name: 'Margherita Baby', description: 'Frites + Boisson incluses.' },
de: { name: 'Margherita Baby', description: 'Pommes Frites + Getränk inklusive.' }
}
},
// --- CONTORNI ---
{
id: 'c1',
name: 'Patatine Fritte',
description: '',
price: 5.00,
category: ProductCategory.CONTORNI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2020/02/CONT-PATA-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'French Fries', description: '' },
fr: { name: 'Frites', description: '' },
de: { name: 'Pommes Frites', description: '' }
}
},
{
id: 'c2',
name: 'Pomodorini',
description: '',
price: 5.00,
category: ProductCategory.CONTORNI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/pomodorini-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Cherry Tomatoes', description: '' },
fr: { name: 'Tomates Cerises', description: '' },
de: { name: 'Kirschtomaten', description: '' }
}
},
{
id: 'c3',
name: 'Fagioli Borlotti con Cipolle Crude',
description: '',
price: 5.00,
category: ProductCategory.CONTORNI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/fagioli-cipole-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Borlotti Beans with Raw Onions', description: '' },
fr: { name: 'Haricots Borlotti aux Oignons Crus', description: '' },
de: { name: 'Borlotti-Bohnen mit Rohen Zwiebeln', description: '' }
}
},
{
id: 'c4',
name: 'Insalata di Lattuga e Radicchio',
description: '',
price: 5.00,
category: ProductCategory.CONTORNI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/LATT-E-RAD-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Lettuce and Radicchio Salad', description: '' },
fr: { name: 'Salade de Laitue et Radicchio', description: '' },
de: { name: 'Salat aus Kopfsalat und Radicchio', description: '' }
}
},
{
id: 'c5',
name: 'Mais e Carote',
description: '',
price: 5.00,
category: ProductCategory.CONTORNI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/carote-mais.jpg',
isAvailable: true,
translations: {
en: { name: 'Corn and Carrots', description: '' },
fr: { name: 'Maïs et Carottes', description: '' },
de: { name: 'Mais und Karotten', description: '' }
}
},
{
id: 'c6',
name: 'Grill di Verdure',
description: 'Melanzane, Zucchine, Peperoni',
price: 5.00,
category: ProductCategory.CONTORNI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/VERD-GRILL-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Grilled Vegetables', description: 'Eggplant, Zucchini, Peppers' },
fr: { name: 'Légumes Grillés', description: 'Aubergines, Courgettes, Poivrons' },
de: { name: 'Gegrilltes Gemüse', description: 'Auberginen, Zucchini, Paprika' }
}
},
// --- DOLCI ---
{
id: 'd1',
name: 'Cannolo Siciliano',
description: 'Con ricotta di bufala',
price: 6.00,
category: ProductCategory.DOLCI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2018/07/IMG-20180612-WA0002-e1539182228140.jpg',
isAvailable: true,
translations: {
en: { name: 'Sicilian Cannolo', description: 'With buffalo ricotta' },
fr: { name: 'Cannolo Sicilien', description: 'À la ricotta de buffle' },
de: { name: 'Sizilianischer Cannolo', description: 'Mit Büffelricotta' }
}
},
{
id: 'd2',
name: 'Panna Cotta',
description: 'Ai frutti di bosco o al caramello',
price: 6.00,
category: ProductCategory.DOLCI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/panna-cotta-fdb-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Panna Cotta', description: 'With wild berries or caramel' },
fr: { name: 'Panna Cotta', description: 'Aux fruits des bois ou au caramel' },
de: { name: 'Panna Cotta', description: 'Mit Waldbeeren oder Karamell' }
}
},
{
id: 'd3',
name: 'Tiramisù',
description: '',
price: 6.00,
category: ProductCategory.DOLCI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/tiramisu-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Tiramisù', description: '' },
fr: { name: 'Tiramisù', description: '' },
de: { name: 'Tiramisù', description: '' }
}
},
{
id: 'd4',
name: 'Tortino',
description: '"Cuore di cioccolato" nero',
price: 6.00,
category: ProductCategory.DOLCI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/Tortino-cuore-bianco-scaled.jpg',
isAvailable: true,
translations: {
en: { name: 'Chocolate Cake', description: 'Dark chocolate "heart"' },
fr: { name: 'Fondant au Chocolat', description: '"Cœur" au chocolat noir' },
de: { name: 'Schokoladenküchlein', description: 'Schwarzes "Schokoladenherz"' }
}
},
{
id: 'd5',
name: 'Tortino',
description: '"Cuore di cioccolato" bianco',
price: 6.00,
category: ProductCategory.DOLCI,
imageUrl: 'https://oldwest.click/wp-content/uploads/2025/11/335-225-tortino-cuore-di-cioccolato-bianco.jpg',
isAvailable: true,
translations: {
en: { name: 'Chocolate Cake', description: 'White chocolate "heart"' },
fr: { name: 'Fondant au Chocolat', description: '"Cœur" au chocolat blanc' },
de: { name: 'Schokoladenküchlein', description: 'Weißes "Schokoladenherz"' }
}
}
];
export const CATEGORIES_LIST = Object.values(ProductCategory);