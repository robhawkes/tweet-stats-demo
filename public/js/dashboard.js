Pusher.log = function(message) {
  if (window.console && window.console.log) {
    window.console.log(message);
  }
};

var pusher = new Pusher("PUSHER_APP_KEY");

var technologies = ["html5", "javascript", "css", "webgl", "websockets", "nodejs", "hello"];

var graphContainer = document.querySelector(".graph-container");
var graphElements = {};
var graphs = {};

// Create graph DOM
_.each(technologies, function(tech) {
  // Generate graph header
  var graphHeaderElement = document.createElement("h2");
  graphHeaderElement.innerText = tech;

  graphContainer.appendChild(graphHeaderElement);

  // Generate graph element
  var graphElement = document.createElement("div");
  graphElement.classList.add("epoch");
  graphElement.dataset.tech = tech;

  graphElements[tech] = graphElement;

  graphContainer.appendChild(graphElement);
});

// Create graphs
var yesterday = new Date();
yesterday.setHours(-23);
_.each(technologies, function(tech) {
  var graphData = {
    label: tech,
    values: [ { time: yesterday.getTime() / 1000, y: 0 } ]
  };

  // Get historic data
  $.getJSON("http://techdash.herokuapp.com/stats/" + tech + "/24hours.json", function(json) {

    _.each(json.data, function(data) {
      graphData.values.push({
        time: data.time / 1000,
        y: data.value
      });
    });

    createGraph(tech, graphData);

  }).fail(function() {
    createGraph(tech, graphData);
  });
});

var createGraph = function(tech, graphData) {
  var graphElement = graphElements[tech];
  graphs[tech] = $(graphElement).epoch({
    type: "time.area",
    data: [graphData],
    axes: ["left", "right", "bottom"],
    ticks: {right: 3, left: 3},
    windowSize: 60,
    height: graphElement.clientHeight
  });
};

var subscribe = function(tech) {
  var statsChannel = pusher.subscribe(tech);

  statsChannel.bind("update", function(stat) {
    var graph = graphs[tech];
    if (graph) {
      var values = [{
        time: stat.time / 1000,
        y: stat.value
      }];

      graph.push(values);
    }
  });
};

_.each(technologies, function(tech) {
  subscribe(tech);
});
