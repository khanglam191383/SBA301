import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ListOfOrchids from './components/ListOfOrchids';
import EditOrchid from './components/EditOrchid';
import OrchidDetail from './OrchidDetail';

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ListOfOrchids />} />
          <Route path="/orchids/new" element={<EditOrchid createMode />} />
          <Route path="/orchids/:id/edit" element={<EditOrchid />} />
          <Route path="/orchids/:id" element={<OrchidDetail />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>SBA301 - Lab 05: Single Page Application with Spring Boot 3 & React Vite</p>
      </footer>
    </div>
  );
}
