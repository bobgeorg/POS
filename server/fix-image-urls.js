const connectDB = require('./config/db');
const Product = require('./model/Product');
const TypeProduct = require('./model/TypeProduct');

// Fix image URLs in database from absolute to relative paths
const fixImageUrls = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Fix Product images
    const products = await Product.find({});
    let productCount = 0;
    
    for (const product of products) {
      if (product.img && product.img.includes('localhost')) {
        // Replace http://localhost:5000/ with /
        product.img = product.img.replace(/http:\/\/localhost:\d+\//, '/');
        await product.save();
        productCount++;
        console.log(`✓ Fixed product: ${product.name}`);
      }
    }

    // Fix TypeProduct images
    const typeProducts = await TypeProduct.find({});
    let typeCount = 0;
    
    for (const type of typeProducts) {
      if (type.img && type.img.includes('localhost')) {
        type.img = type.img.replace(/http:\/\/localhost:\d+\//, '/');
        await type.save();
        typeCount++;
        console.log(`✓ Fixed type: ${type.name}`);
      }
    }

    console.log(`\n✅ Done! Fixed ${productCount} products and ${typeCount} product types`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixImageUrls();
