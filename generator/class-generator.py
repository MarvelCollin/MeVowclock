import json
import os

def generate_getter_name(path_parts):
    """Bikin nama getter dari path yang ada"""
    return "get" + "".join(part.capitalize() for part in path_parts)

def generate_getter_path(path_parts):
    """Bikin path buat akses JSON nya"""
    return ".".join(path_parts)

def process_json_structure(data, current_path=None, getters=None):
    """Scan JSON terus bikin getter method yang dilengkapi dengan try-catch"""
    if getters is None:
        getters = []
    if current_path is None:
        current_path = []

    for key, value in data.items():
        path = current_path + [key]
        
        # Kalo nemu PATH, berarti ini data animasi
        if isinstance(value, dict) and "PATH" in value:
            getter_name = generate_getter_name(path)
            getter_path = generate_getter_path(path)
            
            # Check if there is only one frame
            type_field = ""
            if "frames" in value and len(value["frames"]) == 1:
                type_field = "\n        assets.%s.TYPE = 'SINGLE';" % getter_path

            # Bikin method getternya dengan try-catch
            getter = f"""
        async {getter_name}() {{
            try {{
                const assets = await this.fetchAssets();
                return assets.{getter_path};{type_field}
            }} catch (error) {{
                console.error('Error in {getter_name}:', error);
                return null;
            }}
        }}"""
            getters.append(getter)
        
        # Kalo masih ada folder dalam folder, lanjut scan
        elif isinstance(value, dict):
            process_json_structure(value, path, getters)
    
    return getters

def generate_assets_class(json_file_path, output_file_path):
    """Bikin file assets.js"""
    # Baca file JSON nya
    with open(json_file_path, 'r') as f:
        data = json.load(f)
    
    # Generate semua method getter
    getters = process_json_structure(data)
    
    # Template buat class nya
    class_code = """
class Assets {
    static instance = null;
    static assets = null;

    constructor() {
        if (Assets.instance) {
            return Assets.instance;
        }
        Assets.instance = this;
    }

    async fetchAssets() {
        if (Assets.assets) {
            return Assets.assets;
        }
        const response = await fetch('../assets/assets.json');
        if (!response.ok) {
            throw new Error('Waduh error nih: ' + response.statusText);
        }
        Assets.assets = await response.json();
        return Assets.assets;
    }
%s

}

const assetsInstance = new Assets();
export default assetsInstance;
"""
    
    # Gabungin semua getter nya
    final_code = class_code % "\n".join(getters)
    
    # Simpen ke file
    with open(output_file_path, 'w') as f:
        f.write(final_code)

if __name__ == "__main__":
    json_path = "../assets/assets.json"
    js_output_path = "../src/js/car/assets.js"
    
    generate_assets_class(json_path, js_output_path)
    print(f"File assets.js udah jadi di: {js_output_path}")