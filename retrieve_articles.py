import os
import re
import pandas as pd
import json
from datetime import datetime
import collections
import random
import math


def get_top_articles(query):
    ## Commented out cuz DB is incomplete for a good retrieval
    # dataset_folder = os.path.join(os.getcwd(), 'archive')
    # if not os.path.isdir(dataset_folder):
    #     print('Download the preprocessed dataset first from '
    #           'https://drive.google.com/drive/u/1/folders/1Qwv4Kl1IPNj0NpoSsEUbnG8hqwUu0waB')
    #     return
    #
    # with open('metadata.pickle', 'rb') as handle:
    #     metadata = pickle.load(handle)
    #
    # dataset_files = [dataset_file for dataset_file in os.listdir(dataset_folder)
    #                  if os.path.isfile(os.path.join(dataset_folder, dataset_file))]
    #
    # dataframes = []
    # for dataset_file in dataset_files:
    #     dataset_file_tokens = re.split('[.-]', dataset_file)
    #     if not (dataset_file_tokens[-1] == 'csv' and dataset_file_tokens[-2] == 'pp'):
    #         continue
    #
    #     dataset_file_path = os.path.join(dataset_folder, dataset_file)
    #     df = pd.read_csv(dataset_file_path)
    #     dataframes.append(df)
    #
    # frame = pd.concat(dataframes, axis=0, ignore_index=True)
    #
    # vectorizer = metadata['vectorizer']
    # transformed_frame = metadata['transformed_frame']
    #
    # query_vec = vectorizer.transform([query])
    #
    # results = cosine_similarity(transformed_frame, query_vec)
    #
    # filtered_results = (-np.reshape(results, (len(results)))).argsort()[:100]
    # articles = []
    # for i, filtered_result in enumerate(filtered_results):
    #     curr_article = frame.iloc[filtered_result]
    #     articles.append({
    #         'id': curr_article['id'],
    #         'title': curr_article['title'],
    #         'publication': curr_article['publication']
    #     })
    # return articles

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

    data_file = os.path.join(dataset_folder, 'data.json')
    with open(data_file, encoding='utf-8') as f:
        dataset = json.load(f)

    filtered_articles = []
    for article_id in dataset:
        if 'sent' not in dataset[article_id] or\
                'bias' not in dataset[article_id] or\
                dataset[article_id]['sent']['sentence_propaganda'][0]['prediction'] == 'Non-prop' or\
                dataset[article_id]['date'] == 'nan':
            continue
        filtered_article = dataset[article_id]['sent']['sentence_propaganda'][0]
        filtered_article['id'] = article_id
        filtered_article['title'] = dataset[article_id]['title']
        filtered_article['publication'] = dataset[article_id]['publication']
        filtered_article['date'] = dataset[article_id]['date']
        filtered_article['bias'] = dataset[article_id]['bias']
        filtered_articles.append(dataset[article_id]['sent']['sentence_propaganda'][0])
    filtered_articles = random.choices(sorted(filtered_articles, key=lambda x: x['confidence'], reverse=True), k=150)

    prop_set = set()
    for article in filtered_articles:
        article_prop_map = {}
        for tag in article['tags']:
            if tag == 'O':
                continue
            tag_tokens = tag.split(',')
            for tag_token in tag_tokens:
                prop_set.add(tag_token)
                if tag_token not in article_prop_map:
                    article_prop_map[tag_token] = 0
                article_prop_map[tag_token] += 1
        article['prop_map'] = article_prop_map

    prop_list = list(prop_set)
    cluster_map = {}
    for article in filtered_articles:
        total_prop = sum(article['prop_map'].values())
        article['prop_score'] = total_prop
        dominant_prop = max(article['prop_map'], key=article['prop_map'].get, default=None)
        if not dominant_prop:
            continue
        for prop in prop_set:
            if prop not in article['prop_map']:
                article['prop_map'][prop] = int(0)
        if dominant_prop not in cluster_map:
            cluster_map[dominant_prop] = []
        cluster_map[dominant_prop].append(article)

    cluster_rs = []
    for prop in cluster_map:
        prop_cluster = []
        for article in cluster_map[prop]:
            article_obj = {
                'cluster': prop_list.index(prop),
                'propaganda_name': prop,
                'propaganda_score': article['prop_score'],
                'title': article['title'],
                'id': article['id'],
                'publication': article['publication'],
                'date': article['date'],
                'all_propaganda_names': []
            }
            for prop_scores in article['prop_map']:
                if article['prop_map'][prop_scores] != 0:
                    article_obj[prop_scores] = article['prop_map'][prop_scores]
                    article_obj['all_propaganda_names'].append(prop_scores)
            prop_cluster.append(article_obj)
        cluster_rs.append({
            'children': prop_cluster
        })

    date_map = {}
    for article in filtered_articles:
        article_frame = frame.loc[frame['id'] == int(article['id'])]
        article_date_string = article_frame['date'].iloc[0].replace('/', '-')
        article_date = datetime.strptime(article_date_string, '%Y-%m-%d')

        if article_date not in date_map:
            date_map[article_date] = []
        date_map[article_date].append(article)

    date_map = collections.OrderedDict(sorted(date_map.items(), key=lambda x: x[0]))

    days_prop = []
    for date_key in date_map:
        day_prop = {
            'day': date_key
        }
        for prop in prop_set:
            if prop not in day_prop:
                day_prop[prop] = 0
        for article in date_map[date_key]:
            for prop in article['prop_map']:
                day_prop[prop] += article['prop_map'][prop]
        days_prop.append(day_prop)

    default_prop = {}
    for prop in prop_set:
        default_prop[prop] = 0

    start_date, end_date = days_prop[0]['day'].strftime("%d-%m-%Y"), days_prop[-1]['day'].strftime("%d-%m-%Y")
    metrics = {
        'start_date': start_date,
        'end_date': end_date,
        'max_prop': -1
    }

    streamgraph_rs, curr_day = [], None
    for index, day_prop in enumerate(days_prop):
        day_prop['day'] = index
        streamgraph_rs.append(day_prop)
        for prop in day_prop:
            if prop == 'day':
                continue
            metrics['max_prop'] = max(metrics['max_prop'], day_prop[prop])

    publication_map, publication_set = {}, set()
    for article in filtered_articles:
        if article['publication'] not in publication_map:
            publication_map[article['publication']] = {}
        article_month = '-'.join(article['date'].split('-')[:2])
        if article_month not in publication_map[article['publication']]:
            publication_map[article['publication']][article_month] = []
        publication_map[article['publication']][article_month].append(article['bias'])
        publication_set.add(article['publication'])

    start_month, end_month, end_index = start_date.split('-')[1:], end_date.split('-')[1:], -1
    motionchart_rs = []
    for publication in publication_map:
        bias_map = {
            'publication': publication
        }
        month_list, bias_list = [], []
        for month in sorted(publication_map[publication]):
            month_tokens = month.replace('/', '-').split('-')
            month_in_num = (int(month_tokens[0]) - int(start_month[1])) * 12 +\
                           (int(month_tokens[1]) - int(start_month[0]))
            end_index = max(end_index, month_in_num)
            left, center, right = 0, 0, 0
            for article in publication_map[publication][month]:
                left += article['left']
                center += article['center']
                right += article['right']
            month_list.append([month_in_num, month_in_num])
            bias_list.append([month_in_num, (left - right) / len(publication_map[publication][month])])
        bias_map['months'] = month_list
        bias_map['bias'] = bias_list
        motionchart_rs.append(bias_map)

    return {
        'cluster_rs': {
            'children': cluster_rs
        },
        'streamgraph_rs': {
            'streamgraph': streamgraph_rs,
            'metrics': metrics
        },
        'motionchart_rs': {
            'motionchart': motionchart_rs,
            'metrics': {
                'start_month': '-'.join(start_month),
                'end_month': '-'.join(end_month),
                'end_index': end_index
            }
        }
    }


if __name__ == '__main__':
    get_top_articles('Donald trump this, donald trump that')
