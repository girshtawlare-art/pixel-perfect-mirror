export type Category = { slug: string; name: string; emoji: string; tint: string; subs: string[] };

// tint = gradient classes built from design tokens-friendly palette via inline style
export const categories: Category[] = [
  { slug: "fruits-vegetables", name: "Fruits & Vegetables", emoji: "🥦", tint: "#E6F7E9,#C8EFCF", subs: ["Fresh Fruits", "Fresh Vegetables", "Herbs"] },
  { slug: "dairy-eggs", name: "Dairy & Eggs", emoji: "🥛", tint: "#EAF3FF,#D2E6FF", subs: ["Milk", "Curd & Paneer", "Eggs", "Butter & Cheese"] },
  { slug: "snacks", name: "Snacks", emoji: "🍿", tint: "#FFF3DC,#FFE2A8", subs: ["Chips", "Namkeen", "Biscuits", "Chocolates"] },
  { slug: "beverages", name: "Beverages", emoji: "🧃", tint: "#FFE9E4,#FFD0C4", subs: ["Juices", "Soft Drinks", "Tea & Coffee"] },
  { slug: "atta-rice", name: "Atta & Rice", emoji: "🌾", tint: "#FBF1E1,#F2DDB6", subs: ["Atta", "Rice", "Dals"] },
  { slug: "masala-oil", name: "Masala & Oil", emoji: "🌶️", tint: "#FFE7E0,#FFC9B8", subs: ["Masalas", "Oils & Ghee"] },
  { slug: "bakery", name: "Bakery", emoji: "🥐", tint: "#FFF1E0,#FCDDB7", subs: ["Bread", "Cakes & Buns"] },
  { slug: "personal-care", name: "Personal Care", emoji: "🧴", tint: "#F3ECFF,#E0D2FF", subs: ["Bath", "Hair", "Oral Care"] },
  { slug: "cleaning", name: "Cleaning", emoji: "🧽", tint: "#E3F8F6,#C2EEE9", subs: ["Detergents", "Surface Cleaners"] },
  { slug: "baby-care", name: "Baby Care", emoji: "🍼", tint: "#FFEAF3,#FFD1E5", subs: ["Diapers", "Baby Food"] },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
