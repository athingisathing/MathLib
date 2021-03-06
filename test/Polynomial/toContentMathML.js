test('.toContentMathML()', 2, function () {
	var p = new MathLib.Polynomial([1, 2, 3]),
			q = new MathLib.Polynomial([-1, 0, 1]);
	deepEqual(p.toContentMathML(), '<apply><csymbol cd="arith1">plus</csymbol><apply><csymbol cd="arith1">times</csymbol><cn>3</cn><apply><csymbol cd="arith1">power</csymbol><ci>x</ci><cn>2</cn></apply></apply><apply><csymbol cd="arith1">times</csymbol><cn>2</cn><ci>x</ci></apply><cn>1</cn></apply>', '.toContentMathML()');
	deepEqual(q.toContentMathML(), '<apply><csymbol cd="arith1">plus</csymbol><apply><csymbol cd="arith1">times</csymbol><cn>1</cn><apply><csymbol cd="arith1">power</csymbol><ci>x</ci><cn>2</cn></apply></apply><cn>-1</cn></apply>', '.toContentMathML()');
});