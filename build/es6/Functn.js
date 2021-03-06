
import MathLib from './meta.js';
import Expression from './Expression';

var functnPrototype = {};

/**
* MathLib.Functn is the MathLib implementation of mathematical functions
*
* Because 'Function' is a reserved word in JavaScript,
* the class is called 'Functn'.
*
* @class
* @this {Functn}
*/
MathLib.Functn = function (f, options) {
    options = options || {};

    var functn = function (x) {
        if (typeof x === 'number' || typeof x === 'boolean') {
            return f.apply('', arguments);
        } else if (x.type === 'functn') {
            // x -> f(x)
            // y -> g(y)
            // y -> f(g(y))
            var bvar = options.expression.arguments[0].value, composition = options.expression.map(function (expr) {
                if (expr.subtype === 'variable' && expr.value === bvar) {
                    expr = x.expression.content[0];
                }
                return expr;
            });

            return new MathLib.Functn(function (y) {
                return f(x(y));
            }, {
                expression: new MathLib.Expression({
                    subtype: 'functionDefinition',
                    arguments: x.expression.arguments,
                    content: composition.content
                })
            });
        } else if (x.type === 'expression' && x.subtype === 'variable') {
            return new MathLib.Functn(f, {
                expression: new MathLib.Expression({
                    subtype: 'functionDefinition',
                    arguments: x,
                    content: x
                })
            });
        } else if (typeof x === 'function') {
            return function (y) {
                return f(x(y));
            };
        } else if (x.type === 'complex') {
            return x[options.name].apply(x, Array.prototype.slice.call(arguments, 1));
        } else if (x.type === 'integer' || x.type === 'rational') {
            if (x[options.name]) {
                return x[options.name].apply(x, Array.prototype.slice.call(arguments, 1));
            }
            return f(x.coerceTo('number'));
        } else if (x.type === 'set') {
            return x.map(f);
        } else if (MathLib.type(x) === 'array') {
            return x.map(f);
        } else {
            return x[options.name]();
        }
    };

    for (var name in functnPrototype) {
        if (functnPrototype.hasOwnProperty(name)) {
            functn[name] = functnPrototype[name];
        }
    }
    functn.type = 'functn';
    functn.constructor = MathLib.Functn;

    Object.defineProperties(functn, {
        id: { value: options.name },
        expression: { value: options.expression }
    });

    return functn;
};

var exports = {};
var binaryFunctions = {
    arctan2: Math.atan2,
    binomial: function (n, k) {
        // TODO: non integer values
        // What should be done with very big numbers?
        var binomial = 1, i, sign;

        // not finite means ±∞ or NaN
        if (MathLib.isNaN(n) || !MathLib.isFinite(k)) {
            return NaN;
        }

        // Exit early for areas which return 0
        if ((n >= 0 && k <= -1) || (n >= 0 && k > n) || (k < 0 && k > n)) {
            return 0;
        }

        if (n < 0) {
            if (k < 0) {
                // negative odd number % 2 = -1 and not +1
                // This leads to the + 1 here.
                return ((n + k) % 2 * 2 + 1) * MathLib.binomial(-k - 1, -n - 1);
            } else {
                if (k === 0) {
                    sign = 1;
                } else {
                    sign = -(k % 2 * 2 - 1);
                }
                binomial = sign * MathLib.binomial(k - n - 1, k);
            }
        }

        if (k > n / 2) {
            k = n - k;
        }

        for (i = 1; i <= k; i++) {
            binomial *= (n + 1 - i) / i;
        }
        return binomial;
    },
    divide: function (a, b) {
        return MathLib.times(a, MathLib.inverse(b));
    },
    log: function (base, x) {
        if (arguments.length === 1) {
            x = base;
            base = 10;
        }
        return Math.log(x) / Math.log(base);
    },
    minus: function (a, b) {
        return MathLib.plus(a, MathLib.negative(b));
    },
    mod: function (n, m) {
        var nm = n % m;
        return nm >= 0 ? nm : nm + m;
    },
    pow: function (x, y) {
        if (x === 1 || (x === -1 && (y === Infinity || y === -Infinity))) {
            return 1;
        }
        return Math.pow(x, y);
    },
    root: function (x, root) {
        if (arguments.length === 1) {
            return Math.sqrt(x);
        }
        return Math.pow(x, 1 / root);
    }
};

var createBinaryFunction = function (f, name) {
    return function (x) {
        if (typeof x === 'number') {
            return f.apply('', arguments);
        } else if (typeof x === 'function') {
            return function (y) {
                return f(x(y));
            };
        } else if (x.type === 'set') {
            return new MathLib.Set(x.map(f));
        } else if (x.type === 'complex') {
            return x[name].apply(x, Array.prototype.slice.call(arguments, 1));
        } else if (Array.isArray(x)) {
            return x.map(f);
        } else {
            return x[name]();
        }
    };
};

