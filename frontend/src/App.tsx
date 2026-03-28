import { AnimatePresence } from "framer-motion";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";

import BottomNav from "./components/layout/BottomNav";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import DashboardPage from "./pages/Dashboard";
import HistoryPage from "./pages/History";
import HomePage from "./pages/Home";
import LearnPage from "./pages/Learn";
import QuickCheckPage from "./pages/QuickCheck";
import ScanPage from "./pages/Scan";
import VerdictPage from "./pages/Verdict";

function Shell() {
  return (
    <div className="min-h-[100dvh] bg-ink text-slate-100">
      <Navbar />
      <main className="main-content px-4 pb-4 pt-4 sm:px-6">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/verdict" element={<VerdictPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/quickcheck" element={<QuickCheckPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
