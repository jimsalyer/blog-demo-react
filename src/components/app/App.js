import '../../styles/App.scss';
import React from 'react';
import AppContent from './AppContent';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

export default function App() {
  return (
    <>
      <AppHeader />
      <AppContent />
      <AppFooter />
    </>
  );
}