var func, cur;
for (func in binaryFunctions) {
    if (binaryFunctions.hasOwnProperty(func)) {
        cur = binaryFunctions[func];
        Object.defineProperty(exports, func, {
            value: createBinaryFunction(binaryFunctions[func], func)
        });
    }
}

/**
* Numeric derivative at a given point
*
* @param {number} x The value to calculate the derivative at
* @param {number} h Optional step size
* @return {number}
*/
functnPrototype.diff = function (x, h) {
    if (typeof h === "undefined") { h = 1e-5; }
    return (this(x + h) - this(x - h)) / (2 * h);
};

/**
* Draws the function on the screen
*
* @param {Screen} screen The screen to draw the function onto.
* @param {object} options Optional drawing options.
* @return {Functn}
*/
functnPrototype.draw = function (screen, options) {
    if (typeof options === "undefined") { options = {}; }
    var functn = this;
    if (Array.isArray(screen)) {
        screen.forEach(function (x) {
            x.path(functn, options);
        });
    } else {
        screen.path(functn, options);
    }

    return this;
};

// These functions will be added to the functn prototype soon.
var functionList1 = {
    /*
    divisors: function (x) {
    var divisors = x === 1 ? [] : [1],
    i, ii;
    for (i = 2, ii = x / 2; i <= ii; i++) {
    if (x % i === 0) {
    divisors.push(i);
    }
    }
    divisors.push(x);
    return new MathLib.Set(divisors);
    },
    factor: function (n) {
    var factors = [],
    i;
    n = Math.abs(n);
    while (n % 2 === 0) {
    n = n / 2;
    factors.push(2);
    }
    
    i = 3;
    while (n !== 1) {
    while (n % i === 0) {
    n = n / i;
    factors.push(i);
    }
    i += 2;
    }
    return new MathLib.Set(factors, true);
    },
    */
    fallingFactorial: function (n, m, s) {
        var factorial = 1, j;
        s = s || 1;

        for (j = 0; j < m; j++) {
            factorial *= (n - j * s);
        }
        return factorial;
    },
    fibonacci: function (n) {
        return Math.floor(Math.pow(MathLib.goldenRatio, n) / Math.sqrt(5));
    },
    random: Math.random,
    risingFactorial: function (n, m, s) {
        var factorial = 1, j;
        s = s || 1;

        for (j = 0; j < m; j++) {
            factorial *= (n + j * s);
        }
        return factorial;
    },
    round: function (x) {
        // Some implementations have a bug where Math.round(-0) = +0 (instead of -0).
        if (x === 0) {
            return x;
        }
        return Math.round(x);
    },
    trunc: function (x, n) {
        return x.toFixed(n || 0);
    },
    toContentMathML: function (x) {
        if (typeof x === 'number') {
            return '<cn>' + x + '</cn>';
        } else {
            return x.toContentMathML();
        }
    },
    toLaTeX: function (x, plus) {
        if (plus) {
            return (x < 0 ? '-' : '+') + Math.abs(x);
        } else {
            return (x < 0 ? '-' : '') + Math.abs(x);
        }
    },
    toMathML: function (x, plus) {
        if (plus) {
            return '<mo>' + (x < 0 ? '-' : '+') + '</mo><mn>' + Math.abs(x) + '</mn>';
        } else {
            return (x < 0 ? '<mo>-</mo>' : '') + '<mn>' + Math.abs(x) + '</mn>';
        }
    },
    toString: function (x, plus) {
        if (plus) {
            return (x < 0 ? '-' : '+') + Math.abs(x);
        } else {
            return (x < 0 ? '-' : '') + Math.abs(x);
        }
    }
};

var createFunction1 = function (f, name) {
    return function (x) {
        if (typeof x === 'number') {
            return f.apply('', arguments);
        } else if (typeof x === 'function') {
            return function (y) {
                return f(x(y));
            };
        } else if (x.type === 'set') {
            return new MathLib.Set(x.map(f));
        } else if (x.type === 'complex') {
            return x[name].apply(x, Array.prototype.slice.call(arguments, 1));
        } else if (Array.isArray(x)) {
            return x.map(f);
        } else {
            return x[name]();
        }
    };
};

for (func in functionList1) {
    if (functionList1.hasOwnProperty(func)) {
        cur = functionList1[func];
        Object.defineProperty(exports, func, {
            value: createFunction1(functionList1[func], func)
        });
    }
}

