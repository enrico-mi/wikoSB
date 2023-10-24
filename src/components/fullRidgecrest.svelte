<script>
  import P5 from 'p5-svelte';
  import chroma from 'chroma';

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
      var muValues = []
      var betaValues = []

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

      p5.preload = () => {

	  for (var a = 0; a < anglesCSVList.length; a++) {
	      images[a] = [];
	      // looping also for negative of resolution
	      for (var r = 0; r < 2*resolutionCSVList.length-1; r++) {
		  images[a][r] = [];
		  for (var v = 0; v < verifiedCSVList.length; v++) {
		      images[a][r][v] = [];
		      for (var c = 0; c < coseismicCSVList.length; c++) {

			  if (r < resolutionCSVList.length) {
			      images[a][r][v][c] = p5.loadImage("/home/enricomi/Documents/personal/personal_website/al-folio/_projects/map_angles" + anglesCSVList[a] + "_res" + resolutionCSVList[r] + "_ver" + verifiedCSVList[v] + "_cos" + coseismicCSVList[c] + ".png");

			      // [r+1] because res=0 does not have a negative
			  } else {
			      images[a][r][v][c] = p5.loadImage("/home/enricomi/Documents/personal/personal_website/al-folio/_projects/map_angles" + anglesCSVList[a] + "_resNeg" + resolutionCSVList[r+1-resolutionCSVList.length] + "_ver" + verifiedCSVList[v] + "_cos" + coseismicCSVList[c] + ".png");
			  }
		      }
		  }
	      }
	  }

      }
      
      p5.setup = () => {
	  p5.createCanvas(1800, 1000);

	  for (var d = 0; d < 10; d++){
	      depthValues[d] = p5.nf((d+1)*100,4,0);
	  }
	  for (var m = 0; m < 16; m++){
	      muValues[m] = p5.nf(m,2,0);
	      beta = p5.degrees(QUARTER_PI - atan(m/10)/2);
	      betaValues[m] = "("+p5.nf(beta,2,1)+")";
	  }
	  muValues[16] = "1e16";
	  betaValues[16] = "("+p5.nf(0.,1,1)+")";;

	  orientationSlider = p5.createSlider(0, 1, 0, 1).input(function() {
	      sHor = this.value();
	      updateMatrix();
	  });
	  orientationSlider.position(slider_x_0, slider_y_0);
	  previousValues[0] = orientationSlider.value();

	  anglesSlider = p5.createSlider(0, 1, 0, 1).input(function() {
	      ang = this.value();
	      updateMatrix();
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
	      updateMatrix();
	  });
	  resolutionSlider.position(slider_x_0, slider_y_0 + 2*slider_y_int);
	  previousValues[2] = resolutionSlider.value();

	  negResolutionSlider = p5.createSlider(0, 1, 0, 1).input(function() {
	      negRes = this.value();
	      updateMatrix();
	  });
	  negResolutionSlider.position(slider_x_0, slider_y_0 + 3*slider_y_int);
	  previousValues[3] = negResolutionSlider.value();

	  verifiedSlider = p5.createSlider(0, 1, 0, 1).input(function() {
	      ver = this.value();
	      updateMatrix();
	  });
	  verifiedSlider.position(slider_x_0, slider_y_0 + 4*slider_y_int);
	  previousValues[4] = verifiedSlider.value();

	  coseismicSlider = p5.createSlider(0, 1, 0, 1).input(function() {
	      cos = this.value();
	      updateMatrix();
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
	      p5.text("Sum of squared residuals", matrix_x_0 + 350, 30);
	      p5.text("mu (degrees) [- (◦)]", matrix_x_0 + 350, slider_y_0-30);
	      p5.fill(0,0,0);

	      p5.text("orientation = " + orientationTextList[sHor],
		   orientationSlider.x + orientationSlider.width + 10,
		   orientationSlider.y + 10);

	      p5.text("fractures angle = " + anglesTextList[ang],
		   anglesSlider.x + anglesSlider.width + 10,
		   anglesSlider.y + 10);

	      p5.text("resolution = " + resolutionTextList[res],
		   resolutionSlider.x + resolutionSlider.width + 10,
		   resolutionSlider.y + 10);

	      p5.text("negative resolution = " + negResolutionTextList[negRes],
		   negResolutionSlider.x + negResolutionSlider.width + 10,
		   negResolutionSlider.y + 10);

	      p5.text("verified = " + verifiedTextList[ver],
		   verifiedSlider.x + verifiedSlider.width + 10,
		   verifiedSlider.y + 10);

	      p5.text("coseismic = " + coseismicTextList[cos],
		   coseismicSlider.x + coseismicSlider.width + 10,
		   coseismicSlider.y + 10);
	      
	      p5.push();

	      for (var c = 0; c < 10; c++) {
		  depth_vals[c] = p5.round( 100 + 100*c );
		  p5.text(depth_vals[c], 930, c*size+size/2+matrix_y_0);
	      }

	      let angle2 = p5.radians(270);
	      p5.translate(matrix_x_0 + (matrix.length-1)*size+size/2+2*size, 350);
	      p5.rotate(angle2);
	      // Draw the letter to the screen
	      p5.text("depth [m]", 0, 0);
	      p5.pop();

	      p5.textAlign(RIGHT);
	      for (var r = 0; r < numCols; r++) {
		  p5.text(depth_vals[r], matrix_x_0 + (matrix.length-1)*size+2*size, matrix_y_0+r*size+size/2);
	      }

	      p5.textAlign(CENTER, CENTER);
	      for (var r = 0; r < 17; r++) {
		  if (r < 16) {
		      p5.text(muValues[r]/10, matrix_x_0 + r*size+size/2, slider_y_0 - 80);
		  } else {
		      p5.text(muValues[r], matrix_x_0 + r*size+size/2, slider_y_0 - 80);
		  }
		  p5.text(betaValues[r], matrix_x_0 + r*size+size/2, slider_y_0 - 60);
	      }
	      mu_vals[matrix.length] = "random";
	      p5.text(mu_vals[matrix.length], matrix_x_0 + (matrix.length-1)*size+size/2, slider_y_0 - 80);

	      p5.textAlign(LEFT, BASELINE);	  

	      if (negRes === 0){
		  imgFracs = images[ang][res][ver][cos];
	      } else if (res>0) {
		  imgFracs = images[ang][res-1+resolutionCSVList.length][ver][cos];
	      }

	      // Store current values in previousValues array for next comparison
	      previousValues = currentValues.slice();
	  }

	  // draw matrix of error values

	  // js reads rows first, by using in rect() i for x axis (and j for y
	  // axis) I'm mirroring the matrix upon plotting it (ie mu along x and
	  // depth along y)

	  // in matrix, there are as many mu values as matrix.length, and as
	  // many depths as matrix[0].length, i.e. mu is read along rows and
	  // depth along columns; mu_random is at matrix.length-1 position

	  // find the minimum and maximum values in the whole matrix
	  let minMatrixVal = p5.min(matrix.flat());
	  let maxMatrixVal = p5.max(matrix.flat());

	  for (let i = 0; i < matrix.length; i++) {
	      for (let j = 0; j < matrix[0].length; j++) {
	   	  let val = matrix[i][j];
		  // normalize the value to the range [0, 1]
		  let normalizedVal = p5.map(val, minMatrixVal, maxMatrixVal, minColorVal, maxColorVal);		  
		  let color = p5.cscheme(normalizedVal).hex();
//		  let color = cscheme(val / (maxVal - minVal)).hex();
		  p5.fill(color);
		  if ((val < matrix[matrix.length-1][j])&&(i<matrix.length-1)){
		      smallerThanRandom[i][j] = 1;
		  } else {
		      smallerThanRandom[i][j] = 0;
		  }		      
	   	  // fill(map(value, 0, 15, 0, 255));
		  let x = i*size;
		  let y = j*size;
	   	  p5.rect(matrix_x_0 + x, matrix_y_0 + y, size, size);
		  p5.strokeWeight(0);
	      }
	  }

	  // colorbar
	  for (let i = 0; i < numColorbarSteps; i++) {
	      let val = i / (numColorbarSteps - 1) * (maxColorVal - minColorVal) + minColorVal;
	      let color = p5.cscheme(val).hex();
	      p5.fill(color);
	      p5.noStroke();
	      p5.rect(0, matrix_y_0 + i * colorbarStepSize, size, colorbarStepSize);
	  }	  
	  p5.fill(242,114,60);
	  p5.textSize(18);
	  p5.textStyle(BOLD);
	  p5.stroke(1);
	  p5.textAlign(CENTER, CENTER);
	  p5.text(p5.round( minMatrixVal*10 )/10, 0+size/2, matrix_y_0+size/2);
	  p5.text(p5.round( maxMatrixVal*10 )/10, 0+size/2, matrix_y_0+(numColorbarSteps-1)*colorbarStepSize+size/2);
	  p5.textAlign(LEFT, BASELINE);
	  p5.textSize(12);
	  p5.textStyle(NORMAL);
	  p5.stroke(0);

	  // draw border for errors smaller than error for random mu
	  p5.fill(255,0);
	  p5.stroke(242,114,60);
	  p5.strokeWeight(2);
	  lastInDepth = -1;
	  for (let j = 0; j < smallerThanRandom[0].length; j++) {
	      firstInDepth = 0;
	      for (let i = 0; i < smallerThanRandom.length; i++) {
	   	  let val = smallerThanRandom[i][j];
		  if (val === 1){
		      let x = i*size+matrix_x_0;
		      let y = j*size+matrix_y_0;
		      p5.line(x, y, x+size, y);
		      p5.line(x, y+size, x+size, y+size);
		      lastInDepth=x;
		      if (firstInDepth === 0){
			  firstInDepth = 1;
			  p5.line(x, y, x, y+size);
		      }
		  }
	      }
	      if (lastInDepth >= 0){
		  let x = lastInDepth;
		  let y = j*size+matrix_y_0;
		  p5.line(x+size, y, x+size, y+size);
	      }
	  }
	  p5.stroke(242,114,60);

	  for (let i = 0; i < matrix.length; i++) {
	      if (i < 1) {
		  // loop over columns (i.e. depth)
		  for (let j = 0; j < matrix[0].length; j++) {
		      drawCircumference(matrix_x_0+jmin_cols[j]*size + size/2, j*size+matrix_y_0 + size/2, 15)
		  }
	      }
	  }

	  p5.fill(242,114,60);
	  p5.drawCircle(matrix_x_0 + imin*size + size/2, jmin*size+matrix_y_0 + size/2, 15)

	  p5.fill(242,114,60);
	  p5.textSize(18);
	  p5.textStyle(BOLD);
	  p5.stroke(1);
	  p5.textAlign(CENTER, CENTER);
	  p5.text(text_err, x_err, y_err);
	  p5.textAlign(LEFT, BASELINE);
	  p5.textSize(12);
	  p5.textStyle(NORMAL);
	  p5.stroke(0);

	  p5.noStroke();
	  if (!(typeof imgFracs === "undefined")) {
	      p5.fill(255, 255, 255); // Set the fill color to white
	      //rect(20*size, 50, imgFracs.width, imgFracs.height); // Draw the rectangle
      	      p5.image(imgFracs, matrix_x_0 + 20*size, 50, imgFracs.width/4, imgFracs.height/4);
	  }
	  if (!(typeof imgLL === "undefined")){
	      p5.image(imgLL, matrix_x_0 + 20*size, 50, imgLL.width/4, imgLL.height/4);
	  }
      }

      p5.mousePressed = () => {
	  // update shear lines
       	  for (let i = 0; i < (matrix.length-1); i++) {
       	      for (let j = 0; j < matrix[0].length; j++) {
       		  let x = i*size + matrix_x_0;
       		  let y = j*size;
       		  if (mouseX >= x && mouseX <= x + size && mouseY >= y + matrix_y_0 && mouseY <= y + size +  matrix_y_0) {
       		      mu = i;
       		      depth = j;
		      imgLL = p5.loadImage("/home/enricomi/Documents/personal/personal_website/al-folio/_projects/LL_N" + orientationCSVList[sHor] + "E_d" + depthValues[j] + "_mu" + muValues[i] + ".png");
		  }
 	      }
	  }

	  // update error text
       	  for (let i = 0; i < matrix.length; i++) {
       	      for (let j = 0; j < matrix[0].length; j++) {
       		  let x = i*size;
       		  let y = j*size;
       		  if (mouseX >= x && mouseX <= x + size && mouseY >= y + matrix_y_0 && mouseY <= y + size +  matrix_y_0) {
		      text_err = p5.round( matrix[i][j]*10 )/10
		      x_err = mouseX-10;
		      y_err = mouseY-15;
		  }
 	      }
	  }
       	  // if (mouseX >= matrix.length*size || mouseY >= matrix[0].length*size + matrix_y_0) {
	      text_err = "";
	  // }
      }

      p5.keyPressed = () => {
	  if (key == 's' || key == 'S') {
	      // create a new image that contains only the pixels within the desired region
	      let x = 0;
	      let y = matrix_y_0;
	      let w = matrix_x_0+(numRows+2)*size; //rows and cols inverted because I plot depths on y and mu on x
	      let h = slider_y_0-20-matrix_y_0;//numCols*size;
	      let matrixPNG = p5.get(x,y,w,h);
	      let img = p5.createImage(w,h);
	      img.copy(matrixPNG,0,0,w,h,0,0,w,h);
	      
	      // prompt the user for the filename
	      let fname_default = "matrix_" + orientationTextList[sHor] + "_" + anglesCSVList[ang] + "_" + resolutionCSVList[res] + "_" + negResolutionTextList[negRes] + "_" + verifiedTextList[ver] + "_" + coseismicTextList[cos] + ".png"
	      let filename = p5.window.prompt("Enter a filename for the matrix png:", fname_default);
	      
	      // save the new image with the entered filename
	      img.save(filename);
	  }
	  if (key == 'p' || key == 'P') {
	      // create a new image that contains only the pixels within the desired region
	      let x = matrix_x_0 + 20*size;
	      let y = 50;
	      let w = imgFracs.width/4;
	      let h = imgFracs.height/4;
	      let mapPNG = p5.get(x,y,w,h);
	      let img = p5.createImage(w,h);
	      img.copy(mapPNG,0,0,w,h,0,0,w,h);
	      
	      // prompt the user for the filename
	      let fname_default = "LL_" + orientationTextList[sHor] + "_" + anglesCSVList[ang] + "_" + resolutionCSVList[res] + "_" + negResolutionTextList[negRes] + "_" + verifiedTextList[ver] + "_" + coseismicTextList[cos] + ".png"
	      let filename = p5.window.prompt("Enter a filename for the map png:", fname_default);
	      
	      // save the new image with the entered filename
	      img.save(filename);
	  }
      }
      updateMatrix = () => {
	  resString = resolutionCSVList[res]
	  if (negRes === 1){
	      resString = "Neg" + resolutionCSVList[res]
	  }
	  p5.loadTable("/home/enricomi/Documents/personal/personal_website/al-folio/_projects/errW/errW_mu_N/" + orientationCSVList[sHor] +
		    "E_angles" + anglesCSVList[ang] +
		    "_res" + resString +
		    "_ver" + verifiedCSVList[ver] +
		    "_cos" + coseismicCSVList[cos] +
		    ".csv", "csv", function(data) {
			matrix = [];
			for (let i = 0; i < data.getRowCount(); i++) {
			    let row = [];
			    for (let j = 0; j < data.getColumnCount(); j++) {
				row.push(data.getNum(i, j));
			    }
			    matrix.push(row);
			}
			
			let minValue =  Infinity;

			// I will plot depths along y axis, but they are
			// columns in the csv file

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

			// getting number of columns and rows
			// numRows = matrix.rows;
			// numCols = matrix.cols;

		    });
	  
      }

      drawCircle = (x0, y0, r) => {
	  p5.stroke(242,114,60);
	  p5.strokeWeight(2);
	  p5.ellipse(x0, y0, 2 * r, 2 * r);
	  p5.noStroke();
      }

      drawCircumference = (x, y, r) => {
	  p5.stroke(242,114,60);
	  p5.strokeWeight(2);
	  p5.noFill();
	  p5.ellipse(x, y, 2*r, 2*r);
	  p5.noStroke();
      }
};
</script>

<P5 {sketch} />
