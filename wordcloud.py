import re
from nltk.corpus import stopwords
from collections import Counter


def get_article_term_frequency(content):
    word_list = re.sub('[^\w]', " ", content.lower()).split()
    filtered_words = [word for word in word_list if word not in stopwords.words('english')]
    counts = Counter(filtered_words).items()
    wordcloud_rs = []
    for count in counts:
        wordcloud_rs.append({
            'word': count[0],
            'size': count[1]
        })
    return sorted(wordcloud_rs, key=lambda x: x['size'], reverse=True)
