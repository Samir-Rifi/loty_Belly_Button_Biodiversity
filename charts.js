function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var metadata = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sortedotu_ids =result.otu_ids;
    var sortedotu_labels =result.otu_labels; 
    var sortedotu_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = sortedotu_ids.slice(0,10).map(otuid => `OTU ${otuid}`).reverse();
    var xticks = sortedotu_values.slice(0,10).reverse();
    

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x     : xticks,
      y     : yticks,
      text  : sortedotu_labels,
      type  : "bar",
      orientation : "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title : "Top 10 Bacteria"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',barData , barLayout);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////Deliverable 2///////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
    // 1. Create the trace for the bubble chart.
    var colors = [];
    while (colors.length < sortedotu_values.length) {
        do {
            var color = Math.floor((Math.random()*1000000)+1);
        } while (colors.indexOf(color) >= 0);
        colors.push("#" + ("000000" + color.toString(16)).slice(-6));
    }
    console.log(sortedotu_values);
    var bubbleData =  [{
      x     : sortedotu_ids,
      y     : sortedotu_values,
      text  : sortedotu_labels,
      type  : "bubble",
      mode  : 'markers',
      marker: {
      size  : sortedotu_values ,//Array.from(Array(sortedotu_values.length).keys()),
      color : colors
      }
                      }];

    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        showlegend: false,
        //height: 600,
        //width: 600
        };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////Deliverable 3///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 // 3. Create a variable that holds the washing frequency.
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    var wfreqdata = data.metadata;

    // 2. Create a variable that holds the first sample in the metadata array.
    var wfreqdata_resultArray = wfreqdata.filter(sampleObj => sampleObj.id == sample);
    var wfreqdata_result = wfreqdata_resultArray[0];

    // 3. //4 Create a variable that holds the washing frequency.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number+delta",
        value: parseInt(wfreqdata_result.wfreq),
        title: { text: "Scubs Per Week", font: { size: 10 } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "green" }
          ]
          
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title: { text: "Belly Button Washing Frequency", font: { size: 15 } },
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
    };

    
    // 6. Use Plotly to plot the gauge data and layout.    
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
  
}

