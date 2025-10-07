"use client";
import React, { useState, forwardRef } from 'react';
import Input from './InputField'; // <-- Menggunakan komponen dasar kita
import { EyeIcon, EyeCloseIcon } from '@/icons'; // Asumsi Anda punya ikon ini

// Kita tetap butuh semua props dari Input HTML standar
type PasswordInputProps = React.ComponentPropsWithoutRef<'input'>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        {/* Kita menggunakan komponen <Input> yang sudah ada dan fleksibel */}
        <Input
          type={showPassword ? 'text' : 'password'}
          className={className}
          ref={ref}
          {...props}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
        >
          {showPassword ? (
            <EyeIcon className="fill-gray-500" />
          ) : (
            <EyeCloseIcon className="fill-gray-500" />
          )}
        </span>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;