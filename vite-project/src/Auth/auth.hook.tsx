import { useState, useEffect, useContext, createContext } from 'react';
import type {ReactNode} from 'react';
import {jwtDecode} from 'jwt-decode';
import type { User } from '../Types/user.type';
import { http } from '../Http/Axios.Instance';

// Définition du type pour le token décodé
interface DecodedToken {
  userId: string;
  exp: number;
}

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  user: User | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);  // Utilisation de l'interface
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUserId(decodedToken.userId);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');

        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && userId) {
        const token = localStorage.getItem('token');
        try {
          const userResponse = await http.get(`find_user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (userResponse.data) {
            setUser(userResponse.data);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
          logout();
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, userId]);

  const login = (token: string, userId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = () => {
    console.log('Déconnexion en cours...');
    console.log('Suppression des données de localStorage:', {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
    });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('companyId');
    localStorage.removeItem('darkMode');
    setIsAuthenticated(false);
    setUserId(null);
    setUser(null);
    console.log('Utilisateur déconnecté. Les données ont été réinitialisées.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};