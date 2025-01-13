import os
import json

def scan_folder(base_path):
    animation_data = {}

    for root, dirs, files in os.walk(base_path):
        relative_path = os.path.relpath(root, base_path)
        path_parts = relative_path.split(os.sep)
        
        if path_parts[0] == '.':
            continue
            
        current_dict = animation_data
        
        # Bikin struktur folder ke JSON
        for i, part in enumerate(path_parts[:-1]):
            part = part.upper()
            if part not in current_dict:
                current_dict[part] = {}
            current_dict = current_dict[part]

        # Cari semua file PNG yang ada
        frames = [file for file in files if file.endswith('.png')]
        if frames:
            frames.sort()
            first_file = frames[0]
            base_name = os.path.splitext(first_file)[0]  # Buang extension .png nya
            
            if '_' in first_file:
                # Kalo ada underscore (_), pake cara yang lama
                base_pattern = base_name.split('_')[0].upper()
                file_pattern = '_'.join(base_name.split('_')[:-1]) + '_'
            else:
                # Kalo ga ada underscore, pake nama file utuh
                base_pattern = base_name.upper()
                file_pattern = base_name
            
            # Tambahin ../assets/ di depan path
            path = "../../assets/" + os.path.join(relative_path, file_pattern).replace("\\", "/")
            current_dict[base_pattern] = {
                "PATH": path,
                "FRAMES": len(frames),
                "TYPE": "SINGLE" if len(frames) == 1 else "LOOP"  # Kalo cuma 1 frame, jadiin SINGLE
            }
            if len(frames) > 1:
                current_dict[base_pattern]["DELAY"] = 100  # Tambahin DELAY kalo lebih dari 1 frame

    return animation_data

def save_json(data, output_file):
    """
    Nyimpen data ke file JSON
    """
    with open(output_file, "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__": 
    base_path = "../assets"  # Folder yang mau di scan
    output_file = "../assets/assets.json" # Hasil JSON bakal disimpen disini

    animation_json = scan_folder(base_path)
    save_json(animation_json, output_file)

    print(f"File JSON udah jadi di: {output_file}")