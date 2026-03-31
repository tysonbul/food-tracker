import { FoodCategory, FoodItem } from '../types'

interface FoodGroup {
  category: FoodCategory
  label: string
  emoji: string
  items: string[]
}

export const FOOD_GROUPS: FoodGroup[] = [
  {
    category: 'fruit',
    label: 'Fruits',
    emoji: '🍎',
    items: [
      'Apple', 'Apricot', 'Avocado', 'Banana', 'Blackberry', 'Blueberry',
      'Boysenberry', 'Cantaloupe', 'Cherry', 'Clementine', 'Coconut',
      'Cranberry', 'Date', 'Dragon Fruit', 'Fig', 'Goji Berry', 'Grape',
      'Grapefruit', 'Guava', 'Honeydew', 'Jackfruit', 'Kiwi', 'Kumquat',
      'Lemon', 'Lime', 'Lychee', 'Mandarin', 'Mango', 'Mulberry',
      'Nectarine', 'Olive', 'Orange', 'Papaya', 'Passion Fruit', 'Peach',
      'Pear', 'Persimmon', 'Pineapple', 'Plantain', 'Plum', 'Pomegranate',
      'Raspberry', 'Rhubarb', 'Star Fruit', 'Strawberry', 'Tamarind',
      'Tangerine', 'Tomato', 'Watermelon', 'Acai Berry', 'Blood Orange',
      'Cactus Pear', 'Cherimoya', 'Elderberry', 'Feijoa', 'Gooseberry',
      'Lingonberry', 'Longan', 'Loquat', 'Marionberry', 'Miracle Fruit',
      'Passionfruit', 'Quince', 'Rambutan', 'Sapodilla', 'Soursop',
      'Ugli Fruit',
    ],
  },
  {
    category: 'vegetable',
    label: 'Vegetables',
    emoji: '🥦',
    items: [
      'Artichoke', 'Arugula', 'Asparagus', 'Beetroot', 'Bell Pepper (Green)',
      'Bell Pepper (Red)', 'Bell Pepper (Yellow)', 'Bell Pepper (Orange)',
      'Bok Choy', 'Broccoli', 'Broccolini', 'Brussels Sprout', 'Cabbage (Green)',
      'Cabbage (Red)', 'Carrot', 'Cauliflower', 'Celery', 'Chard',
      'Collard Greens', 'Corn', 'Cucumber', 'Daikon', 'Eggplant', 'Endive',
      'Fennel', 'Garlic', 'Ginger', 'Green Bean', 'Green Onion', 'Jicama',
      'Kale', 'Kohlrabi', 'Leek', 'Lettuce (Romaine)', 'Lettuce (Iceberg)',
      'Lettuce (Butter)', 'Mushroom (Button)', 'Mushroom (Shiitake)',
      'Mushroom (Portobello)', 'Mushroom (Oyster)', 'Mushroom (Cremini)',
      'Mushroom (Enoki)', 'Mushroom (King Oyster)', 'Mushroom (Maitake)',
      'Okra', 'Onion (White)', 'Onion (Red)', 'Onion (Yellow)', 'Parsnip',
      'Pea', 'Potato', 'Pumpkin', 'Radicchio', 'Radish', 'Rutabaga',
      'Shallot', 'Snow Pea', 'Spinach', 'Squash (Butternut)',
      'Squash (Acorn)', 'Squash (Spaghetti)', 'Squash (Delicata)',
      'Sugar Snap Pea', 'Sweet Potato', 'Turnip', 'Watercress', 'Yam',
      'Zucchini', 'Bamboo Shoot', 'Bean Sprout', 'Cassava', 'Celeriac',
      'Chayote', 'Chinese Broccoli', 'Dulse', 'Edamame', 'Hearts of Palm',
      'Horseradish', 'Jalapeño', 'Kelp', 'Lotus Root', 'Napa Cabbage',
      'Nori', 'Poblano Pepper', 'Rapini', 'Serrano Pepper', 'Taro',
      'Tomatillo', 'Wakame', 'Wasabi', 'Water Chestnut',
    ],
  },
  {
    category: 'grain',
    label: 'Whole Grains',
    emoji: '🌾',
    items: [
      'Amaranth', 'Barley', 'Brown Rice', 'Buckwheat', 'Bulgur', 'Cornmeal',
      'Couscous (Whole Wheat)', 'Einkorn', 'Emmer', 'Farro', 'Freekeh',
      'Kamut', 'Millet', 'Oats', 'Polenta', 'Quinoa', 'Red Rice', 'Rye',
      'Sorghum', 'Spelt', 'Teff', 'Triticale', 'Wheat Berries',
      'Wild Rice', 'Black Rice', 'Whole Wheat Bread', 'Whole Wheat Pasta',
      'Popcorn',
    ],
  },
  {
    category: 'legume',
    label: 'Legumes & Pulses',
    emoji: '🫘',
    items: [
      'Black Bean', 'Black-Eyed Pea', 'Broad Bean (Fava)', 'Butter Bean',
      'Cannellini Bean', 'Chickpea', 'Edamame', 'Great Northern Bean',
      'Green Lentil', 'Red Lentil', 'Brown Lentil', 'Black Lentil',
      'French Lentil', 'Kidney Bean', 'Lima Bean', 'Mung Bean', 'Navy Bean',
      'Peanut', 'Pinto Bean', 'Snow Pea', 'Soybean', 'Split Pea (Green)',
      'Split Pea (Yellow)', 'Tofu', 'Tempeh', 'Adzuki Bean', 'Carob',
      'Lupini Bean',
    ],
  },
  {
    category: 'nut',
    label: 'Nuts',
    emoji: '🥜',
    items: [
      'Almond', 'Brazil Nut', 'Cashew', 'Chestnut', 'Hazelnut', 'Macadamia',
      'Pecan', 'Pine Nut', 'Pistachio', 'Walnut', 'Coconut',
    ],
  },
  {
    category: 'seed',
    label: 'Seeds',
    emoji: '🌻',
    items: [
      'Chia Seed', 'Flax Seed', 'Hemp Seed', 'Poppy Seed', 'Pumpkin Seed',
      'Sesame Seed', 'Sunflower Seed', 'Caraway Seed', 'Nigella Seed',
      'Pomegranate Seed', 'Watermelon Seed', 'Sacha Inchi',
    ],
  },
  {
    category: 'herb_spice',
    label: 'Herbs & Spices',
    emoji: '🌿',
    items: [
      'Basil', 'Bay Leaf', 'Black Pepper', 'Cardamom', 'Cayenne', 'Chili Flakes',
      'Chive', 'Cilantro', 'Cinnamon', 'Clove', 'Coriander', 'Cumin',
      'Dill', 'Fennel Seed', 'Fenugreek', 'Galangal', 'Garlic Powder',
      'Ginger (Ground)', 'Lemongrass', 'Marjoram', 'Mint', 'Mustard Seed',
      'Nutmeg', 'Onion Powder', 'Oregano', 'Paprika', 'Parsley',
      'Rosemary', 'Saffron', 'Sage', 'Star Anise', 'Sumac', 'Tarragon',
      'Thyme', 'Turmeric', 'Vanilla', 'White Pepper', 'Za\'atar',
      'Allspice', 'Anise', 'Celery Seed', 'Curry Leaf', 'Epazote',
      'Herbes de Provence', 'Juniper Berry', 'Lavender', 'Mace',
      'Szechuan Pepper',
    ],
  },
  {
    category: 'other_plant',
    label: 'Other Plant Foods',
    emoji: '🍵',
    items: [
      'Black Tea', 'Green Tea', 'Herbal Tea', 'White Tea', 'Oolong Tea',
      'Coffee', 'Dark Chocolate (70%+)', 'Cacao Nibs', 'Cacao Powder',
      'Matcha', 'Cocoa Powder', 'Maple Syrup', 'Agave',
    ],
  },
  {
    category: 'fermented',
    label: 'Fermented Foods',
    emoji: '🫙',
    items: [
      'Kimchi', 'Sauerkraut', 'Miso', 'Kombucha', 'Kefir (Plant-Based)',
      'Yogurt (Plant-Based)', 'Natto', 'Pickles (Naturally Fermented)',
      'Apple Cider Vinegar', 'Sourdough',
    ],
  },
]

/** Flat list of all built-in foods */
export const ALL_FOODS: FoodItem[] = FOOD_GROUPS.flatMap((group) =>
  group.items.map((name) => ({
    name,
    category: group.category,
  })),
)

/** Category metadata for display */
export const CATEGORY_META: Record<FoodCategory, { label: string; emoji: string }> = {
  fruit: { label: 'Fruits', emoji: '🍎' },
  vegetable: { label: 'Vegetables', emoji: '🥦' },
  grain: { label: 'Whole Grains', emoji: '🌾' },
  legume: { label: 'Legumes', emoji: '🫘' },
  nut: { label: 'Nuts', emoji: '🥜' },
  seed: { label: 'Seeds', emoji: '🌻' },
  herb_spice: { label: 'Herbs & Spices', emoji: '🌿' },
  other_plant: { label: 'Other Plants', emoji: '🍵' },
  fermented: { label: 'Fermented', emoji: '🫙' },
}

/** Ordered category keys for consistent display */
export const CATEGORY_ORDER: FoodCategory[] = [
  'fruit', 'vegetable', 'grain', 'legume', 'nut', 'seed',
  'herb_spice', 'other_plant', 'fermented',
]
