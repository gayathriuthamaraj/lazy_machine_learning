import { useState } from "react";
import data from "./content.json";
import Dropdown from "./components/dropdown";
import NumberInput from "./components/number";
import Button from "./components/Button";

//keeping it at bay

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

export default function App () {
  const model = data[0];

  const dropdown_items = (model?.dropdown?.content ?? []) as DropdownItem[];
  const number_items = (model?.number_input?.content ?? []) as NumberItem[];

  type ParamValue = string | number | boolean;

  const [params, setParams] = useState<Record<string, ParamValue>>({});
  const [dataset, setDataset] = useState<File | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);

  function updateParam(id: string, value: ParamValue) {
    setParams(prev => ({ ...prev, [id]: value }));
  }

  function handleDatasetUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
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
      const res = await fetch("http://127.0.0.1:8000/train", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Training failed");
      }

      const data = await res.json();
      setModelId(data.model_id);

      console.log("Training result:", data);
      alert("Model trained successfully");
    } catch (err) {
      console.error(err);
      alert("Error while training model");
    }
  }

  function handleDownload() {
    if (!modelId) {
      alert("Train the model first");
      return;
    }

    window.location.href = `http://127.0.0.1:8000/download/${modelId}`;
  }

  return (
  <div className="flex justify-center-safe items-center-safe min-h-screen bg-primary-background select-none">
    <div className="border-2 rounded-xl bg-primary-highlight border-primary-text 
                    p-6 w-full max-w-3xl shadow-sm">

      {/* Header */}
      <h1 className="text-xl font-semibold mb-6 tracking-tight">
        {model.desc}
      </h1>

      {/* Parameters */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2 opacity-80">
          Model Parameters
        </h2>

        <div className="flex flex-wrap gap-3">
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
      </div>

      {/* Dataset Upload */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2 opacity-80">
          Dataset
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".csv"
            onChange={handleDatasetUpload}
            className="text-sm file:mr-3 file:py-1.5 file:px-3
                       file:rounded-md file:border-0
                       file:bg-primary-text file:text-primary-highlight
                       hover:file:opacity-90"
          />

          {dataset && (
            <span className="text-xs opacity-70 truncate max-w-[200px]">
              {dataset.name}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-primary-text/20">
        <Button
          label="Add Dataset"
          variant="secondary"
          onClick={() => {
            if (!dataset) alert("No dataset uploaded");
          }}
        />

        <Button
          label="Create & Fit Model"
          onClick={handleFit}
        />

        <Button
          label="Download Model"
          variant="secondary"
          onClick={handleDownload}
        />
      </div>

    </div>
  </div>
);

}
