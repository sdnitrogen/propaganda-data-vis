import json
import csv

import sys
maxInt = sys.maxsize
while True:
    # decrease the maxInt value by factor 10
    # as long as the OverflowError occurs.
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)

if __name__ == "__main__":
    H1 = {}
    for file_path in ["articles1.csv", "articles2.csv", "articles3.csv"]:
        with open(file_path, encoding="utf-8") as articles_file:
            reader = csv.reader(articles_file)
            header = next(reader)
            for index, row in enumerate(reader):
                id = row[1]
                article = str(row[9]).strip()
                H1[article] = id

    H2 = set()
    with open("Sentence.json", encoding="utf-8") as gathered_file:
        gathered_data = json.load(gathered_file)
        for data_item in gathered_data:
            article = data_item["article"].strip()
            H2.add(article)

    intersection = set(H1.keys()).intersection(H2)
    # print(len(intersection))
    HF = {}
    for key in intersection:
        HF[key] = H1[key]
    with open("ids.json", 'r', encoding="utf-8") as ids_file:
        existing_ids = json.load(ids_file)
        HF.update(existing_ids)
    with open("ids.json", 'w', encoding="utf-8") as ids_file:
        json.dump(HF, ids_file, ensure_ascii=False, indent=4)
