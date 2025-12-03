"use client";

import React, { createContext, useContext, useState } from "react";

type ModalView = 'signIn' | 'signUp';

interface AuthModalContextProps {
  isOpen: boolean;
  view: ModalView; // ✅ 2. Tambahkan 'view' ke interface
  openModal: (view?: ModalView) => void; // ✅ 3. Modifikasi openModal (opsional)
  closeModal: () => void;
  setView: (view: ModalView) => void; // ✅ 4. Tambahkan 'setView'
}

const AuthModalContext = createContext<AuthModalContextProps | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ModalView>('signIn'); // ✅ 5. Tambahkan state 'view'

  const openModal = (viewToShow: ModalView = 'signIn') => { // ✅ 6. Terapkan openModal
    setView(viewToShow);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ 
      isOpen, 
      view,     // ✅ 7. Berikan 'view'
      openModal, 
      closeModal, 
      setView   // ✅ 8. Berikan 'setView'
     }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error("useAuthModal must be used within AuthModalProvider");
  return context;
};
