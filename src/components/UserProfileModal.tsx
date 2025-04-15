import React from 'react';
import { X, LogOut, User, Settings, Bell } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onSignOut }) => {
  if (!isOpen) return null;

  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <User size={20} className="text-purple-400" />
            <div>
              <h3 className="font-semibold">Account Settings</h3>
              <p className="text-sm text-gray-400">Manage your account details</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <Bell size={20} className="text-purple-400" />
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-gray-400">Configure your notifications</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <Settings size={20} className="text-purple-400" />
            <div>
              <h3 className="font-semibold">Preferences</h3>
              <p className="text-sm text-gray-400">Customize your experience</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 p-3 mt-6 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;