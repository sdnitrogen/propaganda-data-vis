var root;
function loadWordcloudPanel(wordcloud_rs) {
    // console.log(wordcloud_rs);
    var currentWordset = wordcloud_rs.slice(0, 20);
    // console.log(currentWordset);
    am5.ready(function() {
        if(root){
            root.dispose();
        }
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        root = am5.Root.new("wordcloud");
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        // Add series
        // https://www.amcharts.com/docs/v5/charts/word-cloud/
        var series = root.container.children.push(am5wc.WordCloud.new(root, {
            categoryField: "word",
            valueField: "size",
            maxFontSize: am5.percent(35),
            minFontSize: am5.percent(5)
        }));
        // Configure labels
        series.labels.template.setAll({
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 5,
            fontFamily: "Courier New",
            fill: "white",
        });
        series.data.setAll(currentWordset);
        console.log(currentWordset);
        series.labels.template.set("tooltipText", "[#000]Frequency: {size}[/]");
    });
}