MathLib.compare = function (a, b) {
    if (MathLib.type(a) !== MathLib.type(b)) {
        return MathLib.sign(MathLib.type(a).localeCompare(MathLib.type(b)));
    } else if (typeof a === 'number') {
        return MathLib.sign(a - b);
    } else if (typeof a === 'string') {
        return a.localeCompare(b);
    }
    return a.compare(b);
};

MathLib.type = function (x) {
    if (x === null) {
        return 'null';
    }
    if (x === undefined) {
        return 'undefined';
    }
    return x.type ? x.type : (x.constructor.name || Object.prototype.toString.call(x).slice(8, -1)).toLowerCase();
};

MathLib.is = function (obj, type) {
    var ucfirst = function (str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1);
    }, global = global, window = window, glbl = {
        Object: Object,
        Function: Function,
        RegExp: RegExp,
        Array: Array
    };

    if (MathLib.type(obj) === type) {
        return true;
    } else if ([
        'circle', 'complex', 'expression', 'functn', 'line', 'matrix', 'permutation', 'point',
        'polynomial', 'rational', 'screen', 'screen2d', 'screen3d', 'set', 'vector'].indexOf(type) !== -1) {
        return obj instanceof MathLib[ucfirst(type)];
    } else {
        // if (window) {
        return obj instanceof glbl[ucfirst(type)];
        // }
        // if (global) {
        // 	return obj instanceof global[ucfirst(type)];
        // }
    }
};

/**
* Checks if MathML is supported by the browser.
* Code stolen from [Modernizr](http://www.modernizr.com/)
*
* @return {boolean}
*/
MathLib.isMathMLSupported = function () {
    var hasMathML = false, ns, div, mfrac;

    // If document is undefined (e.g. in Node) we return false
    if (typeof document !== 'undefined' && document.createElementNS) {
        ns = 'http://www.w3.org/1998/Math/MathML';
        div = document.createElement('div');
        div.style.position = 'absolute';
        mfrac = div.appendChild(document.createElementNS(ns, 'math')).appendChild(document.createElementNS(ns, 'mfrac'));
        mfrac.appendChild(document.createElementNS(ns, 'mi')).appendChild(document.createTextNode('xx'));
        mfrac.appendChild(document.createElementNS(ns, 'mi')).appendChild(document.createTextNode('yy'));
        document.body.appendChild(div);
        hasMathML = div.offsetHeight > div.offsetWidth;
        document.body.removeChild(div);
    }
    return hasMathML;
};

/**
* ### MathLib.writeMathML()
* Writes MathML to an element.
*
* @param {string} id The id of the element in which the MathML should be inserted.
* @param {string} math The MathML to be inserted.
*/
MathLib.writeMathML = function (id, math) {
    var formula;
    document.getElementById(id).innerHTML = '<math>' + math + '</math>';
    if (typeof MathJax !== 'undefined') {
        formula = MathJax.Hub.getAllJax(id)[0];
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, id]);
    }
};

/**
* ### MathLib.loadMathJax()
* Loads MathJax dynamically.
*
* @param {string} config Optional config options
*/
MathLib.loadMathJax = function (config) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://cdn.mathjax.org/mathjax/latest/MathJax.js';

    config = config || 'MathJax.Hub.Config({' + 'config: ["MMLorHTML.js"],' + 'jax: ["input/TeX", "input/MathML", "output/HTML-CSS", "output/NativeMML"],' + 'extensions: ["tex2jax.js", "mml2jax.js", "MathMenu.js", "MathZoom.js"],' + 'TeX: {' + 'extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]' + '}' + '});';

    if (window.opera) {
        script.innerHTML = config;
    } else {
        script.text = config;
    }

    document.getElementsByTagName('head')[0].appendChild(script);
};

