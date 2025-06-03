import { signOut, updateProfile, updateUser } from '@/data/api';
import { useProfile } from '@/data/contexts/profile';
import { useUser } from '@/data/contexts/user';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import ProfileScreen from './ProfileScreen'; // Adjust the path to your component

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock dependencies
jest.mock('expo-router');
jest.mock('@expo/vector-icons');
jest.mock('@/data/api');
jest.mock('@/data/contexts/user');
jest.mock('@/data/contexts/profile');

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Component renders correctly
  it('renders the ProfileForm and logout button', () => {
    const { getByText, getByTestId } = render(<ProfileScreen />);
    expect(getByText('Déconnexion?')).toBeTruthy();
    expect(getByTestId('profile-form')).toBeTruthy(); // Assumes ProfileForm has testID="profile-form"
  });

  // Test 2: handleEditProfile submits successfully with mail=true
  it('handles profile update with email change successfully', async () => {
    updateProfile.mockResolvedValue({ success: true });
    updateUser.mockResolvedValue({ success: true });

    const { getByTestId } = render(<ProfileScreen />);
    const form = getByTestId('profile-form');

    // Simulate form submission
    fireEvent(form, 'onUpdate', {
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      avatar: null,
    }, true);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith('123', {
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        avatar: null,
      });
      expect(updateUser).toHaveBeenCalledWith('test@example.com');
      expect(Alert.alert).toHaveBeenCalledWith('Succès', 'Compte mis à jour avec succès');
    });
  });

  // Test 3: handleEditProfile handles errors
  it('handles profile update error', async () => {
    updateProfile.mockRejectedValue(new Error('Update failed'));

    const { getByTestId } = render(<ProfileScreen />);
    const form = getByTestId('profile-form');

    fireEvent(form, 'onUpdate', {
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      avatar: null,
    }, false);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalled();
      expect(updateUser).not.toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Update failed');
    });
  });

  // Test 4: handleLogout works successfully
  it('handles logout successfully', async () => {
    signOut.mockResolvedValue({ success: true });
    const { Logout } = useUser();
    const { handleClearProfile } = useProfile();

    const { getByText } = render(<ProfileScreen />);
    const logoutButton = getByText('Déconnexion?');

    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(Logout).toHaveBeenCalled();
      expect(handleClearProfile).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });

  // Test 5: handleLogout handles errors
  it('handles logout error', async () => {
    signOut.mockRejectedValue(new Error('Logout failed'));

    const { getByText } = render(<ProfileScreen />);
    const logoutButton = getByText('Déconnexion?');

    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Logout failed');
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  // Test 6: Loading state is set during profile update
  it('sets loading state during profile update', async () => {
    updateProfile.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

    const { getByTestId } = render(<ProfileScreen />);
    const form = getByTestId('profile-form');

    fireEvent(form, 'onUpdate', {
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      avatar: null,
    }, false);

    expect(getByTestId('profile-form').props.loading).toBe(true);

    await waitFor(() => {
      expect(getByTestId('profile-form').props.loading).toBe(false);
    });
  });
});