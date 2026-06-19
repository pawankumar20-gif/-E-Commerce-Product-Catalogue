import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ─── Mock Data ────────────────────────────────────────────────────────────────

const originalMockProducts = [
  { id: 1, title: "iPhone 15 Pro Max", description: "Latest flagship smartphone with A17 Pro chip, titanium design and 48MP camera system.", price: 134900, originalPrice: 149900, brand: "Apple", category: "Electronics", subcategory: "Mobiles", rating: 4.8, ratingCount: 2841, color: "Space Black", size: "6.7 inches", image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400", stock: 25 },
  { id: 2, title: "Samsung Galaxy S24 Ultra", description: "Premium Android phone with S-Pen, 200MP camera and AI features.", price: 109999, originalPrice: 124999, brand: "Samsung", category: "Electronics", subcategory: "Mobiles", rating: 4.7, ratingCount: 1923, color: "Titanium Gray", size: "6.8 inches", image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400", stock: 30 },
  { id: 3, title: "MacBook Pro 16 M3 Pro", description: "Powerful laptop for professionals with M3 Pro chip, 18-hour battery life.", price: 249900, originalPrice: 269900, brand: "Apple", category: "Electronics", subcategory: "Laptops", rating: 4.9, ratingCount: 1204, color: "Space Gray", size: "16 inch", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", stock: 15 },
  { id: 4, title: "Sony WH-1000XM5 Headphones", description: "Industry-leading noise cancelling wireless headphones with 30hr battery.", price: 29990, originalPrice: 34990, brand: "Sony", category: "Electronics", subcategory: "Audio", rating: 4.6, ratingCount: 3102, color: "Black", size: "One Size", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", stock: 40 },
  { id: 5, title: "Apple Watch Series 9", description: "Advanced health sensors, crash detection and double-tap gesture.", price: 41900, originalPrice: 45900, brand: "Apple", category: "Electronics", subcategory: "Smart Watches", rating: 4.7, ratingCount: 987, color: "Silver", size: "45mm", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400", stock: 35 },
  { id: 6, title: "Dell XPS 15 Laptop", description: "OLED display, Intel Core i9, 32GB RAM, professional performance.", price: 185000, originalPrice: 199000, brand: "Dell", category: "Electronics", subcategory: "Laptops", rating: 4.5, ratingCount: 762, color: "Platinum Silver", size: "15.6 inch", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400", stock: 18 },
  { id: 7, title: "iPad Pro 12.9 M2", description: "Liquid Retina XDR display, M2 chip, with Apple Pencil support.", price: 112900, originalPrice: 119900, brand: "Apple", category: "Electronics", subcategory: "Tablets", rating: 4.8, ratingCount: 534, color: "Space Gray", size: "12.9 inch", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", stock: 22 },
  { id: 8, title: "Nike Air Max 270", description: "Iconic Air cushioning with breathable mesh upper for all-day comfort.", price: 9995, originalPrice: 12995, brand: "Nike", category: "Fashion", subcategory: "Men", rating: 4.5, ratingCount: 4210, color: "White/Black", size: "10", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", stock: 50 },
  { id: 9, title: "Adidas Ultraboost 23", description: "Responsive Boost midsole returns energy with every stride.", price: 14999, originalPrice: 18999, brand: "Adidas", category: "Fashion", subcategory: "Women", rating: 4.6, ratingCount: 2890, color: "Pink/White", size: "7", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400", stock: 45 },
  { id: 10, title: "Levi's 511 Slim Fit Jeans", description: "Classic slim fit, sits below waist with a slim leg from hip to ankle.", price: 3999, originalPrice: 5999, brand: "Levis", category: "Fashion", subcategory: "Men", rating: 4.4, ratingCount: 6741, color: "Dark Blue", size: "32x32", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", stock: 80 },
  { id: 11, title: "Winter Puffer Jacket", description: "Warm, water-resistant puffer jacket with down insulation for cold weather.", price: 6999, originalPrice: 9999, brand: "Columbia", category: "Fashion", subcategory: "Men", rating: 4.6, ratingCount: 1230, color: "Navy Blue", size: "M", image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400", stock: 55 },
  { id: 12, title: "Floral Summer Dress", description: "Lightweight floral print midi dress perfect for summer outings.", price: 1999, originalPrice: 3499, brand: "Zara", category: "Fashion", subcategory: "Women", rating: 4.3, ratingCount: 892, color: "Multi", size: "S", image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400", stock: 65 },
  { id: 13, title: "IKEA EKTORP Sofa 3-seat", description: "Timeless design with washable covers in durable cotton blend fabric.", price: 42999, originalPrice: 49999, brand: "IKEA", category: "Home", subcategory: "Furniture", rating: 4.4, ratingCount: 2105, color: "Beige", size: "3 Seater", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", stock: 12 },
  { id: 14, title: "LG 55 inch 4K OLED TV", description: "Stunning OLED display with Dolby Vision IQ and webOS Smart platform.", price: 89990, originalPrice: 109990, brand: "LG", category: "Home", subcategory: "Electronics", rating: 4.7, ratingCount: 1432, color: "Black", size: "55 inch", image: "https://images.unsplash.com/photo-1593642632823-8f78f9d82d17?w=400", stock: 20 },
  { id: 15, title: "Philips Espresso Machine", description: "Fully automatic espresso machine with milk frother and 15-bar pressure.", price: 24999, originalPrice: 34999, brand: "Philips", category: "Home", subcategory: "Kitchen", rating: 4.5, ratingCount: 876, color: "Stainless Steel", size: "Medium", image: "https://images.unsplash.com/photo-1447933601403-0c6688bcad0f?w=400", stock: 28 },
  { id: 16, title: "Dyson V15 Detect Vacuum", description: "Laser reveals hidden dust, powerful suction with intelligent power adjustment.", price: 59900, originalPrice: 66900, brand: "Dyson", category: "Home", subcategory: "Appliances", rating: 4.8, ratingCount: 2341, color: "Yellow/Nickel", size: "Standard", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", stock: 17 },
  { id: 17, title: "Wooden Dining Table 6-Seat", description: "Solid mango wood dining table with natural finish, seats 6 comfortably.", price: 32999, originalPrice: 42999, brand: "IKEA", category: "Home", subcategory: "Furniture", rating: 4.3, ratingCount: 458, color: "Natural Wood", size: "180x90 cm", image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400", stock: 8 },
  { id: 18, title: "OnePlus 12 5G", description: "Hasselblad camera, Snapdragon 8 Gen 3, 100W fast charging.", price: 64999, originalPrice: 69999, brand: "OnePlus", category: "Electronics", subcategory: "Mobiles", rating: 4.5, ratingCount: 1567, color: "Silky Black", size: "6.82 inches", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400", stock: 38 },
  { id: 19, title: "Puma RS-X Running Shoes", description: "Retro-inspired chunky sneakers with RS foam cushioning technology.", price: 7999, originalPrice: 10999, brand: "Puma", category: "Fashion", subcategory: "Women", rating: 4.4, ratingCount: 1890, color: "White/Blue", size: "6", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400", stock: 42 },
  { id: 20, title: "Bosch Mixer Grinder", description: "800W motor, 3 stainless steel jars, rust-proof blades for Indian cooking.", price: 4499, originalPrice: 6299, brand: "Bosch", category: "Home", subcategory: "Kitchen", rating: 4.6, ratingCount: 7823, color: "White", size: "800W", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400", stock: 60 },
  { id: 21, title: "Premium Cotton Oxford Shirt", description: "Classic fit oxford button-down shirt made from breathable organic cotton.", price: 2999, originalPrice: 3999, brand: "Tommy Hilfiger", category: "Fashion", subcategory: "Men", rating: 4.7, ratingCount: 842, color: "Light Blue", size: "L", image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400", stock: 120 },
  { id: 22, title: "Classic Chino Trousers", description: "Comfortable stretch chinos perfect for casual and semi-formal wear.", price: 2499, originalPrice: 3499, brand: "Gap", category: "Fashion", subcategory: "Men", rating: 4.5, ratingCount: 1105, color: "Khaki", size: "32x32", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400", stock: 85 },
  { id: 23, title: "Kids Denim Jacket", description: "Durable and stylish denim jacket for toddlers and kids.", price: 1999, originalPrice: 2499, brand: "Levi's", category: "Fashion", subcategory: "Kids", rating: 4.8, ratingCount: 320, color: "Blue", size: "5-6 Years", image: "https://images.unsplash.com/photo-1519238263530-99bad114f082?w=400", stock: 45 },
  { id: 24, title: "Cotton Graphic T-Shirt", description: "Soft 100% cotton t-shirt with playful graphic print.", price: 799, originalPrice: 999, brand: "Carter's", category: "Fashion", subcategory: "Kids", rating: 4.6, ratingCount: 512, color: "Yellow", size: "3-4 Years", image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=400", stock: 200 },
  { id: 25, title: "Modern Velvet Armchair", description: "Elegant mid-century modern accent chair upholstered in premium velvet.", price: 15999, originalPrice: 19999, brand: "West Elm", category: "Home", subcategory: "Furniture", rating: 4.9, ratingCount: 185, color: "Emerald Green", size: "Standard", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400", stock: 15 },
  { id: 26, title: "Minimalist Coffee Table", description: "Sleek wooden coffee table with a modern minimalist design.", price: 8999, originalPrice: 12999, brand: "IKEA", category: "Home", subcategory: "Furniture", rating: 4.4, ratingCount: 632, color: "Light Oak", size: "110x60 cm", image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400", stock: 30 }
];

const userAddedPhones = [
  "Google pixel 10 pro XL-256gb.webp",
  "Google pixel 10 pro-256gb.webp",
  "Google pixel 10a-256gb.jpg",
  "Google pixel 9a-256gb.jpg",
  "Google pixel 9pro-256gb.webp",
  "Iphone 17-256gb.jpeg",
  "Oneplus 15-256gb.png",
  "Oppo Reno14-256gb.webp",
  "Samsung S24Ultra-256gb.webp",
  "Samsung S25 ultra-256gb.webp",
  "VIVO X200 pro-256gb.jpeg",
  "Vivo X300 pro-256gb.webp",
  "apple iphone 15pro-256 gb.webp",
  "apple-iphone 16pro-256gb.jpeg",
  "apple-iphone-17-pro-256gb-silver.jpg",
  "iphone 14-256gb.jpeg",
  "iphone 15-256gb.jpg",
  "iphone 16-256gb.jpg",
  "samsung S26 ultra-256gb.webp"
];

const userAddedLaptops = [
  "Apple-MacBook-Pro-M4-lineup.jpg",
  "Apple_MacBook-Pro M1_14-16-inch.jpg",
  "Lenovo LOQ.webp",
  "Lenovo ThinkPad.avif",
  "Mac Book M2 pro chip.webp",
  "Mac Book M3 pro chip.jpeg",
  "SAMSUNG LPTOP.jpeg",
  "TUF A15.webp",
  "hp Spectre.jpg",
  "hp Victus.avif",
  "hp elitebook.jpeg",
  "hp omen.avif",
  "hp omni book.avif",
  "hp pavillion.webp"
];

const parsedPhones = userAddedPhones.map((file, i) => {
  const title = file.replace(/\.(webp|jpg|jpeg|png|avif)$/i, '').replace(/-/g, ' ');
  let brand = 'Other';
  if (title.toLowerCase().includes('google')) brand = 'Google';
  else if (title.toLowerCase().includes('iphone') || title.toLowerCase().includes('apple')) brand = 'Apple';
  else if (title.toLowerCase().includes('samsung')) brand = 'Samsung';
  else if (title.toLowerCase().includes('oneplus')) brand = 'OnePlus';
  else if (title.toLowerCase().includes('oppo')) brand = 'Oppo';
  else if (title.toLowerCase().includes('vivo')) brand = 'Vivo';

  return {
    id: 1000 + i,
    title: title,
    description: `Latest flagship smartphone with advanced features.`,
    price: 89999 + (i * 1000),
    originalPrice: 99999 + (i * 1000),
    brand,
    category: "Electronics",
    subcategory: "Mobiles",
    rating: Number((4.2 + (i % 8) * 0.1).toFixed(1)),
    ratingCount: 1200 + i * 40,
    color: "Varies",
    size: "6.7 inches",
    image: `/assets/products/${file}`,
    stock: 25,
    score: 85 + (i % 15),
    pros: ["Excellent Camera Capabilities", "Fast AI Performance", "Stunning High-Resolution Display"],
    cons: ["Premium Price Segment", "Average Battery Life Under Load"]
  }
});

const parsedLaptops = userAddedLaptops.map((file, i) => {
  const title = file.replace(/\.(webp|jpg|jpeg|png|avif)$/i, '').replace(/-/g, ' ');
  let brand = 'Other';
  if (title.toLowerCase().includes('mac') || title.toLowerCase().includes('apple')) brand = 'Apple';
  else if (title.toLowerCase().includes('lenovo') || title.toLowerCase().includes('thinkpad')) brand = 'Lenovo';
  else if (title.toLowerCase().includes('samsung')) brand = 'Samsung';
  else if (title.toLowerCase().includes('tuf') || title.toLowerCase().includes('asus')) brand = 'ASUS';
  else if (title.toLowerCase().includes('hp') || title.toLowerCase().includes('spectre') || title.toLowerCase().includes('omen')) brand = 'HP';

  return {
    id: 2000 + i,
    title: title,
    description: `High performance laptop for professionals and gamers.`,
    price: 129999 + (i * 2000),
    originalPrice: 149999 + (i * 2000),
    brand,
    category: "Electronics",
    subcategory: "Laptops",
    rating: Number((4.3 + (i % 7) * 0.1).toFixed(1)),
    ratingCount: 800 + i * 30,
    color: "Varies",
    size: "15.6 inches",
    image: `/assets/products/${file}`,
    stock: 15,
    score: 88 + (i % 12),
    pros: ["Powerful Next-Gen Processor", "Premium Build Quality", "Exceptional Battery Management"],
    cons: ["Slightly Heavy for Commuting", "High Initial Investment"]
  }
});

const mockProducts = [
  ...originalMockProducts,
  ...parsedPhones,
  ...parsedLaptops
];


const mockCategories = [
  { id: 1, name: "Electronics", parentId: null },
  { id: 2, name: "Mobiles", parentId: 1 },
  { id: 3, name: "Laptops", parentId: 1 },
  { id: 4, name: "Smart Watches", parentId: 1 },
  { id: 5, name: "Tablets", parentId: 1 },
  { id: 6, name: "Audio", parentId: 1 },
  { id: 7, name: "Fashion", parentId: null },
  { id: 8, name: "Men", parentId: 7 },
  { id: 9, name: "Women", parentId: 7 },
  { id: 10, name: "Home", parentId: null },
  { id: 11, name: "Furniture", parentId: 10 },
  { id: 12, name: "Kitchen", parentId: 10 },
  { id: 13, name: "Appliances", parentId: 10 },
  { id: 14, name: "Kids", parentId: 7 }
];

// In-memory users (passwords stored as plain text for mock — do NOT do this in production)
let mockUsers = [
  { id: 1, name: "Admin User", email: "admin@test.com", password: "admin123", role: "admin" },
  { id: 2, name: "Regular User",  email: "user@test.com",  password: "user123",  role: "user"  }
];

let nextUserId = 3;

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: "Mock server is running — no database needed!" });
});

// Products
app.get('/api/products', (req, res) => {
  const { search, minPrice, maxPrice, brand, sort, category } = req.query;
  let filtered = [...mockProducts];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }
  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (minPrice) filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  if (brand)    filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());

  if (sort === 'price-low')  filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  res.json({ success: true, products: filtered });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
});

// Admin: create / update / delete (in-memory only)
app.post('/api/products', (req, res) => {
  const newProduct = { id: mockProducts.length + 1, rating: 4, ratingCount: 0, stock: 1, ...req.body };
  mockProducts.push(newProduct);
  res.status(201).json({ success: true, message: "Product created", productId: newProduct.id });
});

app.put('/api/products/:id', (req, res) => {
  const idx = mockProducts.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: "Product not found" });
  mockProducts[idx] = { ...mockProducts[idx], ...req.body };
  res.json({ success: true, message: "Product updated" });
});

app.delete('/api/products/:id', (req, res) => {
  const idx = mockProducts.findIndex(p => p.id === parseInt(req.params.id));
  if (idx !== -1) mockProducts.splice(idx, 1);
  res.json({ success: true, message: "Product deleted" });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, categories: mockCategories });
});

// Search
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, products: [] });
  const results = mockProducts.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase()) ||
    p.brand.toLowerCase().includes(q.toLowerCase())
  );
  res.json({ success: true, products: results.slice(0, 5) });
});

// Auth
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });
  if (mockUsers.find(u => u.email === email))
    return res.status(400).json({ success: false, message: "User already exists" });

  const user = { id: nextUserId++, name, email, password, role: "user" };
  mockUsers.push(user);
  res.status(201).json({
    success: true,
    token: "mock_token_" + Date.now(),
    user: { id: user.id, name, email, role: "user" }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
  res.json({
    success: true,
    token: "mock_token_" + Date.now(),
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// Wishlist (mock — stateless)
app.get('/api/wishlist', (req, res) => res.json({ success: true, wishlist: [] }));
app.post('/api/wishlist', (req, res) => res.json({ success: true, message: "Added to wishlist" }));
app.delete('/api/wishlist/:id', (req, res) => res.json({ success: true, message: "Removed from wishlist" }));

// Compare
app.post('/api/compare', (req, res) => {
  const { productIds } = req.body;
  const products = mockProducts.filter(p => productIds.includes(p.id));
  res.json({ success: true, products });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n✅ Mock Server running on http://localhost:' + PORT);
  console.log('📦 Using built-in mock data — NO MySQL required!');
  console.log('\n🔑 Demo Login Credentials:');
  console.log('   Admin → admin@test.com  / admin123');
  console.log('   User  → user@test.com   / user123\n');
});
