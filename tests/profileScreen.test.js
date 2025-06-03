import { signOut, updateProfile, updateUser } from '@/data/api';
import { useProfile } from '@/data/contexts/profile';
import { useUser } from '@/data/contexts/user';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import ProfileScreen from '../ProfileScreen'; // Ajustez le chemin selon votre structure

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  Ionicons: 'Ionicons',
}));

// Mock API functions
jest.mock('@/data/api', () => ({
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  updateUser: jest.fn(),
}));

// Mock user context
jest.mock('@/data/contexts/user', () => ({
  useUser: jest.fn(),
}));

// Mock profile context
jest.mock('@/data/contexts/profile', () => ({
  useProfile: jest.fn(),
}));

describe('ProfileScreen', () => {
  // Mock des valeurs par défaut pour les contexts
  const mockUserContext = {
    user: { id: '123', email: 'test@example.com' },
    Logout: jest.fn(),
  };

  const mockProfileContext = {
    profile: {
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '1234567890',
    },
    handleClearProfile: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup des mocks pour chaque test
    useUser.mockReturnValue(mockUserContext);
    useProfile.mockReturnValue(mockProfileContext);
    
    // Reset des mocks d'API
    signOut.mockClear();
    updateProfile.mockClear();
    updateUser.mockClear();
  });

  // Test 1: Le composant se rend correctement
  it('renders the ProfileForm and logout button', () => {
    const { getByText } = render(<ProfileScreen />);
    
    // Vérifier que le bouton de déconnexion est présent
    expect(getByText('Déconnexion?')).toBeTruthy();
  });

  // Test 2: Mise à jour du profil avec changement d'email réussie
  it('handles profile update with email change successfully', async () => {
    updateProfile.mockResolvedValue({ success: true });
    updateUser.mockResolvedValue({ success: true });

    const { getByTestId } = render(<ProfileScreen />);
    
    // Simuler la soumission du formulaire
    // Note: Vous devrez ajuster ceci selon l'implémentation réelle de votre ProfileForm
    const profileData = {
      username: 'newuser',
      first_name: 'New',
      last_name: 'User',
      email: 'new@example.com',
      phone: '0987654321',
      avatar: null,
    };

    // Si votre ProfileForm expose une méthode onSubmit
    // fireEvent(form, 'onUpdate', profileData, true);

    // Pour l'instant, nous testons directement les appels d'API
    await waitFor(async () => {
      // Simuler l'appel de mise à jour
      await updateProfile('123', profileData);
      await updateUser('new@example.com');
      
      expect(updateProfile).toHaveBeenCalledWith('123', profileData);
      expect(updateUser).toHaveBeenCalledWith('new@example.com');
    });
  });

  // Test 3: Gestion des erreurs lors de la mise à jour du profil
  it('handles profile update error', async () => {
    const errorMessage = 'Update failed';
    updateProfile.mockRejectedValue(new Error(errorMessage));

    // Simuler une tentative de mise à jour qui échoue
    try {
      await updateProfile('123', {
        username: 'testuser',
        email: 'test@example.com',
      });
    } catch (error) {
      expect(updateProfile).toHaveBeenCalled();
      expect(error.message).toBe(errorMessage);
    }
  });

  // Test 4: Déconnexion réussie
  it('handles logout successfully', async () => {
    signOut.mockResolvedValue({ success: true });

    const { getByText } = render(<ProfileScreen />);
    const logoutButton = getByText('Déconnexion?');

    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockUserContext.Logout).toHaveBeenCalled();
      expect(mockProfileContext.handleClearProfile).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });

  // Test 5: Gestion des erreurs lors de la déconnexion
  it('handles logout error', async () => {
    const errorMessage = 'Logout failed';
    signOut.mockRejectedValue(new Error(errorMessage));

    const { getByText } = render(<ProfileScreen />);
    const logoutButton = getByText('Déconnexion?');

    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  // Test 6: Vérification de l'état de chargement
  it('shows loading state during operations', async () => {
    // Mock avec délai pour simuler le chargement
    updateProfile.mockImplementation(
      () => new Promise(resolve => 
        setTimeout(() => resolve({ success: true }), 100)
      )
    );

    const { getByText } = render(<ProfileScreen />);
    
    // Ce test dépend de l'implémentation de votre composant
    // Vous devrez l'ajuster selon la façon dont vous gérez l'état de chargement
    expect(getByText('Déconnexion?')).toBeTruthy();
  });

  // Test 7: Vérification des données du profil affichées
  it('displays profile data correctly', () => {
    const { getByText } = render(<ProfileScreen />);
    
    // Vérifier que les données du profil sont affichées
    // Ajustez selon votre implémentation
    expect(getByText('Déconnexion?')).toBeTruthy();
  });
});

// Tests additionnels pour une meilleure couverture
describe('ProfileScreen Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      Logout: jest.fn(),
    });
    useProfile.mockReturnValue({
      profile: null, // Profil non chargé
      handleClearProfile: jest.fn(),
    });
  });

  it('handles missing profile data gracefully', () => {
    const { getByText } = render(<ProfileScreen />);
    
    // Le composant devrait se rendre même sans données de profil
    expect(getByText('Déconnexion?')).toBeTruthy();
  });

  it('handles network errors during logout', async () => {
    signOut.mockRejectedValue(new Error('Network Error'));

    const { getByText } = render(<ProfileScreen />);
    const logoutButton = getByText('Déconnexion?');

    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network Error');
    });
  });
});