var errors = [],
		warnings = [];



// ### [MathLib.on()](http://mathlib.de/en/docs/on)
// Binds an event handler to an event.
// 
// *@param {string}* The name of the event.  
// *@param {function}* The callback function.  
MathLib.on = function (type, callback) {
	if (type === 'error') {
		errors.push(callback);
	}
	else if (type === 'warning') {
		warnings.push(callback);
	}
}


// ### [MathLib.off()](http://mathlib.de/en/docs/off)
// Unbinds an event handler from an event.
//
// *@param {string}* The name of the event.  
// *@param {function}* The callback function.  
MathLib.off = function (type, callback) {
	if (type === 'error') {
		errors = errors.filter(x => x !== callback);
	}
	else if (type === 'warning') {
		warnings = warnings.filter(x => x !== callback);
	}
}


// ### [MathLib.error()](http://mathlib.de/en/docs/error)
// Fires an error event.
//
// *@param {oject}* An object describing the error further.  
MathLib.error = function (details) {
	errors.forEach(function (cb) {
		cb(details);
	});
};


// ### [MathLib.warning()](http://mathlib.de/en/docs/warning)
// Fires a waring event.
//
// *@param {object}* An object describing the warning further.  
MathLib.warning = function (details) {
	warnings.forEach(function (cb) {
		cb(details);
	});
};