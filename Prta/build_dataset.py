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
    rows = {}
    # idx vs row
    mapping = dict()
    for articles_file_path in ["articles1.csv", "articles2.csv", "articles3.csv"]:
        with open(articles_file_path, encoding="utf-8") as articles_file:
            reader = csv.reader(articles_file)
            header = next(reader)
            for row in reader:
                row_idx = int(row[1])
                mapping[row_idx] = dict()
                mapping[row_idx]["title"] = row[2]
                mapping[row_idx]["publication"] = row[3]
                mapping[row_idx]["author"] = row[4]
                mapping[row_idx]["date"] = row[5]
                rows[row_idx] = row

    with open("ids.json", 'r', encoding="utf-8") as ids_file:
        ids = json.load(ids_file)

    with open("Propaganda.json", encoding="utf-8") as prop_file:
        prop_data = json.load(prop_file)
    with open("Bias.json", encoding="utf-8") as bias_file:
        bias_data = json.load(bias_file)
    with open("Sentence.json", encoding="utf-8") as sent_file:
        sent_data = json.load(sent_file)

    data = {}
    for prop_item in prop_data:
        article = str(prop_item["article"]).strip()
        prop_value = prop_item["prop"]
        idx = int(ids[article])
        if idx not in data:
            data[idx] = {}
        data[idx]["prop"] = prop_value

    for bias_item in bias_data:
        article = str(bias_item["article"]).strip()
        bias_value = bias_item["bias"]
        idx = int(ids[article])
        if idx not in data:
            data[idx] = {}
        data[idx]["bias"] = bias_value

    for sent_item in sent_data:
        article = str(sent_item["article"]).strip()
        sent_value = sent_item["sentence"]
        idx = int(ids[article])
        if idx not in data:
            data[idx] = {}
        data[idx]["sent"] = sent_value

    #saving title,publication,author,date 
    for key in data:
        data[key]["title"] = mapping[key]["title"]
        data[key]["publication"] = mapping[key]["publication"]
        data[key]["author"] = mapping[key]["author"]
        data[key]["date"] = mapping[key]["date"]


    # data2 = {}
    # for idx in data:
    #     item = data[idx]
    #     if "prop" in item and "sent" in item and "bias" in item:
    #         data2[idx] = data[idx]
    # data = data2

    print("Total items in the dataset: %d" % len(data))

    with open("data.json", "w+", encoding="utf-8") as data_file:
        json.dump(data, data_file, ensure_ascii=False, indent=4, sort_keys=True)
