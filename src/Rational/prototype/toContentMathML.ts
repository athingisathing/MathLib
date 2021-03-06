/**
 * Returns the Content MathML representation of the rational number
 *
 * @return {string}
 */
toContentMathML() : string {
	return '<cn type="rational">' + this.numerator + '<sep/>' + this.denominator + '</cn>';
}