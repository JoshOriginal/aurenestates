import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type FavoritesContextValue = {
  favoriteIds: string[]
  toggleFavorite: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function getSavedFavorites() {
  try {
    const saved = localStorage.getItem('auren-estates-favorites')
    return saved ? JSON.parse(saved) as string[] : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getSavedFavorites)

  useEffect(() => localStorage.setItem('auren-estates-favorites', JSON.stringify(favoriteIds)), [favoriteIds])

  function toggleFavorite(id: string) {
    setFavoriteIds((current) => current.includes(id) ? current.filter((favorite) => favorite !== id) : [...current, id])
  }

  return <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider')
  return context
}