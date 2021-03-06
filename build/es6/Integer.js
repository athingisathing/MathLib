
import MathLib from './meta.js';
import Functn from './Functn';

/**
* MathLib.Integer is the MathLib implementation of (arbitrary precision) integers.
*
*
* #### Simple example:
* ```
* // Create the integer
* var int = new MathLib.Integer('123456789');
* ```
*
* @class
* @this {Integer}
*/
var Integer = (function () {
    function Integer(integer, options) {
        if (typeof options === "undefined") { options = {}; }
        this.type = 'integer';
        var i, res, factor, blocksize, inputBase = options.base || 10, base = Math.pow(2, 26), data = [], sign = '+';

        if (Array.isArray(integer)) {
            i = integer.length - 1;
            while (integer[i] === 0) {
                i--;
            }
            data = integer.slice(0, i + 1);
        }

        if (typeof integer === 'number') {
            if (integer === 0) {
                sign = MathLib.isPosZero(integer) ? '+' : '-';
                data.push(0);
            } else {
                if (integer < 0) {
                    sign = '-';
                    integer = -integer;
                }
                while (integer) {
                    data.push(integer % base);
                    integer = Math.floor(integer / base);
                }
            }
        } else if (typeof integer === 'string') {
            if (integer[0] === '+' || integer[0] === '-') {
                sign = integer[0];
                integer = integer.slice(1);
            }

            data = [];
            blocksize = Math.floor(Math.log(Math.pow(2, 53)) / Math.log(inputBase));

            while (integer.length > blocksize) {
                data.push(new MathLib.Integer(parseInt(integer.slice(-blocksize), inputBase)));
                integer = integer.slice(0, -blocksize);
            }
            data.push(new MathLib.Integer(parseInt(integer, inputBase)));

            res = data[data.length - 1];
            factor = new MathLib.Integer(Math.pow(10, blocksize));
            for (i = data.length - 2; i >= 0; i--) {
                res = res.times(factor).plus(data[i]);
            }

            data = res.data;
            /*
            data.push(
            Number(
            Array.prototype.reduceRight.call(integer, function (old, cur) {
            if (old.length === blocksize) {
            data.push(Number(cur + old));
            return '';
            }
            return cur + old;
            })
            )
            )
            */
        }

        if ('sign' in options) {
            sign = options.sign;
        }

        this.data = data;
        this.sign = sign;
    }
    /**
    * A content MathML string representation
    *
    * @return {string}
    */
    Integer.toContentMathML = function () {
        return '<csymbol cd="setname1">Z</csymbol>';
    };

    /**
    * A LaTeX string representation
    *
    * @return {string}
    */
    Integer.toLaTeX = function () {
        return 'Integer Ring $\\mathbb{Z}$';
    };

    /**
    * A presentation MathML string representation
    *
    * @return {string}
    */
    Integer.toMathML = function () {
        return '<mrow><mtext>Integer Ring</mtext><mi mathvariant="double-struck">Z</mi></mrow>';
    };

    /**
    * Custom toString function
    *
    * @return {string}
    */
    Integer.toString = function () {
        return 'Integer Ring ℤ';
    };

    /**
    * Calculates the absolute value of the integer
    *
    * @return {Integer}
    */
    Integer.prototype.abs = function () {
        return new MathLib.Integer(this.data, { sign: '+' });
    };

    /**
    * Coerces the integer to some other data type
    *
    * @return {Integer|Rational|number|Complex}
    */
    Integer.prototype.coerceTo = function (type) {
        var num;

        if (type === 'integer') {
            return this.copy();
        }

        if (type === 'rational') {
            return new MathLib.Rational(this, 1);
        }

        if (type === 'number') {
            //TODO Warn when the number is bigger that 2^53
            num = this.data.reduce(function (old, cur, i) {
                return old + cur * Math.pow(1e7, i);
            }, 0);

            if (this.sign === '-') {
                num = -num;
            }

            return num;
        }

        if (type === 'complex') {
            return new MathLib.Complex(this, 0);
        }
    };

    /**
    * Compares the integer
    *
    * @return {Integer}
    */
    Integer.prototype.compare = function (n) {
        var i;
        if (this.sign !== n.sign) {
            if (this.isZero() && n.isZero()) {
                return 0;
            }
            if (this.sign === '+') {
                return 1;
            }
            return -1;
        }

        if (this.data.length !== n.data.length) {
            if (this.sign === '+') {
                return MathLib.sign(this.data.length - n.data.length);
            } else {
                return MathLib.sign(n.data.length - this.data.length);
            }
        } else {
            for (i = this.data.length - 1; i >= 0; i--) {
                if (this.data[i] !== n.data[i]) {
                    if (this.sign === '+') {
                        return MathLib.sign(this.data[i] - n.data[i]);
                    } else {
                        return MathLib.sign(n.data[i] - this.data[i]);
                    }
                }
            }
            return 0;
        }
    };

    /**
    * Calculates the complex conjugate of the integer
    *
    * @return {Integer}
    */
    Integer.prototype.conjugate = function () {
        return this.copy();
    };

    /**
    * Copy the integer
    *
    * @return {Integer}
    */
    Integer.prototype.copy = function () {
        return new MathLib.Integer(this.data, { sign: this.sign });
    };

    /**
    * Divides the integer by some other number.
    *
    * @param {Integer|Rational|number|Complex} divisor - The divisor
    * @return {Integer|Rational|number|Complex}
    */
    Integer.prototype.divide = function (divisor) {
        var divrem;

        if (divisor.type !== 'integer') {
            return MathLib.divide.apply(null, MathLib.coerce(this, divisor));
        } else {
            divrem = this.divrem(divisor);

            if (divrem[1].isZero()) {
                return divrem[0];
            }

            return new MathLib.Rational(this, divisor);
        }
    };

    /**
    * Returns an array containing the quotient and the remainder of the division.
    *
    * Based on the "Schoolbook Division" in
    * Karl Hasselström's "Fast Division of Large Integers"
    * http://www.treskal.com/kalle/exjobb/original-report.pdf
    *
    * @param {Integer} divisor - The divisor
    * @return {Integer[]}
    */
    Integer.prototype.divrem = function (divisor) {
        var main, subroutine, quot, mult, temp, rem, base = Math.pow(2, 26);

        // Algorithm 3.1 Schoolbook division subroutine
        subroutine = function (A, B) {
            var q, T, temp, B1, n = A.data.length - 1;

            // Step 1
            if (A.data[n] >= B.data[n - 1]) {
                B1 = B.copy();
                B1.data.unshift(0);
                temp = subroutine(A.minus(B1), B);
                return [temp[0].plus(new MathLib.Integer(base)), temp[1]];
            }

            // Step 2
            // nothing to do
            // Step 3
            q = new MathLib.Integer(Math.min(Math.floor((A.data[n] * base + A.data[n - 1]) / B.data[n - 1]), base - 1));

            // Step 4
            T = B.times(q);

            // Step 5
            if (T.compare(A) === 1) {
                q = q.minus(new MathLib.Integer(1));
                T = T.minus(B);
            }

            // Step 6
            if (T.compare(A) === 1) {
                q = q.minus(new MathLib.Integer(1));
                T = T.minus(B);
            }

            // Step 7
            return [q, A.minus(T)];
        };

        // Algorithm 3.2 Schoolbook division
        main = function (A, B) {
            var q, r, q1, r1, sign, temp, A1, s, m = A.data.length - 1, n = B.data.length - 1;

            // Step 1
            if (m < n) {
                return [new MathLib.Integer(0), A.copy()];
            }

            // Step 2
            if (m === n) {
                if (A.compare(B) === -1) {
                    return [new MathLib.Integer(0), A.copy()];
                } else {
                    return [new MathLib.Integer(1), A.minus(B)];
                }
            }

            // Step 3
            if (m === n + 1) {
                return subroutine(A, B);
            }

            // Step 4
            // A1 = floor(A / base^(m-n-1))
            A1 = new MathLib.Integer(A.data.slice(m - n - 1));
            s = new MathLib.Integer(A.data.slice(0, m - n - 1));

            // Step 5
            temp = subroutine(A1, B);
            q1 = temp[0];
            r1 = temp[1];

            // Step 6
            temp = main(new MathLib.Integer(s.data.concat(r1.data)), B);
            q = temp[0];
            r = temp[1];

            // Step 7
            return [new MathLib.Integer(q.data.concat(q1.data)), r];
        };

        if (this.isZero()) {
            return [new MathLib.Integer(0), new MathLib.Integer(0)];
        }

        if (divisor.data[divisor.data.length - 1] < base / 2) {
            mult = new MathLib.Integer(Math.ceil(base / (2 * divisor.data[divisor.data.length - 1])));
            temp = main(this.abs().times(mult), divisor.abs().times(mult));
            quot = temp[0];
            rem = new MathLib.Integer(temp[1].data[0] / mult.data[0]);
        } else {
            temp = main(this.abs(), divisor.abs());
            quot = temp[0];
            rem = temp[1];
        }

        if (this.sign === '-' && !rem.isZero()) {
            quot = quot.plus(new MathLib.Integer(1));
            rem = divisor.abs().minus(rem);
        }

        if (this.sign !== divisor.sign) {
            quot = quot.negative();
        }

        return [quot, rem];
    };

    /**
    * Checks if the current integer is equal to some other number
    *
    * @param {any} n The number to check
    * @return {boolean}
    */
    Integer.prototype.isEqual = function (n) {
        var i, ii;

        if (n.type !== 'integer') {
            return MathLib.isEqual(MathLib.coerce(this, n));
        } else {
            if (this.sign !== n.sign) {
                if (this.isZero() && n.isZero()) {
                    return true;
                }
                return false;
            }

            if (this.data.length !== n.data.length) {
                return false;
            }

            for (i = 0, ii = this.data.length; i < ii; i++) {
                if (this.data[i] !== n.data[i]) {
                    return false;
                }
            }

            return true;
        }
    };

    /**
    * All integers are finite
    *
    * @return {boolean}
    */
    Integer.prototype.isFinite = function () {
        return true;
    };

    /**
    * No Integer is NaN
    *
    * @return {boolean}
    */
    Integer.prototype.isNaN = function () {
        return false;
    };

    /**
    * Checks if the integer is a unit in the ring of integers or not
    *
    * @return {boolean}
    */
    Integer.prototype.isUnit = function () {
        var i, ii;

        for (i = 1, ii = this.data.length; i < ii; i++) {
            if (this.data[i] !== 0) {
                return false;
            }
        }

        if (this.data[0] === 1) {
            return true;
        }

        return false;
    };

    /**
    * Checks if the integer is zero or not
    *
    * @return {boolean}
    */
    Integer.prototype.isZero = function () {
        return this.data.every(function (x) {
            return x === 0;
        });
    };

    /**
    * Subtracts a number from the current integer
    *
    * @param {Integer|Rational|number|Complex} n - The number to subtract
    * @return {Integer}
    */
    Integer.prototype.minus = function (n) {
        var i, ii, temp, resPos, A, B, data = [], carry = 0, sign = '+', base = Math.pow(2, 26);

        if (n.type !== 'integer') {
            return MathLib.minus.apply(null, MathLib.coerce(this, n));
        } else {
            if (this.sign === '-') {
                if (n.sign === '-') {
                    return n.negative().minus(this.negative());
                } else {
                    temp = this.negative().plus(n);
                    temp.sign = '-';
                    return temp;
                }
            } else {
                if (n.sign === '-') {
                    return this.plus(n.negative());
                }
            }

            if (this.data.length !== n.data.length) {
                resPos = this.data.length > n.data.length;

                while (this.data.length < n.data.length) {
                    this.data.push(0);
                }
                while (this.data.length > n.data.length) {
                    n.data.push(0);
                }
            } else {
                for (i = this.data.length - 1; i >= 0; i--) {
                    if (this.data[i] !== n.data[i]) {
                        resPos = this.data[i] > n.data[i];
                        break;
                    }
                }
                if (typeof resPos === 'undefined') {
                    return new MathLib.Integer(0);
                }
            }

            if (resPos) {
                A = this;
                B = n;
                sign = '+';
            } else {
                A = n;
                B = this;
                sign = '-';
            }

            for (i = 0, ii = A.data.length; i < ii; i++) {
                temp = A.data[i] - B.data[i] + carry;
                carry = Math.floor(temp / base);
                data[i] = MathLib.mod(temp, base);
            }

            return new MathLib.Integer(data, { sign: sign });
        }
    };

    /**
    * Reduces the integer modulo an other number.
    *
    * @param {Integer|number} n - The number with which the current integer should be reduced
    * @return {Integer|number}
    */
    Integer.prototype.mod = function (n) {
        if (n.type !== 'integer') {
            return MathLib.mod.apply(null, MathLib.coerce(this, n));
        } else {
            return this.divrem(n)[1];
        }
    };

    /**
    * Calculates the negative integer
    *
    * @return {Integer}
    */
    Integer.prototype.negative = function () {
        return new MathLib.Integer(this.data, { sign: this.sign === '-' ? '+' : '-' });
    };

    /**
    * Adds a number to the current integer
    *
    * @param {Integer|Rational|number|Complex} n - The number to add
    * @return {Integer}
    */
    Integer.prototype.plus = function (n) {
        var i, ii, temp, data = [], carry = 0, base = Math.pow(2, 26);

        if (n.type !== 'integer') {
            return MathLib.plus(MathLib.coerce(this, n));
        } else {
            if (this.sign === '-') {
                if (n.sign === '+') {
                    this.sign = '+';
                    return n.minus(this);
                }
            } else if (n.sign === '-') {
                n.sign = '+';
                return this.minus(n);
            }

            if (this.data.length !== n.data.length) {
                while (this.data.length < n.data.length) {
                    this.data.push(0);
                }
                while (this.data.length > n.data.length) {
                    n.data.push(0);
                }
            }

            for (i = 0, ii = this.data.length; i < ii; i++) {
                temp = this.data[i] + n.data[i] + carry;

                data[i] = temp % base;
                carry = Math.floor(temp / base);
            }

            if (carry !== 0) {
                data[i] = carry;
            }

            return new MathLib.Integer(data, { sign: this.sign });
        }
    };

    /**
    * Raises the integer to a certain power.
    *
    * @param {Integer|Rational|number|Complex} exponent - The exponent
    * @return {Integer|Rational}
    */
    Integer.prototype.pow = function (exponent) {
        var powInt, result;

        if (exponent.type !== 'integer') {
            return MathLib.pow.apply(null, MathLib.coerce(this, exponent));
        } else {
            powInt = function (b, e) {
                var res, i, half = [], carry = 0;

                if (e.data.length === 1 && e.data[0] === 1) {
                    return b;
                }

                for (i = e.data.length - 1; i >= 0; i--) {
                    half[i] = Math.floor(e.data[i] / 2) + carry;

                    if (e.data[i] % 2) {
                        carry = 5e6;
                    } else {
                        carry = 0;
                    }
                }

                res = powInt(b, new MathLib.Integer(half));
                res = res.times(res);

                if (e.data[0] % 2) {
                    res = res.times(b);
                }

                return res;
            };

            result = powInt(this, exponent);

            if (exponent.sign === '-') {
                return new MathLib.Rational(new MathLib.Integer('1'), result);
            }

            return result;
        }
    };

    /**
    * Multiplies a number to the current integer
    *
    * @param {Integer|Rational|number|Complex} n - The number to multiply
    * @return {Integer}
    */
    Integer.prototype.times = function (n) {
        var i, ii, j, jj, temp, data = [], carry = 0, base = Math.pow(2, 26);

        if (n.type !== 'integer') {
            return MathLib.times(MathLib.coerce(this, n));
        } else {
            for (i = 0, ii = this.data.length; i < ii; i++) {
                for (j = 0, jj = n.data.length; j < jj; j++) {
                    if (data[i + j] === undefined) {
                        data[i + j] = this.data[i] * n.data[j];
                    } else {
                        data[i + j] += this.data[i] * n.data[j];
                    }
                }
            }

            for (i = 0, ii = this.data.length + n.data.length - 1; i < ii; i++) {
                temp = data[i] + carry;
                carry = Math.floor(temp / base);
                data[i] = temp % base;
            }
            data[i] = carry;

            return new MathLib.Integer(data, { sign: this.sign === n.sign ? '+' : '-' });
        }
    };

    /**
    * A content MathML string representation
    *
    * @return {string}
    */
    Integer.prototype.toContentMathML = function () {
        return '<cn type="integer" base="10">' + this.toString() + '</cn>';
    };

    /**
    * A LaTeX string representation
    *
    * @return {string}
    */
    Integer.prototype.toLaTeX = function () {
        return this.toString();
    };

    /**
    * A presentation MathML string representation
    *
    * @return {string}
    */
    Integer.prototype.toMathML = function () {
        return '<mn>' + this.toString() + '</mn>';
    };

    /**
    * Custom toString function
    *
    * @return {string}
    */
    Integer.prototype.toString = function () {
        var div, rem, temp, n = this.abs(), factor = new MathLib.Integer(1e7), str = '';

        if (n.isZero()) {
            return '0';
        }

        while (!n.isZero()) {
            temp = n.divrem(factor);
            div = temp[0];
            rem = temp[1];

            str = ('000000' + rem.data[0]).slice(-7) + str;
            n = div;
        }

        str = str.replace(/^0+/, '');

        if (this.sign === '-') {
            str = '-' + str;
        }

        return str;
    };
    return Integer;
})();
export default = Integer;

