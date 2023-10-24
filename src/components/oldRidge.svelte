<script>
import P5 from "p5-svelte";

let ciao = 'ciao'

const sketch = (p5) => {
    p5.setup = () => {
	p5.createCanvas(865, 400);
	p5.background(0);
	p5.stroke('#ed225d');
	/* p5.loadTable('./prova/prova.csv', 'csv'); */
	/* p5.loadImage('./prova.png'); */
	console.log(ciao);
    }
    
    p5.draw = () => {
	p5.translate(p5.width / 2, p5.height / 2);

	let v = p5.createVector(p5.random(-100, 100), p5.random(-100, 100));
	v.mult(p5.random(50, 100));

	p5.strokeWeight(1);
	p5.line(0, 0, v.x, v.y);
    };
};
</script>

<P5 {sketch} />


<!-- <script>

     import P5 from "p5-svelte";
     import chroma from "chroma-js";
     import utils from "utils-js";

     const sketch = (p5) =>{
     let sHor = 0;
     let ang = 0;
     let res = 0;
     let ver = 0;
     let cos = 0;
     let negRes = 0;
     let imin = [];
     let jmin = [];
     let jmin_cols = [];

     let cscheme = chroma.scale('Blues');//.mode('lch');
     // get the minimum and maximum values of the color scale domain

     // get the minimum and maximum values of the color scale domain
     let [minColorVal, maxColorVal] = cscheme.domain();
     let minVal = 0;  // minimum value of the matrix
     let maxVal = 20;  // maximum value of the matrix
     let colorbarHeight = 500;
     let numColorbarSteps = 10;
     let colorbarStepSize = colorbarHeight / numColorbarSteps;
     
     let slider_y_int = 50;
     let slider_y_0 = 650;
     let slider_x_0 = 20;
     
     let matrix_y_0 = 50;
     let matrix_x_0 = 80;

     let mu_vals = [];
     let depth_vals = [];

     var orientationTextList = ["N0E","N13E"];
     var orientationCSVList = ["00","13"];
     var anglesTextList = ["All","[30,60]"];
     var anglesCSVList = ["All","3060"];
     var resolutionTextList = ["0","10","100","200"];//,"300","400"];
     var resolutionCSVList = ["0000","0010","0100","0200"];//,"0300","0400"]; 
     var negResolutionTextList = ["No","Yes"];
     var verifiedTextList = ["All","Yes"];
     var verifiedCSVList = ["All","Yes"];
     var coseismicTextList = ["No","Yes"];
     var coseismicCSVList = ["No","Yes"];

     var depthValues = [];
     var muValues = [];
     var betaValues = [];
     let beta;

     let previousValues = [];

     let size = 50;

     let matrix = [];
     let numRows = 18;
     let numCols = 10;
     for (var r = 0; r < numRows; r++) {
     matrix[r] = [];
     for (var c = 0; c < numCols; c++) {
     matrix[r][c] = [];
     }
     }

     var images=[];
     for (var a = 0; a < anglesCSVList.length; a++) {
     images[a] = [];
     // looping also for negative of resolution
     for (var r = 0; r < 2*resolutionCSVList.length-1; r++) {
     images[a][r] = [];
     for (var v = 0; v < verifiedCSVList.length; v++) {
     images[a][r][v] = [];
     for (var c = 0; c < coseismicCSVList.length; c++) {
     images[a][r][v][c] = [];
     }
     }
     }
     }

     let text_err = "";
     let x_err = 0;
     let y_err = 0;

     let smallerThanRandom = [];
     for (var r = 0; r < 18; r++) {
     smallerThanRandom[r] = [];
     for (var c = 0; c < 10; c++) {
     smallerThanRandom[r][c] = [];
     }
     }

     let orientationSlider;
     let anglesSlider;
     let resolutionSlider;
     let negResolutionSlider;
     let verifiedSlider;
     let coseismicSlider;
     let resString;

     p5.setup = () => {
     p5.createCanvas(1800, 1000);

     for (var d = 0; d < 10; d++){
     depthValues[d] = p5.nf((d+1)*100,4,0);
     }
     for (var m = 0; m < 16; m++){
     muValues[m] = p5.nf(m,2,0);
     beta = p5.degrees(p5.QUARTER_PI - p5.atan(m/10)/2);
     betaValues[m] = "("+p5.nf(beta,2,1)+")";
     }
     muValues[16] = "1e16";
     betaValues[16] = "("+p5.nf(0.,1,1)+")";;

     orientationSlider = p5.createSlider(0, 1, 0, 1).input(function() {
     sHor = this.value();
     p5.updateMatrix();
     });
     orientationSlider.position(slider_x_0, slider_y_0);
     previousValues[0] = orientationSlider.value();

     anglesSlider = p5.createSlider(0, 1, 0, 1).input(function() {
     ang = this.value();
     p5.updateMatrix();
     });
     anglesSlider.position(slider_x_0, slider_y_0 + slider_y_int);
     previousValues[1] = anglesSlider.value();

     resolutionSlider = p5.createSlider(0, 3, 0, 1).input(function() {
     res = this.value();
     if (res === 0) {
     negResolutionSlider.value(0);
     negRes = 0;
     negResolutionSlider.elt.disabled = true;
     negResolutionSlider.elt.style.opacity = 0.5;
     } else {
     negResolutionSlider.elt.disabled = false;
     negResolutionSlider.elt.style.opacity = 1.0;
     }
     p5.updateMatrix();
     });
     resolutionSlider.position(slider_x_0, slider_y_0 + 2*slider_y_int);
     previousValues[2] = resolutionSlider.value();

     negResolutionSlider = p5.createSlider(0, 1, 0, 1).input(function() {
     negRes = this.value();
     p5.updateMatrix();
     });
     negResolutionSlider.position(slider_x_0, slider_y_0 + 3*slider_y_int);
     previousValues[3] = negResolutionSlider.value();

     verifiedSlider = p5.createSlider(0, 1, 0, 1).input(function() {
     ver = this.value();
     p5.updateMatrix();
     });
     verifiedSlider.position(slider_x_0, slider_y_0 + 4*slider_y_int);
     previousValues[4] = verifiedSlider.value();

     coseismicSlider = p5.createSlider(0, 1, 0, 1).input(function() {
     cos = this.value();
     p5.updateMatrix();
     });
     coseismicSlider.position(slider_x_0, slider_y_0 + 5*slider_y_int);
     previousValues[5] = coseismicSlider.value();
     }

     p5.draw = () => {

     let currentValues = [];
     currentValues[0]=sHor;
     currentValues[1]=ang;
     currentValues[2]=res;
     currentValues[3]=negRes;
     currentValues[4]=ver;
     currentValues[5]=cos;

     // Compare current and previous values
     let valuesHaveChanged = false;
     for (let i = 0; i < currentValues.length; i++) {
     if (currentValues[i] !== previousValues[i]) {
     valuesHaveChanged = true;
     break;
     }
     }

     if (valuesHaveChanged) {

     p5.background(255);
     p5.strokeWeight(0);
     p5.fill(0,0,0);
     p5.fill(0,0,0);

     }
     }

     p5.updateMatrix = () => {
     resString = resolutionCSVList[res]
     if (negRes === 1){
     resString = "Neg" + resolutionCSVList[res]
     }
     const path = window.location.pathname
     console.log("Current path:", path);
     p5.loadTable('./prova/prova.csv', 'csv')
     }
     }



     </script>

     <P5 {sketch} /> -->
