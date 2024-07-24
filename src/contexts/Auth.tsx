import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  user: any;
  login: (user: any) => void;
  logout: () => void;
  register: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUserData(token).then((userData) => {
        setUser(userData);
      });
    }
  }, []);

  const login = (user: any) => {
    localStorage.setItem("authToken", "fake-token");
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const register = (newUser: any) => {
    localStorage.setItem("authToken", "fake-token");
    setUser(newUser);
  };

  const fetchUserData = async (token: string) => {
    console.log(token);
    return new Promise<any>((resolve) =>
      setTimeout(
        () => resolve({ name: "John Doe", email: "john.doe@example.com" }),
        1000
      )
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
