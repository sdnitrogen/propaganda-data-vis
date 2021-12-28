import requests 
from time import sleep, time
import csv
import json
from random import Random


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


# All times are in seconds
TIME_OVERRIDE = False
SLEEP_BETWEEN_POST_AND_GET = 10
SLEEP_BETWEEN_2_CALLS = 90
SEED = int(time())

LINES = {
    "articles1": 53290,
    "articles2": 50160,
    "articles3": 42570
}


def get_printable_request_response(response: requests.Response):
    return (
        str({
            "method": response.request.method,
            "url": response.request.url,
            "body": response.request.body
        }),
        str({
            "status_code": response.status_code,
            "text": response.text
        })
    )


def make_api_call(url, data, call_name):
    start_time = time()
    post_response = requests.post(url=url, data=data)
    if post_response.status_code != 200:
        printable_request, printable_response = get_printable_request_response(post_response)
        print("Error while executing request: %s; the returned response was: %s" %
              (printable_request, printable_response))
        return None
    post_data = post_response.json()
    sleep(SLEEP_BETWEEN_POST_AND_GET)
    get_response = requests.get(url + "?key=" + post_data["key"])
    if get_response.status_code != 200:
        printable_request, printable_response = get_printable_request_response(get_response)
        print("Error while executing request: %s; the returned response was: %s" %
              (printable_request, printable_response))
        return None
    end_time = time()
    print("Total time spent on the %s API call was %.3fs" % (call_name, end_time-start_time))
    return get_response.json()


def get_propaganda_score(article, write_to_file="Propaganda.json"):
    response = make_api_call(url="http://webapi.tanbih.org/article/propaganda", data={'text': article},
                             call_name="propaganda")
    if response is None:
        return
    with open(write_to_file, "a+") as propaganda_file:
        propaganda_file.write(json.dumps({
            "article": article,
            "prop": response["propaganda_score"]
        }, ensure_ascii=False) + "\n")
        propaganda_file.flush()


def get_bias_score(article, write_to_file="Bias.json"):
    response = make_api_call(url="http://webapi.tanbih.org/article/bias", data={'text': article},
                             call_name="bias")
    if response is None:
        return
    with open(write_to_file, "a+") as bias_file:
        bias_file.write(json.dumps({
            "article": article,
            "bias": response["bias"]
        }, ensure_ascii=False) + "\n")
        bias_file.flush()


def get_score_by_sentence(article, write_to_file="Sentence.json"):
    response = make_api_call(url="http://webapi.tanbih.org/article/propaganda/sentences", data={'text': article},
                             call_name="sentence")
    if response is None:
        return
    with open(write_to_file, "a+") as sentence_file:
        sentence_file.write(json.dumps({
            "article": article,
            "sentence": response
        }, ensure_ascii=False) + "\n")
        sentence_file.flush()


def run_script():
    # article = """Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus.
    # Most people infected with the virus will experience mild to moderate respiratory illness and recover without requiring
    # special treatment. However, some will become seriously ill and require medical attention. Older people and those with
    # underlying medical conditions like cardiovascular disease, diabetes, chronic respiratory disease, or cancer are more
    # likely to develop serious illness. Anyone can get sick with COVID-19 and become seriously ill or die at any age. The
    # best way to prevent and slow down transmission is to be well informed about the disease and how the virus spreads.
    # Protect yourself and others from infection by staying at least 1 metre apart from others, wearing a properly fitted
    # mask, and washing your hands or using an alcohol-based rub frequently. Get vaccinated when it’s your turn and follow
    # local guidance."""
    article = """Beware anti-gunners presenting history. That’s a lesson the Supreme Court justices and their clerks should remember as they read the State of New York’s brief in the big Second Amendment case New York State Rifle & Pistol Association v. Bruen. We all should have learned this lesson from the Michael Bellesiles scandal. In 2000, Bellesiles published a book claiming to have found that gun ownership was not widespread in colonial America. The book won the prestigious Bancroft Prize for historical scholarship. But the prize later was revoked after independent scholars exposed Bellesiles’s shoddy and misleading research. Bellesiles resigned from his post at Emory University. Of course, Bellesiles is an extreme case, and each individual work of history needs to be evaluated on its own merits. But the precedent set by Bellesiles counsels caution when presented with historical arguments that discount or mischaracterize the Founders’ lived experiences and the importance (dare I say, necessity) of firearms to their survival. Such caution is well warranted with respect to New York’s brief in the Bruen case. The state tries desperately, but unsuccessfully, to find historical support for its law tightly restricting the right to carry guns outside the home."""

    print ("The random seed is %d" % SEED)
    random = Random(SEED)

    while True:

        try:
            article_index = random.randint(1, sum(LINES.values()))
            articles_file_name = "articles1" if article_index < LINES["articles1"] else \
                "articles2" if article_index < LINES["articles1"] + LINES["articles2"] else \
                "articles3"
            article_index_in_file = (article_index if articles_file_name=="articles1" else
                article_index-LINES["articles1"] if articles_file_name=="articles2" else
                article_index-LINES["articles1"]-LINES["articles2"]) % LINES[articles_file_name]
            print("Getting article with article_index=%d in file=%s which is article_index_in_file=%d" % (
                article_index, articles_file_name, article_index_in_file
            ))

            with open(articles_file_name + ".csv", encoding="utf8") as articles_file:
                reader = csv.reader(articles_file)
                header = next(reader)

                start_time = time()
                for index, row in enumerate(reader):
                    if index != article_index_in_file:
                        continue
                    a = row[9]
                    # print(a)
                    get_propaganda_score(a)
                    get_bias_score(a)
                    get_score_by_sentence(a)
                    elapsed = time() - start_time
                    # print("Done " + str(index+1) + " articles in " + str(elapsed) + "s. Rate=" + str((index+1)/elapsed) +
                    #       "/s")
                    print("###############################################################################")
                    break
        except Exception as e:
            print(e)

        if not TIME_OVERRIDE:
            sleep(SLEEP_BETWEEN_2_CALLS)


if __name__ == "__main__":
    run_script()
