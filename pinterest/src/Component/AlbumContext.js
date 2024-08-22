import React, { createContext, useState, useContext } from 'react';

const AlbumsContext = createContext();

export const useAlbums = () => useContext(AlbumsContext);

export const AlbumsProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);

  return (
    <AlbumsContext.Provider value={{ albums, setAlbums }}>
      {children}
    </AlbumsContext.Provider>
  );
};