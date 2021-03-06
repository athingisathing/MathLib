/**
 * Converts the options to the SVG options format
 *
 * @param {object} options The drawing options  
 * @return {object} The converted options
 */
convertOptions: function (options) {
	var convertedOptions : any = {};
	if ('fillColor' in options) {
		convertedOptions.fill = MathLib.colorConvert(options.fillColor);
	}
	else if ('color' in options) {
		convertedOptions.fill = MathLib.colorConvert(options.color);
	}


	if ('font' in options) {
		convertedOptions.font = options.font;
	}

	if ('fontSize' in options) {
		convertedOptions.fontSize = options.fontSize;
	}


	if ('lineColor' in options) {
		convertedOptions.stroke = MathLib.colorConvert(options.lineColor);
	}
	else if ('color' in options) {
		convertedOptions.stroke = MathLib.colorConvert(options.color);
	}


	if ('dash' in options && options.dash.length !== 0) {
		convertedOptions['stroke-dasharray'] = options.dash;
	}

	if ('dashOffset' in options && options.dashOffset !== 0) {
		convertedOptions['stroke-dashoffset'] = options.dashOffset;
	}


	return convertedOptions;
},