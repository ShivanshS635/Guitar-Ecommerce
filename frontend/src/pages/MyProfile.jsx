import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { FiEdit, FiLock, FiUser, FiMapPin, FiHeart, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { FiX } from 'react-icons/fi';

const MyProfile = () => {
    const { user, logout } = useContext(ShopContext);
    const [darkMode, setDarkMode] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [editMode, setEditMode] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    });

    const handleSaveProfile = () => {
        setEditMode(false);
        // TODO: Add API call to update profile data
    };

    return (

        <div className="relative">
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {/* Header */}
                <header className={`py-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-bold text-yellow-500">My Profile</h1>
                    </div>
                </header>

                {/* Main */}
                <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-1/4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                            >
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative group">
                                        <img
                                            src={profileData.avatar}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full border-2 border-yellow-500 object-cover"
                                        />
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full hover:bg-yellow-600 transition"
                                        >
                                            <FiEdit className="text-white" />
                                        </button>
                                    </div>
                                    <h2 className="mt-4 text-xl font-semibold">{profileData.name}</h2>
                                    <p className="text-gray-500">{profileData.email}</p>
                                </div>

                                <nav className="space-y-2">
                                    {[
                                        { id: 'overview', icon: <FiUser />, label: 'Overview' },
                                        { id: 'orders', icon: <FiShoppingBag />, label: 'My Orders' },
                                        { id: 'addresses', icon: <FiMapPin />, label: 'Addresses' },
                                        { id: 'wishlist', icon: <FiHeart />, label: 'Wishlist' },
                                        { id: 'security', icon: <FiLock />, label: 'Security' },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === item.id
                                                ? 'bg-yellow-500 text-white'
                                                : darkMode
                                                    ? 'hover:bg-gray-700'
                                                    : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <FiLogOut />
                                        <span>Logout</span>
                                    </button>
                                </nav>

                                {/* Dark Mode Toggle */}
                                <div className="mt-6 flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <span>Dark Mode</span>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-yellow-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </motion.div>
                        </aside>

                        {/* Content */}
                        <div className="w-full lg:w-3/4">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold">Profile Overview</h2>
                                            {!editMode ? (
                                                <button
                                                    onClick={() => setEditMode(true)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                                >
                                                    <FiEdit />
                                                    <span>Edit Profile</span>
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                                    >
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        onClick={() => setEditMode(false)}
                                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {editMode ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={profileData.email}
                                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="p-4 border rounded-lg">
                                                        <h3 className="font-semibold mb-2">Personal Information</h3>
                                                        <p><span className="text-gray-500">Name:</span> {profileData.name}</p>
                                                        <p><span className="text-gray-500">Email:</span> {profileData.email}</p>
                                                        <p><span className="text-gray-500">Phone:</span> {profileData.phone || 'Not provided'}</p>
                                                    </div>
                                                    <div className="p-4 border rounded-lg">
                                                        <h3 className="font-semibold mb-2">Account Security</h3>
                                                        <p>Last login: 2 hours ago</p>
                                                        <button className="mt-2 text-yellow-500 hover:underline">Change Password</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Under Construction Fallback */}
                                {['orders', 'addresses', 'wishlist', 'security'].includes(activeTab) && (
                                    <motion.div
                                        key="under-construction"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className={`p-10 text-center rounded-xl shadow-lg flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                                            }`}
                                    >
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/189/189792.png"
                                            alt="Under Construction"
                                            className="w-24 h-24 mb-4 animate-bounce"
                                        />
                                        <h2 className="text-2xl font-bold mb-2">This Section is Under Construction</h2>
                                        <p className="text-gray-500">We're working hard to bring this feature to life. Stay tuned!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>
            </div>
            {showOverlay && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white text-center">
                    <div className="p-8 rounded-xl border border-yellow-500 bg-gray-900/80 shadow-2xl relative">
                        <h1 className="text-3xl font-bold text-yellow-400">🚧 Page Under Construction 🚧</h1>
                        <p className="mt-4 text-lg text-gray-300">We're working on this feature. Please check back later.</p>
                    </div>
                </div>

            )}
        </div>
    );
};



export default MyProfile;
