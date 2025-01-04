// pages/buy.js
export default function Buy() {
    return (
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold">Available Items for Sale</h1>
        <p className="mt-4">Browse through the items available for purchase.</p>
        <div className="mt-8">
          {/* Sample items for sale */}
          <div className="mt-4">
            <h2 className="text-2xl">Item 1</h2>
            <p>Description of the item</p>
            <button className="px-6 py-2 mt-4 bg-blue-500 text-white rounded">Buy Now</button>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl">Item 2</h2>
            <p>Description of the item</p>
            <button className="px-6 py-2 mt-4 bg-blue-500 text-white rounded">Buy Now</button>
          </div>
        </div>
      </div>
    );
  }
  