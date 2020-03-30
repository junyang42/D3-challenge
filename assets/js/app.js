
// define the position
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// append svg
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data
d3.csv("assets/data/data.csv").then(function(temp_data) {
    // clear the NaN table in yaxis
    // if (err) throw err;
    
    temp_data.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        console.log(data.poverty);
        console.log(data.healthcare);
    });

    // define x axis starts from 8
    var xlinerScale = d3.scaleLinear()
        .domain([8, d3.max(temp_data, d => d.poverty)])
        .range([0, width]);
    
    // define y axis starts from 3    
    var ylinerScale = d3.scaleLinear()
        .domain([3, d3.max(temp_data, d => d.healthcare)])
        .range([height, 0]);
    
    var xAxis = d3.axisBottom(xlinerScale);
    var yAxis = d3.axisLeft(ylinerScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);
        
    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(temp_data)
        .enter()
        .append("circle")
        .attr('class', 'stateCircle')
        .attr("cx", d => xlinerScale(d.poverty))
        .attr("cy", d => ylinerScale(d.healthcare))
        .attr("r", "15")
        //.attr(fill = "black")
        .attr("opacity", ".5");   
        
    // Add states abbr
    var circlesState = chartGroup.selectAll('text.stateText')
        .data(temp_data)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('class', 'stateText')
        .attr('x', d => xlinerScale(d.poverty))
        .attr('y', d => ylinerScale(d.healthcare-0.3));
        //.attr(fill ='black');   
    
    // Add tooltip
    var tooltip = d3.tip()
        .attr("class","tip")
        .offset([80, -60])
        .html(function (d) {
            return (`<b><i>${d.state}</i></b><br>poverty index: ${d.poverty} %<br>healthcare index: ${d.healthcare} `);
        });
    chartGroup.call(tooltip);
    
    // Add label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50 )
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)"); 

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
        
});