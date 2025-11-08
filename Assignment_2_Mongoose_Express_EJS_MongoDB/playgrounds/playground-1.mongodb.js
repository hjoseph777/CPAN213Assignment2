/* global use, db */
// MongoDB Playground for Assignment 2 - lab04 Database Schema Testing
// Connection: mongodb+srv://hjoseph777_mongodb_user:%24Lulu12345@cluster0.nizoxjv.mongodb.net/lab04?appName=Cluster0

// Select the lab04 database
use('lab04');

// ===== ITEMS COLLECTION =====
// Insert enhanced sample data with new schema fields
db.items.insertMany([
  { 
    name: 'Gaming Laptop', 
    price: 1299.99, 
    category: 'Electronics', 
    inStock: true,
    quantity: 5,
    description: 'High-performance gaming laptop with RTX graphics',
    brand: 'ASUS',
    tags: ['gaming', 'laptop', 'high-performance']
  },
  { 
    name: 'JavaScript: The Definitive Guide', 
    price: 49.99, 
    category: 'Education', 
    inStock: true,
    quantity: 15,
    description: 'Comprehensive guide to JavaScript programming',
    brand: 'O\'Reilly',
    tags: ['javascript', 'programming', 'book']
  },
  { 
    name: 'Ceramic Coffee Mug', 
    price: 12.99, 
    category: 'Kitchen', 
    inStock: false,
    quantity: 0,
    description: 'Elegant ceramic coffee mug with handle',
    brand: 'KitchenAid',
    tags: ['coffee', 'mug', 'ceramic']
  }
]);

// ===== CUSTOMERS COLLECTION =====
// Insert sample customers
db.customers.insertMany([
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '5551234567',
    address: {
      street: '123 Main St',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M1A 1A1'
    },
    isActive: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '5559876543',
    address: {
      street: '456 Queen St W',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5V 2A8'
    },
    isActive: true
  }
]);

// ===== QUERIES AND TESTS =====

// Find all items
db.items.find({});

// Find items in stock with quantity > 0
db.items.find({ inStock: true, quantity: { $gt: 0 } });

// Find items by category with price range
db.items.find({ 
  category: 'Electronics', 
  price: { $gte: 100, $lte: 2000 } 
});

// Find items with specific tags
db.items.find({ tags: { $in: ['gaming', 'laptop'] } });

// Aggregation: Group items by category with average price
db.items.aggregate([
  {
    $group: {
      _id: '$category',
      averagePrice: { $avg: '$price' },
      totalItems: { $sum: 1 },
      totalQuantity: { $sum: '$quantity' }
    }
  }
]);

// Find customers in Toronto
db.customers.find({ 'address.city': 'Toronto' });

// Create indexes for better performance
db.items.createIndex({ name: 1 });
db.items.createIndex({ category: 1, price: 1 });
db.customers.createIndex({ email: 1 }, { unique: true });

// Text search setup (create text index)
db.items.createIndex({ name: 'text', description: 'text', tags: 'text' });

// Text search example
db.items.find({ $text: { $search: 'gaming laptop' } });
