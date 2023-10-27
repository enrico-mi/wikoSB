let mapSketch = function(p){
    
    let Ponti = [];
    let TJ = [];
    let myMap;
    let paramsCheck = [];
    let failureCheck;
    let mapLoaded = false;
    let markerSelection;
    let mechanismsCheck = [];
    p.numFeatures = {Value: 0};
    p.verified = {Value: 'All'};
    p.methodology = {Value: 0};
    p.coseismic = {Value: 0};
    p.orientationIndex = {Value: 0};
    p.failureColor = {Value: false};
    p.muColoring = {Value: 0.6};
    p.resolutionLength = {Value: 0};
    p.resolutionNeg = {Value: false};
    p.angleSelection = {Value: false};
    p.polarPlotLengths = {Value: []};
    p.polarPlotAngles = {Value: []};
    p.polarPlotSelected = {Value: []};
    p.stressLines = {Value: []};
    let oldStressLines = [];
    p.failureMode = {Value: ["RL","LL","TH"]}; // TH == tensile (from 'THeta')
    p.mechanismsMode = {Value: false};
    p.clearStressLines = {Value: false};
    
    const segmentsPonti = [];
    const segmentsPontiMechs = [];
    let segmentsFlag = 1;//document.querySelector('input[name=resolution-type]:checked').value;
    // Adjustement of topographical angles.
    // N13E angle re-measured in classical trigonometric space;
    // angles inside p.radians() have to be positive if clockwise and negative
    // if ccw and is measured from North;
    // p.radians() from p5.js

    let orientations = [0,13];

    p.colorMode(p.RGB);
    let colorErrorThetaH = p.color(   0, 255,   0); // RGB pure green
    let colorErrorLL     = p.color( 255,   0,   0); // pure red
    let colorErrorRL     = p.color(   0,   0, 255); // pure blue
    let colorErrorsRGB = [ colorErrorRL, colorErrorLL, colorErrorThetaH ];

    let colorCurlinesThetaH = p.color(   0, 120,   0); // dark green
    let colorCurlinesLL     = p.color( 189,   0,   0); // dark red
    let colorCurlinesRL     = p.color(   0,  20, 134); // dark blue
    let colorCurlinesRGB = [ colorCurlinesRL, colorCurlinesLL, colorCurlinesThetaH ];

    const markers = [];

    dpiRatio = 300/96;
    Object.defineProperty(window, 'devicePixelRatio', {
	get: function() {return dpiRatio}

    });

    const awsAddress = 'https://ridgecrest-viz.s3.us-east-2.amazonaws.com/';

    p.preload = function() {
	// Load the GeoJSON data; you can convert shp to geojson at
	// https://mapshaper.org/
	Ponti_mechs = p.loadJSON(awsAddress + 'geojson/ponti_mechs.geojson');
	Ponti = p.loadJSON(awsAddress + 'geojson/ponti_all_lengths.geojson');
	//Ponti = p.loadJSON('./geojson/prova.geojson');
	TJ = p.loadJSON(awsAddress + 'geojson/tj_geojson_ids.json');
	faultTraceMainshock = p.loadJSON('./geojson/fault_trace_mainshock.geojson');
	faultTraceForeshock = p.loadJSON('./geojson/fault_trace_foreshock.geojson');
    };

    // For Fig. 1a (whole area):
    // center: [-117.53,35.75],//
    // zoom: 10.,
    
    // For Fig. 1b (NW zoom):
    // center: [-117.685, 35.88],
    // zoom: 11.7,
    
    p.setup = function() {
	// Create a new map instance
	myMap = new mapboxgl.Map({
	    container: 'region',
	    style: 'mapbox://styles/mapbox/light-v10',//'mapbox://styles/mapbox/satellite-v9',//,
	    center: [-117.53,35.75],//
	    zoom: 10.,
	    preserveDrawingBuffer: true,
	    accessToken:  'pk.eyJ1IjoiZW5yaWNvbWkiLCJhIjoiY2xoejd1dmQ2MTN0aDNmcDB6eWI1M3lnbSJ9.JedSnxXDco6QF3fhImcr-Q'
	});

	// Wait for the map to load
	    myMap.on('load', function () {

		// update variable that tell that map was loaded
		mapLoaded = true;

		// Add the GeoJSON data as a source
		// Ponti et al coseismic ruptures
		myMap.addSource('Ponti-et-al', {
		    type: 'geojson',
		    data: Ponti
		});

		// Thompson-Jobe pre-2019 features
		myMap.addSource('Thompson-Jobe', {
		    type: 'geojson',
		    data: TJ
		});

		// Ponti-et-al known mechanisms in NW area
		myMap.addSource('Ponti-et-al-NW-mechs', {
		    type: 'geojson',
		    data: Ponti_mechs
		});

		// Jin and Fialko fault trace
		myMap.addSource('fault-trace-main', {
		    type: 'geojson',
		    data: faultTraceMainshock
		});

		myMap.addSource('fault-trace-fore', {
		    type: 'geojson',
		    data: faultTraceForeshock
		});

		// Add a layer to display the GeoJSON data
		myMap.addLayer({
		    id: 'ruptures-Ponti',
		    type: 'line',
		    source: 'Ponti-et-al',
		    paint: {
			'line-width': 3,
			'line-color': 'orange',
			'line-opacity': 1
		    },
		    minzoom: 0,
		    maxzoom: 24
		});

		myMap.addLayer({
	    	    id: 'ruptures-TJ',
	    	    type: 'line',
	    	    source: 'Thompson-Jobe',
	    	    paint: {
	    		'line-width': 3,
	    		'line-color': 'rgb(20,20,20)', // dark gray
	    		'line-opacity': 0.2 // transparency
	    	    },
	    	    filter: ['all',['!=', 'CLASS', 'subtle'],['!=', 'CLASS', 'artificial']] 
		});

		// Add a layer to display fault trace
		myMap.addLayer({
		    id: 'fault-trace-main',
		    type: 'line',
		    source: 'fault-trace-main',
		    paint: {
			'line-width': 3,
			'line-color': 'black',
			'line-opacity': 1
		    },
		    minzoom: 0,
		    maxzoom: 24
		});

		myMap.addLayer({
		    id: 'fault-trace-fore',
		    type: 'line',
		    source: 'fault-trace-fore',
		    paint: {
			'line-width': 3,
			'line-color': 'black',
			'line-dasharray': [3, 1, 1],
			'line-opacity': 1
		    },
		    minzoom: 0,
		    maxzoom: 24
		});

		// Add a layer to display selected data
		myMap.addLayer({
		    id: 'selected-Ponti',
		    type: 'line',
		    source: 'Ponti-et-al',
		    paint: {
			'line-width': 2,
			'line-color': 'yellow'
		    },
		    filter: ['in', 'fid', '']
		});

		myMap.addLayer({
		    id: 'selected-TJ',
		    type: 'line',
		    source: 'Thompson-Jobe',
		    paint: {
			'line-width': 3,
			'line-color': 'blue'
		    },
		    filter: ['in', 'fid', '']
		});

		// Creating bounding box for NW fractures
		var bbox = [[-117.74, 35.82], [-117.63, 35.94]];

		// Draw the box as a mapbox-gl feature
		myMap.addLayer({
		    id: 'box',
		    type: 'line',
		    source: {
			type: 'geojson',
			data: {
			    type: 'Feature',
			    geometry: {
				type: 'Polygon',
				coordinates: [[
				    [bbox[0][0], bbox[0][1]],
				    [bbox[1][0], bbox[0][1]],
				    [bbox[1][0], bbox[1][1]],
				    [bbox[0][0], bbox[1][1]],
				    [bbox[0][0], bbox[0][1]]
				]]
			    }
			}
		    },
		    paint: {
			'line-color': 'black',
			'line-width': 2,
			'line-dasharray': [2,2]
		    }
		});

		myMap.moveLayer('ruptures-Ponti', null);
		myMap.moveLayer('selected-Ponti', null);
		
		// Add a scale control to the map
		const scale = new mapboxgl.ScaleControl({
		    unit: 'metric',
		});
		myMap.addControl(scale);

		p.generateSegmentsSources();
	    });

	// Event listener for click on features
	myMap.on('click', (e) => {

	    // Set `bbox` as 5px reactangle area around clicked point.
	    // For some reasons I cannot understand, there is an offset of
	    // roughly 100px in the selection in the vertical direction
	    const bbox = [
		[e.point.x - 5, e.point.y + 100],
		[e.point.x + 5, e.point.y + 110]
	    ];
	    // Find features intersecting the bounding box.
	    const selectedFeaturesCoseismic = myMap.queryRenderedFeatures(bbox, {
		layers: ['ruptures-Ponti']
	    });
	    p.numFeatures.Value = selectedFeaturesCoseismic.length;

	    const fidsCoseismic = selectedFeaturesCoseismic.map(
		(feature) => feature.properties.fid
	    );
	    // Set a filter matching selected features by fid property
	    // to activate the 'selected-ruptures' layer.
	    myMap.setFilter('selected-Ponti', ['in', 'fid', ...fidsCoseismic]);

	    
	    const allSelectedFeatures = [...selectedFeaturesCoseismic];

	    if (allSelectedFeatures.length == 0){
		markers.forEach(marker => marker.remove());
		markers.length = 0;
	    }

	    allSelectedFeatures.forEach((feature) => {
		// Calculate the center of the coordinates for the current feature
		const centroid = turf.centerOfMass(feature);

		// Get the centroid coordinates
		const lngLat = centroid.geometry.coordinates;

		// Build the HTML content for the popup
		let popupContent = '<h3>Feature Properties:</h3>';
		Object.entries(feature.properties).forEach(([key, value]) => {
		    popupContent += `<p>${key}: ${value}</p>`;
		});

		// Create a marker
		markerSelection = new mapboxgl.Marker({
		    draggable: true // Enable dragging
		})
		    .setLngLat(lngLat) // Set the marker's coordinates
		    .addTo(myMap);

		markers.push(markerSelection);

		// Create a popup at the centroid location for the current feature
		var popup = new mapboxgl.Popup()
		    .setLngLat(lngLat)
		    .setHTML(popupContent)
		    .addTo(myMap);

		// Attach the popup to the marker
		markerSelection.setPopup(popup);

		// Open the popup when the marker is clicked
		markerSelection.on('click', function () {
		    popup.addTo(myMap);
		});

	    });

	});
    };

    p.colorByError = function() {
	// making already plotted lines opaque for small scale features
	myMap.setPaintProperty('ruptures-Ponti', 'line-opacity', 1.);
	lineSegmentsSource = 'line-segments';
	lineSegmentsLayer = 'line-segments-layer';
	if (myMap.getSource(lineSegmentsSource)) {
	    if (myMap.getLayer(lineSegmentsLayer)) {
		// Layer that uses source exists, remove it
		myMap.removeLayer(lineSegmentsLayer);
	    }
	    // Source exists, remove it
	    myMap.removeSource(lineSegmentsSource);
	}	    

	// clear layers and return if user decides not to plot errors
	if (p.failureColor.Value === false){
	    return;
	}
	// Create an array to store the line segments
	const lineSegments = [];
	const shortSegments = [];
	const numFeatures = Ponti.features.length;
	let indFeature = 0;

	var renderedFeatures;
	var selectedIds;

	if (myMap.getLayer('LL-Ponti')) {
	    referenceFeatures = segmentsPontiMechs;
	} else {	    
	    if (p.resolutionLength.Value>1e-6) {
		referenceFeatures = segmentsPonti;
	    } else {
		referenceFeatures = Ponti.features;
	    }
	}
	
	referenceFeatures.forEach(function(feature) {

	    const coordinates = feature.geometry.coordinates;
	    indColor = (indFeature/numFeatures)*255;
	    // Create line segments with different colors
	    var arrayLength;
	    if (Array.isArray(feature.properties.Lengths)) {
		arrayLength = feature.properties.Lengths.length;
	    } else {
		arrayLength = 1;
	    }

	    var skipFeature = false;
	    var refLat = feature.geometry.coordinates[0][0];
	    var refLng = feature.geometry.coordinates[0][1];
	    if (!p.inArea(refLat,refLng,-117.74,-117.63,35.82,35.94)) {
		skipFeature = true;
	    } else if ( (!(feature.properties.coseismic === 'Yes')) ||
		 (feature.properties.mechanism === 'U') ) {
		skipFeature = true;
	    }

	    // console.log(skipFeature);
	    if (!skipFeature) {
		for (let i = 0; i <= coordinates.length - 2; i++) {
		    // discard those larger/shorter than resolution slider
		    if (arrayLength > 1) {
			referenceLength = feature.properties.Lengths[i];
			angleSegment = feature.properties.AngleUTM[i];
		    } else {
			referenceLength = feature.properties.Lengths;
			angleSegment = feature.properties.AngleUTM;
		    }

		    if ( (referenceLength < p.resolutionLength.Value) && p.resolutionNeg.Value === false ) {
			continue;
		    } else if ( (referenceLength > p.resolutionLength.Value) && p.resolutionNeg.Value === true ) {
			continue;
		    }
		    //-1 because segments are one less than the number of coordinates pairs
		    //-1 because index starts from 0
		    //=> coordinates.length-2
		    // inputType = typeof feature.properties.AngleUTM;
		    // if (coordinates.length - 1 === 1){
		    //     if (inputType === 'number') {
		    // 	angleSegment = feature.properties.AngleUTM;
		    //     } else {
		    // 	console.error('Input is not a number. It is a ' + inputType );
		    // 	console.log(i);
		    // 	console.log(coordinates.length-1);
		    // 	console.log(typeof feature.properties.AngleUTM);
		    // 	console.log(feature.properties.AngleUTM);
		    // 	console.log(feature);
		    // 	console.log(feature.geometry);
		    // 	console.log(feature.properties);
		    //     }
		    // } else {		     
		    //     if (inputType === 'object') {
		    // 	angles = feature.properties.AngleUTM;
		    // 	angleSegment = angles[i];
		    //     } else {
		    // 	console.error('Input is not an object (array). It is a ' + inputType);
		    // 	console.log(i);
		    // 	console.log(coordinates.length-1);
		    // 	console.log(typeof feature.properties.AngleUTM);
		    // 	console.log(feature.properties.AngleUTM);
		    // 	console.log(feature);
		    // 	console.log(feature.geometry);
		    // 	console.log(feature.properties);
		    //     }
		    // }
		    if (isNaN(angleSegment)) {
			console.error('angleSegment is NaN');
			console.log(i);
			console.log(coordinates.length-1);
			console.log(typeof feature.properties.AngleUTM);
			console.log(feature.properties.AngleUTM);
			console.log(feature);
			console.log(feature.geometry);
			console.log(feature.properties);
		    }

		    const referenceOrientation = orientations[p.orientationIndex.Value];
		    const sigmaHOrientation = p.PI/2 - p.radians(referenceOrientation);

		    const mu_ref = p.muColoring.Value/10; // slider goes from 0 to 15, not 0 to 1.5
		    const beta = (p.PI/2 - p.atan(mu_ref))/2;
		    const LLOrientation = p.PI/2 - p.radians(referenceOrientation+p.degrees(beta));
		    const RLOrientation = p.PI/2 - p.radians(referenceOrientation-p.degrees(beta));

		    // correcting angle segment to put it in an interval pi-wide centered around thetaH
		    if (angleSegment < (sigmaHOrientation - p.PI/2) ){
			angleSegment += p.PI;
		    } else if  (angleSegment > (sigmaHOrientation + p.PI/2) ){
			angleSegment -= p.PI;
		    }

		    thetaHError = Math.abs(angleSegment - sigmaHOrientation);
		    LLError = Math.abs(angleSegment - LLOrientation);
		    RLError = Math.abs(angleSegment - RLOrientation);
		    if (p.failureColor.Value) {
			errors = [RLError, LLError, thetaHError];
		    } else {
			errors = [RLError, LLError];
		    }
		    const minError = Math.min(...errors); // ... to spread input as
		    // Math.min takes
		    // individual arguments

		    const indexMinError = errors.indexOf(minError);

		    // removing shades to group all features of same colour in
		    // one unique layer
		    if (indexMinError === 0) {
			segmentColor = "rgb(0,20,134)";
		    } else if (indexMinError === 1) {
			segmentColor = "rgb(189,0,0)";
		    } else if (indexMinError === 2) {
			segmentColor = "rgb(0,120,0)";
		    }
		    //segmentColor = colorCurlinesRGB[indexMinError];
			    
		    // alpha channel is between 0 (transparent) and 1 (opaque);
		    // I rescale the error so that the largest error is
		    // alpha=0.25, and the smallerst erros is alpha=1. This way,
		    // the largest error is still visible
 		    // alphaErrorThetaH = (1-minError/(p.PI/2)*0.75)+0.25;

		    // Instead of alpha channel, using saturation of HSL channels;
		    // saturation takes values between 0 and 1; I am rescaling
		    // them between .25 and 1 so that the largest error is still
		    // coloured
		    // saturationError = ((1-minError/(p.PI/2)))*100;
		    // lightnessError = ((1-minError/(p.PI/2))*0.5+0.1)*100;

		    // // getting hue and lightness of reference color
		    // hueColor = p.hue(segmentColor);
		    // saturationColor = p.saturation(segmentColor);
		    // lightnessColor = p.lightness(segmentColor);

		    // // changing p5 color space to HSL and generating new color
		    // p.colorMode(p.HSL);
		    // segmentColor = p.color(hueColor, saturationError, lightnessError);

		    // // converting to mapbox RGB space
		    // segmentColor = 'rgb('+p.red(segmentColor)+','+p.green(segmentColor)+','+p.blue(segmentColor)+')';

		    const segment = {
			type: 'Feature',
			geometry: {
			    type: 'LineString',
			    coordinates: [coordinates[i], coordinates[i + 1]]
			},
			properties: {
			    color: segmentColor, // Assign color to the segment
			    Class: feature.properties.Class,
			    Verified: feature.properties.Verified,
			    coseismic: feature.properties.coseismic,
			    localLength: referenceLength
			}
		    };

		    lineSegments.push(segment);
		    // if (referenceLength < 20) {
		    // 		shortSegments.push(segment);
		    // }
		}
		indFeature += 1;
	    }
	});

	// console.log(lineSegments);

	// var nbSegmentsOriginal = lineSegments.length - 1;
	// var aggregatedSegments = [];
	// var idxReference = p.generateRangeArray(0,nbSegmentsOriginal);

	// console.log(lineSegments);
	// let f = 0;

	// for (let ids = 0; ids <= nbSegmentsOriginal; ids++) {

	//     s = idxReference[ids];
	//     if (s!=-1) {
	// 	console.log(s);
	//     	var newCoords = [];
	//     	var currentCoords = lineSegments[s].geometry.coordinates;
	//     	newCoords.push(currentCoords);
	//     	idxReference[s] = -1;
		
	//     	for (let idq = ids; idq <= idxReference.length-1; idq++) {

	//     	    q = idxReference[idq];

	//     	    if (q!=-1) {
	//     	    	var targetCoords = lineSegments[q].geometry.coordinates;
	//     	    	if (JSON.stringify(newCoords[1]) === JSON.stringify(targetCoords[0])) {
	//     	    	    // add segment at the end
	//     	    	    newCoords.push(targetCoords);
	//     	    	    idxReference[q] = -1;
	//     	    	} else if (JSON.stringify(newCoords[0]) === JSON.stringify(targetCoords[1])) {
	//     	    	    // add segment at the beginning
	//     	    	    newCoords.unshift(targetCoords);
	//     	    	    idxReference[q] = -1;
	//     	    	}
	//     	    }
	//     	}

	//     	aggregatedSegments.push(newCoords);
	//     }	    

	// }

	// console.log('done with loop, aggregatedSegments:');
	// console.log(aggregatedSegments);
	// var usedK = [];
	// for (let j = 0; j < indFeature; j++) {
	//     if (!usedK.includes(j)) {
	// 	aggregatedSegments.push(lineSegments[j]);
	// 	currentCoords = lineSegments[j].geometry.coordinates;
	// 	newCoords = currentCoords;
	// 	console.log('currentCoords: ' + currentCoords);
	// 	console.log('currentCoords[0]: ' + currentCoords[0]);
	// 	console.log('currentCoords[1]: ' + currentCoords[1]);
	// 	for (let k = 0; k < indFeature; k++) {
	// 	    if (k!=j) {
	// 		testCoords = lineSegments[k].geometry.coordinates;
	// 		if (testCoords === currentCoords) {

	// 		    newCoords.push(testCoords);
	// 		    nbSegments += 1;
	// 		    usedK.push(k);
	// 		    console.log('newCoords: ' + newCoords);
			    
	// 		    // update coords to aggregated segments by adding the ones that are concatenated 
	// 		}
	// 	    }
		    
	// 	}
	//     }
	// }

	// Add the line segments as a single source to the map
	myMap.addSource(lineSegmentsSource, {
	    type: 'geojson',
	    data: {
		type: 'FeatureCollection',
		features: lineSegments
	    }
	});

	// Add a layer to render the line segments
	myMap.addLayer({
	    id: lineSegmentsLayer,
	    type: 'line',
	    source: lineSegmentsSource,
	    minzoom: 0,
	    lineMetrics: true, // Prevents simplification of geometries
	    paint: {
		'line-color': {
		    type: 'identity',
		    property: 'color' // Property that contains the color value for each segment
		},
		'line-width': 4, // Adjust the line width as needed
	    },
	    minzoom: 0,
	    maxzoom: 24
	});

	// Move segments layer to the top
	if  (myMap.getLayer(lineSegmentsLayer)) {
	    myMap.moveLayer(lineSegmentsLayer, null);
	}
	console.log('done with adding new lines and layer for coloring');
	myMap.moveLayer('selected-Ponti', null);
	
    };

    p.updateMap = function() {
	// Define the filter condition based on the parameter you provide
	// segmentsFlag = Boolean(document.querySelector('input[name=resolution-type]:checked').value);

	var layersToFilter = [];
	var featuresSel;
	if (myMap.getLayer('LL-Ponti')) {
	    myMap.setLayoutProperty('Ponti-segments', 'visibility', 'none');
	    myMap.setLayoutProperty('Ponti-segments-mechs', 'visibility', 'none');
	    myMap.setLayoutProperty('ruptures-Ponti', 'visibility', 'none');
	    featuresSel = segmentsPontiMechs;
	    layersToFilter.push('LL-Ponti');
	    layersToFilter.push('RL-Ponti');
	    layersToFilter.push('V-Ponti');
	} else if (p.resolutionLength.Value>1e-6) {
	    myMap.setLayoutProperty('ruptures-Ponti', 'visibility', 'none');
	    myMap.setLayoutProperty('Ponti-segments-mechs', 'visibility', 'none');
	    myMap.setLayoutProperty('Ponti-segments', 'visibility', 'visible');
	    featuresSel = segmentsPonti;
	    layersToFilter.push('Ponti-segments');
	} else {
	    myMap.setLayoutProperty('Ponti-segments-mechs', 'visibility', 'none');
	    myMap.setLayoutProperty('Ponti-segments', 'visibility', 'none');
	    myMap.setLayoutProperty('ruptures-Ponti', 'visibility', 'visible');
	    featuresSel = Ponti.features;
	    layersToFilter.push('ruptures-Ponti');
	}

	var methodologyCondition;
	
	if (p.methodology.Value === 1) {
	    methodologyCondition = ['==', ['get', 'Class'], 'Field'];
	} else if (p.methodology.Value === 2){
	    methodologyCondition = ['==', ['get', 'Class'], 'Remote Sensing'];
	} else {
	    // If the parameter value is not 'Field' or 'Remote Sensing', show all features
	    methodologyCondition = ['has', 'Class'];
	}

	if (p.coseismic.Value === 1) {
	    coseismicCondition = ['==', ['get', 'coseismic'], 'Yes'];
	} else {
	    // If the parameter value is not 'no' or 'yes', show all features
	    coseismicCondition = ['has', 'coseismic'];
	}

	const fidResolution  = [];
	const fidAngles = [];

	featuresSel.forEach(function(feature) {
	    const coordinates = feature.geometry.coordinates;
	    var resolutionFlag = false;

	    var fractureLength;
	    if (Array.isArray(feature.properties.Lengths)) {
		fractureLength = p.computeSum(feature.properties.Lengths);
	    } else {
		fractureLength = feature.properties.Lengths;
	    }

	    if ( (fractureLength >= p.resolutionLength.Value) && p.resolutionNeg.Value === false ) {
		resolutionFlag = true; // filtering out fractures that meet condition
	    } else if ( (fractureLength < p.resolutionLength.Value) && p.resolutionNeg.Value === true ) {
		resolutionFlag = true;
	    }

	    if (resolutionFlag) {
		fidResolution.push(feature.properties.fid);
	    }

	    // selecting angles between N30E and N60E
	    if (p.angleSelection.Value === true) {
		angleFracture = feature.properties.AngleAveUTM;
		if (angleFracture < 0 ){ // moving angles in range [0,PI]
		    angleFracture += p.PI;
		}
		if ( (angleFracture < p.PI/2 - p.radians(30)) && (angleFracture > p.PI/2 - p.radians(60)) ){
		    fidAngles.push(feature.properties.fid);
		}
	    }
	    else {
		fidAngles.push(feature.properties.fid);
	    }
	});

	resolutionCondition = ['in', ['get', 'fid'], ['literal', fidResolution] ];
	anglesCondition = ['in', ['get', 'fid'], ['literal', fidAngles] ];

	var filterCondition = ['all', methodologyCondition, coseismicCondition, resolutionCondition, anglesCondition];

	// Set the filter on the desired layers
	if (myMap.getLayer('line-segments-layer')) {
	    layersToFilter.push('line-segments-layer');
	}

	layersToFilter.forEach(layerToFilter => {
	    if (layerToFilter === 'LL-Ponti') {
		// concat() does not modify the array it is applied to (unlike
		// push()), it creates a new variable
		myMap.setFilter(layerToFilter, filterCondition.concat([p.filterMechanisms('LL')]));
	    } else if (layerToFilter === 'RL-Ponti') {
		myMap.setFilter(layerToFilter, filterCondition.concat([p.filterMechanisms('RL')]));
	    } else if (layerToFilter === 'V-Ponti') {
		myMap.setFilter(layerToFilter, filterCondition.concat([p.filterMechanisms('V')]));
	    } else {
		myMap.setFilter(layerToFilter, filterCondition);
	    }
	});

	if (myMap.getLayer('line-segments-layer')) {
	    myMap.moveLayer('line-segments-layer', null);
	}
	
    };

    p.checkParameterValue = function() {
	if (mapLoaded){
	    // Check if the parameter value has changed
	    // Compare the current value with the previous value
	    // Perform the necessary actions based on the change
	    
	    const previousFailureValue = failureCheck;
	    p.failureColor.Value = document.querySelector('#failure-color').checked;
	    if (p.failureColor.Value !== previousFailureValue){
		p.colorByError();
	    }
	    failureCheck = p.failureColor.Value;		


	    // Example logic to check if the parameters have changed
	    const previousValues = paramsCheck;
	    const currentValues = [p.methodology.Value, p.coseismic.Value, p.orientationIndex.Value, p.muColoring.Value, p.resolutionLength.Value, p.resolutionNeg.Value, p.angleSelection.Value]; // Get the current value of the parameters
	    for (let i = 0; i < currentValues.length; i++) {
		if (currentValues[i] !== previousValues[i]) {
		    // The parameter value has changed
		    // Call the function to update the Mapbox map
		    // Update the previous value to the current value
		    p.updateMap();
		    if (myMap.getLayer('line-segments-layer')) {
			p.colorByError();
		    }
		    paramsCheck = currentValues;
		    break;
		}
	    }
	}
    };

    p.filterMechanisms = function(mechanism){
	return ['in', ['get', 'mechanism'], mechanism];
    };

    p.refreshMechanismsLayers = function(){
	if (myMap.getLayer('LL-Ponti')) {
	    myMap.removeLayer('LL-Ponti');
	    myMap.removeLayer('RL-Ponti');
	    myMap.removeLayer('V-Ponti');
	}

	let sourceMechanisms;
	if (p.resolutionLength.Value>1e-6) {
	    sourceMechanisms = 'Ponti-et-al-NW-segments-mechs';
	} else {
	    sourceMechanisms = 'Ponti-et-al-NW-mechs';
	}

	myMap.addLayer({
	    id: 'LL-Ponti',
	    type: 'line',
	    source: sourceMechanisms,
	    paint: {
	    	'line-width': 3,
	    	'line-color': 'rgb(189,0,0)', // red
	    	'line-opacity': 1 // no transparency
	    },
	    filter: p.filterMechanisms('LL')
	});

	myMap.addLayer({
	    id: 'RL-Ponti',
	    type: 'line',
	    source: sourceMechanisms,
	    paint: {
	    	'line-width': 3,
	    	'line-color': 'rgb(0,30,124)', // blue
	    	'line-opacity': 1 // no transparency
	    },
	    filter: p.filterMechanisms('RL')
	});

	myMap.addLayer({
	    id: 'V-Ponti',
	    type: 'line',
	    source: sourceMechanisms,
	    paint: {
	    	'line-width': 3,
	    	'line-color': 'rgb(0,120,0)', // green
	    	'line-opacity': 1 // no transparency
	    },
	    filter: p.filterMechanisms('V')
	});
	
    };

    p.superposeMechanisms = function() {
	if (mapLoaded){
	    // Check if plotting known mechanisms
	    const previousValues = mechanismsCheck;
	    const currentValues = [p.mechanismsMode.Value, p.resolutionLength.Value];

	    for (let i = 0; i < currentValues.length; i++) {
		if (currentValues[i] !== previousValues[i]) {
		    // The parameter value has changed
		    // Superpose colors for known mechanisms
		    if (currentValues[0] === true) {
			p.refreshMechanismsLayers();
		    } else {
			// just checking one layer as they are all created at the
			// same time
			if (myMap.getLayer('LL-Ponti')) {
			    myMap.removeLayer('LL-Ponti');
			    myMap.removeLayer('RL-Ponti');
			    myMap.removeLayer('V-Ponti');
			}
		    }
		    p.updateMap();
		    
		    mechanismsCheck = currentValues;
		}
	    }
	}
    };

    p.polarPlotData = function() {
    	if (mapLoaded){
	    if (myMap.getLayer('ruptures-Ponti')) {

		var renderedFeatures;
		var selectedIds;

		[renderedFeatures, selectedIds, renderedIds, referenceFeatures] = p.getRenderedFeatures();

    		// Loop over the features
    		p.polarPlotLengths.Value = [];
    		p.polarPlotAngles.Value = [];
    		p.polarPlotSelected.Value = Array(renderedFeatures.length).fill(false);

		var plotLength;
		var plotAngle;
    		let j = 0;
		
		if (myMap.getZoom()<12 || renderedFeatures.length > 100) {
		    renderedFeatures.forEach(function(feature) {
    			// Access individual feature properties or perform operations
    			// plotting in classic space where theta is positive if CCW
			const coordinates = feature.geometry.coordinates;

			var plotAngle = JSON.parse(feature.properties.AngleAveUTM);
			var plotLengths = JSON.parse(feature.properties.Lengths);

			if (Array.isArray(plotLengths)) {
			    plotLength = p.computeSum(plotLengths);
			} else {
			    plotLength = plotLengths;
			}

			p.polarPlotAngles.Value.push(p.degrees(plotAngle));
    			p.polarPlotLengths.Value.push(plotLength);
			
    			if (selectedIds.includes(feature.properties.fid)) {
    			    p.polarPlotSelected.Value[j] = true;
    			}
			j += 1;
		    });
    		} else {
		    renderedFeatures.forEach(function(feature) {
    			// Access individual feature properties or perform operations
    			// plotting in classic space where theta is positive if CCW

			var plotAngles = JSON.parse(feature.properties.AngleUTM);
			var plotLengths = JSON.parse(feature.properties.Lengths);

			var arrayLength;
			if (Array.isArray(plotLengths)) {
			    arrayLength = plotLengths.length;
			} else {
			    arrayLength = 1;
			}
			
			for (let i = 0; i <= arrayLength-1; i++) {

			    if (arrayLength === 1){
				plotAngle = plotAngles;
				plotLength = plotLengths;
			    } else if (arrayLength > 1){
				plotAngle = plotAngles[i];
				plotLength = plotLengths[i];
			    } else {
				console.log("error, plotLengths.length of incompatible value");
			    }
    			    p.polarPlotAngles.Value.push(p.degrees(plotAngle));
    			    p.polarPlotLengths.Value.push(plotLength);
			    
    			    if (selectedIds.includes(feature.properties.fid)) {
    				p.polarPlotSelected.Value[j] = true;
    			    }
			    j += 1;

			}
    		    });
    		}
	    }
	}
    };

    p.statusStressLines = function(){
    	if (mapLoaded & p.stressLines.Value.length > 0 & p.stressLines.Value !== oldStressLines) {
	    p.renderStressLines();
	    oldStressLines = p.stressLines.Value;
	}
    };

    p.renderStressLines = async function(){
    	if (mapLoaded) {

	    for ( var failMode = 0; failMode<3; failMode++ ) {
		console.log('start of iteration:');
		console.log(failMode);

		await p.loadStressLines(failMode);

		console.log('end of iteration:');
		console.log(failMode);

	    }

	    myMap.moveLayer('ruptures-Ponti', null);
	    myMap.moveLayer('selected-Ponti', null);
	    
    	}
    };

    p.removeStressLines = function(curlinesLayerName){
    	if (myMap.getSource(curlinesLayerName)) {
    	    if (myMap.getLayer(curlinesLayerName)) {
    		myMap.removeLayer(curlinesLayerName);
    	    }
    	    myMap.removeSource(curlinesLayerName);
    	}	    
    };

    p.loadStressLines = function(failMode){

	return new Promise(resolve => {

	    curlinesLayerName = 'curlines-'+p.failureMode.Value[failMode];

	    p.removeStressLines(curlinesLayerName);

	    if (failMode != 2){
    		var geoJSONFileUrl = awsAddress + 'geojson/streamlines/' +
    	    	    p.stressLines.Value + '_' +
    	    	    p.failureMode.Value[failMode] + '_NW.geojson';
	    } else {
    		var geoJSONFileUrl = awsAddress + 'geojson/streamlines/' +
    	    	    p.stressLines.Value.slice(0,-5) + '_' +
    	    	    p.failureMode.Value[failMode] + '_NW.geojson';
	    }

    	    // geoJSONData represents the resolved value of the promise
    	    // returned by the loadGeoJSONFile function.
    	    loadGeoJSONFile(geoJSONFileUrl)
    		.then(function(geoJSONData) {

		    console.log(geoJSONFileUrl);
    	    	    var curlines = JSON.parse(geoJSONData); //p.loadJSON(geoJSONFileUrl);
		    
    	    	    myMap.addSource(curlinesLayerName, {
    	    		type: 'geojson',
    	    		data: curlines
    	    	    });

		    console.log('colorErrosRGB');
		    console.log(colorCurlinesRGB);
		    console.log('colorCurlinesRGB[failMode]');
		    console.log(colorCurlinesRGB[failMode]);
		    layerColor = colorCurlinesRGB[failMode];
		    console.log('layerColor');
		    console.log(layerColor);
		    const layerColorText = 'rgb('+p.red(layerColor)+','+p.green(layerColor)+','+p.blue(layerColor)+')';
		    console.log('layerColorText');
		    console.log(layerColorText);

    	    	    myMap.addLayer({
    	    		id: curlinesLayerName,
    	    		type: 'line',
    	    		source: curlinesLayerName,
    	    		paint: {
    	    		    'line-width': 1,
    	    		    'line-color': layerColorText,
    	    		    'line-opacity': 1
    	    		},
    	    		minzoom: 0,
    	    		maxzoom: 24
    	    	    });

		    // linking html toggle for stress lines
		    console.log('adding toggle');
		    console.log('stresslines-'+p.failureMode.Value[failMode]+'-toggle');
		    p.addLayerToggle('stresslines-'+p.failureMode.Value[failMode]+'-toggle',curlinesLayerName);

		    resolve();		    
    		})
    		.catch(function(error) {
    	    	    // Handle any errors that occur during the file loading
    	    	    console.error(error);
    		});

	});
	
    };

    // Function to load the GeoJSON file asynchronously
    function loadGeoJSONFile(url) {
    	return new Promise(function(resolve, reject) {
    	    var xhr = new XMLHttpRequest();
    	    xhr.open('GET', url, true);
    	    xhr.onload = function() {
    		if (xhr.status === 200) {
    		    resolve(xhr.responseText);
    		} else {
    		    reject(new Error('Failed to load GeoJSON file.'));
    		}
    	    };
    	    xhr.send();
    	});
    };

    p.computeSum = function(vector) {
	const sum = vector.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	return sum;
    };

    p.addLayerToggle = function(toggleId, layerId){
	const toggleButton = document.getElementById(toggleId);
	myMap.setLayoutProperty(layerId, 'visibility', toggleButton.checked ? 'visible' : 'none');
	toggleButton.addEventListener('change', () => {
	    const isVisible = toggleButton.checked;
	    myMap.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
	});
    };
    
    p.generateSegmentsSources = function() {

	// Create an array to store the line segments
	const numFeatures = Ponti.features.length;
	
	var idx = 0;
	Ponti.features.forEach(function(feature) {

	    const coordinates = feature.geometry.coordinates;

	    var arrayLength;
	    if (Array.isArray(feature.properties.Lengths)) {
		arrayLength = feature.properties.Lengths.length;
	    } else {
		arrayLength = 1;
	    }

	    for (let i = 0; i <= coordinates.length - 2; i++) {

		if (arrayLength > 1) {
		    referenceLength = feature.properties.Lengths[i];
		    referenceAngle = feature.properties.AngleUTM[i];
		} else {
		    referenceLength = feature.properties.Lengths;
		    referenceAngle = feature.properties.AngleUTM;
		}
		
		const segment = {
		    type: 'Feature',
		    geometry: {
			type: 'LineString',
			coordinates: [coordinates[i], coordinates[i + 1]]
		    },
		    properties: {
			Class: feature.properties.Class,
			Verified: feature.properties.Verified,
			coseismic: feature.properties.coseismic,
			Lengths: referenceLength,
			AngleUTM: referenceAngle,
			AngleAveUTM: referenceAngle,
			fid: idx,
			oid: feature.properties.fid
		    }
		};
		idx += 1;

		segmentsPonti.push(segment);
	    }
	});

	// For known mechanisms
	const numFeaturesMechs = Ponti_mechs.features.length;
	
	idx = 0;
	Ponti_mechs.features.forEach(function(feature) {

	    const coordinates = feature.geometry.coordinates;

	    var arrayLength;
	    if (Array.isArray(feature.properties.Lengths)) {
		arrayLength = feature.properties.Lengths.length;
	    } else {
		arrayLength = 1;
	    }
	    
	    for (let i = 0; i <= coordinates.length - 2; i++) {
		if (arrayLength > 1) {
		    referenceLength = feature.properties.Lengths[i];
		    referenceAngle = feature.properties.AngleUTM[i];
		} else {
		    referenceLength = feature.properties.Lengths;
		    referenceAngle = feature.properties.AngleUTM;
		}
		const segment = {
		    type: 'Feature',
		    geometry: {
			type: 'LineString',
			coordinates: [coordinates[i], coordinates[i + 1]]
		    },
		    properties: {
			Class: feature.properties.Class,
			Verified: feature.properties.Verified,
			coseismic: feature.properties.coseismic,
			mechanism: feature.properties.mechanism,
			Lengths: referenceLength,
			AngleUTM: referenceAngle,
			AngleAveUTM: referenceAngle,
			fid: idx,
			oid: feature.properties.fid
		    }
		};
		idx += 1;

		segmentsPontiMechs.push(segment);
	    }
	});

	// Ponti-et-al segments
	myMap.addSource('Ponti-et-al-NW-segments', {
	    type: 'geojson',
	    data: {
		type: 'FeatureCollection',
		features: segmentsPonti
	    }
	});

	// Ponti-et-al segments
	myMap.addSource('Ponti-et-al-NW-segments-mechs', {
	    type: 'geojson',
	    data: {
		type: 'FeatureCollection',
		features: segmentsPontiMechs
	    }
	});

	// add segments layers for Ponti et al
	myMap.addLayer({
	    id: 'Ponti-segments',
	    type: 'line',
	    source: 'Ponti-et-al-NW-segments',
	    paint: {
	    	'line-width': 3,
	    	'line-color': 'orange',
	    	'line-opacity': 1
	    },
	    minzoom: 0,
	    maxzoom: 24,
	    visibility: 'none'
	});

	// add segments layers for Ponti et al, mechs
	myMap.addLayer({
	    id: 'Ponti-segments-mechs',
	    type: 'line',
	    source: 'Ponti-et-al-NW-segments-mechs',
	    paint: {
	    	'line-width': 3,
	    	'line-color': 'blue',
	    	'line-opacity': 1.
	    },
	    minzoom: 0,
	    maxzoom: 24,
	    visibility: 'none'
	});

    };

    p.getRenderedFeatures = function() {

	var referenceFeatures;
	
	if (myMap.getLayer('LL-Ponti')) {
	    layersId = ['LL-Ponti','RL-Ponti','V-Ponti','selected-Ponti'];
	    referenceFeatures = segmentsPontiMechs;
	} else {	    
	    layersId = ['ruptures-Ponti','Ponti-segments','selected-Ponti'];
	    if (p.resolutionLength.Value>1e-6) {
		referenceFeatures = segmentsPonti;
	    } else {
		referenceFeatures = Ponti.features;
	    }
	}
    
    	const renderedFeatures = myMap.queryRenderedFeatures(undefined, {
    	    layers: layersId
    	});
    	const selectedFeatures = myMap.queryRenderedFeatures(undefined, {
    	    layers: [layersId[layersId.length - 1]] //getting last element for selected features
    	});

    	let selectedIds = [];
    	selectedFeatures.forEach((feature) => {
    	    selectedIds.push(feature.properties.fid);
    	});

	renderedIds = [];
	renderedFeatures.forEach(function(feature) {
	    currentId = feature.properties.fid;
	    if (!renderedIds.includes(currentId)) {
		renderedIds.push(currentId);
	    }
	});

	return [renderedFeatures, selectedIds, renderedIds, referenceFeatures];
    };

    p.generateRangeArray = function(n, m) {
	let result = [];
	for (let i = n; i <= n + m; i++) {
	    result.push(i);
	}
	return result;
    };

    p.inArea = function(pointLat,pointLng,lat1,lat2,lng1,lng2) {
	if (pointLat >= Math.min(lat1, lat2) &&
	    pointLat <= Math.max(lat1, lat2) &&
	    pointLng >= Math.min(lng1, lng2) &&
	    pointLng <= Math.max(lng1, lng2)) {
	    return true;
	    //console.log('Point is inside the rectangle.');
	} else {
	    return false;
	    // console.log('Point is outside the rectangle.');
	}
    };
};
