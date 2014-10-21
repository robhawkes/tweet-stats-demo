Pusher.log = function(message) {
  if (window.console && window.console.log) {
    window.console.log(message);
  }
};

var pusher = new Pusher("52db15e1600a742af0c9", {
  wsHost: "ws-megabus.pusher.com",
  httpHost: "sockjs-megabus.pusher.com"
});

var technologies = ["html5", "javascript", "css", "webgl", "websockets", "nodejs", "node.js"];

var graphContainer = document.querySelector(".graph-container");
var graphs = {};

_.each(technologies, function(tech) {
  // Generate graph header
  var graphHeaderElement = document.createElement("h2");
  graphHeaderElement.innerText = tech;

  graphContainer.appendChild(graphHeaderElement);

  // Generate graph element
  var graphElement = document.createElement("div");
  graphElement.classList.add("epoch");
  graphElement.dataset.tech = tech;

  graphContainer.appendChild(graphElement);

  // Create graph
  graphs[tech] = $(graphElement).epoch({
    type: "time.area",
    data: [{label: tech, values: [{time: Date.now() / 1000, y: 0}]}],
    axes: ["left", "right", "bottom"]
  });
});

var statsChannel = pusher.subscribe("stats");

statsChannel.bind("update", function(data) {
  _.each(data, function(stat, tech) {
    var graph;
    if (graph = graphs[tech]) {
      var values = [{
        time: stat.time / 1000,
        y: stat.value
      }];

      graph.push(values);
    }
  });
});