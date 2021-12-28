import spacy

ner = spacy.load("en_core_web_sm")


def get_article_ner(article_content):
    ner_response = ner(article_content)
    ner_map = [[ent.text, ent.start_char, ent.end_char, ent.label_] for ent in ner_response.ents]
    ner_map = sorted(ner_map, key=lambda x: x[1])
    return ner_map
