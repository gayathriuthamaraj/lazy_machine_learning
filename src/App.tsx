import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import ModelHome from "./ModelHome";
import SavedModelPage from "./SavedModelPage";
import { modelRoutes } from "./models/modelRoutes";
import AuthForm from "./LoginForms";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<AuthForm />} />

        {/* APP ROUTES (with layout) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<ModelHome />} />

          {modelRoutes.map(r => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}

          <Route path="/saved-models" element={<SavedModelPage />} />
          <Route path="/datasets" element={<div>Datasets</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
