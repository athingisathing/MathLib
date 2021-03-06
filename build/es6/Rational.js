
import MathLib from './meta.js';
import Functn from './Functn';

/**
* MathLib.Rational is the MathLib implementation of rational numbers.
*
* #### Simple use case:
* ```
* // Create the rational number 2/3
* var r = new MathLib.Rational(2, 3);
* ```
*
* @class
* @this {Rational}
*/
var Rational = (function () {
    function Rational(numerator, denominator) {
        if (typeof denominator === "undefined") { denominator = 1; }
        this.type = 'rational';
        if (MathLib.isZero(denominator)) {
            MathLib.error({ message: 'The denominator cannot be zero.', method: 'Rational.constructor' });
            throw 'The denominator cannot be zero.';
        }

        if ((typeof denominator === 'number' && denominator < 0) || (denominator.type === 'integer' && denominator.sign === '-')) {
            numerator = MathLib.negative(numerator);
            denominator = MathLib.negative(denominator);
        }

        this.numerator = numerator;
        this.denominator = denominator;
    }
    /**
    * A content MathML string representation
    *
    * @return {string}
    */
    Rational.toContentMathML = function () {
        return '<csymbol cd="setname1">Q</csymbol>';
    };

    /**
    * A LaTeX string representation
    *
    * @return {string}
    */
    Rational.toLaTeX = function () {
        return 'Rational Field $\\mathbb{Q}$';
    };

    /**
    * A presentation MathML string representation
    *
    * @return {string}
    */
    Rational.toMathML = function () {
        return '<mrow><mtext>Rational Field</mtext><mi mathvariant="double-struck">Q</mi></mrow>';
    };

    /**
    * Custom toString function
    *
    * @return {string}
    */
    Rational.toString = function () {
        return 'Rational Field ℚ';
    };

    /**
    * Coerces the rational to some other data type
    *
    * @return {Integer|Rational|number|Complex}
    */
    Rational.prototype.coerceTo = function (type) {
        if (type === 'rational') {
            if (this.denominator === 1) {
                return new MathLib.Integer(this.numerator);
            }
            // TODO: coercion error
        }

        if (type === 'rational') {
            return this.copy();
        }

        if (type === 'number') {
            return this.numerator / this.denominator;
        }

        if (type === 'complex') {
            //		return new MathLib.Complex(this, new MathLib.Rational(0));
            return new MathLib.Complex(this, 0);
        }
    };

    /**
    * Compares two rational numbers
    *
    * @param {Rational} rational The number to compare
    * @return {number}
    */
    Rational.prototype.compare = function (rational) {
        return MathLib.sign(this.numerator * rational.denominator - this.denominator * rational.numerator);
    };

    /**
    * Copy the rational number
    *
    * @return {Rational}
    */
    Rational.prototype.copy = function () {
        return new MathLib.Rational(MathLib.copy(this.numerator), MathLib.copy(this.denominator));
    };

    /**
    * Divides rational numbers
    *
    * @param {Rational|number} divisor The divisor
    * @return {Rational}
    */
    Rational.prototype.divide = function (divisor) {
        if (divisor.type === 'rational') {
            return new MathLib.Rational(MathLib.times(this.numerator, divisor.denominator), MathLib.times(this.denominator, divisor.numerator));
        } else if (typeof divisor === 'number') {
            return new MathLib.Rational(this.numerator, MathLib.times(this.denominator, divisor));
        } else {
            return divisor.inverse().times(this);
        }
    };

    /**
    * Calculates the inverse of a rational number
    *
    * @return {Rational}
    */
    Rational.prototype.inverse = function () {
        if (!MathLib.isZero(this.numerator)) {
            return new MathLib.Rational(this.denominator, this.numerator);
        }
    };

    /**
    * Checks if the rational number is equal to an other number
    *
    * @param {Integer|Rational|number|Complex} n The number to compare
    * @return {boolean}
    */
    Rational.prototype.isEqual = function (n) {
        if (n.type !== 'rational') {
            return MathLib.isEqual.apply(null, MathLib.coerce(this, n));
        } else {
            return MathLib.isEqual(MathLib.times(this.numerator, n.denominator), MathLib.times(this.denominator, n.numerator));
        }
    };

    /**
    * Checks if the rational number is zero
    *
    * @return {boolean}
    */
    Rational.prototype.isZero = function () {
        return MathLib.isZero(this.numerator);
    };

    /**
    * Subtracts rational numbers
    *
    * @param {Rational|number} subtrahend The number to be subtracted
    * @return {Rational}
    */
    Rational.prototype.minus = function (subtrahend) {
        if (subtrahend.type !== 'rational') {
            return MathLib.minus.apply(null, MathLib.coerce(this, subtrahend));
        } else {
            return new MathLib.Rational(MathLib.minus(MathLib.times(this.numerator, subtrahend.denominator), MathLib.times(this.denominator, subtrahend.numerator)), MathLib.times(this.denominator, subtrahend.denominator));
        }
    };

    /**
    * Calculates the negative of a rational number
    *
    * @return {Rational}
    */
    Rational.prototype.negative = function () {
        return new MathLib.Rational(-this.numerator, this.denominator);
    };

    /**
    * Adds rational numbers
    *
    * @param {Integer|Rational|number|Complex} summand The number to be added
    * @return {Rational|number|Complex}
    */
    Rational.prototype.plus = function (summand) {
        if (summand.type !== 'rational') {
            return MathLib.plus.apply(null, MathLib.coerce(this, summand));
        } else {
            return new MathLib.Rational(MathLib.plus(MathLib.times(this.denominator, summand.numerator), MathLib.times(this.numerator, summand.denominator)), MathLib.times(this.denominator, summand.denominator));
        }
    };

    /**
    * Reduces the rational number
    *
    * @return {Rational}
    */
    Rational.prototype.reduce = function () {
        var gcd = MathLib.sign(this.denominator) * MathLib.gcd([this.numerator, this.denominator]);
        return new MathLib.Rational(this.numerator / gcd, this.denominator / gcd);
    };

    /**
    * Multiplies rational numbers
    *
    * @param {Rational|number} factor The number to be multiplied
    * @return {Rational}
    */
    Rational.prototype.times = function (factor) {
        if (factor.type === 'rational') {
            return new MathLib.Rational(MathLib.times(this.numerator, factor.numerator), MathLib.times(this.denominator, factor.denominator));
        } else if (typeof factor === 'number') {
            return new MathLib.Rational(MathLib.times(this.numerator, factor), this.denominator);
        } else {
            return factor.times(this);
        }
    };

    /**
    * Returns the Content MathML representation of the rational number
    *
    * @return {string}
    */
    Rational.prototype.toContentMathML = function () {
        return '<cn type="rational">' + this.numerator + '<sep/>' + this.denominator + '</cn>';
    };

    /**
    * Returns the LaTeX representation of the rational number
    *
    * @return {string}
    */
    Rational.prototype.toLaTeX = function () {
        return '\\frac{' + MathLib.toLaTeX(this.numerator) + '}{' + MathLib.toLaTeX(this.denominator) + '}';
    };

    /**
    * Returns the MathML representation of the rational number
    *
    * @return {string}
    */
    Rational.prototype.toMathML = function () {
        return '<mfrac>' + MathLib.toMathML(this.numerator) + MathLib.toMathML(this.denominator) + '</mfrac>';
    };

    /**
    * Returns the number represented by the rational number
    *
    * @deprecated Use .coerceTo('number') instead
    * @return {number}
    */
    Rational.prototype.toNumber = function () {
        console.warn('Rational.prototype.toNumber() is deprecated. Use Rational.prototype.coerceTo("number") instead.');
        return this.numerator / this.denominator;
    };

    /**
    * Custom toString function
    *
    * @return {string}
    */
    Rational.prototype.toString = function () {
        return MathLib.toString(this.numerator) + '/' + MathLib.toString(this.denominator);
    };
    return Rational;
})();
export default = Rational;

