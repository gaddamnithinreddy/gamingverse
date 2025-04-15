import React from 'react';
import { Github, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import NavigationMenu from '../components/NavigationMenu';
import GameShowcase from '../components/GameShowcase';
import { LoadingOverlay } from '../components/LoadingAnimation';

const developers = [
  {
    name: 'John Doe',
    role: 'Lead Developer',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com'
    }
  },
];

const DevelopersSection: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm transform-gpu"
            >
              <div className="relative mb-6 overflow-hidden group">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={dev.image}
                  alt={dev.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-lg 
                              group-hover:from-purple-900/80 transition-all duration-300" />
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  className="absolute bottom-4 left-4"
                >
                  <h3 className="text-xl font-bold">{dev.name}</h3>
                  <p className="text-gray-400">{dev.role}</p>
                </motion.div>
              </div>
              <motion.div 
                className="flex justify-center space-x-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.a
                  whileHover={{ scale: 1.2, color: "#fff" }}
                  href={dev.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors"
                >
                  <Github size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, color: "#0077b5" }}
                  href={dev.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors"
                >
                  <Linkedin size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, color: "#e4405f" }}
                  href={dev.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors"
                >
                  <Instagram size={24} />
                </motion.a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DevelopersSection;