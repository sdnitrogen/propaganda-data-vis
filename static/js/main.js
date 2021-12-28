const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const searchInput = document.querySelector("input");
searchInput.value = "";
const searchData = document.querySelector(".search-data");
const loader = document.querySelector(".loader");
const loader_article = document.querySelector(".loader_article");
const loader_wordcloud = document.querySelector(".loader_wordcloud");
const placeholder_article = document.querySelector(".placeholder_article");
const placeholder_wordcloud = document.querySelector(".placeholder_wordcloud");
const fromdate = document.querySelector("#fromdate");
const todate = document.querySelector("#todate");
const article = document.getElementById('article');
const wordcloud = document.getElementById('wordcloud');
var tooltipdiv;
var loadercount = 0;

searchBtn.onclick = () => {
    searchBox.classList.add("active");
    searchBtn.classList.add("active");
    searchInput.classList.add("active");
    cancelBtn.classList.add("active");
    searchInput.focus();
    if (searchInput.value != "") {
        var values = searchInput.value;
        loader.style.opacity = 1;
        if(loadercount == 1){
          loader.style.top = "4%";
          loader.style.left = "35%";
        }
        
        //TODO: get search criteria from html
        getArticles('GET', "http://127.0.0.1:5000/" + "Trump").then(function (datums) {
          while (article.firstChild) {
            article.removeChild(article.firstChild);
          }
          while (wordcloud.firstChild) {
            wordcloud.removeChild(wordcloud.firstChild);
          }
          placeholder_article.style.opacity = 1;
          placeholder_wordcloud.style.opacity = 1;
          loader.style.opacity = 0;
          loadercount = 1;
          searchData.classList.remove("active");
          searchData.innerHTML =
              "Search result for : " +
              "<span style='font-weight: 500;'>" +
              values +
              "</span>";
          searchBox.classList.add("searched-mode");
          document.querySelector(".wrapper").classList.add("active");
          loadStreamGraph(datums.streamgraph_rs,'',[],[]);
          loadCluster(datums.cluster_rs,datums.streamgraph_rs);
          loadMotionChartPanel(datums.motionchart_rs);
        }).catch(function(err) {
          loader.style.opacity = 0;
          searchData.innerHTML =
              ":( couldn't find result.";
          console.log(err);
        });
        
        tooltipdiv = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    } else {
        searchData.textContent = "";
    }
};
cancelBtn.onclick = () => {
    if (searchBox.classList.contains("searched-mode")) {
        cancelBtn.classList.remove("active");
        searchData.classList.toggle("active");
        searchInput.value = "";
    }
    else {
        searchBox.classList.remove("active");
        searchBtn.classList.remove("active");
        searchInput.classList.remove("active");
        cancelBtn.classList.remove("active");
        searchData.classList.toggle("active");
        searchInput.value = "";
    }
};
searchInput.onkeyup = (event) => {
  event.preventDefault;
  if (event.keyCode === 13) {
    searchBtn.click();
  }
};