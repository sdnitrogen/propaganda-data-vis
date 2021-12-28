// TODO: get article ID from main.js
function loadArticlePanel(articlesRs) {
    var titleDiv = document.createElement('div');
    titleDiv.classList.add('article-title');
    titleDiv.innerHTML += articlesRs.article_title;
    article.appendChild(titleDiv);

    var contentDiv = document.createElement('div');
    contentDiv.classList.add('article-content');
    contentDiv.innerHTML += articlesRs.article_content;
    article.appendChild(contentDiv);
}
