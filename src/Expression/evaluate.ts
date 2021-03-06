/**
 * Evaluates the symbolic expression
 *
 * @return {any}
 */
evaluate() : any {

	if (this.subtype === 'binaryOperator') {
		return MathLib[this.name].apply(null, this.content.map(x => x.evaluate()));
	}
	if (this.subtype === 'brackets') {
		return this.content.evaluate();
	}
	if (this.subtype === 'complexNumber') {
		if (this.mode === 'cartesian') {
			return new MathLib.Complex(this.value[0].evaluate(), this.value[1].evaluate());
		}
		else if (this.mode === 'polar') {
			return MathLib.Complex.polar(this.value[0].evaluate(), this.value[1].evaluate());
		}
	}
	if (this.subtype === 'constant') {
		if (this.value === 'false') {
			return false;
		}
		if (this.value === 'pi') {
			return Math.PI;
		}
		if (this.value === 'true') {
			return true;
		}
	}
	if (this.subtype === 'functionCall') {
		if (this.isMethod) {
			var args = this.content.map(x => x.evaluate()),
					_this = args.shift();

			return _this[this.value].apply(_this, args);
		}
		else {
			return MathLib[this.value].apply(null, this.content.map(x => x.evaluate()));
		}
	}
	if (this.subtype === 'functionDefinition') {
		return MathLib.Functn(this.content[0].evaluate(), {
			name: 'f', 
			expression: this.value
		});
	}
	if (this.subtype === 'matrix') {
		return new MathLib.Matrix(this.value.map(r => r.map(c => c.evaluate())));
	}
	if (this.subtype === 'number') {
		return parseFloat(this.value);
	}
	if (this.subtype === 'naryOperator') {
		return MathLib[this.name].apply(null, this.content.map(x => x.evaluate()));
	}
	if (this.subtype === 'rationalNumber') {
		return new MathLib.Rational(this.value[0].evaluate(), this.value[1].evaluate());
	}
	if (this.subtype === 'set') {
		return new MathLib.Set(this.value.map(x => x.evaluate()));
	}
	if (this.subtype === 'string') {
		return this.value;
	}
	if (this.subtype === 'variable') {
		if (this.value in MathLib.Expression.variables) {
			return MathLib.Expression.variables[this.value];
		}
		return this;
	}
	if (this.subtype === 'vector') {
		return new MathLib.Vector(this.value.map(x => x.evaluate()));
	}
	if (this.subtype === 'unaryOperator') {
		if (this.value === '-') {
			return MathLib.negative(this.content.evaluate())
		}
		return this.content.evaluate();
	}

}