// Functions that act on set-like structures and return one single number/boolean...
var nAryFunctions = {
    /**
    * Returns true iff all arguments are true.
    *
    * @param {...boolean} n Expects an arbitrary number of boolean arguments
    * @return {boolean}
    */
    and: function (n) {
        return n.every(function (x) {
            return !!x;
        });
    },
    arithMean: function (n) {
        return MathLib.plus(n) / n.length;
    },
    gcd: function (a) {
        var min, reduction = function (x) {
            return x !== min ? x % min : x;
        }, isntZero = function (x) {
            return x !== 0;
        };

        // remove zeros and make negative values positive
        a = a.filter(isntZero).map(Math.abs);

        if (a.length === 0) {
            return 0;
        }

        while (a.length > 1) {
            min = MathLib.min(a);
            a = a.map(reduction).filter(isntZero);
        }
        return a[0] || min;
    },
    geoMean: function (n) {
        return MathLib.root(MathLib.times(n), n.length);
    },
    harmonicMean: function (n) {
        return n.length / MathLib.plus(n.map(MathLib.inverse));
    },
    hypot: function (n) {
        var a, b, max, min;

        if (n.length === 1) {
            return Math.abs(n[0]);
        }

        if (n.length > 2) {
            return n.reduce(function (a, b) {
                return MathLib.hypot(a, b);
            });
        }

        a = MathLib.abs(n[0]);
        b = MathLib.abs(n[1]);

        // Return Infinity if one value is infinite, even if the other value is NaN.
        // (see IEEE 754-2008, 9.2.1)
        if (a === Infinity || b === Infinity) {
            return Infinity;
        }

        // Return +0 if both values are ±0 (see IEEE 754-2008, 9.2.1)
        if (a === 0 && b === 0) {
            return 0;
        }

        max = Math.max(a, b);
        min = Math.min(a, b);

        return max * Math.sqrt(1 + Math.pow(min / max, 2));
    },
    hypot2: function (n) {
        // Return Infinity if one value is infinite
        if (n.some(function (x) {
            return x === Infinity || x === -Infinity;
        })) {
            return Infinity;
        }
        return n.reduce(function (old, cur) {
            return old + cur * cur;
        }, 0);
    },
    /**
    * ### MathLib.isEqual()
    * Determines if all arguments are equal.
    *
    * @param {...number|MathLib object} n Expects an arbitrary number of numbers or MathLib objects
    * @return {boolean}
    */
    isEqual: function (n) {
        return n.every(function (a, i, args) {
            if (a === args[0]) {
                return true;
            } else if (typeof a === 'number' && typeof args[0] === 'number') {
                return Math.abs(a - args[0]) <= 3e-15;
            } else if (typeof a === 'object') {
                return a.isEqual(args[0]);
            } else if (typeof args[0] === 'object') {
                return args[0].isEqual(a);
            }
            return false;
        });
    },
    lcm: function (n) {
        if (n.length === 0) {
            return 0;
        }
        if (n.length === 1) {
            return n[0];
        } else if (n.length === 2) {
            return MathLib.times(n) / MathLib.gcd(n);
        } else if (n.length > 2) {
            return n.reduce(function (x, y) {
                return MathLib.lcm(x, y);
            });
        }
    },
    max: function (n) {
        return Math.max.apply(null, n);
    },
    min: function (n) {
        return Math.min.apply(null, n);
    },
    /**
    * ### MathLib.or()
    * Returns true iff at least one argument is true.
    *
    * @param {...boolean} Expects an arbitrary number of boolean arguments
    * @return {boolean}
    */
    or: function (n) {
        return n.some(function (x) {
            return !!x;
        });
    },
    plus: function (n) {
        if (n.length === 0) {
            return 0;
        }
        return n.reduce(function (a, b) {
            var f1, f2, aExpr, bExpr;
            if (typeof a === 'number' && typeof b === 'number') {
                return a + b;
            } else if (a.type === 'functn' || b.type === 'functn') {
                f1 = a;
                f2 = b;
                aExpr = a.expression ? a.expression.content[0] : {};
                bExpr = b.expression ? b.expression.content[0] : {};

                if (a.type !== 'functn') {
                    f1 = function () {
                        return a;
                    };
                    aExpr = new MathLib.Expression({
                        value: a,
                        subtype: 'number'
                    });
                } else if (b.type !== 'functn') {
                    f2 = function () {
                        return b;
                    };
                    bExpr = new MathLib.Expression({
                        value: b,
                        subtype: 'number'
                    });
                }
                return MathLib.Functn(function (x) {
                    return MathLib.plus(f1(x), f2(x));
                }, {
                    expression: new MathLib.Expression({
                        subtype: 'functionDefinition',
                        arguments: ['x'],
                        content: [
                            new MathLib.Expression({
                                content: [aExpr, bExpr],
                                subtype: 'naryOperator',
                                value: '+',
                                name: 'plus'
                            })
                        ]
                    })
                });
            } else if (typeof a === 'object') {
                return a.plus(b);
            } else if (typeof b === 'object') {
                return b.plus(a);
            }
        });
    },
    times: function (n) {
        if (n.length === 0) {
            return 1;
        }
        return n.reduce(function (a, b) {
            var f1, f2, aExpr, bExpr;
            if (typeof a === 'number' && typeof b === 'number') {
                return a * b;
            } else if (a.type === 'functn' || b.type === 'functn') {
                f1 = a;
                f2 = b;
                aExpr = a.expression ? a.expression.content[0] : {};
                bExpr = b.expression ? b.expression.content[0] : {};

                if (a.type !== 'functn') {
                    f1 = function () {
                        return a;
                    };
                    aExpr = new MathLib.Expression({
                        value: a,
                        subtype: 'number'
                    });
                } else if (b.type !== 'functn') {
                    f2 = function () {
                        return b;
                    };
                    bExpr = new MathLib.Expression({
                        value: b,
                        subtype: 'number'
                    });
                }
                return MathLib.Functn(function (x) {
                    return MathLib.times(f1(x), f2(x));
                }, {
                    expression: new MathLib.Expression({
                        subtype: 'functionDefinition',
                        arguments: ['x'],
                        content: [
                            new MathLib.Expression({
                                content: [aExpr, bExpr],
                                subtype: 'naryOperator',
                                value: '*',
                                name: 'times'
                            })
                        ]
                    })
                });
            } else if (typeof a === 'object') {
                return a.times(b);
            } else if (typeof b === 'object') {
                return b.times(a);
            }
        });
    },
    /**
    * ### MathLib.xor()
    * Returns true iff an odd number of the arguments is true.
    *
    * @param {...boolean} Expects an arbitrary number of boolean arguments
    * @return {boolean}
    */
    xor: function (n) {
        return n.reduce(function (x, y) {
            return x + !!y;
        }, 0) % 2 !== 0;
    }
};

