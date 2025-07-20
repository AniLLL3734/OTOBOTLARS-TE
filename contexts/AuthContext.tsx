import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  kullaniciAdi: string | null;
  girisYapildi: boolean;
  login: (kullaniciAdi: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [kullaniciAdi, setKullaniciAdi] = useState<string | null>(null);
  const [girisYapildi, setGirisYapildi] = useState<boolean>(false);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'ı kontrol et
    const kayitliKullanici = localStorage.getItem('otobotlar-kullaniciAdi');
    if (kayitliKullanici) {
      setKullaniciAdi(kayitliKullanici);
      setGirisYapildi(true);
    }
  }, []);

  const login = (ad: string) => {
    localStorage.setItem('otobotlar-kullaniciAdi', ad);
    localStorage.setItem('girisYapildi_8E_Anilari', 'true');
    setKullaniciAdi(ad);
    setGirisYapildi(true);
  };

  const logout = () => {
    localStorage.removeItem('otobotlar-kullaniciAdi');
    localStorage.removeItem('girisYapildi_8E_Anilari');
    setKullaniciAdi(null);
    setGirisYapildi(false);
  };

  return (
    <AuthContext.Provider value={{ kullaniciAdi, girisYapildi, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Bu hook sayesinde herhangi bir bileşenden kimlik bilgisine kolayca erişeceğiz
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};