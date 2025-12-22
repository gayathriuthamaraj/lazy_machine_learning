import { useState } from "react";
import data from "./content.json";
import Dropdown from "./components/dropdown";
import NumberInput from "./components/number";
import Button from "./components/Button";

//this is actually really great

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

type ParamValue = string | number | boolean;

export default function Theme_check() {
  const model = data[0];

  const dropdown_items = (model?.dropdown?.content ?? []) as DropdownItem[];
  const number_items = (model?.number_input?.content ?? []) as NumberItem[];

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

      if (!res.ok) throw new Error("Training failed");

      const data = await res.json();
      setModelId(data.model_id);

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
    <div className="min-h-screen flex items-center justify-center-safe
                    bg-gradient-to-br from-primary-background to-black/10
                    select-none px-4">

      <div className="w-full max-w-4xl
                      rounded-2xl border border-primary-text/30
                      bg-primary-highlight/90 backdrop-blur
                      shadow-lg shadow-black/10 p-7">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {model.desc}
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Configure parameters, upload data, and train your model
          </p>
        </div>

        {/* Parameters */}
        <section className="mb-7">
          <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70 mb-3">
            Model Parameters
          </h2>

          <div className="flex flex-wrap gap-4 p-4
                          rounded-xl border border-primary-text/20
                          bg-primary-background/40">
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
        </section>

        {/* Dataset */}
        <section className="mb-7">
          <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70 mb-3">
            Dataset
          </h2>

          <div className="flex items-center gap-4 p-4
                          rounded-xl border border-dashed border-primary-text/30
                          bg-primary-background/30">
            <input
              type="file"
              accept=".csv"
              onChange={handleDatasetUpload}
              className="text-sm
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:bg-primary-text file:text-primary-highlight
                         file:font-medium
                         hover:file:opacity-90"
            />

            {dataset ? (
              <span className="text-xs opacity-80 truncate max-w-[240px]">
                {dataset.name}
              </span>
            ) : (
              <span className="text-xs opacity-50">
                No file selected
              </span>
            )}
          </div>
        </section>

        {/* Actions */}
        <section className="pt-5 border-t border-primary-text/20
                            flex flex-wrap gap-4 justify-end">
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
        </section>

      </div>
    </div>
  );
}
