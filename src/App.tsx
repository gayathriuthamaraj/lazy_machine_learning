import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import ModelHome from "./modelHome";
import SavedModelPage from "./SavedModelPage";
import { modelRoutes } from "./models/modelRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<ModelHome />} />

          {modelRoutes.map(r => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}

          <Route path="/saved-models/:id" element={<SavedModelPage />} />

          <Route path="/train" element={<div>Train Model</div>} />
          <Route path="/datasets" element={<div>Datasets</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