var createNaryFunction = function (f) {
    return function (n) {
        if (MathLib.type(n) === 'set') {
            return f(n.slice());
        } else if (MathLib.type(n) !== 'array') {
            n = Array.prototype.slice.apply(arguments);
        }
        return f(n);
    };
};

for (func in nAryFunctions) {
    if (nAryFunctions.hasOwnProperty(func)) {
        Object.defineProperty(exports, func, {
            value: createNaryFunction(nAryFunctions[func])
        });
    }
}

/**
* Numeric evaluation of an integral using an adative simpson approach.
*
* Inspired by "adaptsim.m" by Walter Gander
* and MatLab's "quad.m"
*
* @param {number} a The starting point
* @param {number} b The end point
* @param {number} options Optional options
* @return {number}
*/
functnPrototype.quad = function (a, b, options) {
    if (typeof options === "undefined") { options = {}; }
    var f = this, warnMessage = [
        'Calculation succeded',
        'Minimum step size reached',
        'Maximum function count exceeded',
        'Infinite or NaN function value encountered'
    ], Q;

    options.calls = 3;
    options.warn = 0;

    if (a === -Infinity) {
        a = -Number.MAX_VALUE;
    }

    if (b === Infinity) {
        b = Number.MAX_VALUE;
    }

    if (!('minStep' in options)) {
        options.minStep = 1e-15;
    }

    if (!('maxCalls' in options)) {
        options.maxCalls = 10000;
    }

    if (!('tolerance' in options)) {
        options.tolerance = 1e-5;
    }

    Q = quadstep(f, a, b, f(a), f((a + b) / 2), f(b), options);

    options.warnMessage = warnMessage[options.warn];

    return Q;
};

// Recursive function for the quad method
var quadstep = function (f, a, b, fa, fc, fb, options) {
    var h = b - a, c = (a + b) / 2, fd = f((a + c) / 2), fe = f((c + b) / 2), Q1 = (h / 6) * (fa + 4 * fc + fb), Q2 = (h / 12) * (fa + 4 * fd + 2 * fc + 4 * fe + fb), Q = Q2 + (Q2 - Q1) / 15;

    options.calls = options.calls + 2;

    // Infinite or Not-a-Number function value encountered
    if (!MathLib.isFinite(Q)) {
        options.warn = Math.max(options.warn, 3);
        return Q;
    }

    // Maximum function count exceeded; singularity likely
    if (options.calls > options.maxCalls) {
        options.warn = Math.max(options.warn, 2);
        return Q;
    }

    // Accuracy over this subinterval is acceptable
    if (Math.abs(Q2 - Q) <= options.tolerance) {
        return Q;
    }

    // Minimum step size reached; singularity possible
    if (Math.abs(h) < options.minStep || c === a || c === b) {
        options.warn = Math.max(options.warn, 1);
        return Q;
    }

    // Otherwise, divide the interval into two subintervals
    return quadstep(f, a, c, fa, fd, fc, options) + quadstep(f, c, b, fc, fe, fb, options);
};

/**
* Returns a content MathML representation of the function
*
* @return {MathML}
*/
functnPrototype.toContentMathML = function () {
    return this.expression.toContentMathML();
};

