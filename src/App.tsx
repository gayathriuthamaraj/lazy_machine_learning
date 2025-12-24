import { BrowserRouter, Routes, Route } from "react-router-dom";
import { modelRoutes } from "./models/modelRoutes";
import ModelHome from "./modelHome";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModelHome />} />

        {modelRoutes.map(r => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
