import os
import pandas as pd
import re

import named_entity_recognition
import wordcloud


def get_article_content(article_id):
    dataset_folder = os.path.join(os.getcwd(), 'archive')
    if not os.path.isdir(dataset_folder):
        print('Download the preprocessed dataset first from '
              'https://drive.google.com/drive/u/1/folders/1Qwv4Kl1IPNj0NpoSsEUbnG8hqwUu0waB')
        return

    dataframe_files = [dataframe_file for dataframe_file in os.listdir(dataset_folder)
                       if os.path.isfile(os.path.join(dataset_folder, dataframe_file))]

    dataframes = []
    for dataframe_file in dataframe_files:
        dataframe_file_tokens = re.split('[.-]', dataframe_file)
        if not (dataframe_file_tokens[-1] == 'csv' and dataframe_file_tokens[-2] != 'pp'):
            continue
        dataframe_file_path = os.path.join(dataset_folder, dataframe_file)
        df = pd.read_csv(dataframe_file_path)
        dataframes.append(df)

    frame = pd.concat(dataframes, axis=0, ignore_index=True)
    article_frame = frame.loc[frame['id'] == int(article_id)]
    article_title, article_content = article_frame['title'].iloc[0], article_frame['content'].iloc[0]

    article_ner = named_entity_recognition.get_article_ner(article_content)

    curr_index, article_content_with_color_coding = 0, ''
    for entity in article_ner:
        article_content_with_color_coding += article_content[curr_index: entity[1]]
        article_content_with_color_coding += "<span class=\"" + \
                                             entity[3] + \
                                             "\">" + \
                                             entity[0] + \
                                             "&emsp;" + \
                                             entity[3] + \
                                             "</span>"
        curr_index = entity[2]
    article_content_with_color_coding += article_content[curr_index:]

    article_term_frequency = wordcloud.get_article_term_frequency(article_content)

    return {
        'article_rs': {
            'article_title': article_title,
            'article_content': article_content_with_color_coding
        },
        'wordcloud_rs': article_term_frequency
    }
