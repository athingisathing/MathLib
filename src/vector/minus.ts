// ### [Vector.prototype.minus()](http://mathlib.de/en/docs/vector/minus)
// Calculates the difference of two vectors.
//
// *@param {Vector}* The vector to be subtracted.  
// *@returns {Vector}*
minus(v : Vector) {
	if (this.length === v.length) {
	  return this.plus(v.negative());
	}
}