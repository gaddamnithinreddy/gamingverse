import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Gamepad2, 
  Trophy,
  Users,
  Heart,
  Clock,
  Search,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'games', label: 'Games', icon: Gamepad2, href: '/games' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
  { id: 'community', label: 'Community', icon: Users, href: '/community' },
  { id: 'favorites', label: 'Favorites', icon: Heart, href: '/favorites' },
  { id: 'recent', label: 'Recent', icon: Clock, href: '/recent' },
];

const NavigationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Navigation Menu */}
      <motion.nav
        className={`fixed left-0 top-0 h-screen bg-gray-900/95 backdrop-blur-md z-40 
                    lg:w-64 w-full transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <Link href="/">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              GameHub
            </motion.h1>
          </Link>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="px-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div 
          className="px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {menuItems.map((item, index) => (
            <Link key={item.id} href={item.href}>
              <motion.div
                className="relative"
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                            ${hoveredItem === item.id ? 'text-white' : 'text-gray-400'}`}
                  whileHover={{ x: 6 }}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
                
                {hoveredItem === item.id && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 bg-purple-600/20 rounded-lg -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default NavigationMenu; 