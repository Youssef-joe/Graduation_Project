const mongoose = require("mongoose");
const Menu = require("../models/menuModel.js");
require("dotenv").config();

const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bliss_rest";

const menuItems = [
  // Breakfast Items
  {
    title: "Classic Eggs Benedict",
    description:
      "Poached eggs and Canadian bacon on English muffins, topped with hollandaise sauce",
    price: 14.99,
    category: "Breakfast",
    imageSrc:
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
  {
    title: "Avocado Toast",
    description:
      "Sourdough bread topped with mashed avocado, poached eggs, and cherry tomatoes",
    price: 12.99,
    category: "Breakfast",
    imageSrc:
      "https://images.unsplash.com/photo-1603046891744-1f76eb10aec1?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
  {
    title: "Blueberry Pancakes",
    description:
      "Fluffy pancakes loaded with fresh blueberries, served with maple syrup",
    price: 11.99,
    category: "Breakfast",
    imageSrc:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600",
    isAvailable: true,
  },

  // Main Dishes
  {
    title: "Grilled Salmon",
    description:
      "Fresh Atlantic salmon with lemon herb butter, served with roasted vegetables",
    price: 24.99,
    category: "MainDishes",
    imageSrc:
      "https://images.unsplash.com/photo-1567189022371-cc754891cdc9?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
  {
    title: "Beef Tenderloin",
    description:
      "8oz beef tenderloin with red wine reduction, served with mashed potatoes",
    price: 29.99,
    category: "MainDishes",
    imageSrc:
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
  {
    title: "Mushroom Risotto",
    description: "Creamy Arborio rice with wild mushrooms and parmesan cheese",
    price: 18.99,
    category: "MainDishes",
    imageSrc:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600",
    isAvailable: true,
  },

  // Drinks
  {
    title: "Signature Mojito",
    description: "Fresh mint, lime, rum, and soda water",
    price: 9.99,
    category: "Drinks",
    imageSrc:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
  {
    title: "Artisanal Coffee",
    description: "Locally roasted coffee beans, served hot or iced",
    price: 4.99,
    category: "Drinks",
    imageSrc:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
  {
    title: "Fresh Berry Smoothie",
    description: "Mixed berries, yogurt, and honey blend",
    price: 6.99,
    category: "Drinks",
    imageSrc:
      "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600",
    isAvailable: true,
  },

  // Desserts
  {
    title: "Chocolate Lava Cake",
    description:
      "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 8.99,
    category: "Desserts",
    imageSrc:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
  {
    title: "New York Cheesecake",
    description: "Classic cheesecake with berry compote",
    price: 7.99,
    category: "Desserts",
    imageSrc:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
  {
    title: "Tiramisu",
    description: "Italian coffee-flavored dessert with mascarpone cream",
    price: 8.99,
    category: "Desserts",
    imageSrc:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600",
    isAvailable: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");

    // Clear existing menu items
    await Menu.deleteMany({});
    console.log("Cleared existing menu items");

    // Insert new menu items
    await Menu.insertMany(menuItems);
    console.log("Successfully seeded menu items");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
