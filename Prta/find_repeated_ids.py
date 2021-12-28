import json


if __name__ == "__main__":
    HF = {}
    with open("ids.json", 'r', encoding="utf-8") as ids_file:
        existing_ids = json.load(ids_file)
        HF.update(existing_ids)

    s = set()
    repeated = []
    for v in HF.values():
        if int(v) in s:
            repeated.append(int(v))
        else:
            s.add(int(v))
    print("Repeated ids: %s" % repeated)

    print("Difference: %s" % (len(HF.values()) - len(set(HF.values()))))
