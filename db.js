// api/products.js (backend)

import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
  await client.connect();
  const db = client.db();
  const collection = db.collection('products');

  if (req.method === 'POST') {
    // Handle product upload
    const { name, description, price, images } = req.body;
    try {
      const result = await collection.insertOne({ name, description, price, images });
      res.status(200).json({ message: 'Product uploaded successfully!', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading product', error });
    }
  } else if (req.method === 'GET') {
    // Handle fetching products
    try {
      const products = await collection.find({}).toArray();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  }
}
