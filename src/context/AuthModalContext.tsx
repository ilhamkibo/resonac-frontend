"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextProps | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error("useAuthModal must be used within AuthModalProvider");
  return context;
};
