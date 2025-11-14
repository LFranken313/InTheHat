import React, { createContext, useContext, ReactNode } from 'react';

type FontVariants = {
  regular: string;
  bold: string;
};

export const fontMap: Record<string, FontVariants> = {
  pixel: { regular: 'pixel-regular', bold: 'pixel-bold' },
  handwriting: { regular: 'caveat-regular', bold: 'caveat-bold' },
  rubik: { regular: 'rubik-regular', bold: 'rubik-bold' },
  custom: { regular: 'custom-regular', bold: 'custom-bold' },
};

const FontContext = createContext<{
  font: string;
  setFont: (f: string) => void;
  variants: FontVariants;
}>({
  font: 'pixel',
  setFont: () => {},
  variants: fontMap.pixel,
});

type FontProviderProps = {
  font: string;
  setFont: (f: string) => void;
  children: ReactNode;
};

export function FontProvider({ font, setFont, children }: FontProviderProps) {
  const variants = fontMap[font] || fontMap.pixel;
  return (
    <FontContext.Provider value={{ font, setFont, variants }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}