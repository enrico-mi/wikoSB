// Initialize all sketches
var graphic = new p5(graphicSketch, 'heatmap');
var polar = new p5(polarSketch, 'polar');
var region = new p5(mapSketch, 'region');

graphic.numFeatures = region.numFeatures;
region.verified = graphic.verified;
region.methodology = graphic.methodology;
region.coseismic = graphic.coseismic;
region.orientationIndex = graphic.orientationIndex;
region.failure = graphic.failure;
//      region.resolutionLength = graphic.resolutionLength;
// region.resolutionNeg = graphic.resolutionNeg;
region.angleSelection = graphic.angleSelection;
region.stressLines = graphic.stressLines;
// region.failureMode = graphic.failureMode;
setInterval(region.checkParameterValue, 10); // Check every .1 second

region.mechanismsMode = graphic.mechanismsMode;
setInterval(region.superposeMechanisms, 10);

region.clearStressLines = graphic.clearStressLines;
setInterval(region.statusStressLines, 10);

// no need to check values for polar plot as the draw function in p5
// refreshes automatically
polarPlotLayers = ['ruptures-Ponti','selected-Ponti'];
polar.polarPlotLengths = region.polarPlotLengths;
polar.polarPlotAngles = region.polarPlotAngles;
polar.polarPlotSelected = region.polarPlotSelected;
polar.orientationIndex = graphic.orientationIndex;
//polar.muColoring = graphic.muColoring;
setInterval(function() {
    region.polarPlotData(polarPlotLayers);
}, 100); // Check every 100ms

// mu slider value
const mu_value = document.querySelector("#mu_value");
const mu_input = document.querySelector("#mu_input");
let muColoring = {Value: 0};
mu_value.textContent = mu_input.value;
mu_input.addEventListener("input", (event) => {
    mu_value.textContent = event.target.value;
    muColoring.Value = event.target.valueAsNumber*10;
    region.muColoring = muColoring;
    graphic.muColoring = muColoring;
    polar.muColoring = muColoring;
});

// resolution slider value
const res_value = document.querySelector("#res_value");
const res_input = document.querySelector("#res_input");
let resolutionLength = {Value: 0};
var resolutionTextList = ["0","10","100","200"];//,"300","400"];
res_value.textContent = resolutionTextList[res_input.valueAsNumber];
res_input.addEventListener("input", (event) => {
    res_value.textContent = resolutionTextList[event.target.valueAsNumber];
    resolutionLength.Value = Number(resolutionTextList[event.target.valueAsNumber]);
    region.resolutionLength = resolutionLength;
    region.resolutionLength.res = event.target.value;
    graphic.resolutionLength = resolutionLength;
});

// resolution checkbox value
const resCheckbox = document.querySelector("#resolution-toggle");
let resolutionNeg = {Value: 0};
resCheckbox.addEventListener("change", () => {
    resolutionNeg.Value = resCheckbox.checked;
    graphic.resolutionNeg = resolutionNeg;
    region.resolutionNeg = resolutionNeg;
});

// methods radio button values
// const methodsRadio = document.querySelector('input[name="methods"]:checked');
// let methodology = {Value: 0};
// methodsRadio.addEventListener("change", () => {
//     methodology.Value = Number(methodsRadio.Value);
//     graphic.methodology = methodology;
//     region.methodology = methodology;
// });
