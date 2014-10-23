Pusher.log = function(message) {
  if (window.console && window.console.log) {
    window.console.log(message);
  }
};

var pusher = new Pusher("PUSHER_APP_KEY");
var apiURL = "http://tweet-stats-api.herokuapp.com";

// TODO: Pull active keywords from the API
$.getJSON(apiURL + "/keywords.json", function(keywords) {
  if (!keywords || keywords.length === 0) {
    console.log("No keywords");
    return;
  }

  var graphContainer = document.querySelector(".graph-container");
  var graphElements = {};
  var graphs = {};

  // Create graph DOM
  _.each(keywords, function(keyword) {
    // Generate graph header
    var graphHeaderElement = document.createElement("h2");
    graphHeaderElement.innerHTML = keyword;

    graphContainer.appendChild(graphHeaderElement);

    // Generate graph element
    var graphElement = document.createElement("div");
    graphElement.classList.add("epoch");
    graphElement.dataset.keyword = keyword;

    graphElements[keyword] = graphElement;

    graphContainer.appendChild(graphElement);
  });

  // Create graphs
  _.each(keywords, function(keyword) {
    // Get historic data
    $.getJSON(apiURL + "/stats/" + keyword + "/24hours.json", function(json) {
      var graphData = {
        label: keyword,
        values: []
      };

      _.each(json.data, function(data) {
        graphData.values.push({
          time: data.time / 1000,
          y: data.value
        });
      });

      var graphElement = graphElements[keyword];
      graphs[keyword] = $(graphElement).epoch({
        type: "time.area",
        data: [graphData],
        axes: ["left", "right", "bottom"],
        ticks: {right: 3, left: 3},
        windowSize: 60,
        height: graphElement.clientHeight
      });
    });
  })

  var statsChannel = pusher.subscribe("stats");

  statsChannel.bind("update", function(data) {
    _.each(data, function(stat, keyword) {
      var graph;
      if (graph = graphs[keyword]) {
        var values = [{
          time: stat.time / 1000,
          y: stat.value
        }];

        graph.push(values);
      }
    });
  });
});