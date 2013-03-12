test('.integrate()', 2, function () {
	var p = new MathLib.Polynomial([0, 0, 0, 1]);
	deepEqual(p.integrate(), new MathLib.Polynomial([0, 0, 0, 0, 0.25]), '.integrate()');
	deepEqual(p.integrate(2), new MathLib.Polynomial([0, 0, 0, 0, 0,  0.05]), '.integrate(2)');
});