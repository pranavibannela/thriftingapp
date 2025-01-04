// sell.js

import { useState } from 'react';

export default function Sell() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");
  
    // Create FormData to handle image uploads
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
  
    // Append images to FormData
    images.forEach((image) => {
      formData.append("images", image);
    });
  
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
  
      // Log the response to check what is being returned
      const result = await response.text(); // Use .text() to log the response body before parsing it as JSON
      console.log("API Response:", result);
  
      if (response.ok) {
        setStatus("Product uploaded successfully!");
      } else {
        setStatus(result || "Error uploading product.");
      }
  
      // Clear the form
      setName("");
      setDescription("");
      setPrice("");
      setImages([]);
    } catch (error) {
      console.error("Error uploading product:", error);
      setStatus("Error uploading product.");
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center">Thrift Your Product</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border mt-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border mt-2"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border mt-2"
          required
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full p-2 border mt-2"
        />
        <button
          type="submit"
          className="w-full p-3 mt-4 bg-gray-900 text-white hover:bg-gray-700"
        >
          Upload Product
        </button>
      </form>

      <div className="mt-4">
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative flex flex-col items-center h-auto gap-2">
                <div className="relative h-24 w-24">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover rounded"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-700 text-center truncate w-24">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {status && <p className="mt-4 text-center text-green-600">{status}</p>}
    </div>
  );
}
