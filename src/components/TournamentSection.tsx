import React, { useState, useEffect } from 'react';
import { Trophy, Timer, Users, Star, Award } from 'lucide-react';
import { tournaments } from '../data/games';
import AuthModal from './auth/AuthModal';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface Tournament {
  id: number;
  name: string;
  game: string;
  date: string;
  prize: string;
  participants: number;
  maxParticipants: number;
  image: string;
}

interface TournamentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tournament: Tournament;
}

const TournamentConfirmationModal: React.FC<TournamentConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tournament
}) => {
  if (!isOpen || !tournament) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4">Confirm Tournament Registration</h2>
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Are you sure you want to register for the {tournament.name}?
          </p>
          <div className="bg-gray-700 p-4 rounded-lg space-y-2">
            <p><span className="font-semibold">Game:</span> {tournament.game}</p>
            <p><span className="font-semibold">Date:</span> {new Date(tournament.date).toLocaleDateString()}</p>
            <p><span className="font-semibold">Prize:</span> {tournament.prize}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            Confirm Registration
          </button>
        </div>
      </div>
    </div>
  );
};

const TournamentSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<{[key: number]: boolean}>({});
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      loadRegistrations();
    }
  }, [user]);

  const loadRegistrations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('tournament_id')
      .eq('user_id', user.id);

    if (data) {
      const status = data.reduce((acc: {[key: number]: boolean}, reg) => {
        acc[reg.tournament_id] = true;
        return acc;
      }, {});
      setRegistrationStatus(status);
    }
  };

  const handleJoinTournament = (tournament: Tournament) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSelectedTournament(tournament);
    setShowConfirmationModal(true);
  };

  const handleConfirmRegistration = async () => {
    if (!user || !selectedTournament) return;

    try {
      const { error } = await supabase
        .from('tournament_registrations')
        .insert([
          {
            user_id: user.id,
            tournament_id: selectedTournament.id
          }
        ]);

      if (error) throw error;

      setRegistrationStatus(prev => ({
        ...prev,
        [selectedTournament.id]: true
      }));

      // Show success animation
      const element = document.getElementById(`tournament-${selectedTournament.id}`);
      if (element) {
        element.classList.add('animate-success-pulse');
        setTimeout(() => {
          element.classList.remove('animate-success-pulse');
        }, 1000);
      }
    } catch (error) {
      console.error('Error registering for tournament:', error);
      alert('Failed to register for tournament. Please try again.');
    } finally {
      setShowConfirmationModal(false);
      setSelectedTournament(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading-trophy">
            <Trophy size={48} className="text-purple-500 animate-bounce" />
          </div>
          <p className="text-xl text-purple-400">Loading Tournaments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4 animate-text-shine">
            Active Tournaments
          </h2>
          <p className="text-gray-400">
            Join competitive tournaments and win amazing prizes!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              id={`tournament-${tournament.id}`}
              className="bg-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                  <p className="text-gray-300">{tournament.game}</p>
                </div>
                {registrationStatus[tournament.id] && (
                  <div className="absolute top-4 right-4">
                    <Award size={24} className="text-green-400 animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Timer size={16} className="animate-spin-slow" />
                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Trophy size={16} className="animate-bounce-subtle" />
                    <span>{tournament.prize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Users size={16} />
                    <span>{tournament.participants}/{tournament.maxParticipants}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < 4 ? "text-yellow-400" : "text-gray-600"} transition-all hover:scale-110`}
                        fill={i < 4 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleJoinTournament(tournament)}
                  disabled={registrationStatus[tournament.id]}
                  className={`w-full py-2 rounded-lg font-semibold transition-all duration-300
                    ${registrationStatus[tournament.id]
                      ? 'bg-green-600 cursor-not-allowed transform hover:scale-100'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transform hover:scale-105'
                    }`}
                >
                  {registrationStatus[tournament.id] ? 'Registered' : 'Join Tournament'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="tournament"
      />

      {showConfirmationModal && selectedTournament && (
        <TournamentConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirmRegistration}
          tournament={selectedTournament}
        />
      )}
    </div>
  );
};

export default TournamentSection;