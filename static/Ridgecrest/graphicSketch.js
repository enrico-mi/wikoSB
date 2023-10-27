let graphicSketch = function(p){

    const awsAddress = 'https://ridgecrest-viz.s3.us-east-2.amazonaws.com/';

    // trying to scale it to use viewport units in html
    var elementHeight = document.getElementById('heatmap').clientHeight;
    const referenceHeight = 386; // px, empirical
    let scaleFactorHeight = elementHeight/referenceHeight;

    // trying to scale it to use viewport units in html
    let originalCanvasWidth = 1200;
    let originalCanvasHeight = 800;
    let scaleFactorWidth = p.windowWidth/1920;

    let mycounter = 0;

    p.numFeatures = {Value: 0};
    p.verified = {Value: 'All'};
    p.methodology = {Value: 0};
    p.coseismic = {Value: 0};
    p.orientationIndex = {Value: 0};
    p.failure = {Value: 0};
    p.muColoring = {Value: 0};
    p.resolutionLength = {Value: 0};
    p.resolutionNeg = {Value: false};
    p.angleSelection = {Value: false};
    p.polarPlotAngles = {Value: []};
    p.polarPlotLengths = {Value: []};
    p.stressLines = {Value: []};
    p.failureMode = {Value: "RL"};
    p.mechanismsMode = {Value: false};
    p.clearStressLines = {Value: false};

    let mechBool = 0;

    let errType = 2; // now hard-coded
    let errExp = 0; // now hard-coded
    let sHor = 0;
    let ang = 0; // now hard-coded
    let res = 0;
    let ver = 0; // now hard-coded
    let cos = 1; // now hard-coded
    let met = 0;
    let fail = 0;
    let negRes = 0;
    let fMode = 0;

    let imin = [];
    let jmin = [];
    let jmin_cols = [];

    // reference size for heatmap tiles
    let size = 40*scaleFactorHeight;

    let cscheme = chroma.scale('Blues');//.mode('lch');
    // get the minimum and maximum values of the color scale domain
    let [minColorVal, maxColorVal] = cscheme.domain();
    let minVal = 0;  // minimum value of the matrix
    let maxVal = 20;  // maximum value of the matrix
    let colorbarX = 20;
    let numColorbarSteps = 6;
    let colorbarHeight = numColorbarSteps*size;

    let slider_y_int = 50;
    let slider_y_0 = 450;
    let slider_x_0 = 20;
    let slider_x_1 = 360;
    let slider_x_2 = 690;
    let cosCheckbox;
    cosCheckbox = {boolean: []};

    let matrix_y_0 = 50;
    let matrix_x_0 = 80 + colorbarX;

    let mu_vals = [];
    let depth_vals = [];

    // For the public version for peers, I am hard-coding error types,
    // residuals' exponent, and I will not give the option to select N30E-N60E
    // fractures or verified on the field
    
    var errorTypeTextList = ["Absolute","Relative","Weighted"];
    var errorTypeCSVList = ["errAbs","errRel","errW"];
    var errorExpTextList = ["1","2"];
    var errorExpCSVList = ["1","2"];
    var orientationTextList = ["N14E","N13E"];
    var orientationCSVList = ["14","13"];
    var anglesTextList = ["All","[30,60]"];
    var anglesCSVList = ["All","3060"];
    var resolutionTextList = ["0","10","100","200"];//,"300","400"];
    var resolutionCSVList = ["0000","0010","0100","0200"];//,"0300","0400"]; 
    var negResolutionTextList = ["No","Yes"];
    var verifiedTextList = ["All","Yes"];
    var verifiedCSVList = ["All","Yes"];
    var coseismicTextList = ["No","Yes"];
    var coseismicCSVList = ["No","Yes"];
    var methodTextList = ["All (incl inferred)", "Only field", "Only remote sensing"];
    var methodCSVList = ["1111", "1000", "0001"];
    var failureTextList = ["None", "All: LL (red) and RL (blue) shear, tensile (green)", "Only shear LL (red) and RL (blue) shear"];
    var muColoringTextList = ["0.0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0", "1.1", "1.2", "1.3", "1.4", "1.5"];
    var failureModeTextList = ["RL","tensile","LL"];
    var failureModeJSONList = ["RL","TH","LL"];

    let previousValues = [];

    var depthValues = [];
    var muValues = [];
    var betaValues = [];

    let matrix = [];
    let numRows = 18;
    let numCols = 6; //10; discarding depths 600 to 900 included
    for (var r = 0; r < numRows; r++) {
	matrix[r] = [];
	for (var c = 0; c < numCols; c++) {
	    matrix[r][c] = [];
	}
    }

    let text_err = "";
    let x_err = 0;
    let y_err = 0;

    let smallerThanRandom = [];
    for (var r = 0; r < numRows; r++) {
	smallerThanRandom[r] = [];
	for (var c = 0; c < numCols; c++) {
	    smallerThanRandom[r][c] = [];
	}
    }

    p.setup = function() {
	elementHeight = document.getElementById('polar').clientHeight;
	scaleFactorHeight = elementHeight/referenceHeight;

	scaleFactorWidth = p.windowWidth/1920;

	scaleFactor = Math.min( (scaleFactorHeight, scaleFactorWidth) );
	
	size = 40*scaleFactor;
	
	p.createCanvas(originalCanvasWidth*scaleFactor, originalCanvasHeight*scaleFactor);
	p.textFont("Helvetica"); // setting font for rest of viz
	p.textSize(18*scaleFactor);

	for (var d = 0; d < numCols; d++){
	    depthValues[d] = p.nf((d+1)*100,4,0);
	}
	depthValues[-1] = "no coseismic";

	for (var m = 0; m < 16; m++){
	    muValues[m] = p.nf(m,2,0);
	    beta = p.degrees(p.QUARTER_PI - p.atan(m/10)/2);
	    betaValues[m] = "("+p.nf(beta,2,1)+")";
	}
	muValues[16] = "inf.";
	betaValues[16] = "("+p.nf(0.,1,1)+")";

	let sliderPos = 0;

	previousValues[0]=sHor;
	previousValues[1]=ang;
	previousValues[2]=res;
	previousValues[3]=negRes;
	previousValues[4]=ver;
	previousValues[5]=cos;
	previousValues[6]=met;
	previousValues[7]=fail;
	previousValues[8]=0;
	previousValues[9]=errType;
	previousValues[10]=errExp;
	previousValues[11]=fMode;
	previousValues[12]=mechBool;

    };

    p.windowResized = function() {
	elementHeight = document.getElementById('polar').clientHeight;
	scaleFactorHeight = elementHeight/referenceHeight;

	scaleFactorWidth = p.windowWidth/1920;

	scaleFactor = Math.min( (scaleFactorHeight, scaleFactorWidth) );
	
	size = 40*scaleFactor;

	p.resizeCanvas(originalCanvasWidth*scaleFactor, originalCanvasHeight*scaleFactor);
	p.pixelDensity(1/scaleFactor);

    };

    p.draw = function() {
	sHor = document.querySelector('input[name=orientation]:checked').value;
	
	p.orientationIndex.Value = sHor;
	p.methodology.Value = Number(document.querySelector('input[name=methods]:checked').value);
	met = p.methodology.Value;
	res = document.querySelector('#res_input').value;
  	//p.methodology.Value = met;
	p.coseismic.Value = cos;
	p.angleSelection.Value = Boolean(ang);
	mechBool = Number(document.querySelector('#slipsense-toggle').checked);
	p.mechanismsMode.Value = document.querySelector('#slipsense-toggle').checked;
	negRes = Number(p.resolutionNeg.Value);

	let currentValues = [];
	currentValues[0]=sHor;
	currentValues[1]=ang;
	currentValues[2]=res;
	currentValues[3]=negRes;
	currentValues[4]=ver;
	currentValues[5]=cos;
	currentValues[6]=met;
	currentValues[7]=fail;
	currentValues[8]=0;
	currentValues[9]=errType;
	currentValues[10]=errExp;
	currentValues[11]=fMode;
	currentValues[12]=mechBool;

	// Compare current and previous values
	let valuesHaveChanged = false;
	for (let i = 0; i < currentValues.length; i++) {
	    if (currentValues[i] !== previousValues[i]) {
		valuesHaveChanged = true;
		break;
	    }
	}

	if (valuesHaveChanged) {

	    p.updateHeatmap();

	    // Store current values in previousValues array for next comparison
	    previousValues = currentValues.slice();
	}
    };

    p.mousePressed = function() {
	// update shear lines
	for (let i = 0; i < (matrix.length-1); i++) {
       	    for (let j = 0; j < matrix[0].length; j++) {
       		let x = i*size + matrix_x_0;
       		let y = j*size;
       		if (p.mouseX >= x && p.mouseX <= x + size && p.mouseY >= y + matrix_y_0 && p.mouseY <= y + size +  matrix_y_0) {
       		    mu = i;
       		    depth = j;
		    if (j === matrix[0].length-1) {
			p.stressLines.Value = "N" + orientationCSVList[sHor] + "E_dRegional";
		    } else {
			p.stressLines.Value = "N" + orientationCSVList[sHor] + "E_d" + depthValues[j];
		    }
		    if (fMode !== 1){
			p.stressLines.Value += "_mu" + muValues[i];
		    }
		}
 	    }
	}

	// update error text
	for (let i = 0; i < (matrix.length); i++) {
       	    for (let j = 0; j < matrix[0].length; j++) {
       		let x = i*size + matrix_x_0;
       		let y = j*size;
       		if (p.mouseX >= x && p.mouseX <= x + size && p.mouseY >= y + matrix_y_0 && p.mouseY <= y + size +  matrix_y_0) {
		    text_err = p.round( matrix[i][j]*100 )/100;
		    x_err = p.mouseX-10;
		    y_err = p.mouseY-15;
		}
 	    }
	}
	if (p.mouseX >= 2*matrix.length*size || p.mouseY >= matrix[0].length*size + matrix_y_0) {
	    text_err = "";
	}
	p.drawAll(); // this automatically covers previous text_err graphics

    };

    p.keyPressed = function() {
	if (p.key == 's' || p.key == 'S') {
	    // create a new image that contains only the pixels within the desired region
	    let x = 0;
	    let y = matrix_y_0-size;
	    let w = matrix_x_0+(numRows+2)*size+30; //rows and cols inverted because I plot depths on y and mu on x
	    let h = slider_y_0-size;//+5;//-20-matrix_y_0;//numCols*size;
	    let matrixPNG = p.get(x,y,w,h);
	    let img = p.createImage(w,h);
	    img.copy(matrixPNG,0,0,w,h,0,0,w,h);
	    
	    // prompt the user for the filename
	    let filename = "/home/enricomi/Documents/myMIT/projects/ridgecrest-damage/paper/figures/rev2/test.png";
	    
	    // save the new image with the entered filename
	    img.save(filename);
	}
	if (p.key == 'p' || p.key == 'P') {

	    // Get a reference to the element
            const myElement = document.getElementById("region");

            // Get the coordinates of the element
            const rect = myElement.getBoundingClientRect();

            // Display the coordinates
            console.log("Top:", rect.top);
            console.log("Left:", rect.left);
            console.log("Right:", rect.right);
            console.log("Bottom:", rect.bottom);
            console.log("X:", rect.x); // Same as 'left'
            console.log("Y:", rect.y); // Same as 'top'
	    console.log(rect);
	    console.log(myElement);

	    // Create a temporary canvas element to cover the desired area
            const canvas = document.createElement("canvas");
            canvas.width = rect.width*300/96;
            canvas.height = rect.height*300/96;
            canvas.style.position = "absolute";
            canvas.style.top = `${rect.y}px`;
            canvas.style.left = `${rect.x}px`;
            document.body.appendChild(canvas);

            // Use html2canvas to capture the specified area
            html2canvas(document.body, {
		canvas: canvas,
		x: rect.x,
		y: rect.y,
		width: rect.width*300/96,
		height: rect.height*300/96
            }).then(function (renderedCanvas) {
		// Convert the captured canvas to an image URL
		const dataURL = renderedCanvas.toDataURL("image/png");

		// Open the image in a new tab (optional)
		const newTab = window.open();
		newTab.document.write('<img src="' + dataURL + '"/>');

		// Remove the temporary canvas element
		document.body.removeChild(canvas);
            });
	    
	}
    };

    p.updateHeatmap = function() {

	mycounter += 1;

	resString = resolutionCSVList[res];
	if (negRes === 1){
	    resString = "Neg" + resolutionCSVList[res];
	}

	var relFolder = "ave_test";
	relFolder += "_segments/";
	
	tableName = awsAddress + "SRw/" + relFolder +  errorTypeCSVList[errType] + errorExpCSVList[errExp] +
	    "_mu_N" + orientationCSVList[sHor] +
	    "E_angles" + anglesCSVList[ang] +
	    "_res" + resString +
	    "_ver" + verifiedCSVList[ver] +
	    "_cos" + coseismicCSVList[cos] +
	    "_met" + methodCSVList[met];

	tableNameRegional = tableName + "_dRegional";

	if (mechBool === 1) {
            tableName += "_mechs";//updatederror";
            tableNameRegional += "_mechs";//updatederror";
	}

	tableName += "_averaged";
	tableNameRegional += "_averaged";
	tableName += "_segments_ok";
	tableNameRegional += "_segments_ok";

	tableName += "_degrees.csv";
	tableNameRegional += "_degrees.csv";

	p.loadMatrix(tableName, tableNameRegional);

    };

    p.loadMatrix = function(tableName, tableNameRegional){
	//NB: the regional row is in a separate file and is thus loaded through
	//a second loadTable, which is called inside the first loadTable
	//callback to ensure that the final matrix for the heatmap is built
	//correctly. The functions to draw the heatmap are also inside the
	//first loadTable callback, to make sure the plots are executed when
	//all both tables are loaded.

	// load table with all values but regional stress only
	p.loadTable(tableName, "csv", function(data) {
	    matrix = [];
	    for (let i = 0; i < data.getRowCount(); i++) {
		let row = [];
		let d = 0;
		for (let j = 0; j < data.getColumnCount(); j++) {
		    // Tricking to discard depths 600 to 900 included
		    if ((j < 5)){// || (j > 8)){
			row.push(data.getNum(i, d));
			d += 1;
		    };
		}
		matrix.push(row);
	    }

	    // append table with regional stress only
	    p.loadTable(tableNameRegional, "csv", function(data) {
		matrix_reg = [];
		for (let i = 0; i < data.getRowCount(); i++) {
		    let row = [];
		    for (let j = 0; j < data.getColumnCount(); j++) {
			row.push(data.getNum(i, j));
		    }
		    matrix_reg.push(row);
		}

		for (let i = 0; i < matrix.length; i++) {
		    let regVal = matrix_reg[i];
		    matrix[i].push(regVal[0]); // Append the element matrix_reg[i] at the end each row
		}

		// I will plot depths along y axis, but they are
		// columns in the csv file

		// determining location of minimum element in heatmap
		// (i.e. smallest error)
		let minValue =  Infinity;
		// outer loop over columns (i.e. depth)
		for (var j = 0; j < matrix[0].length; j++) {
	    	    var minValue_cols = Infinity;
	    	    jmin_cols[j] = -1;
	    	    // inner loop over rows (i.e. mu)
	    	    for (var i = 0; i < matrix.length; i++) {
	    		if (matrix[i][j] < minValue) {
	    		    minValue = matrix[i][j];
	    		    imin = i;
	    		    jmin = j;
	    		}
	    		if (matrix[i][j] < minValue_cols) {
	    		    minValue_cols = matrix[i][j];
	    		    jmin_cols[j] = i;
	    		}
	    	    }
		}

		// putting this in the first loadTable callback to make sure plots are
		// performed after all data is loaded
		p.drawAll();
	    });
	});
    };

    p.drawAll = function(){
	p.background(255,255,255);//(255,254,245);
	p.drawTexts();
	p.drawHeatmap();
	p.drawErrText();
    };

    p.drawTexts = function(){
	p.strokeWeight(0);
	p.fill(0,0,0);
	p.textAlign(p.CENTER);
	p.text("Sum of residuals", matrix_x_0 + 9*size, 30);
	p.text("\u03BC [-]\n(degrees [\u00B0])", matrix_x_0 + 9*size, matrix_y_0 + 8*size);
	p.textAlign(p.LEFT);
	p.fill(0,0,0);

	p.textSize(12*scaleFactor);

	p.textSize(18*scaleFactor);

	p.push();

	for (var c = 0; c < numCols-1; c++) {
	    depth_vals[c] = p.round( 100 + 100*c );
	    p.textAlign(p.RIGHT,p.CENTER);
	    p.text(depth_vals[c], matrix_x_0 + (matrix.length-1)*size+2*size, c*size+size/2+matrix_y_0);
	}	    
	p.textAlign(p.LEFT,p.CENTER);
	p.text("regional\nstress", matrix_x_0 + (matrix.length-1)*size+size/2+size, c*size+size/2+matrix_y_0);

	let angle2 = p.radians(270);
	p.translate(matrix_x_0 + (matrix.length-1)*size+size/2+2*size, 350);
	p.rotate(angle2);
	// Draw the letter to the screen
	p.text("depth [m]", 150, 10);
	p.pop();

	p.textAlign(p.CENTER, p.CENTER);
	for (var r = 0; r < 17; r+=3) {
	    if (r < 16) {
		p.text(muValues[r]/10, matrix_x_0 + r*size+size/2, matrix_y_0 + 6.5*size);
	    } else {
		p.text(muValues[r], matrix_x_0 + r*size+size/2, matrix_y_0 + 6.5*size);
	    }
	    p.text(betaValues[r], matrix_x_0 + r*size+size/2, matrix_y_0 + 6.5*size + 20);
	}
	p.text(muValues[16], matrix_x_0 + 16*size+size/2, matrix_y_0 + 6.5*size);
	p.text(betaValues[16], matrix_x_0 + 16*size+size/2, matrix_y_0 + 6.5*size + 20);

	mu_vals[matrix.length] = "random";
	p.text(mu_vals[matrix.length], 15 + matrix_x_0 + (matrix.length-1)*size+size/2, matrix_y_0 + 6.5*size);

	p.textAlign(p.LEFT, p.BASELINE);	  

    };

    p.drawHeatmap = function() {
	// draw matrix of error values

	// JS reads rows first, by using in rect() i for x axis (and j for y
	// axis) I'm mirroring the matrix upon plotting it (ie mu along x and
	// depth along y)

	// in matrix, there are as many mu values as matrix.length, and as many
	// depths as matrix[0].length, i.e. mu is read along rows and depth
	// along columns; mu_random is at matrix.length-1 position (because in
	// JS we start counting from 0)

	// find the minimum and maximum values in the whole matrix
	let minMatrixVal = p.min(matrix.flat());
	let maxMatrixVal = p.max(matrix.flat());

	for (let i = 0; i < matrix.length; i++) {
	    for (let j = 0; j < matrix[0].length; j++) {
		let val = matrix[i][j];
		// normalize the value to the range [0, 1]
		let color;
		if (val === -1) {
                    color = chroma('lightgray').hex();
		} else {
                    let normalizedVal = p.map(val, minMatrixVal, maxMatrixVal, minColorVal, maxColorVal);                 
                    color = cscheme(normalizedVal).hex();
	        }
		
		p.fill(color);
		
		if ((val < matrix[matrix.length-1][j])&&(i<matrix.length-1)){
		    smallerThanRandom[i][j] = true;
		} else {
		    smallerThanRandom[i][j] = false;
		}		      
		let x = i*size;
		let y = j*size;
		p.rect(matrix_x_0 + x, matrix_y_0 + y, size, size);
		p.strokeWeight(0);
	    }
	}

	// colorbar
	for (let i = 0; i < numColorbarSteps; i++) {
	    let val = i / (numColorbarSteps - 1) * (maxColorVal - minColorVal) + minColorVal;
	    let color = cscheme(val).hex();
	    p.fill(color);
	    p.noStroke();
	    p.rect(colorbarX, matrix_y_0 + i * size, size, size);
	}	  
	p.fill(242,114,60);
	p.textStyle(p.BOLD);
	p.stroke(1);
	p.textAlign(p.CENTER, p.CENTER);

	let minValText = false;
	let maxValText = false;
	let minj;
	let maxj;
	for (let l = 0; l<10; l++) {
            if (minMatrixVal/10**l < 0. && minValText===false) {
		minj = l+1;
		minValText = true;
            }
            if (maxMatrixVal/10**l < 0. && maxValText===false) {
		maxj = l+1;

		maxValText = true;
            }
	}
	p.text(p.nf(minMatrixVal,minj,2), colorbarX+size/2, matrix_y_0-size/4);
	p.text(p.nf(maxMatrixVal,maxj,2), colorbarX+size/2, matrix_y_0+(numColorbarSteps)*size+size/4);
	
	p.textAlign(p.LEFT, p.BASELINE);
	p.textStyle(p.NORMAL);
	p.stroke(0);

	// draw border for errors smaller than error for random mu
	p.fill(255,0);
	p.stroke(242,114,60); //orange
	p.strokeWeight(2);
	lastInDepth = -1;
	for (let j = 0; j < smallerThanRandom[0].length; j++) {
	    firstInDepth = true;
	    for (let i = 0; i < smallerThanRandom.length; i++) {
		let val = smallerThanRandom[i][j];
		if (val === true){
		    let x = i*size+matrix_x_0;
		    let y = j*size+matrix_y_0;
		    p.line(x, y, x+size, y);
		    p.line(x, y+size, x+size, y+size);
		    lastInDepth=x;

		    // drawing vertical line for first element smaller than
		    // random case
		    if (firstInDepth === true){
			firstInDepth = false;
			p.line(x, y, x, y+size);
		    }
		}
	    }
	    if (lastInDepth >= 0 && firstInDepth === false){
		let x = lastInDepth;
		let y = j*size+matrix_y_0;
		p.line(x+size, y, x+size, y+size);
	    }
	}

	for (let i = 0; i < matrix.length; i++) {
	    if (i < 1) {
		// loop over columns (i.e. depth)
		for (let j = 0; j < matrix[0].length; j++) {
		    p.drawCircumference(matrix_x_0+jmin_cols[j]*size + size/2, j*size+matrix_y_0 + size/2, 15);
		}
	    }
	}

	p.fill(242,114,60);
	p.drawCircle(matrix_x_0 + imin*size + size/2, jmin*size+matrix_y_0 + size/2, 15);
    };

    p.drawErrText = function(){
	p.fill(242,114,60);
	p.textStyle(p.BOLD);
	p.stroke(1);
	p.textAlign(p.CENTER, p.CENTER);
	p.text(text_err, x_err, y_err);
	p.textAlign(p.LEFT, p.BASELINE);
	p.textStyle(p.NORMAL);
	p.stroke(0);

	p.noStroke();

    };

    p.drawCircle = function(x0, y0, r) {
	p.stroke(242,114,60);
	p.strokeWeight(2);
	p.ellipse(x0, y0, 2 * r*scaleFactor, 2 * r *scaleFactor);
	p.noStroke();
    };

    p.drawCircumference = function(x, y, r) {
	p.stroke(242,114,60);
	p.strokeWeight(2);
	p.noFill();
	p.ellipse(x, y, 2*r*scaleFactor, 2*r*scaleFactor);
	p.noStroke();
    };

    p.myCheckedEvent = function() {
        if (this.checked()) {
	    this.boolean = 1;
	} else {
	    this.boolean = 0;
	}
    };

    p.clearStressLines = function() {
	p.clearStressLines.Value = true;
    };

};
