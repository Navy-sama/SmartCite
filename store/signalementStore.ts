import { create } from 'zustand';

export type Signalement = {
  id: number;
  photo: string;
  categorie: string;
  description: string;
  location: string;
  statut: 'en attente' | 'en cours' | 'résolu';
  date: number;
};

type Store = {
  signalements: Signalement[];
  addSignalement: (s: Omit<Signalement, 'id'>) => void;
  updateSignalement: (id: number, s: Partial<Signalement>) => void;
  deleteSignalement: (id: number) => void;
};

export const useSignalementStore = create<Store>((set) => ({
  signalements: [],
  addSignalement: (s) =>
    set((state) => ({
      signalements: [...state.signalements, { id: Date.now(), ...s }],
    })),
  updateSignalement: (id, s) =>
    set((state) => ({
      signalements: state.signalements.map((item) =>
        item.id === id ? { ...item, ...s } : item
      ),
    })),
  deleteSignalement: (id) =>
    set((state) => ({
      signalements: state.signalements.filter((item) => item.id !== id),
    })),
}));