/**
* Returns a LaTeX representation of the function
*
* @return {string}
*/
functnPrototype.toLaTeX = function () {
    return this.expression.toLaTeX();
    /*
    / / List of functions to be executed on the specified node type
    var handlers = {
    apply: function (n) {
    var f = n.childNodes[0],
    args = n.childNodes.slice(1).map(function (x) {
    return handlers[x.nodeName](x);
    }),
    str = '';
    
    if (f.nodeName === 'plus') {
    str = args.join('+');
    }
    else if (f.nodeName === 'times') {
    str = args.join('*');
    }
    else if (f.nodeName === 'power') {
    str = args[0] + '^{' + args[1] + '}';
    }
    else {
    / / TODO: not all functions can be written like \sin some have to be written like \operatorname{argmax}
    str = '\\' + f.nodeName + '(' + args.join(', ') + ')';
    }
    return str;
    },
    bvar: function () {return '';},
    ci: function (n) {return bvar || n.innerMathML;},
    cn: function (n) {return n.innerMathML;},
    cs: function (n) {return n.innerMathML;},
    domainofapplication: function () {return '';},
    lambda: function (n) {
    return n.childNodes.reduce(function (old, cur) {
    return old + handlers[cur.nodeName](cur);
    }, '');
    },
    '#text': function (n) {return n.innerMathML;}
    };
    
    / / Start the node handling with the first real element (not the <math> element)
    return handlers[this.contentMathML.childNodes[0].nodeName](this.contentMathML.childNodes[0]);
    */
};

/**
* Returns a MathML representation of the function
*
* @return {string}
*/
functnPrototype.toMathML = function () {
    return this.expression.toMathML();
};

/**
* Returns a string representation of the function
*
* @return {string}
*/
functnPrototype.toString = function () {
    return this.expression.toString();
    /*
    / / List of functions to be executed on the specified node type
    var handlers = {
    apply: function (n) {
    var f = n.childNodes[0],
    args = n.childNodes.slice(1).map(function (x) {
    return handlers[x.nodeName](x);
    }),
    str = '';
    
    if (f.nodeName === 'plus') {
    str = args.join('+');
    }
    else if (f.nodeName === 'times') {
    str = args.join('*');
    }
    else if (f.nodeName === 'power') {
    str = args[0] + '^' + args[1];
    }
    else {
    str = f.nodeName + '(' + args.join(', ') + ')';
    }
    return str;
    },
    bvar: function () {return '';},
    ci: function (n) {return bvar || n.innerMathML;},
    cn: function (n) {return n.innerMathML;},
    cs: function (n) {return n.innerMathML;},
    domainofapplication: function () {return '';},
    lambda: function (n) {
    return n.childNodes.reduce(function (old, cur) {
    return old + handlers[cur.nodeName](cur);
    }, '');
    },
    '#text': function (n) {return n.innerMathML;}
    };
    
    / / Start the node handling with the first real element (not the <math> element)
    return handlers[this.contentMathML.childNodes[0].nodeName](this.contentMathML.childNodes[0]);
    */
};

