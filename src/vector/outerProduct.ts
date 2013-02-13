// ### [Vector.prototype.outerProduct()](http://mathlib.de/en/docs/vector/outerProduct)
// Calculates the outer product of two vectors.
//
// *@param {Vector}*  
// *@returns {Matrix}*
outerProduct(v : Vector) : Matrix {
  return new MathLib.Matrix(this.map(function (x) {
    return v.map(function (y) {
      return MathLib.times(x, y);
    });
  }));
}