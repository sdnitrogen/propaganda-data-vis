import re
import os.path
import os
import csv
import sys
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

csv.field_size_limit(sys.maxsize)


def dump_metadata():
    dataset_folder = os.path.join(os.getcwd(), 'archive')
    if not os.path.isdir(dataset_folder):
        print('Download the preprocessed dataset first from '
              'https://drive.google.com/drive/u/1/folders/1Qwv4Kl1IPNj0NpoSsEUbnG8hqwUu0waB')
        return

    dataset_files = [dataset_file for dataset_file in os.listdir(dataset_folder)
                     if os.path.isfile(os.path.join(dataset_folder, dataset_file))]

    dataframes = []
    for dataset_file in dataset_files:
        dataset_file_tokens = re.split('[.-]', dataset_file)
        if not (dataset_file_tokens[-1] == 'csv' and dataset_file_tokens[-2] == 'pp'):
            continue

        dataset_file_path = os.path.join(dataset_folder, dataset_file)
        df = pd.read_csv(dataset_file_path)
        dataframes.append(df)

    frame = pd.concat(dataframes, axis=0, ignore_index=True)
    vectorizer = TfidfVectorizer()
    transformed_frame = vectorizer.fit_transform(frame['content'])

    metadata_file = os.path.join(os.getcwd(), 'metadata.pickle')
    with open(metadata_file, 'wb') as handle:
        pickle.dump({
            'vectorizer': vectorizer,
            'transformed_frame': transformed_frame
        }, handle)


if __name__ == '__main__':
    dump_metadata()