// ## unary functions
// Some functions for the functn prototype
var unaryFunctions = {
    abs: Math.abs,
    arccos: Math.acos,
    arccot: function (x) {
        return 1.5707963267948966 - Math.atan(x);
    },
    arccsc: function (x) {
        return Math.asin(1 / x);
    },
    arcosh: MathLib.isNative(Math.acosh) || function (x) {
        return Math.log(x + Math.sqrt(x * x - 1));
    },
    arcoth: function (x) {
        // Handle ±∞
        if (!MathLib.isFinite(x)) {
            return 1 / x;
        }
        return 0.5 * Math.log((x + 1) / (x - 1));
    },
    arcsch: function (x) {
        // Handle ±0 and ±∞ separately
        if (x === 0 || !MathLib.isFinite(x)) {
            return 1 / x;
        }
        return Math.log(1 / x + Math.sqrt(1 / (x * x) + 1));
    },
    arcsec: function (x) {
        return Math.acos(1 / x);
    },
    arcsin: Math.asin,
    arctan: Math.atan,
    arsech: function (x) {
        return Math.log((1 + Math.sqrt(1 - x * x)) / x);
    },
    arsinh: MathLib.isNative(Math.asinh) || function (x) {
        // Handle ±0 and ±∞ separately
        if (x === 0 || !MathLib.isFinite(x)) {
            return x;
        }
        return Math.log(x + Math.sqrt(x * x + 1));
    },
    artanh: MathLib.isNative(Math.atanh) || function (x) {
        // Handle ±0
        if (x === 0) {
            return x;
        }
        return 0.5 * Math.log((1 + x) / (1 - x));
    },
    ceil: function (x) {
        // Some implementations have a bug where Math.ceil(-0) = +0 (instead of -0)
        if (x === 0) {
            return x;
        }
        return Math.ceil(x);
    },
    cbrt: function (x) {
        var a3, a3x, an, a;

        // Handle ±0, NaN, ±∞
        if (x === 0 || x !== x || x === Infinity || x === -Infinity) {
            return x;
        }

        // Get an approximation
        a = MathLib.sign(x) * Math.pow(Math.abs(x), 1 / 3);

        while (true) {
            a3 = Math.pow(a, 3);
            a3x = a3 + x;
            an = a * (a3x + x) / (a3x + a3);
            if (MathLib.isZero(an - a)) {
                break;
            }
            a = an;
        }
        return an;
    },
    conjugate: function (x) {
        return x;
    },
    copy: function (x) {
        return x;
    },
    cos: Math.cos,
    cosh: MathLib.isNative(Math.cosh) || function (x) {
        return (Math.exp(x) + Math.exp(-x)) / 2;
    },
    cot: function (x) {
        // Handle ±0 separate, because tan(pi/2 ± 0) is not ±∞
        if (x === 0) {
            return 1 / x;
        }

        // cot(x) = tan(pi/2 - x) is better than 1/tan(x)
        return Math.tan(1.5707963267948966 - x);
    },
    coth: function (x) {
        // Handle ±0
        if (x === 0) {
            return 1 / x;
        }

        // Handle ±∞
        if (!MathLib.isFinite(x)) {
            return MathLib.sign(x);
        }

        return (Math.exp(x) + Math.exp(-x)) / (Math.exp(x) - Math.exp(-x));
    },
    csc: function (x) {
        return 1 / Math.sin(x);
    },
    csch: function (x) {
        // csch(-0) should be -∞ not ∞
        if (x === 0) {
            return 1 / x;
        }
        return 2 / (Math.exp(x) - Math.exp(-x));
    },
    degToRad: function (x) {
        // Math.PI / 180 = 0.017453292519943295
        return x * 0.017453292519943295;
    },
    digitsum: function (x) {
        var out = 0;
        while (x > 9) {
            out += x % 10;
            x = Math.floor(x / 10);
        }
        return out + x;
    },
    exp: Math.exp,
    factorial: function (x) {
        var factorial = 1, i;
        if ((x > 170 && MathLib.isInt(x)) || x === Infinity) {
            return Infinity;
        }
        if (x < 0 || !MathLib.isInt(x) || MathLib.isNaN(x)) {
            return NaN;
        }
        for (i = 1; i <= x; i++) {
            factorial *= i;
        }
        return factorial;
    },
    floor: Math.floor,
    identity: function (x) {
        return x;
    },
    inverse: function (x) {
        return 1 / x;
    },
    isFinite: function (x) {
        return Math.abs(x) < Infinity;
    },
    isInt: function (x) {
        return x % 1 === 0;
    },
    isNaN: function (x) {
        return x !== x;
    },
    isNegZero: function (x) {
        return 1 / x === -Infinity;
    },
    isOne: function (a) {
        return Math.abs(a - 1) < MathLib.epsilon;
    },
    isPosZero: function (x) {
        return 1 / x === Infinity;
    },
    isPrime: function (x) {
        var sqrt = Math.sqrt(x), i;
        if (x % 1 === 0 && x > 1) {
            if (x === 2) {
                return true;
            }
            if (x % 2 === 0) {
                return false;
            }
            for (i = 3; i <= sqrt; i += 2) {
                if (x % i === 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    isReal: function (x) {
        return Math.abs(x) < Infinity;
    },
    isZero: function (x) {
        return Math.abs(x) < MathLib.epsilon;
    },
    lg: function (x) {
        return Math.log(x) / Math.LN10;
    },
    ln: Math.log,
    // Algorithm based on [Numerical Recipes Vol. 3, p. 257](www.nr.com)
    logGamma: function (x) {
        var j, tmp, y, ser, cof = [
            57.1562356658629235, -59.5979603554754912, 14.1360979747417471, -0.491913816097620199,
            0.339946499848118887e-4, 0.465236289270485756e-4, -0.983744753048795646e-4, 0.158088703224912494e-3,
            -0.210264441724104883e-3, 0.217439618115212643e-3, -0.164318106536763890e-3, 0.844182239838527433e-4,
            -0.261908384015814087e-4, 0.368991826595316234e-5];

        if (x === Infinity) {
            return Infinity;
        }

        y = x;
        tmp = x + 5.24218750000000000; // Rational 671/128.
        tmp = (x + 0.5) * Math.log(tmp) - tmp;
        ser = 0.999999999999997092;
        for (j = 0; j < 14; j++) {
            ser += cof[j] / ++y;
        }
        return tmp + Math.log(2.5066282746310005 * ser / x);
    },
    negative: function (x) {
        return -x;
    },
    not: function (x) {
        return !x;
    },
    radToDeg: function (x) {
        // 180 / Math.PI = 57.29577951308232
        return x * 57.29577951308232;
    },
    sec: function (x) {
        return 1 / Math.cos(x);
    },
    sech: function (x) {
        return 2 / (Math.exp(x) + Math.exp(-x));
    },
    sign: function (x) {
        return x && (x < 0 ? -1 : 1);
    },
    sin: Math.sin,
    sinh: MathLib.isNative(Math.sinh) || function (x) {
        // sinh(-0) should be -0
        if (x === 0) {
            return x;
        }
        return (Math.exp(x) - Math.exp(-x)) / 2;
    },
    sqrt: Math.sqrt,
    tan: Math.tan,
    tanh: MathLib.isNative(Math.tanh) || function (x) {
        var p;

        // Handle ±0 and ±∞ separately
        // Their values happen to coincide with sign
        if (x === 0 || !MathLib.isFinite(x)) {
            return MathLib.sign(x);
        }

        p = Math.exp(x);
        return (p * p - 1) / (p * p + 1);
    }
};

for (var elemfn in unaryFunctions) {
    if (unaryFunctions.hasOwnProperty(elemfn)) {
        Object.defineProperty(exports, elemfn, {
            value: MathLib.Functn(unaryFunctions[elemfn], {
                name: elemfn,
                expression: new MathLib.Expression({
                    subtype: 'functionDefinition',
                    arguments: [
                        new MathLib.Expression({
                            subtype: 'variable',
                            value: 'x'
                        })
                    ],
                    content: [
                        new MathLib.Expression({
                            subtype: 'functionCall',
                            content: [
                                new MathLib.Expression({
                                    subtype: 'variable',
                                    value: 'x'
                                })
                            ],
                            value: elemfn
                        })
                    ]
                })
            }),
            writable: true,
            enumerable: true,
            configurable: true
        });
    }
}

export var abs = exports.abs;
export var arccos = exports.arccos;
export var arccot = exports.arccot;
export var arccsc = exports.arccsc;
export var arcosh = exports.arcosh;
export var arcoth = exports.arcoth;
export var arcsch = exports.arcsch;
export var arcsec = exports.arcsec;
export var arcsin = exports.arcsin;
export var arctan = exports.arctan;
export var arsech = exports.arsech;
export var arsinh = exports.arsinh;
export var artanh = exports.artanh;
export var ceil = exports.ceil;
export var cbrt = exports.cbrt;
export var conjugate = exports.conjugate;
export var copy = exports.copy;
export var cos = exports.cos;
export var cosh = exports.cosh;
export var cot = exports.cot;
export var coth = exports.coth;
export var csc = exports.csc;
export var csch = exports.csch;
export var degToRad = exports.degToRad;
export var digitsum = exports.digitsum;
export var exp = exports.exp;
export var factorial = exports.factorial;
export var floor = exports.floor;
export var identity = exports.identity;
export var inverse = exports.inverse;
export var isFinite = exports.isFinite;
export var isInt = exports.isInt;
export var isNaN = exports.isNaN;
export var isNegZero = exports.isNegZero;
export var isOne = exports.isOne;
export var isPosZero = exports.isPosZero;
export var isPrime = exports.isPrime;
export var isReal = exports.isReal;
export var isZero = exports.isZero;
export var lg = exports.lg;
export var ln = exports.ln;
export var logGamma = exports.logGamma;
export var negative = exports.negative;
export var not = exports.not;
export var radToDeg = exports.radToDeg;
export var sec = exports.sec;
export var sech = exports.sech;
export var sign = exports.sign;
export var sin = exports.sin;
export var sinh = exports.sinh;
export var sqrt = exports.sqrt;
export var tan = exports.tan;
export var tanh = exports.tanh;

export var arctan2 = exports.arctan2;
export var binomial = exports.binomial;
export var divide = exports.divide;
export var log = exports.log;
export var minus = exports.minus;
export var mod = exports.mod;
export var pow = exports.pow;
export var root = exports.root;

export var divisors = exports.divisors;
export var factor = exports.factor;
export var fallingFactorial = exports.fallingFactorial;
export var fibonacci = exports.fibonacci;
export var risingFactorial = exports.risingFactorial;
export var round = exports.round;
export var trunc = exports.trunc;
export var toContentMathML = exports.toContentMathML;
export var toLaTeX = exports.toLaTeX;
export var toMathML = exports.toMathML;
export var toString = exports.toString;

export var and = exports.and;
export var arithMean = exports.arithMean;
export var gcd = exports.gcd;
export var geoMean = exports.geoMean;
export var harmonicMean = exports.harmonicMean;
export var hypot = exports.hypot;
export var hypot2 = exports.hypot2;
export var isEqual = exports.isEqual;
export var lcm = exports.lcm;
export var max = exports.max;
export var min = exports.min;
export var or = exports.or;
export var plus = exports.plus;
export var times = exports.times;
export var xor = exports.xor;

