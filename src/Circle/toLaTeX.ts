// ### [Circle.prototype.toLaTeX()](http://mathlib.de/en/docs/Circle/toLaTeX)
// Returns a LaTeX expression of the circle
//
// *@return {string}* 
toLaTeX() : string {
	return 'B_{' + MathLib.toLaTeX(this.radius) + '}\\left(' + this.center.toLaTeX() + '\\right)';
}