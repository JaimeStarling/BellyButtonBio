function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    d3.json("static/data/samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildBarChart(firstSample);
        buildBubbleChart(firstSample);
        buildGaugeChart(firstSample);
        buildMetadata(firstSample);
    });
}
// Initialize the dashboard
init();
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
    buildGaugeChart(newSample);
}
// Demographics Panel 
function buildMetadata(sample) {
    d3.json("static/data/samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        PANEL.html("");
        // Use `Object.entries` to add each key and value pair to the panel. Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}

// 1. Create the buildCharts function.
function buildBarChart(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("static/data/samples.json").then((data) => {
        // 3. Create a variable that holds the samples array.
        var samples = data.samples;
        // 4. Create a variable that filters the samples for the object with the desired sample number.
        var sample_data = samples.filter(x => x.id == sample);
        console.log(sample_data);
        //  5. Create a variable that holds the first sample in the array.
        sample_data = sample_data[0];
        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otu_ids = sample_data.otu_ids;
        var otu_labels = sample_data.otu_labels;
        var sample_values = sample_data.sample_values;
        // 7. Create the yticks for the bar chart. Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 
        var yticks = otu_ids.map(x => `OTU ${x}`);
        // 8. Create the trace for the bar chart. 
        var trace1 = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks.slice(0, 10).reverse(),
            hovertext: otu_labels.slice(0, 10).reverse(),
            name: 'Top Bacteria',
            orientation: "h",
            marker: {
                color: "MediumSeaGreen"
            },
            type: 'bar'
        }
        var barData = [trace1];
        // 9. Create the layout for the bar chart. 
        var barLayout = { 
            title: "Top 10 Bacteria Cultures Found",
            xaxis: { title: "Amount of Bacteria" }
        };

        // 10. Use Plotly to plot the data with the layout. 
        Plotly.newPlot('bar', barData, barLayout);
    });
}
// Bar done, now Bubble chart
// Create the buildCharts function
function buildBubbleChart(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("static/data/samples.json").then((data) => {
      // Create a variable that holds the samples array.
        var samples = data.samples;
      // Create a variable that filters the samples for the object with the desired sample number.
        var sample_data = samples.filter(x => x.id == sample);
      // Create a variable that holds the first sample in the array.
        sample_data = sample_data[0];
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otu_ids = sample_data.otu_ids;
        var otu_labels = sample_data.otu_labels;
        var sample_values = sample_data.sample_values; 
  
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values
            },
            hovertext: otu_labels
        };
        //Deliverable 1 Step 10. Use Plotly to plot the data with the layout.
        // Plotly.newPlot(); 
  
      // 1. Create the trace for the bubble chart.
        var bubbleData = [trace1];
  
      // 2. Create the layout for the bubble chart.
        var bubbleLayout = { 
            title: "Bacteria Cultures Per Sample",
            yaxis: { title: "Count of Bacteria" },
            xaxis: { title: "OTU ID" }
        };
  
      // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
    });
}

// Create the buildCharts function.
function buildGaugeChart(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    d3.json("static/data/samples.json").then((data) => {
      // Create a variable that holds the samples array.
        var metadata = data.metadata;
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata_data = metadata.filter(x => x.id == sample);
        // console.log(sample_data);
      // 2. Create a variable that holds the first sample in the metadata array.
        metadata_data = metadata_data[0];
      // 3. Create a variable that holds the washing frequency.  
        var wfreq = metadata_data.wfreq;

        var trace1 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "Scrubs Per Week" },
            type: "indicator",
            mode: "gauge+number+delta",
            delta: { reference: 5 },
            gauge: {
                axis: { range: [null, 10] },
                steps: [
                    { range: [0, 2], color: "red" },
                    { range: [2, 4], color: "orange" },
                    { range: [4, 6], color: "yellow"},
                    { range: [6, 8], color: "limegreen"},                    
                    { range: [8, 10], color: "darkgreen"}                    
                  ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 490               
                }
            }
        };
      // 4. Create the trace for the gauge chart.   
        var gaugeData = [trace1];
      // 5. Create the layout for the gauge chart.
        var gaugeLayout = {
            title: "Belly Button Washing Frequency"
        };
      // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
}   