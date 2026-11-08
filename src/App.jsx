import React, { useState, useEffect } from 'react';
import { Shirt, Sparkles, Plus, Trash2, RefreshCw, Upload, Search, UserPlus, ExternalLink, UserCheck, Layers, Calendar } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('closet');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Load items from localStorage if available, otherwise use defaults
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('clueless_items');
    if (savedItems) {
      try { return JSON.parse(savedItems); } catch (e) { console.error(e); }
    }
    return [
      { id: 1, name: 'Yellow Plaid Blazer', category: 'Tops', occasion: 'School', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', link: 'https://www.google.com/search?q=Yellow+Plaid+Blazer' },
      { id: 2, name: 'Pleated Mini Skirt', category: 'Bottoms', occasion: 'Party', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400', link: 'https://www.google.com/search?q=Pleated+Mini+Skirt' },
      { id: 3, name: 'White Knee Socks', category: 'Accessories', occasion: 'Casual', image: 'https://images.unsplash.com/photo-1582966772680-860e3525554a?w=400', link: 'https://www.google.com/search?q=White+Knee+Socks' },
      { id: 4, name: 'Mary Jane Heels', category: 'Shoes', occasion: 'Party', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', link: 'https://www.google.com/search?q=Mary+Jane+Heels' }
    ];
  });

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('clueless_items', JSON.stringify(items));
  }, [items]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Tops');
  const [newItemOccasion, setNewItemOccasion] = useState('Casual');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemLink, setNewItemLink] = useState('');
  const [generatedOutfit, setGeneratedOutfit] = useState(null);

  // Carousel manual outfit state
  const [carouselTopIndex, setCarouselTopIndex] = useState(0);
  const [carouselBottomIndex, setCarouselBottomIndex] = useState(0);
  const [carouselShoeIndex, setCarouselShoeIndex] = useState(0);

  const topsList = items.filter(i => i.category === 'Tops');
  const bottomsList = items.filter(i => i.category === 'Bottoms');
  const shoesList = items.filter(i => i.category === 'Shoes');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setUser({ email });
    setShowAuthModal(false);
    setEmail('');
    setPassword('');
  };

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
      occasion: newItemOccasion,
      image: newItemImage || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
      link: newItemLink || `https://www.google.com/search?q=${encodeURIComponent(newItemName)}`
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemImage('');
    setNewItemLink('');
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const generateRandomOutfit = () => {
    if (topsList.length > 0) setCarouselTopIndex(Math.floor(Math.random() * topsList.length));
    if (bottomsList.length > 0) setCarouselBottomIndex(Math.floor(Math.random() * bottomsList.length));
    if (shoesList.length > 0) setCarouselShoeIndex(Math.floor(Math.random() * shoesList.length));

    setGeneratedOutfit({
      top: topsList[carouselTopIndex] || { name: 'Add tops!', image: '' },
      bottom: bottomsList[carouselBottomIndex] || { name: 'Add bottoms!', image: '' },
      shoe: shoesList[carouselShoeIndex] || { name: 'Add shoes!', image: '' }
    });
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.occasion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExternalSearch = () => {
    if (!searchQuery) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 font-sans pb-12">
      {/* Top Fixed Header */}
      <header className="bg-pink-400 text-white sticky top-0 z-40 shadow-md border-b-4 border-yellow-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-wider flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('closet')}>
            <Sparkles className="w-7 h-7 text-yellow-300" /> CLUELESS CLOSET
          </h1>

          <div className="flex items-center gap-2 w-full md:w-1/3 bg-white text-gray-700 px-3 py-2 rounded-full shadow-inner border border-pink-200">
            <Search className="w-4 h-4 text-pink-400 shrink-0" />
            <input
              type="text"
              placeholder="Search closet or occasions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={handleExternalSearch}
                title="Search on Google"
                className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 transition shrink-0"
              >
                <ExternalLink className="w-3 h-3" /> Web
              </button>
            )}
          </div>

          <nav className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('closet')}
              className={`px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 transition ${
                activeTab === 'closet' ? 'bg-yellow-300 text-pink-900' : 'hover:bg-pink-500'
              }`}
            >
              <Shirt className="w-4 h-4" /> Closet
            </button>

            <button
              onClick={() => setActiveTab('carousel')}
              className={`px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 transition ${
                activeTab === 'carousel' ? 'bg-yellow-300 text-pink-900' : 'hover:bg-pink-500'
              }`}
            >
              <Layers className="w-4 h-4" /> Carousel
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 transition ${
                activeTab === 'generator' ? 'bg-yellow-300 text-pink-900' : 'hover:bg-pink-500'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Matchmaker
            </button>

            {user ? (
              <div className="flex items-center gap-1 bg-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                <UserCheck className="w-4 h-4 text-yellow-300" />
                <span className="max-w-[80px] truncate">{user.email}</span>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                className="bg-yellow-300 hover:bg-yellow-400 text-pink-900 font-bold text-xs px-3 py-1.5 rounded-full transition shadow flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl border-2 border-pink-300 relative">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 font-bold">✕</button>
              <h3 className="text-2xl font-extrabold text-pink-600 mb-2 text-center">{authMode === 'signup' ? 'Create Account' : 'Welcome Back'}</h3>
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 mt-4">
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-3 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-3 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition shadow">{authMode === 'signup' ? 'Sign Up' : 'Log In'}</button>
              </form>
              <div className="text-center mt-4 text-xs text-gray-500">
                {authMode === 'signup' ? (
                  <p>Already have an account? <button onClick={() => setAuthMode('login')} className="text-pink-600 font-bold underline">Log In</button></p>
                ) : (
                  <p>Need an account? <button onClick={() => setAuthMode('signup')} className="text-pink-600 font-bold underline">Sign Up</button></p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Closet */}
        {activeTab === 'closet' && (
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-pink-100">
              <h2 className="text-xl font-bold mb-4 text-pink-600 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Clothes
              </h2>
              <form onSubmit={handleAddItem} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="text" placeholder="Item Name (e.g. Yellow Cardigan)" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="flex-1 p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400" />
                  <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} className="p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <select value={newItemOccasion} onChange={(e) => setNewItemOccasion(e.target.value)} className="p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="Casual">Casual</option>
                    <option value="School">School</option>
                    <option value="Party">Party</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:bg-pink-50 transition text-pink-600 font-semibold text-sm">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <span className="text-gray-400 font-bold text-xs">OR</span>
                  <input type="text" placeholder="Paste Image URL" value={newItemImage} onChange={(e) => setNewItemImage(e.target.value)} className="flex-1 w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm" />
                </div>

                <input type="url" placeholder="Product or web link (optional)" value={newItemLink} onChange={(e) => setNewItemLink(e.target.value)} className="p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm" />
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm self-end">Add to Closet</button>
              </form>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-pink-800">Your Wardrobe ({filteredItems.length})</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100 relative group">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-3">
                    <div className="flex gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">{item.category}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{item.occasion}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-pink-500 hover:underline font-semibold">
                        <ExternalLink className="w-3 h-3" /> View Link
                      </a>
                    )}
                  </div>
                  <button onClick={() => handleDeleteItem(item.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Virtual Closet Carousel (Cher's Computer Style) */}
        {activeTab === 'carousel' && (
          <div className="text-center py-6">
            <h2 className="text-3xl font-extrabold text-pink-700 mb-2">Virtual Closet Carousel</h2>
            <p className="text-gray-600 mb-8">Mix and match your outfits side-by-side!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Top Carousel */}
              <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-md flex flex-col items-center">
                <h4 className="font-bold text-pink-500 mb-3">Tops</h4>
                {topsList.length > 0 ? (
                  <div className="w-full flex flex-col items-center">
                    <img src={topsList[carouselTopIndex]?.image} alt="Top" className="w-full h-48 object-cover rounded-xl mb-3 border" />
                    <p className="font-semibold text-sm mb-3 truncate">{topsList[carouselTopIndex]?.name}</p>
                    <div className="flex gap-2 w-full">
                      <button onClick={() => setCarouselTopIndex((prev) => (prev === 0 ? topsList.length - 1 : prev - 1))} className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-2 rounded-xl text-sm">◀ Prev</button>
                      <button onClick={() => setCarouselTopIndex((prev) => (prev === topsList.length - 1 ? 0 : prev + 1))} className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-2 rounded-xl text-sm">Next ▶</button>
                    </div>
                  </div>
                ) : <p className="text-sm text-gray-400">No tops added yet.</p>}
              </div>

              {/* Bottom Carousel */}
              <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-md flex flex-col items-center">
                <h4 className="font-bold text-pink-500 mb-3">Bottoms</h4>
                {bottomsList.length > 0 ? (
                  <div className="w-full flex flex-col items-center">
                    <img src={bottomsList[carouselBottomIndex]?.image} alt="Bottom" className="w-full h-48 object-cover rounded-xl mb-3 border" />
                    <p className="font-semibold text-sm mb-3 truncate">{bottomsList[carouselBottomIndex]?.name}</p>
                    <div className="flex gap-2 w-full">
                      <button onClick={() => setCarouselBottomIndex((prev) => (prev === 0 ? bottomsList.length - 1 : prev - 1))} className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-2 rounded-xl text-sm">◀ Prev</button>
                      <button onClick={() => setCarouselBottomIndex((prev) => (prev === bottomsList.length - 1 ? 0 : prev + 1))} className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-2 rounded-xl text-sm">Next ▶</button>
                    </div>
                  </div>
                ) : <p className="text-sm text-gray-400">No bottoms added yet.</p>}
              </div>

              {/* Shoes Carousel */}
              <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-md flex flex-col items-center">
                <h4 className="font-bold text-pink-500 mb-3">Shoes</h4>
                {shoesList.length > 0 ? (
                  <div className="w-full flex flex-col items-center">
                    <img src={shoesList[carouselShoeIndex]?.image} alt="Shoe" className="w-full h-48 object-cover rounded-xl mb-3 border" />
                    <p className="font-semibold text-sm mb-3 truncate">{shoesList[carouselShoeIndex]?.name}</p>
                    <div className="flex gap-2 w-full">
                      <button onClick={() => setCarouselShoeIndex((prev) => (prev === 0 ? shoesList.length - 1 : prev - 1))} className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-2 rounded-xl text-sm">◀ Prev</button>
                      <button onClick={() => setCarouselShoeIndex((prev) => (prev === shoesList.length - 1 ? 0 : prev + 1))} className="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-2 rounded-xl text-sm">Next ▶</button>
                    </div>
                  </div>
                ) : <p className="text-sm text-gray-400">No shoes added yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Matchmaker Generator */}
        {activeTab === 'generator' && (
          <div className="text-center py-8">
            <h2 className="text-3xl font-extrabold text-pink-700 mb-2">Match Maker</h2>
            <p className="text-gray-600 mb-6">Let your closet pick a random fit for today!</p>
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
                  {generatedOutfit.top.image && <img src={generatedOutfit.top.image} alt="Top" className="w-full h-40 object-cover rounded-xl mb-2" />}
                  <p className="font-semibold">{generatedOutfit.top.name}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-md">
                  <h4 className="font-bold text-pink-500 mb-2">Bottom</h4>
                  {generatedOutfit.bottom.image && <img src={generatedOutfit.bottom.image} alt="Bottom" className="w-full h-40 object-cover rounded-xl mb-2" />}
                  <p className="font-semibold">{generatedOutfit.bottom.name}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-md">
                  <h4 className="font-bold text-pink-500 mb-2">Shoes</h4>
                  {generatedOutfit.shoe.image && <img src={generatedOutfit.shoe.image} alt="Shoe" className="w-full h-40 object-cover rounded-xl mb-2" />}
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
