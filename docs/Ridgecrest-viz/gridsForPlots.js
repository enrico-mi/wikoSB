    const gridLargeScale = {
	type: 'FeatureCollection',
	features: []
    };
    const gridLargeScaleLabels = {
	type: 'FeatureCollection',
	features: []
    };
    const largeScaleLngMin = -117.9;
    const largeScaleLngMax = -117.099999;
    const largeScaleLatMin = 35.45;
    const largeScaleLatMax = 36.25;
    const largeScaleLngDelta = (largeScaleLngMax - largeScaleLngMin)/8;
    const largeScaleLatDelta = (largeScaleLatMax - largeScaleLatMin)/8;

    for (let lng = largeScaleLngMin; lng <= largeScaleLngMax; lng += largeScaleLngDelta) {
	gridLargeScale.features.push({
            type: 'Feature',
            geometry: {type: 'LineString', coordinates: [[lng, largeScaleLatMin], [lng, largeScaleLatMax]]},
            properties: {value: lng}
	});
	if (lng < largeScaleLngMax - largeScaleLngDelta && lng > largeScaleLngMin + largeScaleLngDelta){
	    gridLargeScaleLabels.features.push({
		type: 'Feature',
		geometry: {type: 'LineString', coordinates: [[lng, largeScaleLatMin+largeScaleLatDelta], [lng, largeScaleLatMax-largeScaleLatDelta]]},
		properties: {value: lng}
	    });
	}
    }
    for (let lat = largeScaleLatMin; lat <= largeScaleLatMax; lat += largeScaleLatDelta) {
	gridLargeScale.features.push({
            type: 'Feature',
            geometry: {type: 'LineString', coordinates: [[largeScaleLngMin, lat], [largeScaleLngMax, lat]]},
            properties: {value: lat}
	});
	if (lat < largeScaleLatMax - largeScaleLatDelta && lat > largeScaleLatMin + largeScaleLatDelta){
	    gridLargeScaleLabels.features.push({
		type: 'Feature',
		geometry: {type: 'LineString', coordinates: [[largeScaleLngMin+largeScaleLngDelta, lat], [largeScaleLngMax-largeScaleLngDelta,lat]]},
		properties: {value: lat}
	    });
	}
    }

    const smallScaleLngMin = -117.7600001;
    const smallScaleLngMax = -117.6099999;
    const smallScaleLatMin = 35.8000001;
    const smallScaleLatMax = 35.9999999;
    const smallScaleLngDelta = (smallScaleLngMax - smallScaleLngMin)/5;
    const smallScaleLatDelta = (smallScaleLatMax - smallScaleLatMin)/8;

    const gridSmallScale = {
	type: 'FeatureCollection',
	features: []
    };
    for (let lng = smallScaleLngMin; lng <= smallScaleLngMax; lng += smallScaleLngDelta) {
	gridSmallScale.features.push({
            type: 'Feature',
            geometry: {type: 'LineString', coordinates: [[lng, smallScaleLatMin], [lng, smallScaleLatMax]]},
            properties: {value: lng}
	});
    }
    for (let lat = smallScaleLatMin; lat <= smallScaleLatMax; lat += smallScaleLatDelta) {
	gridSmallScale.features.push({
            type: 'Feature',
            geometry: {type: 'LineString', coordinates: [[smallScaleLngMin, lat], [smallScaleLngMax, lat]]},
            properties: {value: lat}
	});
    }
