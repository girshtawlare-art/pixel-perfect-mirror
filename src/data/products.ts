export type Diet = "vegan" | "keto" | "high-protein" | "gluten-free" | "low-sugar";
export type Product = {
  id: string; name: string; emoji: string; category: string; sub: string; brand: string;
  weight: string; price: number; mrp: number; diets: Diet[]; eta: number; rating: number;
  variants: { label: string; mult: number }[];
  nutrition: { kcal: number; protein: number; carbs: number; fat: number };
};

type Row = [name: string, emoji: string, sub: string, brand: string, weight: string, price: number, mrp: number, diets: Diet[]];

const V: Diet = "vegan", K: Diet = "keto", P: Diet = "high-protein", G: Diet = "gluten-free", L: Diet = "low-sugar";

const raw: Record<string, Row[]> = {
  "fruits-vegetables": [
    ["Banana Robusta", "🍌", "Fresh Fruits", "FreshFarm", "6 pcs", 42, 55, [V, G]],
    ["Shimla Apple", "🍎", "Fresh Fruits", "FreshFarm", "4 pcs", 129, 160, [V, G]],
    ["Tomato Hybrid", "🍅", "Fresh Vegetables", "FreshFarm", "500 g", 24, 35, [V, G, K, L]],
    ["Onion", "🧅", "Fresh Vegetables", "FreshFarm", "1 kg", 38, 50, [V, G, L]],
    ["Potato", "🥔", "Fresh Vegetables", "FreshFarm", "1 kg", 32, 42, [V, G]],
    ["Avocado Hass", "🥑", "Fresh Fruits", "Exotica", "1 pc", 149, 199, [V, G, K, L]],
    ["Broccoli", "🥦", "Fresh Vegetables", "Exotica", "250 g", 59, 80, [V, G, K, L, P]],
    ["Coriander Bunch", "🌿", "Herbs", "FreshFarm", "100 g", 12, 20, [V, G, K, L]],
    ["Green Chilli", "🌶️", "Fresh Vegetables", "FreshFarm", "100 g", 10, 15, [V, G, K, L]],
    ["Ginger Garlic Pack", "🧄", "Herbs", "FreshFarm", "200 g", 36, 48, [V, G, K, L]],
    ["Lemon", "🍋", "Fresh Fruits", "FreshFarm", "4 pcs", 25, 32, [V, G, K, L]],
  ],
  "dairy-eggs": [
    ["Toned Milk", "🥛", "Milk", "Amul", "500 ml", 28, 30, [G]],
    ["Malai Paneer", "🧀", "Curd & Paneer", "Amul", "200 g", 95, 110, [G, K, P, L]],
    ["Fresh Curd", "🥣", "Curd & Paneer", "Mother Dairy", "400 g", 45, 50, [G, P]],
    ["Farm Eggs", "🥚", "Eggs", "EggHub", "6 pcs", 54, 66, [G, K, P, L]],
    ["Salted Butter", "🧈", "Butter & Cheese", "Amul", "100 g", 58, 62, [G, K]],
    ["Cheese Slices", "🧀", "Butter & Cheese", "Britannia", "200 g", 139, 155, [G, K, P]],
    ["Greek Yogurt", "🍶", "Curd & Paneer", "Epigamia", "90 g", 55, 65, [G, P, L]],
    ["Fresh Cream", "🥛", "Milk", "Amul", "250 ml", 69, 75, [G, K]],
  ],
  snacks: [
    ["Classic Salted Chips", "🥔", "Chips", "Lay's", "52 g", 20, 20, [V]],
    ["Masala Munch", "🌶️", "Chips", "Kurkure", "90 g", 30, 35, [V]],
    ["Bhujia Sev", "🥨", "Namkeen", "Haldiram's", "200 g", 55, 65, [V]],
    ["Digestive Biscuits", "🍪", "Biscuits", "McVitie's", "250 g", 60, 75, []],
    ["Dark Chocolate 70%", "🍫", "Chocolates", "Amul", "150 g", 110, 125, [V, G, L]],
    ["Roasted Almonds", "🌰", "Namkeen", "Happilo", "200 g", 249, 349, [V, G, K, P, L]],
    ["Popcorn Butter", "🍿", "Chips", "Act II", "70 g", 35, 40, [G]],
    ["Protein Bar", "🍫", "Chocolates", "RiteBite", "50 g", 60, 70, [P]],
  ],
  beverages: [
    ["Orange Juice", "🧃", "Juices", "Real", "1 L", 115, 130, [V, G]],
    ["Cola Can", "🥤", "Soft Drinks", "FizzUp", "300 ml", 40, 40, [V, G]],
    ["Coconut Water", "🥥", "Juices", "Paper Boat", "200 ml", 45, 50, [V, G, L]],
    ["Green Tea", "🍵", "Tea & Coffee", "Tetley", "25 bags", 155, 180, [V, G, K, L]],
    ["Instant Coffee", "☕", "Tea & Coffee", "Nescafe", "50 g", 175, 190, [V, G, K, L]],
    ["Assam Tea", "🫖", "Tea & Coffee", "Tata Tea", "250 g", 140, 160, [V, G, K, L]],
    ["Cold Coffee", "🧋", "Soft Drinks", "Sleepy Owl", "200 ml", 65, 75, [G]],
  ],
  "atta-rice": [
    ["Whole Wheat Atta", "🌾", "Atta", "Aashirvaad", "5 kg", 245, 290, [V]],
    ["Basmati Rice", "🍚", "Rice", "India Gate", "1 kg", 139, 175, [V, G]],
    ["Toor Dal", "🫘", "Dals", "Tata Sampann", "1 kg", 165, 199, [V, G, P]],
    ["Moong Dal", "🫘", "Dals", "Tata Sampann", "500 g", 89, 110, [V, G, P]],
    ["Rolled Oats", "🥣", "Atta", "Saffola", "1 kg", 185, 220, [V, P, L]],
    ["Quinoa", "🌾", "Rice", "True Elements", "500 g", 229, 299, [V, G, P, L]],
  ],
  "masala-oil": [
    ["Garam Masala", "🌶️", "Masalas", "Everest", "100 g", 78, 85, [V, G, K, L]],
    ["Kashmiri Chilli Powder", "🌶️", "Masalas", "MDH", "100 g", 62, 70, [V, G, K, L]],
    ["Turmeric Powder", "🟡", "Masalas", "Everest", "100 g", 35, 40, [V, G, K, L]],
    ["Kasuri Methi", "🌿", "Masalas", "MDH", "25 g", 30, 35, [V, G, K, L]],
    ["Sunflower Oil", "🫙", "Oils & Ghee", "Fortune", "1 L", 145, 175, [V, G, K]],
    ["Desi Ghee", "🧈", "Oils & Ghee", "Amul", "500 ml", 315, 340, [G, K]],
    ["Extra Virgin Olive Oil", "🫒", "Oils & Ghee", "Figaro", "500 ml", 549, 699, [V, G, K, L]],
    ["Pasta Sauce Arrabbiata", "🍅", "Masalas", "Sacla", "300 g", 199, 250, [V]],
  ],
  bakery: [
    ["Brown Bread", "🍞", "Bread", "Harvest Gold", "400 g", 50, 55, [V]],
    ["Multigrain Bread", "🍞", "Bread", "The Baker's Dozen", "400 g", 75, 85, [V, P]],
    ["Butter Croissant", "🥐", "Cakes & Buns", "Theobroma", "2 pcs", 120, 140, []],
    ["Burger Buns", "🍔", "Cakes & Buns", "Harvest Gold", "4 pcs", 45, 50, [V]],
    ["Penne Pasta", "🍝", "Bread", "Del Monte", "500 g", 115, 140, [V]],
    ["Chocolate Muffin", "🧁", "Cakes & Buns", "Britannia", "2 pcs", 60, 70, []],
  ],
  "personal-care": [
    ["Aloe Body Wash", "🧴", "Bath", "Dove", "250 ml", 229, 275, []],
    ["Anti-Dandruff Shampoo", "🧴", "Hair", "Head & Shoulders", "340 ml", 339, 399, []],
    ["Herbal Toothpaste", "🪥", "Oral Care", "Dabur", "150 g", 95, 110, [V]],
    ["Neem Soap", "🧼", "Bath", "Himalaya", "4 x 75 g", 145, 170, [V]],
    ["Hair Oil Coconut", "🥥", "Hair", "Parachute", "300 ml", 135, 150, [V]],
  ],
  cleaning: [
    ["Liquid Detergent", "🧺", "Detergents", "Surf Excel", "1 L", 219, 260, []],
    ["Dishwash Gel", "🧽", "Surface Cleaners", "Vim", "500 ml", 105, 120, []],
    ["Floor Cleaner", "🧹", "Surface Cleaners", "Lizol", "975 ml", 199, 239, []],
    ["Garbage Bags", "🗑️", "Surface Cleaners", "Ezee", "30 pcs", 99, 120, []],
    ["Toilet Cleaner", "🚽", "Surface Cleaners", "Harpic", "500 ml", 95, 110, []],
  ],
  "baby-care": [
    ["Baby Diapers M", "🍼", "Diapers", "Pampers", "20 pcs", 399, 499, []],
    ["Baby Wipes", "🧻", "Diapers", "Himalaya", "72 pcs", 149, 199, []],
    ["Cerelac Wheat Apple", "🥣", "Baby Food", "Nestle", "300 g", 245, 270, []],
    ["Baby Lotion", "🧴", "Diapers", "Johnson's", "200 ml", 199, 235, []],
  ],
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const products: Product[] = Object.entries(raw).flatMap(([category, rows]) =>
  rows.map(([name, emoji, sub, brand, weight, price, mrp, diets], i) => {
    const seed = name.length * 7 + i * 13;
    return {
      id: slugify(`${brand}-${name}`),
      name, emoji, category, sub, brand, weight, price, mrp, diets,
      eta: 8 + (seed % 5),
      rating: 3.9 + ((seed % 11) / 10) * 1,
      variants: [
        { label: weight, mult: 1 },
        { label: `2 x ${weight}`, mult: 1.9 },
        { label: `4 x ${weight}`, mult: 3.6 },
      ],
      nutrition: { kcal: 40 + (seed % 380), protein: seed % 22, carbs: (seed * 3) % 60, fat: (seed * 2) % 25 },
    };
  }),
);

export const productById = (id: string) => products.find((p) => p.id === id);
export const findByName = (q: string) => products.find((p) => p.name.toLowerCase().includes(q.toLowerCase()));
