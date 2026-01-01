import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// ...existing code...
type ModelParams = {
  fit_intercept?: boolean;
  n_jobs?: number;
  [key: string]: unknown;
};

type ModelMetrics = {
  r2: number;
  rmse: number;
  [key: string]: number | undefined;
};

type Model = {
  id?: string;
  name: string;
  algo: string;
  params: ModelParams;
  metrics: ModelMetrics;
};

export default function SavedModelPage() {
  const { id } = useParams();
  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setModel({
        id,
        name: "Linear Regression v1",
        algo: "linear_regression",
        params: {
          fit_intercept: true,
          n_jobs: -1,
        },
        metrics: {
          r2: 0.82,
          rmse: 3.1,
        },
      });
    }, 300);
  }, [id]);

  if (!model) {
    return <div>Loading model…</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{model.name}</h1>

      <div>
        <h2 className="font-medium">Parameters</h2>
        <pre className="bg-black text-green-400 p-3 rounded text-sm">
          {JSON.stringify(model.params, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="font-medium">Metrics</h2>
        <pre className="bg-black text-green-400 p-3 rounded text-sm">
          {JSON.stringify(model.metrics, null, 2)}
        </pre>
      </div>
    </div>
  );
}
