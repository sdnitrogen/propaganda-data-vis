from flask import Flask
from flask_cors import CORS, cross_origin
import json

import retrieve_article
import retrieve_articles

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/<search_criteria>")
@cross_origin()
def landing(search_criteria):
    articles_rs = retrieve_articles.get_top_articles(search_criteria)
    return json.dumps(articles_rs)


@app.route("/article/<article_id>")
@cross_origin()
def get_article_ner(article_id):
    article_rs = retrieve_article.get_article_content(article_id)
    return json.dumps(article_rs)


if __name__ == '__main__':
    app.run(debug=True, use_debugger=False, use_reloader=False, passthrough_errors=True)
