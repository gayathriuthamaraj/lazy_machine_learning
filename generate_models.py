import json
import os
import re
from jinja2 import Environment, FileSystemLoader

CONTENT_JSON = "src/content.json"
OUT_DIR = "src/models"
TEMPLATE_DIR = "src/templates"

os.makedirs(OUT_DIR, exist_ok=True)

def safe_name(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9]", "", name)

# Load models
with open(CONTENT_JSON, "r") as f:
    models = json.load(f)

# Setup Jinja
env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=False
)

template = env.get_template("model.tsx.jinja")

imports = []
renders = []

for index, model in enumerate(models):
    component_name = safe_name(model["desc"])
    file_path = os.path.join(OUT_DIR, f"{component_name}.tsx")

    tsx_code = template.render(
        component_name=component_name,
        index=index
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(tsx_code)

    imports.append(f'import {component_name} from "./{component_name}";')
    renders.append(f"<{component_name} />")

# Generate call_main.tsx
call_main = f"""{chr(10).join(imports)}

export default function CallMain() {{
  return (
    <div className="space-y-10">
      {"".join(renders)}
    </div>
  );
}}
"""

with open(os.path.join(OUT_DIR, "call_main.tsx"), "w", encoding="utf-8") as f:
    f.write(call_main)

print("Model components and call_main.tsx generated successfully")
