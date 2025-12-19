import json
import os
import re

CONTENT_JSON = "src/content.json"
OUT_DIR = "src/models"

os.makedirs(OUT_DIR, exist_ok=True)

def safe_name(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9]", "", name)

with open(CONTENT_JSON, "r") as f:
    models = json.load(f)

component_template = """import data from "../content.json";
import Dropdown from "../components/dropdown";
import NumberInput from "../components/number";

type DropdownItem = {{
  id: number;
  desc: string;
  options: string[];
}};

type NumberItem = {{
  id: number;
  desc: string;
  float_bool: boolean;
  allowMin?: boolean;
  allowMax?: boolean;
  min?: number;
  max?: number;
}};

export default function {component_name}() {{
  const model = data[{index}];

  const dropdown_items = (model?.dropdown?.content ?? []) as DropdownItem[];
  const number_items = (model?.number_input?.content ?? []) as NumberItem[];

  return (
    <div className="flex justify-center-safe items-center-safe min-h-screen min-w-screen select-none">
      <div className="border-2 rounded bg-primary-highlight border-primary-text pb-3 pt-10 px-5">
        <h1 className="text-xl font-semibold mb-4">{{model.desc}}</h1>

        {{dropdown_items.map(item => (
          <Dropdown key={{item.id}} id={{item.desc}} options={{item.options}} />
        ))}}

        {{number_items.map(item => (
          <NumberInput
            key={{item.id}}
            id={{item.desc}}
            float={{item.float_bool}}
            allowMin={{item.allowMin}}
            allowMax={{item.allowMax}}
            min={{item.min}}
            max={{item.max}}
          />
        ))}}
      </div>
    </div>
  );
}}
"""

imports = []
renders = []

for i, model in enumerate(models):
    name = safe_name(model["desc"])
    file_path = os.path.join(OUT_DIR, f"{name}.tsx")

    tsx_code = component_template.format(
        component_name=name,
        index=i
    )

    with open(file_path, "w") as f:
        f.write(tsx_code)

    imports.append(f'import {name} from "./{name}";')
    renders.append(f"<{name} />")

# generate call_main.tsx
call_main = f"""{"\n".join(imports)}

export default function CallMain() {{
  return (
    <div className="space-y-10">
      {"".join(renders)}
    </div>
  );
}}
"""

with open(os.path.join(OUT_DIR, "call_main.tsx"), "w") as f:
    f.write(call_main)

print("Model components and call_main.tsx generated")
