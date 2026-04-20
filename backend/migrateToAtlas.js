const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://localhost:27017/supermarketDB';
const ATLAS_URI = 'mongodb+srv://admin:admin123@supermarketcluster.0cdcsoq.mongodb.net/supermarketDB?retryWrites=true&w=majority&appName=SuperMarketCluster';

const collections = ['users', 'products', 'sales', 'customers', 'messages'];

async function migrate() {
  console.log('Connecting to local MongoDB...');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('✅ Connected to local MongoDB');

  console.log('Connecting to Atlas...');
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('✅ Connected to Atlas');

  for (const col of collections) {
    try {
      const data = await localConn.collection(col).find({}).toArray();
      if (data.length === 0) {
        console.log(`⚠️  ${col}: no data found, skipping`);
        continue;
      }
      await atlasConn.collection(col).deleteMany({});
      await atlasConn.collection(col).insertMany(data);
      console.log(`✅ ${col}: migrated ${data.length} documents`);
    } catch (err) {
      console.log(`❌ ${col}: ${err.message}`);
    }
  }

  await localConn.close();
  await atlasConn.close();
  console.log('Migration complete!');
}

migrate();
