import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const seed = [
  { id: '1', item: 'Padaria', kg: 80, status: 'concluida', janela: 'Ontem, 18h às 20h' },
  { id: '2', item: 'Hortifruti', kg: 120, status: 'concluida', janela: 'Segunda, 17h às 19h' },
  { id: '3', item: 'Refeições prontas', kg: 35, status: 'oferta', janela: 'Hoje, 18h às 20h' },
  { id: '4', item: 'Padaria', kg: 50, status: 'aceita', janela: 'Hoje, 16h às 18h' },
];

export function AppProvider({ children }) {
  const [donations, setDonations] = useState(seed);
  const [prefs, setPrefs] = useState({ scale: 1, reduceMotion: false, contrast: false });
  const [sysReduce, setSysReduce] = useState(false);
  const [plano, setPlano] = useState(0);
  const [servidas, setServidas] = useState(120);
  const [ocorrencias, setOcorrencias] = useState([]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setSysReduce);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setSysReduce);
    return () => sub.remove();
  }, []);

  const add = (d) => {
    const id = String(Date.now());
    setDonations((l) => [{ ...d, id, status: 'oferta' }, ...l]);
    return id;
  };
  const setStatus = (id, status) =>
    setDonations((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));

  const update = (id, patch) =>
    setDonations((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const reduce = prefs.reduceMotion || sysReduce;
  const value = useMemo(
    () => ({ donations, add, setStatus, update, prefs, setPrefs, reduce, plano, setPlano, servidas, setServidas, ocorrencias, setOcorrencias }),
    [donations, prefs, reduce, plano, servidas, ocorrencias]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
