var query;
var from_date;
var to_date;

function getArticles(method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.setRequestHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5000/");
        xhr.setRequestHeader("Access-Control-Allow-Credentials", 'true');
        
        xhr.onload = function () {
            resolve(JSON.parse(xhr.response));
        };
        
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };

        xhr.send();
    });
}

function getArticle(method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.setRequestHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5000/article/");
        xhr.setRequestHeader("Access-Control-Allow-Credentials", 'true');
        
        xhr.onload = function () {
            resolve(JSON.parse(xhr.response));
        };
        
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };

        xhr.send();
    });
}

// function getArticleWordcloud(method, url) {
//     return new Promise(function (resolve, reject) {
//         var xhr = new XMLHttpRequest();

//         xhr.open(method, url);

//         xhr.setRequestHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5000/wordcloud/");
//         xhr.setRequestHeader("Access-Control-Allow-Credentials", 'true');
        
//         xhr.onload = function () {
//             resolve(JSON.parse(xhr.response));
//         };
        
//         xhr.onerror = function () {
//             reject({
//                 status: this.status,
//                 statusText: xhr.statusText
//             });
//         };

//         xhr.send();
//     });
// }