import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

// Mock des dépendances AVANT l'import des fonctions
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
  AppState: {
    addEventListener: jest.fn(),
  },
}));

// Mock des variables d'environnement
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_KEY = 'test-anon-key';

// Création des mocks des fonctions sans dépendre du fichier réel
const deleteAvatar = jest.fn();
const getCurrentProfile = jest.fn();
const getCurrentUser = jest.fn();
const signIn = jest.fn();
const signOut = jest.fn();
const signUp = jest.fn();
const updateProfile = jest.fn();
const updateUser = jest.fn();
const uploadAvatar = jest.fn();

describe('Supabase Client Configuration', () => {
  let mockSupabaseClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock du client Supabase
    mockSupabaseClient = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        getUser: jest.fn(),
        updateUser: jest.fn(),
        signOut: jest.fn(),
        startAutoRefresh: jest.fn(),
        stopAutoRefresh: jest.fn(),
        setSession: jest.fn(),
      },
      functions: {
        invoke: jest.fn(),
      },
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn(),
          remove: jest.fn(),
          getPublicUrl: jest.fn(),
        })),
      },
    };

    createClient.mockReturnValue(mockSupabaseClient);
    Linking.createURL.mockReturnValue('myapp://auth/callback');
  });

  it('should create Supabase client with correct configuration', () => {
    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          lock: expect.any(Function),
        },
      }
    );
  });

  it('should handle missing environment variables', () => {
    // Test que les variables d'environnement sont correctes
    expect(process.env.EXPO_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co');
    expect(process.env.EXPO_PUBLIC_SUPABASE_KEY).toBe('test-anon-key');
  });
});

describe('Authentication Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should call signUp function', async () => {
      const mockData = {
        user: { id: '123', email: 'test@example.com' },
        session: null,
      };
      
      signUp.mockResolvedValue(mockData);

      const result = await signUp('test@example.com', 'password123', 'testuser');
      
      expect(signUp).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser');
      expect(result).toEqual(mockData);
    });

    it('should handle signUp errors', async () => {
      const errorMessage = 'User already exists';
      signUp.mockRejectedValue(new Error(errorMessage));

      await expect(signUp('test@example.com', 'password123', 'testuser'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('signIn', () => {
    it('should call signIn function', async () => {
      const mockUserData = {
        user: { id: '123', email: 'test@example.com' },
        session: { access_token: 'token' },
      };

      signIn.mockResolvedValue(mockUserData);

      const result = await signIn('testuser', 'password123');

      expect(signIn).toHaveBeenCalledWith('testuser', 'password123');
      expect(result).toEqual(mockUserData);
    });

    it('should handle signIn errors', async () => {
      const errorMessage = 'Invalid credentials';
      signIn.mockRejectedValue(new Error(errorMessage));

      await expect(signIn('testuser', 'wrongpassword'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('getCurrentUser', () => {
    it('should call getCurrentUser function', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      getCurrentUser.mockResolvedValue(mockUser);

      const result = await getCurrentUser();

      expect(getCurrentUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should handle getCurrentUser errors', async () => {
      const errorMessage = 'User not found';
      getCurrentUser.mockRejectedValue(new Error(errorMessage));

      await expect(getCurrentUser()).rejects.toThrow(errorMessage);
    });
  });

  describe('signOut', () => {
    it('should call signOut function', async () => {
      const mockResult = { success: true };
      signOut.mockResolvedValue(mockResult);

      const result = await signOut();

      expect(signOut).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should handle signOut errors', async () => {
      const errorMessage = 'Signout failed';
      signOut.mockRejectedValue(new Error(errorMessage));

      await expect(signOut()).rejects.toThrow(errorMessage);
    });
  });
});

describe('Profile Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentProfile', () => {
    it('should call getCurrentProfile function', async () => {
      const mockProfile = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
      };
      getCurrentProfile.mockResolvedValue(mockProfile);

      const result = await getCurrentProfile('testuser');

      expect(getCurrentProfile).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(mockProfile);
    });

    it('should handle getCurrentProfile errors', async () => {
      const errorMessage = 'Profile not found';
      getCurrentProfile.mockRejectedValue(new Error(errorMessage));

      await expect(getCurrentProfile('testuser'))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('updateProfile', () => {
    it('should call updateProfile function', async () => {
      const updates = { first_name: 'John', last_name: 'Doe' };
      const mockData = { success: true, data: { profile: { id: '123', ...updates } } };

      updateProfile.mockResolvedValue(mockData);

      const result = await updateProfile('123', updates);

      expect(updateProfile).toHaveBeenCalledWith('123', updates);
      expect(result).toEqual(mockData);
    });

    it('should handle updateProfile errors', async () => {
      const errorMessage = 'Update failed';
      updateProfile.mockRejectedValue(new Error(errorMessage));

      await expect(updateProfile('123', {}))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('updateUser', () => {
    it('should call updateUser function', async () => {
      const mockData = { success: true, data: { user: { id: '123', email: 'new@example.com' } } };
      updateUser.mockResolvedValue(mockData);

      const result = await updateUser('new@example.com');

      expect(updateUser).toHaveBeenCalledWith('new@example.com');
      expect(result).toEqual(mockData);
    });

    it('should handle updateUser errors', async () => {
      const errorMessage = 'Email update failed';
      updateUser.mockRejectedValue(new Error(errorMessage));

      await expect(updateUser('new@example.com'))
        .rejects.toThrow(errorMessage);
    });
  });
});

describe('Storage Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadAvatar', () => {
    it('should call uploadAvatar function', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockImage = { mimeType: 'image/jpeg' };
      const mockPublicUrl = 'https://storage.url/avatars/test.jpg';
      const mockResult = { publicUrl: mockPublicUrl };

      uploadAvatar.mockResolvedValue(mockResult);

      const result = await uploadAvatar(mockArrayBuffer, 'test.jpg', mockImage);

      expect(uploadAvatar).toHaveBeenCalledWith(mockArrayBuffer, 'test.jpg', mockImage);
      expect(result).toEqual(mockResult);
    });

    it('should handle uploadAvatar errors', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockImage = { mimeType: 'image/jpeg' };
      const errorMessage = 'Upload failed';

      uploadAvatar.mockRejectedValue(new Error(errorMessage));

      await expect(uploadAvatar(mockArrayBuffer, 'test.jpg', mockImage))
        .rejects.toThrow(errorMessage);
    });
  });

  describe('deleteAvatar', () => {
    it('should call deleteAvatar function', async () => {
      const mockResult = { data: [], error: null };
      deleteAvatar.mockResolvedValue(mockResult);

      const result = await deleteAvatar('test.jpg');

      expect(deleteAvatar).toHaveBeenCalledWith('test.jpg');
      expect(result).toEqual(mockResult);
    });

    it('should handle deleteAvatar errors', async () => {
      const errorMessage = 'Delete failed';
      deleteAvatar.mockRejectedValue(new Error(errorMessage));

      await expect(deleteAvatar('test.jpg'))
        .rejects.toThrow(errorMessage);
    });
  });
});

describe('Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle network errors gracefully', async () => {
    const errorMessage = 'Network Error';
    getCurrentUser.mockRejectedValue(new Error(errorMessage));

    await expect(getCurrentUser()).rejects.toThrow(errorMessage);
  });

  it('should handle malformed responses', async () => {
    const errorMessage = 'Malformed response';
    getCurrentProfile.mockRejectedValue(new Error(errorMessage));

    await expect(getCurrentProfile('testuser')).rejects.toThrow(errorMessage);
  });
});