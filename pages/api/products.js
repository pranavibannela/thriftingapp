// pages/api/products.js
import formidable from 'formidable';
import AWS from 'aws-sdk';
import { MongoClient } from 'mongodb';
import fs from 'fs';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file uploads
  },
};

// Function to upload images to S3
const uploadImageToS3 = async (file) => {
  const fileContent = fs.readFileSync(file.filepath);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `images/${Date.now()}-${file.originalFilename}`, // Unique key for each file
    Body: fileContent,
    ContentType: file.mimetype,
    ACL: 'public-read', // Allow public read access
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // URL of the uploaded image
  } catch (err) {
    throw new Error('Error uploading to S3: ' + err.message);
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = "./public/uploads"; // Optional: Local storage backup
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data.' });
      }

      const { name, description, price } = fields;
      const imageFiles = files.images;

      try {
        // Upload images to S3 and get their URLs
        const imageUrls = await Promise.all(
          imageFiles.map((file) => uploadImageToS3(file))
        );

        const productData = {
          name,
          description,
          price,
          images: imageUrls, // Store the URLs of the images
        };

        // Connect to MongoDB and store the product data
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        const db = client.db();
        const productsCollection = db.collection('products');
        await productsCollection.insertOne(productData);

        res.status(200).json({ message: 'Product uploaded successfully', productData });
      } catch (uploadError) {
        res.status(500).json({ error: uploadError.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
