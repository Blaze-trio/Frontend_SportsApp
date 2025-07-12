import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import SportsPage from '@/pages/SportsPage';
import MembersPage from '@/pages/MembersPage';
import SubscriptionsPage from '@/pages/SubscriptionsPage';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SportsPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;