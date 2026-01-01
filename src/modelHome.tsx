import { useEffect, useState } from "react";
import { apiFetch } from "./api/client";

type SavedModel = {
  id: string;
  algo: string;
  features: string[];
};

export default function ModelHome() {
  const [models, setModels] = useState<SavedModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/models")
      .then(setModels)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading models...</div>;

  return (
    <div>
      {models.map(m => (
        <div key={m.id}>{m.algo}</div>
      ))}
    </div>
  );
}
