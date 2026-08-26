import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { ApiDocs } from './pages/ApiDocs';
import { Sandbox }  from './pages/Sandbox';
import { Production } from './pages/Production';

export default function App() {
  return (
    <Routes>
      {/* เข้าเว็บครั้งแรก (/) ให้แสดงหน้า Landing Page */}
      <Route path="/" element={<Home />} />

      {/* เส้นทางหน้าอื่นๆ */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/docs" element={<ApiDocs />} />
      <Route path="/sandbox" element={<Sandbox />} />
      <Route path="/production" element={<Production />} />
    </Routes>
  );
}