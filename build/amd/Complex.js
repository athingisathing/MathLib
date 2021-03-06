
    define(['meta', 'Functn', 'Point'], function(MathLib) {
    /**
    * MathLib.Complex is the MathLib implementation of complex numbers.
    *
    * There are two ways of defining complex numbers:
    *
    * * Two numbers representing the real and the complex part.
    * * MathLib.Complex.polar(abs, arg)
    *
    * #### Simple example:
    * ```
    * // Create the complex number 1 + 2i
    * var c = new MathLib.Complex(1, 2);
    * ```
    *
    * @class
    * @this {Complex}
    */
    var Complex = (function () {
        function Complex(re, im) {
            if (typeof im === "undefined") { im = 0; }
            this.type = 'complex';
            if (MathLib.isNaN(re) || MathLib.isNaN(im)) {
                this.re = NaN;
                this.im = NaN;
            } else if (!MathLib.isFinite(re) || !MathLib.isFinite(im)) {
                this.re = Infinity;
                this.im = Infinity;
            } else {
                this.re = re;
                this.im = im;
            }
        }
        /**
        * A content MathML string representation
        *
        * @return {string}
        */
        Complex.toContentMathML = function () {
            return '<csymbol cd="setname1">C</csymbol>';
        };

        /**
        * A LaTeX string representation
        *
        * @return {string}
        */
        Complex.toLaTeX = function () {
            return 'Complex Field $\\mathbb{C}$';
        };

        /**
        * A presentation MathML string representation
        *
        * @return {string}
        */
        Complex.toMathML = function () {
            return '<mrow><mtext>Complex Field</mtext><mi mathvariant="double-struck">C</mi></mrow>';
        };

        /**
        * Custom toString function
        *
        * @return {string}
        */
        Complex.toString = function () {
            return 'Complex Field ℂ';
        };

        /**
        * Returns the absolute value of the number.
        *
        * @return {number}
        */
        Complex.prototype.abs = function () {
            return MathLib.hypot(this.re, this.im);
        };

        /**
        * Returns the inverse cosine of the number.
        *
        * @return {Complex}
        */
        Complex.prototype.arccos = function () {
            return MathLib.minus(Math.PI / 2, this.arcsin());
        };

        /**
        * Returns the inverse cotangent of the number.
        *
        * @return {Complex}
        */
        Complex.prototype.arccot = function () {
            if (this.isZero()) {
                return new MathLib.Complex(MathLib.sign(1 / this.re) * Math.PI / 2, -this.im);
            }
            return this.inverse().arctan();
        };

        /**
        * Returns the inverse cosecant of the number
        *
        * @return {Complex}
        */
        Complex.prototype.arccsc = function () {
            // arccsc(0) = ComplexInfinity not ComplexNaN
            if (this.isZero()) {
                return new MathLib.Complex(Infinity);
            }

            return this.inverse().arcsin();
        };

        /**
        * Returns the inverse secant of the number
        *
        * @return {Complex}
        */
        Complex.prototype.arcsec = function () {
            // arcsec(0) = ComplexInfinity not ComplexNaN
            if (this.isZero()) {
                return new MathLib.Complex(Infinity);
            }

            return this.inverse().arccos();
        };

        /**
        * Returns the inverse sine of the number
        *
        * @return {Complex}
        */
        Complex.prototype.arcsin = function () {
            var a = this.re, b = this.im, aa = a * a, bb = b * b, sqrt = Math.sqrt(Math.pow(aa + bb - 1, 2) + 4 * bb), sgn = function (x) {
                if (x > 0) {
                    return 1;
                }
                if (x < 0) {
                    return -1;
                }
                if (1 / x === Infinity) {
                    return 1;
                }
                if (1 / x === -Infinity) {
                    return -1;
                }
            };

            if (a === Infinity) {
                return new MathLib.Complex(Infinity);
            }

            return new MathLib.Complex(sgn(a) / 2 * MathLib.arccos(sqrt - (aa + bb)), sgn(b) / 2 * MathLib.arcosh(sqrt + (aa + bb)));
        };

        /**
        * Returns the inverse tangent of the number
        *
        * @return {Complex}
        */
        Complex.prototype.arctan = function () {
            var res, iz = new MathLib.Complex(-this.im, this.re);

            if (this.isZero()) {
                return new MathLib.Complex(this.re, this.im);
            }

            res = MathLib.times(new MathLib.Complex(0, -0.5), MathLib.plus(1, iz).divide(MathLib.minus(1, iz)).ln());

            // Correct some values on the axis imaginary axis.
            // TODO: Are this all the wrong values?
            if (MathLib.isNegZero(this.re) && res.re !== Infinity && (this.im < 0 || this.im > 1)) {
                res.re = -res.re;
            }

            return res;
        };

        /**
        * Returns the argument (= the angle) of the complex number
        *
        * @return {number}
        */
        Complex.prototype.arg = function () {
            if (this.re === Infinity) {
                return NaN;
            }
            return Math.atan2(this.im, this.re);
        };

        /**
        * Returns the inverse hyperbolic tangent of the number
        *
        * @return {Complex}
        */
        Complex.prototype.artanh = function () {
            if (this.isZero()) {
                return new MathLib.Complex(this.re, this.im);
            }

            if (this.re === Infinity) {
                return new MathLib.Complex(NaN);
            }

            return MathLib.times(0.5, MathLib.minus(MathLib.ln(MathLib.plus(1, this)), MathLib.ln(MathLib.minus(1, this))));
        };

        /**
        * Coerces the complex number to some other data type
        *
        * @return {Rational|number|Complex}
        */
        Complex.prototype.coerceTo = function (type) {
            if (type === 'complex') {
                return this.copy();
            }

            if (this.im !== 0) {
                // TODO: coercion error
            } else {
                /*
                if (type === 'integer') {
                return new MathLib.Integer(this.re);
                }
                if (type === 'rational') {
                return new MathLib.Rational(this.re);
                }
                */
                if (type === 'number') {
                    return MathLib.coerceTo(this.re, 'number');
                }
            }
        };

        /**
        * Compares two complex numbers
        *
        * @return {number}
        */
        Complex.prototype.compare = function (x) {
            var a = MathLib.sign(this.abs() - x.abs());

            if (MathLib.isNaN(this.re)) {
                if (MathLib.isNaN(x.re)) {
                    return 0;
                }
                return -1;
            }

            if (this.re === Infinity) {
                if (x.re === Infinity) {
                    return 0;
                }
                return 1;
            }

            return a ? a : MathLib.sign(this.arg() - x.arg());
        };

        /**
        * Calculates the conjugate of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.conjugate = function () {
            return new MathLib.Complex(this.re, MathLib.negative(this.im));
        };

        /**
        * Copies the complex number
        *
        * @return {Complex}
        */
        Complex.prototype.copy = function () {
            return new MathLib.Complex(MathLib.copy(this.re), MathLib.copy(this.im));
        };

        /**
        * Calculates the cosine of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.cos = function () {
            return new MathLib.Complex(MathLib.cos(this.re) * MathLib.cosh(this.im), -MathLib.sin(this.re) * MathLib.sinh(this.im));
        };

        /*
        * Calculates the hyperbolic cosine of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.cosh = function () {
            return new MathLib.Complex(MathLib.cos(this.im) * MathLib.cosh(this.re), MathLib.sin(this.im) * MathLib.sinh(this.re));
        };

        /**
        * Calculates the cotangent of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.cot = function () {
            var aa = 2 * this.re, bb = 2 * this.im, d = MathLib.cos(aa) - MathLib.cosh(bb);

            if (this.isZero()) {
                return new MathLib.Complex(Infinity);
            }

            return new MathLib.Complex(-MathLib.sin(aa) / d, MathLib.sinh(bb) / d);
        };

        /**
        * Calculates the hyperbolic cotangent of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.coth = function () {
            var aa = 2 * this.re, bb = 2 * this.im, d = MathLib.cosh(aa) - MathLib.cos(bb);

            if (this.isZero()) {
                return new MathLib.Complex(Infinity);
            }

            return new MathLib.Complex(MathLib.sinh(aa) / d, -MathLib.sin(bb) / d);
        };

        /**
        * Calculates the cosecant of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.csc = function () {
            var a = this.re, b = this.im, d = MathLib.cos(2 * a) - MathLib.cosh(2 * b);

            if (this.isZero()) {
                return new MathLib.Complex(Infinity);
            }

            return new MathLib.Complex(-2 * MathLib.sin(a) * MathLib.cosh(b) / d, 2 * MathLib.cos(a) * MathLib.sinh(b) / d);
        };

        /**
        * Calculates the hyperbolic cosecant of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.csch = function () {
            var a = this.re, b = this.im, d = MathLib.cosh(2 * a) - MathLib.cos(2 * b);

            if (this.isZero()) {
                return new MathLib.Complex(Infinity);
            }

            return new MathLib.Complex(2 * MathLib.sinh(a) * MathLib.cos(b) / d, -2 * MathLib.cosh(a) * MathLib.sin(b) / d);
        };

        /**
        * Divides a complex number by an other
        *
        * @param {number|Complex} divisor The divisor
        * @return {Complex}
        */
        Complex.prototype.divide = function (divisor) {
            return this.times(MathLib.inverse(divisor));
        };

        /**
        * Evaluates the exponential function with a complex argument
        *
        * @return {Complex}
        */
        Complex.prototype.exp = function () {
            return new MathLib.Complex(MathLib.exp(this.re) * MathLib.cos(this.im), MathLib.exp(this.re) * MathLib.sin(this.im));
        };

        /**
        * Calculates the inverse of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.inverse = function () {
            var d = MathLib.plus(MathLib.pow(this.re, 2), MathLib.pow(this.im, 2));

            if (this.isZero()) {
                return new MathLib.Complex(Infinity);
            }

            if (this.re === Infinity) {
                return new MathLib.Complex(0);
            }

            return new MathLib.Complex(MathLib.divide(this.re, d), MathLib.divide(MathLib.negative(this.im), d));
        };

        /**
        * Determines if the complex number is equal to another number.
        *
        * @param {Integer|Rational|number|Complex} n The number to be compared
        * @return {boolean}
        */
        Complex.prototype.isEqual = function (n) {
            if (n.type !== 'complex') {
                if (MathLib.isZero(this.im)) {
                    return MathLib.isEqual.apply(null, MathLib.coerce(this.re, n));
                } else {
                    return false;
                }
            } else {
                return MathLib.isEqual(this.re, n.re) && MathLib.isEqual(this.im, n.im);
            }
        };

        /**
        * Determines if the complex number is finite.
        *
        * @return {boolean}
        */
        Complex.prototype.isFinite = function () {
            return MathLib.isFinite(this.re);
        };

        /**
        * Determines if the complex number is equal to 0.
        *
        * @return {boolean}
        */
        Complex.prototype.isZero = function () {
            return MathLib.isZero(this.re) && MathLib.isZero(this.im);
        };

        /*
        * Evaluates the natural logarithm with complex arguments
        *
        * @return {Complex}
        */
        Complex.prototype.ln = function () {
            if (this.re === Infinity) {
                return new MathLib.Complex(Infinity);
            }
            return new MathLib.Complex(MathLib.ln(this.abs()), this.arg());
        };

        /**
        * Calculates the difference of two complex numbers
        *
        * @param {number|Complex} subtrahend The subtrahend
        * @return {Complex}
        */
        Complex.prototype.minus = function (subtrahend) {
            return this.plus(MathLib.negative(subtrahend));
        };

        /**
        * Calculates the negative of the complex number
        *
        * @return {Complex}
        */
        Complex.prototype.negative = function () {
            return new MathLib.Complex(MathLib.negative(this.re), MathLib.negative(this.im));
        };

        /**
        * Add complex numbers
        *
        * @param {Integer|Rational|number|Complex} summand The number to be added
        * @return {Complex}
        */
        Complex.prototype.plus = function (summand) {
            if (summand.type !== 'complex') {
                return new MathLib.Complex(MathLib.plus.apply(null, MathLib.coerce(this.re, summand)), this.im);
            } else {
                return new MathLib.Complex(MathLib.plus(this.re, summand.re), MathLib.plus(this.im, summand.im));
            }
        };

        /**
        * Calculates the complex number raised to some power
        *
        * @param {numeric} c The power to which the complex number should be raised
        * @return {Complex}
        */
        Complex.prototype.pow = function (c) {
            var re, im, abs, arg;

            if (MathLib.type(c) === 'complex') {
                re = c.re;
                im = c.im;
                abs = this.abs();
                arg = this.arg();

                // Fixes inf^(2+5i) = inf and 0^(2+5i) = 0
                if ((this.isZero() || this.re === Infinity) && !(c.isZero() || c.re === Infinity || MathLib.isNaN(c.re))) {
                    return new MathLib.Complex(this.re, this.im);
                }

                return MathLib.Complex.polar(MathLib.times(MathLib.pow(abs, re), MathLib.exp(MathLib.negative(MathLib.times(im, arg)))), MathLib.plus(MathLib.times(re, arg), MathLib.times(im, MathLib.ln(abs))));
            } else {
                // The naive pow method has some rounding errrors. For example
                // (2+5i)^3 = -142.00000000000006-64.99999999999999i
                // instead of -142-65i which are errors of magnitude around 1e-14.
                // This error increases quickly for increasing exponents.
                // (2+5i)^21 has an error of 5.8 in the real part
                // return MathLib.Complex.polar(MathLib.pow(abs, c), MathLib.times(arg, c));
                // The following algorithm uses a different approach for integer exponents,
                // where it yields exact results.
                // Non integer exponents are evaluated using the naive approach.
                // TODO: Improve the algorithm.
                var i, int = MathLib.floor(Math.abs(c)), res = new MathLib.Complex(1), power = this, bin = int.toString(2);

                // If the exponent is not an integer we use the naive approach
                if (c % 1) {
                    abs = this.abs();
                    arg = this.arg();
                    return MathLib.Complex.polar(MathLib.pow(abs, c), MathLib.times(arg, c));
                }

                // The imaginary part of (2+5i)^-0 should be -0 not +0.
                if (MathLib.isZero(c)) {
                    return new MathLib.Complex(1, c);
                }

                for (i = bin.length - 1; i >= 0; i--) {
                    if (bin[i] === '1') {
                        res = MathLib.times(res, power);
                    }
                    power = MathLib.times(power, power);
                }

                if (c < 0) {
                    res = res.inverse();
                }

                return res;
            }
        };

        /**
        * Calculates the secant of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.sec = function () {
            var a = this.re, b = this.im, d = MathLib.cos(2 * a) + MathLib.cosh(2 * b);

            return new MathLib.Complex(2 * MathLib.cos(a) * MathLib.cosh(b) / d, 2 * MathLib.sin(a) * MathLib.sinh(b) / d);
        };

        /**
        * Calculates the hyperbolic secant of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.sech = function () {
            var a = this.re, b = this.im, d = MathLib.cosh(2 * a) + MathLib.cos(2 * b);

            return new MathLib.Complex(2 * MathLib.cosh(a) * MathLib.cos(b) / d, -2 * MathLib.sinh(a) * MathLib.sin(b) / d);
        };

        /**
        * Calculates the signum of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.sign = function () {
            if (this.isZero() || MathLib.isNaN(this.re)) {
                return this;
            } else if (this.re === Infinity) {
                return new MathLib.Complex(NaN);
            }
            return MathLib.Complex.polar(1, this.arg());
        };

        /**
        * Calculates the sine of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.sin = function () {
            return new MathLib.Complex(MathLib.sin(this.re) * MathLib.cosh(this.im), MathLib.cos(this.re) * MathLib.sinh(this.im));
        };

        /**
        * Calculates the hyperbolic sine of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.sinh = function () {
            return new MathLib.Complex(MathLib.cos(this.im) * MathLib.sinh(this.re), MathLib.sin(this.im) * MathLib.cosh(this.re));
        };

        /**
        * Takes the square root of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.sqrt = function () {
            return MathLib.Complex.polar(Math.sqrt(this.abs()), this.arg() / 2);
        };

        /**
        * Calculates the tangent of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.tan = function () {
            var aa = 2 * this.re, bb = 2 * this.im, d = MathLib.cos(aa) + MathLib.cosh(bb);

            return new MathLib.Complex(MathLib.sin(aa) / d, MathLib.sinh(bb) / d);
        };

        /**
        * Calculates the hyperbolic tangent of a complex number
        *
        * @return {Complex}
        */
        Complex.prototype.tanh = function () {
            var aa = 2 * this.re, bb = 2 * this.im, d = MathLib.cosh(aa) + MathLib.cos(bb);

            return new MathLib.Complex(MathLib.sinh(aa) / d, MathLib.sin(bb) / d);
        };

        /**
        * Multiplies complex numbers
        *
        * @param {Complex|number|Rational} factor The number to be multiplied
        * @return {Complex}
        */
        Complex.prototype.times = function (factor) {
            if (factor.type === 'complex') {
                if (this.re === Infinity) {
                    if (factor.isZero() || MathLib.isNaN(factor.re)) {
                        return new MathLib.Complex(NaN);
                    } else {
                        return new MathLib.Complex(Infinity);
                    }
                }

                if (factor.re === Infinity) {
                    if (this.isZero() || MathLib.isNaN(this.re)) {
                        return new MathLib.Complex(NaN);
                    } else {
                        return new MathLib.Complex(Infinity);
                    }
                }

                return new MathLib.Complex(MathLib.minus(MathLib.times(this.re, factor.re), MathLib.times(this.im, factor.im)), MathLib.plus(MathLib.times(this.re, factor.im), MathLib.times(this.im, factor.re)));
            } else if (factor.type === 'rational') {
                factor = factor.coerceTo('number');
            }
            if (typeof factor === 'number') {
                return new MathLib.Complex(MathLib.times(this.re, factor), MathLib.times(this.im, factor));
            }
        };

        /**
        * Returns the content MathML representation of the number
        *
        * @return {string}
        */
        Complex.prototype.toContentMathML = function () {
            if (!this.isFinite()) {
                return '<csymbol cd="nums1">' + (this.re === Infinity ? 'infinity' : 'NaN') + '</csymbol>';
            }

            return '<apply><plus />' + MathLib.toContentMathML(this.re) + '<apply><times />' + MathLib.toContentMathML(this.im) + '<imaginaryi /></apply></apply>';
        };

        /**
        * Returns the LaTeX representation of the complex number
        *
        * @return {string}
        */
        Complex.prototype.toLaTeX = function () {
            var str = '', reFlag = false;

            if (!this.isFinite()) {
                return '\\text{Complex' + this.re + '}';
            }

            if (!MathLib.isZero(this.re)) {
                str = MathLib.toLaTeX(this.re);
                reFlag = true;
            }
            if (!MathLib.isZero(this.im)) {
                str += MathLib.toLaTeX(this.im, reFlag) + 'i';
            }
            if (str.length === 0) {
                str = '0';
            }
            return str;
        };

        /**
        * Returns the (presentation) MathML representation of the number
        *
        * @return {string}
        */
        Complex.prototype.toMathML = function () {
            var str = '', reFlag = false;

            if (!this.isFinite()) {
                return '<mi>Complex' + this.re + '</mi>';
            }

            if (!MathLib.isZero(this.re)) {
                str = MathLib.toMathML(this.re);
                reFlag = true;
            }
            if (!MathLib.isZero(this.im)) {
                str += MathLib.toMathML(this.im, reFlag) + '<mo>&#x2062;</mo><mi>i</mi>';
            }
            if (str.length === 0) {
                str = '<mn>0</mn>';
            }
            return str;
        };

        /**
        * Interprets the complex number as point in the two dimensional plane
        *
        * @return {Point}
        */
        Complex.prototype.toPoint = function () {
            if (this.re == Infinity || MathLib.isNaN(this.re)) {
                return new MathLib.Point([0, 0, 0]);
            }

            return new MathLib.Point([this.re, this.im, 1]);
        };

        /**
        * Custom toString function
        *
        * @return {string}
        */
        Complex.prototype.toString = function () {
            var str = '';

            if (!this.isFinite()) {
                return 'Complex' + this.re;
            }

            if (!MathLib.isZero(this.re)) {
                str = MathLib.toString(this.re);
            }
            if (!MathLib.isZero(this.im)) {
                str += (this.im > 0 ? (str.length ? '+' : '') : '-') + MathLib.toString(Math.abs(this.im)) + 'i';
            }
            if (str.length === 0) {
                str = '0';
            }
            return str;
        };
        Complex.polar = function (abs, arg) {
            if (abs === Infinity) {
                return new MathLib.Complex(Infinity);
            }
            return new MathLib.Complex(abs * Math.cos(arg), abs * Math.sin(arg));
        };
        return Complex;
    })();
    MathLib.Complex = Complex;
return MathLib;
});
