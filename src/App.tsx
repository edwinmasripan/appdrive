import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => (
  <div>
    <DashboardHeader />
    <DashboardPage />
    <ProfilePage />
  </div>
);

export default App;
