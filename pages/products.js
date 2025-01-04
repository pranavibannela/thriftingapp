import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { collection, query, onSnapshot } from "firebase/firestore";

const ProductsPage = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Wait for Firebase to initialize before checking for user authentication
    const checkUserStatus = () => {
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/auth"); // Redirect to auth page if not logged in
      }
    };

    auth.onAuthStateChanged(checkUserStatus); // Wait for Firebase auth state to change

    const fetchProducts = () => {
      const q = query(collection(db, "products"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      });

      // Cleanup the listener when the component is unmounted
      return () => unsubscribe();
    };

    fetchProducts();
  }, [router]);

  useEffect(() => {
    // Filter products based on search query after products have been fetched
    if (products.length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header */}
      <header className="bg-grey-600 text-black flex items-center justify-between px-6 py-4 shadow-md">
        {/* Search Bar */}
        <div className="relative w-2/4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 px-4 rounded-full shadow focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-grey-600 text-white py-1 px-3 rounded-full">
            Search
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <FiShoppingCart
            size={24}
            className="cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={() => alert("Go to Cart")}
          />

          <FiUser
            size={24}
            className="cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={() => setShowProfileSidebar(true)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-2xl font-bold text-grey-600 mb-6">Available Products</h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-grey-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                <div className="flex flex-col space-y-2">
                  {product.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                  ))}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                <p className="text-grey-600 font-semibold">${product.price}</p>
                <p className="text-gray-500 text-sm mt-2">{product.description}</p>
                <button
                  className="mt-4 py-2 px-4 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                  onClick={() => alert("Added to Cart")}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No products available yet. Add some!</p>
        )}
      </main>

      {/* Profile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform ${
          showProfileSidebar ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            onClick={() => setShowProfileSidebar(false)}
          >
            <IoClose size={24} />
          </button>

          <h2 className="text-2xl font-bold text-grey-600 mb-4">Account Info</h2>
          <p className="text-gray-700 text-lg">{userEmail || "Guest"}</p>
          <button
            className="mt-6 w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-grey-700"
            onClick={() => router.push("/sell")}
          >
            Sell Your Products
          </button>
          <button
            className="mt-4 w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
