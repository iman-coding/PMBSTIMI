/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import BiodataForm from './pages/student/Biodata';
import PaymentPage from './pages/student/Payment';
import DocumentsPage from './pages/student/Documents';
import AcademicTestPage from './pages/student/AcademicTest';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/student/biodata" element={<BiodataForm />} />
          <Route path="/student/payment" element={<PaymentPage />} />
          <Route path="/student/documents" element={<DocumentsPage />} />
          <Route path="/student/test" element={<AcademicTestPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
