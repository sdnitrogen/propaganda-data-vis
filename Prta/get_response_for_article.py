from .prta_response import get_score_by_sentence
from collections import defaultdict


def get_response_for_article(article):

    sentences = article.split(".")
    
    #combining multiple  sentences to minimize the number of calls
    sentence_arr = [sentences[0]]
    for i in range(1,len(sentences)):
        if len(sentence_arr[-1]) + len(sentences[i]) <= 1000:
            s1 = sentence_arr.pop()
            s = s1 + sentences[i]
            sentence_arr.append(s)
        else:
            sentence_arr.append(sentences[i])

    #dict to save the count of all the 
    propaganda_dict = defaultdict(int)

    #making call for each sentence in the sentence_arr
    for sentence in sentence_arr:
        get_data = get_score_by_sentence(sentence)
        is_propaganda = get_data["prediction"]
        tags = get_data["tags"]
        confidence_of_prediction = get_data["confidence"]
        if is_propaganda == "Prop":
            for tag in tags:
                propaganda_dict(tag) +=1

    propaganda_dict.pop("O") 
    return propaganda_dict
    
              
