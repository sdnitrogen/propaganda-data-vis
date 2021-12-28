from pathlib import Path
import json


FOLDER_NAMES = ["Ananya", "Chirag", "Kevin", "Siddhant"]
PROP_FILES = ["prta_collected_data/" + f + "/Propaganda.json" for f in FOLDER_NAMES]
BIAS_FILES = ["prta_collected_data/" + f + "/Bias.json" for f in FOLDER_NAMES]
SENT_FILES = ["prta_collected_data/" + f + "/Sentence.json" for f in FOLDER_NAMES]


if __name__ == "__main__":
    for index, FILES_LIST in enumerate([PROP_FILES, BIAS_FILES, SENT_FILES]):
        data = []
        for file_path in FILES_LIST:
            # print(files_path)
            with open(Path(file_path), 'r', encoding="utf-8") as f1:
                json_data = json.load(f1)
                for item in json_data:
                    data.append(item)
        # print(data)
        with open(Path(str(index)+".json"), "w+", encoding="utf-8") as f2:
            json.dump(data, f2, ensure_ascii=False, indent=4, sort_keys=True)
