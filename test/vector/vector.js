module('Vector');
test('init', 4, function () {
  var vector = new MathLib.Vector([1, 2, 3]);
  equal(vector.length, 3, 'Testing the dimension');
  equal(vector[0], 1, 'checking the entries');
  equal(vector[1], 2, 'checking the entries');
  equal(vector[2], 3, 'checking the entries');
});



// Properties
test('.constructor', 1, function () {
  var v = new MathLib.Vector([1, 2, 3]);
  equal(v.constructor, MathLib.Vector, 'Testing .constructor');
});


test('.type', 1, function () {
  var v = new MathLib.Vector([1, 2, 3]);
  equal(v.type, 'vector', 'Testing .type');
});



// Methods
test('.isEqual()', 3, function () {
  var v = new MathLib.Vector([0, 1, 2]),
      w = new MathLib.Vector([0, 1, 2]),
      u = new MathLib.Vector([0, 0, 0]),
      x = new MathLib.Vector([0, 0, 0, 0]);
  equal(v.isEqual(w), true, '.isEqual()');
  equal(v.isEqual(u), false, '.isEqual()');
  equal(u.isEqual(x), false, '.isEqual()');
});


test('.isZero()', 2, function () {
  var v = new MathLib.Vector([0, 0, 0]),
      w = new MathLib.Vector([0, 0, 1]);
  equal(v.isZero(), true, '.isZero()');
  equal(w.isZero(), false, '.isZero()');
});


test('.map()', 2, function () {
  var p = new MathLib.Vector([1, 2, 3]),
      q = new MathLib.Vector([2, 4, 6]),
      f = function (x) {
        return 2 * x;
      },
      res = p.map(f);

  deepEqual(res, q, '.map()');
  equal(res.type, 'vector', '.type should be vector');
});


test('.minus()', 1, function () {
  var v = new MathLib.Vector([3, 1, 4]),
      w = new MathLib.Vector([1, 5, 9]);
  equal(v.minus(w).isEqual(new MathLib.Vector([2, -4, -5])), true, '.minus()');
});


test('.neagtive()', 1, function () {
  var v = new MathLib.Vector([3, 1, 4]);
  equal(v.negative().isEqual(new MathLib.Vector([-3, -1, -4])), true, '.negative()');
});


test('.normalize()', 1, function () {
  var v = new MathLib.Vector([2, 3, 6]);
  equal(v.normalize().isEqual(new MathLib.Vector([2/7, 3/7, 6/7])), true, '.normalize()');
});


test('.outerProduct()', 1, function () {
  var v = new MathLib.Vector([3, 1, 4]),
      w = new MathLib.Vector([1, 5, 9]);
  equal(v.outerProduct(w).isEqual(new MathLib.Matrix([[3, 15, 27], [1, 5, 9], [4, 20, 36]])), true, '.outerProduct()');
});


test('.plus()', 1, function () {
  var v = new MathLib.Vector([3, 1, 4]),
      w = new MathLib.Vector([1, 5, 9]);
  equal(v.plus(w).isEqual(new MathLib.Vector([4, 6, 13])), true, '.plus()');
});


test('.scalarProduct()', 1, function () {
  var v = new MathLib.Vector([3, 1, 4]),
      w = new MathLib.Vector([1, 5, 9]);
  equal(v.scalarProduct(w), 44, '.scalarProduct()');
});


test('.size()', 1, function () {
  var v = new MathLib.Vector([1, 2, 2]);
  equal(v.size(), 3, '.size()');
});


test('.times()', 2, function () {
  var v = new MathLib.Vector([1, 2, 3]),
      m = new MathLib.Matrix([[1,2,3],[4,5,6],[7,8,9]]);
  deepEqual(v.times(3), new MathLib.Vector([3, 6, 9]), '.times(number)');
  deepEqual(v.times(m), new MathLib.Vector([30, 36, 42]), '.times(matrix)');
});


test('.toArray()', 1, function () {
  var v = new MathLib.Vector([1, 2, 3]);
  equal(MathLib.type(v.toArray()), 'array', '.toArray()');
});


test('.toContentMathMLString()', 1, function () {
  var v = new MathLib.Vector([1, 2, 3]);
  equal(v.toContentMathMLString(), '<vector><cn>1</cn><cn>2</cn><cn>3</cn></vector>', '.toContentMathML()String');
});


test('.toLaTeX()', 1, function () {
  var v = new MathLib.Vector([1, 2, 3]);
  equal(v.toLaTeX(), '\\begin{pmatrix}\n\t1\\\\\n\t2\\\\\n\t3\n\\end{pmatrix}');
});


test('.toMathMLString()', 1, function () {
  var v = new MathLib.Vector([1, 2, 3]);
  equal(v.toMathMLString(), '<mrow><mo>(</mo><mtable><mtr><mtd><mn>1</mn></mtd></mtr><mtr><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd></mtr></mtable><mo>)</mo></mrow>', '.toMathMLString()');
});


test('.toString()', 1, function () {
  var v = new MathLib.Vector([1, 2, 3]);
  equal(v.toString(), '(1, 2, 3)', '.toString()');
});


test('.vectorproduct()', 1, function () {
  var v = new MathLib.Vector([1, 2, 3]),
      w = new MathLib.Vector([-7, 8, 9]),
      res = new MathLib.Vector([-6, -30, 22]);
  equal(v.vectorproduct(w).isEqual(res), true, '.vectorProduct()');
});



// Static methods
test('zero()', 1, function () {
  var v = new MathLib.Vector.zero(3);
  equal(v.isZero(), true, 'testing zero vector');
});
