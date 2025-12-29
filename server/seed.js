const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./model/Product');
const TypeProduct = require('./model/TypeProduct');
const products = require('./data/product');

// Connect to MongoDB
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany();
    await TypeProduct.deleteMany();
    console.log('Existing data cleared!');

    // Extract unique categories from products
    const categoryMap = new Map();
    products.forEach((product) => {
      if (!categoryMap.has(product.categoryId)) {
        categoryMap.set(product.categoryId, {
          name: product.categoryName,
          img: product.image || '',
        });
      }
    });

    // Create categories
    console.log('Creating product categories...');
    const categoryDocs = [];
    for (const [categoryId, categoryData] of categoryMap) {
      const typeProduct = new TypeProduct(categoryData);
      const savedType = await typeProduct.save();
      categoryDocs.push({ id: categoryId, doc: savedType });
      console.log(`  ✓ Created category: ${categoryData.name}`);
    }

    // Create products with category references
    console.log('\nCreating products...');
    let createdCount = 0;
    
    for (const productData of products) {
      // Find the MongoDB _id for this category
      const categoryDoc = categoryDocs.find(
        (cat) => cat.id === productData.categoryId
      );

      if (!categoryDoc) {
        console.log(`  ⚠ Skipping product ${productData.name}: Category not found`);
        continue;
      }

      // Create product with proper schema fields
      const product = new Product({
        name: productData.name,
        catelory: categoryDoc.doc._id, // Reference to TypeProduct
        price: productData.price,
        count: productData.count || 0,
        description: productData.description || '',
        img: productData.image || '',
      });

      await product.save();
      createdCount++;
      console.log(`  ✓ Created: ${productData.name} ($${productData.price})`);
    }

    console.log(`\n✅ Successfully imported ${createdCount} products into database!`);
    console.log(`✅ Created ${categoryDocs.length} categories`);
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('Destroying all data...');
    await Product.deleteMany();
    await TypeProduct.deleteMany();
    console.log('✅ All data destroyed!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
