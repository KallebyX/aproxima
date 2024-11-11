'use client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaInicial from './components/PaginaInicial/page';
import QuemSomos from './components/quem-somos/page';
import ProdutosAcessiveis from './components/produtos-acessiveis/page';
import AreaProfissional from './components/area-do-profissional/page';
import Contato from './components/Contato/page';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaInicial />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/produtos-acessiveis" element={<ProdutosAcessiveis />} />
        <Route path="/area-do-profissional" element={<AreaProfissional/>} />
        <Route path="/contato" element={<Contato />} />
      </Routes>
    </Router>
  );
}
