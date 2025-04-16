import React, { useState, useEffect } from 'react';
import { Gamepad, Users, Trophy, Home, Search, Code, Maximize2, Minimize2, Flame, Star, Clock, Award, LogOut, User, Sword, Brain, Crosshair, Dice5, Car } from 'lucide-react';
import { games, simpleGames } from './data/games';
import { Game } from './types';
import NavButton from './components/NavButton';
import GameCard from './components/GameCard';
import GameModal from './components/GameModal';
import SearchBar from './components/SearchBar';
import DevelopersSection from './components/DevelopersSection';
import ComingSoon from './components/ComingSoon';
import TournamentSection from './components/TournamentSection';
import TicTacToe from './components/PlayableGames/TicTacToe';
import MemoryGame from './components/PlayableGames/MemoryGame';
import SnakeGame from './components/PlayableGames/SnakeGame';
import PongGame from './components/PlayableGames/PongGame';
import TetrisGame from './components/PlayableGames/TetrisGame';
import CategoryBar from './components/CategoryBar';
import { useAuthStore } from './store/authStore';
import { useGameStore } from './store/gameStore';
import UserProfileModal from './components/UserProfileModal';

function App() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [showSearch, setShowSearch] = useState(false);
  const [fullscreenGame, setFullscreenGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    showAllTrending,
    showAllPopular,
    showAllRecent,
    setShowAllTrending,
    setShowAllPopular,
    setShowAllRecent,
    getFilteredGames,
    getCategoryGames
  } = useGameStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(introTimer);
    };
  }, []);

  const handleLearnMore = (game: Game) => {
    setSelectedGame(game);
  };

  const closeModal = () => {
    setSelectedGame(null);
  };

  const filteredGames = getFilteredGames();
  const categoryGames = getCategoryGames(selectedCategory);

  const toggleFullscreen = (gameName: string) => {
    setFullscreenGame(fullscreenGame === gameName ? null : gameName);
  };

  const renderPlayableGame = (gameName: string, GameComponent: React.ComponentType) => (
    <div className={`${
      fullscreenGame === gameName 
        ? 'fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-8'
        : 'bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm'
    }`}>
      <div className="relative w-full">
        <button
          onClick={() => toggleFullscreen(gameName)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          {fullscreenGame === gameName ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
        <GameComponent />
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="loading-bullet-container">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-purple-500 rounded-full animate-bullet-loading"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-xl text-purple-400">Loading Amazing Games...</p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'home':
        return (
          <>
            <div className="relative pt-24 pb-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="max-w-2xl">
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent animate-text-shine">
                      Level Up Your Gaming
                    </h1>
                    <p className="text-gray-300 text-lg mb-8">
                      Discover, play, and compete in the most exciting online games.
                      Join millions of players worldwide!
                    </p>
                    <SearchBar 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearch(true)}
                    />
                  </div>
                  <div className="hidden lg:block relative">
                    <div className="absolute -inset-4 bg-purple-500/20 blur-xl rounded-full"></div>
                    <img
  src="https://i.postimg.cc/q75mFvMd/image-removebg-preview.png"
  alt="Gaming Character"
  className="h-[400px] animate-float relative"
/>
                  </div>
                </div>
              </div>
            </div>

            {searchQuery && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                {filteredGames.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onLearnMore={() => handleLearnMore(game)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No games found. More games coming soon!</p>
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                {/* Category Filter Section */}
                <div className="sticky top-16 z-40 bg-gray-900/80 backdrop-blur-sm py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between overflow-x-auto hide-scrollbar">
                    {[
                      { id: 'all', name: 'All Games', icon: Gamepad },
                      { id: 'action', name: 'Action', icon: Sword },
                      { id: 'puzzle', name: 'Puzzle', icon: Brain },
                      { id: 'shooting', name: 'Shooting', icon: Crosshair },
                      { id: 'casual', name: 'Casual', icon: Dice5 },
                      { id: 'racing', name: 'Racing', icon: Car }
                    ].map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                          ${selectedCategory === category.id 
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }
                        `}
                      >
                        <category.icon className="w-5 h-5" />
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Section */}
                <section className="animate-fade-in transform transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <Flame className="text-orange-500 animate-pulse" />
                      Trending Now
                    </h2>
                    <button 
                      onClick={() => setShowAllTrending(!showAllTrending)}
                      className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
                    >
                      {showAllTrending ? 'Show Less' : 'View All'}
                      {showAllTrending ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 card-grid-animation
                    ${showAllTrending ? 'expand-animation' : ''}`}>
                    {[...games]
                      .filter(game => game.genre.toLowerCase() === selectedCategory.toLowerCase() || selectedCategory === 'all')
                      .slice(0, showAllTrending ? undefined : 4)
                      .map((game) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          onLearnMore={() => handleLearnMore(game)}
                          variant="compact"
                        />
                    ))}
                  </div>
                </section>

                {/* Popular Section */}
                <section className="animate-fade-in">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <Star className="text-yellow-500 animate-spin-slow" />
                      Most Popular
                    </h2>
                    <button 
                      onClick={() => setShowAllPopular(!showAllPopular)}
                      className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
                    >
                      {showAllPopular ? 'Show Less' : 'View All'}
                      {showAllPopular ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 card-grid-animation
                    ${showAllPopular ? 'expand-animation' : ''}`}>
                    {categoryGames
                      .filter(game => game.genre.toLowerCase() === selectedCategory.toLowerCase() || selectedCategory === 'all')
                      .slice(0, showAllPopular ? undefined : 8)
                      .map((game) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          onLearnMore={() => handleLearnMore(game)}
                        />
                    ))}
                  </div>
                </section>

                {/* Recently Added Section */}
                <section className="animate-fade-in">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <Clock className="text-blue-500 animate-pulse" />
                      Recently Added
                    </h2>
                    <button 
                      onClick={() => setShowAllRecent(!showAllRecent)}
                      className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
                    >
                      {showAllRecent ? 'Show Less' : 'View All'}
                      {showAllRecent ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 card-grid-animation
                    ${showAllRecent ? 'expand-animation' : ''}`}>
                    {[...simpleGames]
                      .filter(game => game.genre.toLowerCase() === selectedCategory.toLowerCase() || selectedCategory === 'all')
                      .slice(0, showAllRecent ? undefined : 4)
                      .map((game) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          onLearnMore={() => handleLearnMore(game)}
                        />
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        );
      case 'games':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Play Games
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {renderPlayableGame('TicTacToe', TicTacToe)}
              {renderPlayableGame('MemoryGame', MemoryGame)}
              {renderPlayableGame('SnakeGame', SnakeGame)}
              {renderPlayableGame('PongGame', PongGame)}
              {renderPlayableGame('TetrisGame', TetrisGame)}
            </div>
          </div>
        );
      case 'community':
        return <ComingSoon />;
      case 'tournaments':
        return <TournamentSection />;
      case 'developers':
        return <DevelopersSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 text-white relative overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-radial from-purple-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-radial from-indigo-600/20 to-transparent"></div>
      </div>
      
      {showIntro && (
        <div className="intro-overlay intro-animation">
          <div className="intro-content intro-text-animation">
            <div className="intro-logo glow-effect">GameVerse</div>
            <p className="text-xl text-gray-300">Your Ultimate Gaming Destination</p>
          </div>
        </div>
      )}

      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <NavButton
                icon={<Home size={20} />}
                text="Home"
                isActive={activeSection === 'home'}
                onClick={() => setActiveSection('home')}
              />
              <NavButton
                icon={<Gamepad size={20} />}
                text="Games"
                isActive={activeSection === 'games'}
                onClick={() => setActiveSection('games')}
              />
              <NavButton
                icon={<Users size={20} />}
                text="Community"
                isActive={activeSection === 'community'}
                onClick={() => setActiveSection('community')}
              />
              <NavButton
                icon={<Trophy size={20} />}
                text="Tournaments"
                isActive={activeSection === 'tournaments'}
                onClick={() => setActiveSection('tournaments')}
              />
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveSection('developers')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform neon-button"
                >
                  <Code size={20} />
                  <span>Developers</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {renderContent()}

      {/* Animated background stars */}
      <div className="fixed inset-0 -z-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {selectedGame && (
        <GameModal game={selectedGame} onClose={closeModal} />
      )}

      {showProfileModal && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onSignOut={signOut}
        />
      )}
    </div>
  );
}

export default App;