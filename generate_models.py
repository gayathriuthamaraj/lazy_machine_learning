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

def route_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

with open(CONTENT_JSON, "r", encoding="utf-8") as f:
    models = json.load(f)

env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=False
)

template = env.get_template("model.tsx.jinja")

route_entries = []
import_entries = []

# Generate model components
for index, model in enumerate(models):
    component_name = safe_name(model["desc"])
    route_path = route_name(model["desc"])

    file_path = os.path.join(OUT_DIR, f"{component_name}.tsx")

    tsx_code = template.render(
        component_name=component_name,
        index=index
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(tsx_code)

    import_entries.append(
        f'import {component_name} from "./{component_name}";'
    )

    route_entries.append(
        f'{{ name: "{model["desc"]}", path: "/models/{route_path}", element: <{component_name} /> }},'
    )

routes_file = f"""{"\n".join(import_entries)}

export const modelRoutes = [
  {chr(10).join(route_entries)}
];
"""

with open(os.path.join(OUT_DIR, "modelRoutes.tsx"), "w", encoding="utf-8") as f:
    f.write(routes_file)

print("Model pages and modelRoutes.tsx generated successfully")
