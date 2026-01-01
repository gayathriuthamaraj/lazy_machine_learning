import { useState } from "react";
import data from "../content.json";
import Dropdown from "../components/dropdown";
import NumberInput from "../components/number";
import Button from "../components/Button";
import { apiUpload } from "../api/upload";

type DropdownItem = {
  id: number;
  desc: string;
  options: string[];
};

type NumberItem = {
  id: number;
  desc: string;
  float_bool: boolean;
  allowMin?: boolean;
  allowMax?: boolean;
  min?: number;
  max?: number;
};

type ModelParams = Record<string, string | number | boolean>;

export default function LogisticRegression() {
  const model = data[1];

  const dropdown_items = (model?.dropdown?.content ?? []) as DropdownItem[];
  const number_items = (model?.number_input?.content ?? []) as NumberItem[];

  const [params, setParams] = useState<ModelParams>({});
  const [dataset, setDataset] = useState<File | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateParam(id: string, value: string | number | boolean) {
    setParams(prev => ({ ...prev, [id]: value }));
  }

  function handleDatasetUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setDataset(e.target.files[0]);
    }
  }

  async function handleFit() {
    if (!dataset) {
      alert("Upload a dataset first");
      return;
    }

    const formData = new FormData();
    formData.append("dataset", dataset);
    formData.append("params", JSON.stringify(params));

    try {
      setLoading(true);

      const res = await apiUpload("/train", formData);
      setModelId(res.model_id);

      alert("Model trained successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Training failed");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!modelId) {
      alert("Train the model first");
      return;
    }

    const token = localStorage.getItem("auth_token");
    window.location.href = `http://localhost:8000/download/${modelId}?token=${token}`;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 rounded bg-primary-highlight border-primary-text pb-4 pt-6 px-5 w-fit">
        <h1 className="text-xl font-semibold mb-4">{model.desc}</h1>

        <div className="flex flex-wrap gap-2">
          {dropdown_items.map(item => (
            <Dropdown
              key={item.id}
              id={item.desc}
              options={item.options}
              onChange={updateParam}
            />
          ))}

          {number_items.map(item => (
            <NumberInput
              key={item.id}
              id={item.desc}
              float={item.float_bool}
              min={item.min}
              max={item.max}
              allowMin={item.allowMin}
              allowMax={item.allowMax}
              onChange={updateParam}
            />
          ))}
        </div>

        <div className="mt-4">
          <label className="text-sm block mb-1">Dataset (CSV)</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleDatasetUpload}
            className="text-sm"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            label={loading ? "Training..." : "Create & Fit Model"}
            onClick={handleFit}
            disabled={loading}
          />

          <Button
            label="Download Model"
            variant="secondary"
            onClick={handleDownload}
            disabled={!modelId}
          />
        </div>
      </div>
    </div>
  );
}