let polarSketch = function(p){

    // trying to scale it to use viewport units in html
    var elementWidth = document.getElementById('polar').clientWidth;
    const referenceWidth = 386; // px, empirical
    let scaleFactor = elementWidth/referenceWidth;

    let originalCanvasWidth =  referenceWidth;
    let originalCanvasHeight = referenceWidth;

    // Calculate the angle between each point
    let angle = 360 / 12;
    let angles = Array(12).fill(360/12);
    
    p.polarPlotLengths = {Value: []};
    p.polarPlotAngles = {Value: []};
    p.polarPlotSelected = {Value: []};
    p.orientationIndex = {Value: 0};
    p.muColoring = {Value: []};

    let orientations = [0,13];

    p.setup = function() {
	p.createCanvas(originalCanvasWidth*scaleFactor, originalCanvasHeight*scaleFactor);
    };

    p.windowResized = function() {
	// By construction, the element should be 40vh high, so my original
	// plot, based on a 1920x1080 screen, should be 0.4*1080 high. Hence
	// the added factor 0.4 in the following

	elementWidth = document.getElementById('polar').clientWidth;

	scaleFactor = elementWidth/referenceWidth;
	p.resizeCanvas(originalCanvasWidth*scaleFactor, originalCanvasHeight*scaleFactor);
	p.pixelDensity(1/scaleFactor);
    };

    p.draw = function() {
	p.background(255,254,245);
	
	// Calculate the radius of the plot
	let radius = p.min(p.width, p.height) / 2 - 50;

	// Draw the polar grid
	p.drawPolarGrid(angle, radius);
	// radial label
	const xl = p.width/2 + p.cos(0.) * radius;
    	const yl = p.height/2 + p.sin(0.) * radius + 30;

	//rLabel = p.map(radius, 0, radius, 0, p.max(p.polarPlotLengths.Value));
    	let label = p.nf(p.max(p.polarPlotLengths.Value),[],2);//rLabel.toString();
    	p.text(label+' m', xl, yl);

	
	// N0E or N13E line
	p.stroke(236.895, 176.970, 31.875);
	p.strokeWeight(3);
	const orientation = orientations[p.orientationIndex.Value];
	p.drawLineAtNdegE(orientation, radius);
	p.stroke(0);

	const angleMu06LL = p.PI/2-p.radians(orientation+29.5); // Start angle at mu=0.6
	const angleMu10LL = p.PI/2-p.radians(orientation+22.5); // End angle at mu=1.0
	const angleMu06RL = p.PI/2-p.radians(orientation-29.5); // Start angle at mu=0.6
	const angleMu10RL = p.PI/2-p.radians(orientation-22.5); // End angle at mu=1.0

	if (p.muColoring.Value >= 0) {
	    beta = p.PI/4-p.atan(p.muColoring.Value/10)/2; // mu is multiplied by 10 in graphicSketch
	    beta = p.degrees(beta);
	    p.stroke(41, 84, 24);
	    p.setLineDash([20, 20]);
	    p.stroke(189, 0, 0);
	    p.drawLineAtNdegE(orientation+beta, radius);
	    p.stroke(9, 74, 124);
	    p.drawLineAtNdegE(orientation-beta, radius);
	    p.setLineDash([0]);
	}
	
	p.stroke(0);

	// Draw the polar plot if polarPlotAngles.Value is not empty
	if (Array.isArray(p.polarPlotAngles.Value) && p.polarPlotAngles.Value.length>0){

	    n = p.polarPlotAngles.Value.length;
	    for (let i = 0; i < n; i++) {
		let value = p.polarPlotLengths.Value[i];
		
		// Map the value to the range of the radius
		let r = p.map(value, 0, p.max(p.polarPlotLengths.Value), 0, radius);
		
		// Calculate the angle in radians
		let theta = p.radians(p.polarPlotAngles.Value[i]);
		
		// Calculate the x and y coordinates of the point
		// width/2 and height/2 are the canva's center;
		// sin() in y coord has negative sign because canva's y axis
		// points downward
		for (let j = 0; j < 2; j++) {
		    let x = p.width / 2 + p.cos(theta+j*p.PI) * r;
		    let y = p.height / 2 - p.sin(theta+j*p.PI) * r;
		    
		    // Draw the point or line
		    if (p.polarPlotSelected.Value[i]){
			p.stroke(255,0,0);
			p.strokeWeight(4);
			p.point(x, y);
		    } else {
			p.stroke(0,0,0);
			p.strokeWeight(4);
			p.point(x, y);
		    }
		}
	    }
	}
    };

    // Function to draw the polar grid
    p.drawPolarGrid = function(angle, radius) {
	// Draw concentric circles
	p.stroke(200);
	p.strokeWeight(1);
	for (let r = 10; r <= radius; r += 20) {
	    p.noFill();
	    p.circle(p.width / 2, p.height / 2, r * 2);
	}
	
	// Draw radial lines and labels
	p.textSize(12);
	p.textAlign(p.CENTER, p.CENTER);
	p.stroke(200);
	p.strokeWeight(1);
	for (let i = 0; i < 360; i += angle) {
	    let theta = p.radians(i);
	    let x = p.width / 2 + p.cos(theta) * radius;
	    let y = p.height / 2 + p.sin(theta) * radius;
	    p.line(p.width / 2, p.height / 2, x, y);
	    
	    // Calculate the label position
	    let labelX = p.width / 2 + p.cos(theta) * (radius + 20);
	    let labelY = p.height / 2 + p.sin(theta) * (radius + 20);
	    
	    // Draw the label
	    p.noStroke();
	    p.fill(0);
	    if (i + 90 < 360) {
		textLabel = i + 90;
	    } else {
		textLabel = i + 90 - 360;
	    }
	    p.text(textLabel, labelX, labelY);
	}
	// Draw radial lines
	p.stroke(200);
	p.strokeWeight(1);
	for (let i = 0; i < 360; i += angle) {
	    let theta = p.radians(i);
	    let x = p.width / 2 + p.cos(theta) * radius;
	    let y = p.height / 2 + p.sin(theta) * radius;
	    p.line(p.width / 2, p.height / 2, x, y);
	}

    };

    p.drawSlice = function(angles){

	const startAngle=angles[0];
	const endAngle=angles[1];

	// Define the center of the polar plot
	const centerX = p.width / 2;
	const centerY = p.height / 2;
	
	// Define the radius and angle range for the slice
	const radius = p.min(p.width, p.height) / 2 - 50;

	// Set the fill color for the slice
	p.noStroke();
	p.fill(236.895, 176.970, 31.875);

	// Begin drawing the slice
	for (let j = 0; j <= 1; j++) {
	    p.beginShape();
	    // Move to the center of the polar plot
	    p.vertex(centerX, centerY);
	    // Iterate over the angle range and add vertices to form the slice
	    for (let angle = startAngle; angle <= endAngle; angle += 0.01) {
		const x = centerX + p.cos(angle+j*p.PI) * radius;
		const y = centerY - p.sin(angle+j*p.PI) * radius;
		p.vertex(x, y);
	    }
	    // Close the shape
	    p.endShape(p.CLOSE);
	}
    }

    p.drawLineAtNdegE = function(deg, radius) {
	let x1 = p.width / 2 + p.cos(p.PI/2-p.radians(deg)) * radius;
	let y1 = p.width / 2 - p.sin(p.PI/2-p.radians(deg)) * radius;
	let x2 = p.width / 2 - p.cos(p.PI/2-p.radians(deg)) * radius;
	let y2 = p.width / 2 + p.sin(p.PI/2-p.radians(deg)) * radius;
	p.line(x1,y1,x2,y2);
    }

    p.setLineDash = function(list) {
	p.drawingContext.setLineDash(list);
    }

    p.addRadialLabels = function(centerX, centerY, radius) {
    	// Set the label properties
    	p.textSize(12);
    	p.textAlign(p.CENTER, p.CENTER);
    	p.fill(0);

    	// Iterate over the radial values and add labels
    	for (let r = 10; r <= radius; r += 70) {
    	    const x = centerX + p.cos(0.) * r;
    	    const y = centerY + p.sin(0.) * r;

	    rLabel = p.map(r, 0, radius, 0, p.max(p.polarPlotLengths.Value));
    	    const label = p.nf(rLabel,[],2);//rLabel.toString();
    	    p.text(label, x, y+20);
    	}
    }
};
