
    define(['meta'], function(MathLib) {
    /**
    * The Implementation of sets in MathLib
    *
    * To generate the set {1, 2, 3, 4, 5} you simply need to type
    * ```
    * new MathLib.Set([1, 2, 3, 4, 5])
    * ```
    * @class
    * @this {Set}
    */
    var Set = (function () {
        function Set(elements) {
            var _this = this;
            this.type = 'set';
            /**
            * Returns the intersection of two sets.
            *
            * @param {Set} set The set to intersect the current set with.
            * @return {Set}
            */
            this.intersect = Set.createSetOperation(false, true, false);
            /**
            * Returns the union of two sets.
            *
            * @param {Set} set The set to join the current set with.
            * @return {Set}
            */
            this.union = Set.createSetOperation(true, true, true);
            /**
            * Returns all elements, which are in the first set, but not in the second.
            *
            * @param {Set} set The set whose elements should be removed from the current set.
            * @return {Set}
            */
            this.without = Set.createSetOperation(true, false, false);
            /**
            * Returns all elements which are in either the first or the second set.
            *
            * @param {Set} set The second set.
            * @return {Set}
            */
            this.xor = Set.createSetOperation(true, false, true);
            if (!elements) {
                elements = [];
            }

            elements = elements.sort(MathLib.compare).filter(function (x, i, a) {
                return (a.length === i + 1) || !MathLib.isEqual(x, a[i + 1]) || (typeof x.isEqual !== 'undefined' && !x.isEqual(a[i + 1]));
            });

            elements.forEach(function (x, i) {
                _this[i] = x;
            });
            this.length = elements.length;
            this.card = elements.length;
        }
        /**
        * Compare function for sets
        *
        * @param {Set} x The set to compare the current set to
        * @return {number}
        */
        Set.prototype.compare = function (x) {
            var a, i, ii;

            if (this.card !== x.card) {
                return MathLib.sign(this.card - x.card);
            } else {
                for (i = 0, ii = this.card; i < ii; i++) {
                    a = MathLib.compare(this[i], x[i]);
                    if (a !== 0) {
                        return a;
                    }
                }
                return 0;
            }
        };

        /**
        * Works like the Array.prototype.every function
        *
        * @return {boolean}
        */
        Set.prototype.every = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return Array.prototype.every.apply(this, args);
        };

        /**
        * Works like the Array.prototype.filter function
        *
        * @return {Set}
        */
        Set.prototype.filter = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return new MathLib.Set(Array.prototype.filter.apply(this, args));
        };

        /**
        * Works like the Array.prototype.forEach function
        */
        Set.prototype.forEach = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            Array.prototype.forEach.apply(this, args);
        };

        /**
        * Works like the Array.prototype.indexOf function
        *
        * @return {number}
        */
        Set.prototype.indexOf = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return Array.prototype.indexOf.apply(this, args);
        };

        /**
        * Inserts an element into the set.
        *
        * @param{any} x The element to insert in the set.
        * @return {Set} Returns the current set
        */
        Set.prototype.insert = function (x) {
            var i = this.locate(x);
            if (this[i] !== x) {
                this.splice(i, 0, x);
                this.card++;
            }
            return this;
        };

        /**
        * Determines if the set is empty.
        *
        * @return {boolean}
        */
        Set.prototype.isEmpty = function () {
            return this.card === 0;
        };

        /**
        * Determines if the set is equal to an other set.
        *
        * @param {Set} set The set to compare
        * @return {boolean}
        */
        Set.prototype.isEqual = function (set) {
            if (this.card !== set.card) {
                return false;
            } else {
                return this.every(function (y, i) {
                    return MathLib.isEqual(y, set[i]);
                });
            }
        };

        /**
        * Determines if the set is a subset of an other set.
        *
        * @param {Set} set The potential superset
        * @return {boolean}
        */
        Set.prototype.isSubsetOf = function (set) {
            return this.every(function (x) {
                return set.indexOf(x) !== -1;
            });
        };

        /**
        * Array.prototype.indexOf() returns only the position of an element in the
        * array and not the position where one should be inserted.
        *
        * @param {Set} x The element to locate
        * @return {number}
        */
        Set.prototype.locate = function (x) {
            var left = 0, right = this.card - 1, middle, i = this.indexOf(x);

            if (i !== -1) {
                return i;
            }

            while (left <= right) {
                middle = left + Math.floor((right - left) / 2);
                if (this[middle] < x) {
                    left = middle + 1;
                } else if (this[middle] > x) {
                    right = middle - 1;
                } else {
                    return middle;
                }
            }
            return left;
        };

        /**
        * Works like the Array.prototype.map function
        *
        * @param {function} The mapping function
        * @return {Set}
        */
        Set.prototype.map = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return new MathLib.Set(Array.prototype.map.apply(this, args));
        };

        /**
        * Adds the argument to all elements in the set,
        * or if no argument is provided adds up all the elements in the set.
        *
        * @param {number|MathLib object} n The object to add to the elements in the set.
        * @return {Set|any}
        */
        Set.prototype.plus = function (n) {
            var sum = [];
            if (!arguments.length) {
                return MathLib.plus.apply(null, this.toArray());
            } else if (n.type === 'set') {
                this.forEach(function (x) {
                    n.forEach(function (y) {
                        sum.push(MathLib.plus(x, y));
                    });
                });

                return new MathLib.Set(sum);
            } else {
                return this.map(function (x) {
                    return MathLib.plus(x, n);
                });
            }
        };

        /**
        * Returns the powerset
        *
        * @return {Set}
        */
        Set.prototype.powerset = function () {
            var flag, subset, i, ii, j, jj, powerset = [];

            for (i = 0, ii = Math.pow(2, this.card); i < ii; i++) {
                flag = i.toString(2).split('').reverse();
                subset = [];
                for (j = 0, jj = this.card; j < jj; j++) {
                    if (flag[j] === '1') {
                        subset.push(this[j]);
                    }
                }
                powerset.push(new MathLib.Set(subset));
            }

            return new MathLib.Set(powerset);
        };

        /**
        * Works like the Array.prototype.reduce function
        *
        * @return {any}
        */
        Set.prototype.reduce = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return Array.prototype.reduce.apply(this, arguments);
        };

        /**
        * Removes a element from a set
        *
        * @param {any} element The element to remove from the set.
        * @return {Set}
        */
        Set.prototype.remove = function (element) {
            var i = this.indexOf(element);
            if (i !== -1) {
                this.splice(i, 1);
                this.card--;
            }
            return this;
        };

        /**
        * Works like the Array.prototype.slice function
        *
        * @return {array}
        */
        Set.prototype.slice = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return Array.prototype.slice.apply(this, args);
        };

        /**
        * Works like the Array.prototype.some function
        *
        * @return {boolean}
        */
        Set.prototype.some = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return Array.prototype.some.apply(this, args);
        };

        /**
        * Works like the Array.prototype.splice function
        *
        * @return {Set}
        */
        Set.prototype.splice = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return Array.prototype.splice.apply(this, args);
        };

        /**
        * Multiplies all elements in the set if no argument is passed.
        * Multiplies all elements by a argument if one is passed.
        *
        * @param {number|MathLib object} n The object to multiply the elements with
        * @return {Set}
        */
        Set.prototype.times = function (n) {
            if (!arguments.length) {
                return MathLib.times.apply(null, this.toArray());
            } else {
                return this.map(function (x) {
                    return MathLib.times(x, n);
                });
            }
        };

        /**
        * Converts the set to an array
        *
        * @return {array}
        */
        Set.prototype.toArray = function () {
            return Array.prototype.slice.call(this);
        };

        /**
        * Returns the content MathML representation of the set
        *
        * @return {string}
        */
        Set.prototype.toContentMathML = function () {
            if (this.isEmpty()) {
                return '<emptyset/>';
            } else {
                return this.reduce(function (old, cur) {
                    return old + MathLib.toContentMathML(cur);
                }, '<set>') + '</set>';
            }
        };

        /**
        * Returns the LaTeX representation of the set
        *
        * @return {string}
        */
        Set.prototype.toLaTeX = function () {
            if (this.isEmpty()) {
                return '\\emptyset';
            } else {
                return this.reduce(function (old, cur) {
                    return old + MathLib.toLaTeX(cur) + ', ';
                }, '\\{').slice(0, -2) + '\\}';
            }
        };

        /**
        * Returns the (presentation) MathML representation of the set
        *
        * @return {string}
        */
        Set.prototype.toMathML = function () {
            if (this.isEmpty()) {
                return '<mi>&#x2205;</mi>';
            } else {
                return this.reduce(function (old, cur) {
                    return old + MathLib.toMathML(cur) + '<mo>,</mo>';
                }, '<mrow><mo>{</mo>').slice(0, -10) + '<mo>}</mo></mrow>';
            }
        };

        /**
        * Returns a string representation of the set
        *
        * @return {string}
        */
        Set.prototype.toString = function () {
            if (this.isEmpty()) {
                return '∅';
            }
            return '{' + Array.prototype.join.call(this, ', ') + '}';
        };
        Set.fromTo = function (start, end, step) {
            if (typeof step === "undefined") { step = 1; }
            var i, set = [];

            if (start <= end) {
                for (i = start; i <= end; i += step) {
                    set.push(i);
                }
                return new MathLib.Set(set);
            }
        };

        Set.createSetOperation = function (left, both, right) {
            return function (a) {
                var set = [], i = 0, j = 0, tl = this.card, al = a.card;

                while (i < tl && j < al) {
                    if (MathLib.compare(this[i], a[j]) < 0) {
                        if (left) {
                            set.push(this[i]);
                        }
                        i++;
                        continue;
                    }
                    if (MathLib.compare(this[i], a[j]) > 0) {
                        if (right) {
                            set.push(a[j]);
                        }
                        j++;
                        continue;
                    }
                    if (MathLib.isEqual(this[i], a[j])) {
                        if (both) {
                            set.push(this[i]);
                        }
                        i++;
                        j++;
                        continue;
                    }
                }
                if (left && j === al) {
                    set = set.concat(this.slice(i));
                } else if (right && i === tl) {
                    set = set.concat(a.slice(j));
                }
                return new MathLib.Set(set);
            };
        };
        return Set;
    })();
    MathLib.Set = Set;
return MathLib;
});
