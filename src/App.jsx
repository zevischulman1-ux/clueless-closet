import React, { useState } from 'react';
import { Shirt, Sparkles, Plus, Trash2, RefreshCw, Upload, Search, LogIn, UserPlus, ExternalLink, UserCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('closet');
  const [user, setUser] = useState(null); // Signed-in user state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Closet items state
  const [items, setItems] = useState([
    { id: 1, name: 'Yellow Plaid Blazer', category: 'Tops', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', link: 'https://www.google.com/search?q=Yellow+Plaid+Blazer' },
    { id: 2, name: 'Pleated Mini Skirt', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400', link: 'https://www.google.com/search?q=Pleated+Mini+Skirt' },
    { id: 3, name: 'White Knee Socks', category: 'Accessories', image: 'https://images.unsplash.com/photo-1582966772680-860e3525554a?w=400', link: 'https://www.google.com/search?q=White+Knee+Socks' },
    { id: 4, name: 'Mary Jane Heels', category: 'Shoes', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', link: 'https://www.google.com/search?q=Mary+Jane+Heels' }
  ]);

  // Form & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Tops');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemLink, setNewItemLink] = useState('');
  const [generatedOutfit, setGeneratedOutfit] = useState(null);

  // Handle Authentication Mock
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setUser({ email });
    setShowAuthModal(false);
    setEmail('');
    setPassword('');
  };

  // Image File Upload Handler
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

  // Add Item to Closet
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName) return;
    const newItem = {
      id: Date.now(),
      name: newItemName,
      category: newItemCategory,
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

  // Filter items based on top search bar
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExternalSearch = () => {
    if (!searchQuery) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 font-sans">
      {/* Top Fixed Header with Navigation and Search */}
      <header className="bg-pink-400 text-white sticky top-0 z-40 shadow-md border-b-4 border-yellow-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <h1 className="text-2xl font-extrabold tracking-wider flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('closet')}>
            <Sparkles className="w-7 h-7 text-yellow-300" /> CLUELESS CLOSET
          </h1>

          {/* Search Bar UI */}
          <div className="flex items-center gap-2 w-full md:w-1/3 bg-white text-gray-700 px-3 py-2 rounded-full shadow-inner border border-pink-200">
            <Search className="w-4 h-4 text-pink-400 shrink-0" />
            <input
              type="text"
              placeholder="Search closet or look up web items..."
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

          {/* Header Navigation & Sign-up */}
          <nav className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('closet')}
              className={`px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 transition ${
                activeTab === 'closet' ? 'bg-yellow-300 text-pink-900' : 'hover:bg-pink-500'
              }`}
            >
              <Shirt className="w-4 h-4" /> Closet
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 transition ${
                activeTab === 'generator' ? 'bg-yellow-300 text-pink-900' : 'hover:bg-pink-500'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Generator
            </button>

            {user ? (
              <div className="flex items-center gap-2 bg-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                <UserCheck className="w-4 h-4 text-yellow-300" />
                <span className="max-w-[100px] truncate">{user.email}</span>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                className="bg-yellow-300 hover:bg-yellow-400 text-pink-900 font-bold text-xs px-3 py-1.5 rounded-full transition shadow flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up / Log In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto p-6">
        
        {/* Sign-Up / Log In Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl border-2 border-pink-300 relative">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
              
              <h3 className="text-2xl font-extrabold text-pink-600 mb-2 text-center">
                {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-gray-500 text-center mb-6">
                {authMode === 'signup' ? 'Sign up to save your digital wardrobe!' : 'Log in to view your items.'}
              </p>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="p-3 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="p-3 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition shadow"
                >
                  {authMode === 'signup' ? 'Sign Up' : 'Log In'}
                </button>
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

        {/* Tab 1: Closet View & Item Search */}
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
                    placeholder="Item Name (
