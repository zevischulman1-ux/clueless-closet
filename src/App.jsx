import React, { useState } from 'react';
import { Shirt, Sparkles, Plus, Trash2, RefreshCw, Upload } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('closet');
  const [items, setItems] = useState([
    { id: 1, name: 'Yellow Plaid Blazer', category: 'Tops', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' },
    { id: 2, name: 'Pleated Mini Skirt', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400' },
    { id: 3, name: 'White Knee Socks', category: 'Accessories', image: 'https://images.unsplash.com/photo-1582966772680-860e3525554a?w=400' },
    { id: 4, name: 'Mary Jane Heels', category: 'Shoes', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Tops');
  const [newItemImage, setNewItemImage] = useState('');
  const [generatedOutfit, setGeneratedOutfit] = useState(null);

  // Handle uploading local image files
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName) return;
    const newItem = {
      id: Date.now(),
      name: newItemName,
      category: newItemCategory,
      image: newItemImage || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemImage('');
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const generateRandomOutfit = () => {
    const tops = items.filter(i => i.category === 'Tops');
    const bottoms = items.filter(i => i.category === 'Bottoms');
    const shoes = items.filter(i => i.category === 'Shoes');

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const randomShoe = shoes[Math.floor(Math.random() * shoes.length)];

    setGeneratedOutfit({
      top: randomTop || { name: 'Add tops to generate!', image: '' },
      bottom: randomBottom || { name: 'Add bottoms to generate!', image: '' },
      shoe: randomShoe || { name: 'Add shoes to generate!', image: '' }
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-pink-400 text-white p-6 shadow-md border-b-4 border-yellow-300">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wider flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-300" /> CLUELESS CLOSET
          </h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('closet')}
              className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition ${
                activeTab === 'closet' ? 'bg-yellow-300 text-pink-900' : 'hover:bg-pink-500'
              }`}
            >
              <Shirt className="w-5 h-5" /> My Closet
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition ${
                activeTab === 'generator' ? 'bg-yellow-300 text-pink-900' : 'hover:bg-pink-500'
              }`}
            >
              <Sparkles className="w-5 h-5" /> Outfit Generator
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {activeTab === 'closet' && (
          <div>
            {/* Add Item Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-pink-100">
              <h2 className="text-xl font-bold mb-4 text-pink-600 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Clothes
              </h2>
              <form onSubmit={handleAddItem} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Item Name (e.g. Yellow Cardigan)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                {/* File Upload Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:bg-pink-50 transition text-pink-600 font-semibold">
                    <Upload className="w-5 h-5" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-400 font-bold">OR</span>
                  <input
                    type="text"
                    placeholder="Paste Image URL"
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    className="flex-1 w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {/* Preview Thumbnail */}
                {newItemImage && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Preview:</span>
                    <img src={newItemImage} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-pink-200" />
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm self-end"
                >
                  Add to Closet
                </button>
              </form>
            </div>

            {/* Closet Grid */}
            <h2 className="text-2xl font-bold mb-4 text-pink-800">Your Wardrobe ({items.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100 relative group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-50 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-gray-800 mt-1 truncate">{item.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'generator' && (
          <div className="text-center py-8">
            <h2 className="text-3xl font-extrabold text-pink-700 mb-2">Match Maker</h2>
            <p className="text-gray-600 mb-6">Let your closet pick your fit for today!</p>
            <button
              onClick={generateRandomOutfit}
              className="bg-yellow-300 hover:bg-yellow-400 text-pink-900 font-extrabold text-lg px-8 py-4 rounded-full shadow-lg flex items-center gap-2 mx-auto transition transform hover:scale-105"
            >
              <RefreshCw className="w-6 h-6" /> Spin Outfit!
            </button>

            {generatedOutfit && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-md">
                  <h4 className="font-bold text-pink-500 mb-2">Top</h4>
                  {generatedOutfit.top.image && (
                    <img src={generatedOutfit.top.image} alt="Top" className="w-full h-40 object-cover rounded-xl mb-2" />
                  )}
                  <p className="font-semibold">{generatedOutfit.top.name}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-md">
                  <h4 className="font-bold text-pink-500 mb-2">Bottom</h4>
                  {generatedOutfit.bottom.image && (
                    <img src={generatedOutfit.bottom.image} alt="Bottom" className="w-full h-40 object-cover rounded-xl mb-2" />
                  )}
                  <p className="font-semibold">{generatedOutfit.bottom.name}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-md">
                  <h4 className="font-bold text-pink-500 mb-2">Shoes</h4>
                  {generatedOutfit.shoe.image && (
                    <img src={generatedOutfit.shoe.image} alt="Shoe" className="w-full h-40 object-cover rounded-xl mb-2" />
                  )}
                  <p className="font-semibold">{generatedOutfit.shoe.name}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
