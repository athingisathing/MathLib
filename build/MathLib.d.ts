declare module MathLib {
    class Expression {
        public type: string;
        public arguments: string[];
        public content: any;
        public isMethod: boolean;
        public mode: string;
        public name: string;
        public subtype: string;
        public value: any;
        constructor(expr?: {});
        public compare(e);
        static constant(n): Expression;
        public evaluate(): any;
        public map(f): Expression;
        static number(n): Expression;
        static parse: (str: any) => any;
        static parseContentMathML(MathMLString): Expression;
        public toContentMathML(): string;
        public toLaTeX(opts?: {}): string;
        public toMathML(): string;
        public toString(): string;
        static variable(n): Expression;
        static variables: {};
    }
    class Screen {
        public type: string;
        public container: any;
        public figure: any;
        public wrapper: any;
        public contextMenu: any;
        public contextMenuOverlay: any;
        public height: number;
        public width: number;
        public origHeight: number;
        public origWidth: number;
        public options: any;
        public renderer: any;
        public element: any;
        public innerHTMLContextMenu: string;
        public camera: any;
        constructor(id: string, options?: {});
        public oncontextmenu(evt): void;
    }
    class Layer {
        public ctx: any;
        public element: any;
        public id: string;
        public screen: any;
        public zIndex: number;
        public stack: any;
        public transformation: any;
        public applyTransformation: any;
        public draw: any;
        public circle: any;
        public line: any;
        public path: any;
        public pixel: any;
        public point: any;
        public text: any;
        constructor(screen, id: string, zIndex);
        public clear(): Layer;
    }
    class Screen2D extends Screen {
        public type: string;
        public applyTransformation: any;
        public background: any;
        public renderer: any;
        public axis: any;
        public grid: any;
        public layer: any;
        public element: any;
        public init: any;
        public redraw: any;
        public draw: any;
        public circle: any;
        public line: any;
        public path: any;
        public pixel: any;
        public point: any;
        public text: any;
        public transformation: any;
        public translation: any;
        public scale: any;
        public lookAt: any;
        public range: any;
        public interaction: any;
        public zoomSpeed: any;
        constructor(id: string, options?: {});
        public drawAxis(): Screen2D;
        public drawGrid(): Screen2D;
        public getEventPoint(evt);
        public getLineEndPoints(l);
        public onmousedown(evt): void;
        public onmousemove(evt): void;
        public onmouseup(evt): void;
        public onmousewheel(evt): void;
        public resize(width: number, height: number): Screen2D;
    }
    class Screen3D extends Screen {
        public type: string;
        public grid: any;
        public axis: any;
        public render: any;
        public camera: any;
        public element: any;
        public scene: any;
        constructor(id: string, options?: {});
        public drawGrid(): Screen3D;
        public parametricPlot3D(f, options): Screen3D;
        public plot3D(f, options): Screen3D;
        public resize(width: number, height: number): Screen3D;
        public surfacePlot3D(f, options): Screen3D;
    }
    class Vector {
        public type: string;
        public length: number;
        constructor(coords: number[]);
        static areLinearIndependent: (v: Vector[]) => boolean;
        public compare(v: Vector): number;
        public every(f: (value: any, index: number, vector: Vector) => boolean): boolean;
        public forEach(f: (value: any, index: number, vector: Vector) => void): void;
        public isEqual(v: Vector): boolean;
        public isZero(): boolean;
        public map(f: (value: any, index: number, vector: Vector) => any): any;
        public minus(v: Vector): Vector;
        public negative(): Vector;
        public norm(p?: number): number;
        public outerProduct(v: Vector): Matrix;
        public plus(v: Vector): Vector;
        public reduce(...args: any[]): any;
        public scalarProduct(v: Vector): any;
        public slice(...args: any[]): any[];
        public times(n: any): any;
        public toArray(): any[];
        public toContentMathML(): string;
        public toLaTeX(): string;
        public toMathML(): string;
        public toString(): string;
        public vectorProduct(v: Vector): Vector;
        static zero: (n: number) => Vector;
    }
    class Circle {
        public type: string;
        public center: Point;
        public radius: number;
        constructor(center: any, radius: number);
        public area(): number;
        public circumference(): number;
        public compare(c: Circle): number;
        public draw(screen, options): Circle;
        public isEqual(c: Circle): boolean;
        public positionOf(p): string;
        public reflectAt(a): Circle;
        public toLaTeX(): string;
        public toMatrix(): Matrix;
    }
    class Complex {
        public type: string;
        public re: number;
        public im: number;
        constructor(re: number, im?: number);
        static infinity: string;
        public abs(): number;
        public arccos(): Complex;
        public arccot(): Complex;
        public arccsc(): Complex;
        public arcsin(): Complex;
        public arctan(): Complex;
        public arg(): number;
        public artanh(): Complex;
        public compare(x): number;
        public conjugate(): Complex;
        public copy(): Complex;
        public cos(): Complex;
        public cosh(): Complex;
        public divide(c): Complex;
        public exp(): Complex;
        public inverse(): Complex;
        public isEqual(n): boolean;
        public isFinite(): boolean;
        public isOne(): boolean;
        public isReal(): boolean;
        public isZero(): boolean;
        public ln(): Complex;
        public minus(c): Complex;
        public negative(): Complex;
        static one: Complex;
        public plus(c): Complex;
        static polar: (abs: any, arg: any) => Complex;
        public pow(n): Complex;
        public sign(): Complex;
        public sin(): Complex;
        public sinh(): Complex;
        public sqrt(): Complex;
        public times(c): Complex;
        public toContentMathML(): string;
        public toLaTeX(): string;
        public toMathML(): string;
        public toMatrix(): Matrix;
        public toPoint(): Point;
        public toString(): string;
        static zero: Complex;
    }
    class Line extends Vector {
        public type: string;
        public dimension: number;
        constructor(coords: number[]);
        public draw(screen, options): Line;
        public isEqual(q: Line): boolean;
        public isFinite(): boolean;
        public isOrthogonalTo(l: Line): boolean;
        public isParallelTo(l: Line): boolean;
        public meet(l: Line, dyn?: boolean): Point;
        public normalize(): Line;
    }
    class Matrix {
        public type: string;
        public length: number;
        public cols: number;
        public rows: number;
        public LUpermutation: Permutation;
        constructor(matrix);
        public LU();
        public adjoint(): Matrix;
        public adjugate(): Matrix;
        public cholesky(): Matrix;
        public compare(m: Matrix): number;
        public copy(): Matrix;
        public determinant(): any;
        public diag(): any[];
        public divide(n: any): Matrix;
        public every(f): boolean;
        public forEach(f): void;
        public gershgorin(): any[];
        public givens(): any[];
        static givensMatrix: (n: any, i: any, k: any, phi: any) => any;
        static identity: (n: any) => any;
        public inverse(): Matrix;
        public isBandMatrix(l, u): boolean;
        public isDiag(): boolean;
        public isEqual(x): boolean;
        public isIdentity(): boolean;
        public isInvertible(): boolean;
        public isLower(): boolean;
        public isNegDefinite(): boolean;
        public isOrthogonal(): boolean;
        public isPermutation(): boolean;
        public isPosDefinite(): boolean;
        public isReal(): boolean;
        public isScalar(): boolean;
        public isSquare(): boolean;
        public isSymmetric(): boolean;
        public isUpper(): boolean;
        public isVector(): boolean;
        public isZero(): boolean;
        public map(f);
        public minor(r, c);
        public minus(m);
        public negative();
        static numbers: (n: any, r: any, c: any) => any;
        static one: (r: any, c: any) => any;
        public plus(m);
        static random: (r: any, c: any) => any;
        public rank(): number;
        public reduce(...args: any[]);
        public remove(row, col);
        public rref();
        public slice(...args: any[]);
        public solve(b);
        public some(f): boolean;
        public times(a);
        public toArray();
        public toColVectors(): string;
        public toComplex(): Complex;
        public toContentMathML(): string;
        public toLaTeX(): string;
        public toMathML(): string;
        public toRowVectors(): string;
        public toString(): string;
        public trace();
        public transpose(): Matrix;
        static zero: (r: any, c: any) => any;
    }
    class Permutation {
        public type: string;
        public length: number;
        public cycle: any[];
        constructor(p);
        public applyTo(n: any): any;
        public compare(p: Permutation): number;
        static cycleToList(cycle: any): number[];
        static id: Permutation;
        public inverse(): Permutation;
        static listToCycle(list: number[]): any;
        public map(...args: any[]): Permutation;
        public sgn(): number;
        public times(p: Permutation): Permutation;
        public toMatrix(n: number): Matrix;
        public toString(): string;
    }
    class Point extends Vector {
        public dimension: number;
        constructor(coords: number[]);
        static I: Point;
        static J: Point;
        public crossRatio(a: Point, b: Point, c: Point, d: Point): number;
        public distanceTo(point: Point): number;
        public draw(screen, options): Point;
        public isEqual(q: Point): boolean;
        public isFinite(): boolean;
        public isInside(a: Circle): boolean;
        public isOn(a: Circle): boolean;
        public isOutside(a: Circle): boolean;
        public lineTo(q: Point, dyn?: boolean): Line;
        public normalize(): Point;
        public reflectAt(a: Point): Point;
        public toComplex(): Complex;
        public toLaTeX(opt?: boolean): string;
        public toMathML(opt?: boolean): string;
        public toString(opt?: boolean): string;
    }
    class Polynomial {
        public type: string;
        public deg: number;
        public length: number;
        public subdeg: number;
        constructor(polynomial);
        public compare(p: Polynomial): number;
        public differentiate(n?: number): Polynomial;
        public draw(screen, options): Polynomial;
        public every(f: (value: any, index: number, vector: Vector) => boolean): boolean;
        public forEach(...args: any[]): void;
        public integrate(n?: number): Polynomial;
        static interpolation(a, b);
        public isEqual(p: Polynomial): boolean;
        public map(f): Polynomial;
        public negative(): Polynomial;
        static one: Polynomial;
        public plus(a): Polynomial;
        static regression(x, y): Polynomial;
        static roots(zeros): Polynomial;
        public slice(...args: any[]): any[];
        public times(a): Polynomial;
        public toContentMathML(math): string;
        public toExpression(): Expression;
        public toFunctn();
        public toLaTeX(): string;
        public toMathML(math): string;
        public toString(opt): string;
        public valueAt(x);
        static zero: Polynomial;
    }
    class Rational {
        public type: string;
        public numerator: number;
        public denominator: number;
        constructor(numerator: number, denominator?: number);
        public compare(r: Rational): number;
        public divide(r);
        public inverse(): Rational;
        public isEqual(r): boolean;
        public isZero(): boolean;
        public minus(r);
        public negative(): Rational;
        public plus(r);
        public reduce(): Rational;
        public times(r);
        public toContentMathML(): string;
        public toLaTeX(): string;
        public toMathML(): string;
        public toNumber(): number;
        public toString(): string;
    }
    class Set {
        public type: string;
        public length: number;
        public card: number;
        constructor(elements);
        public compare(x: any): number;
        public every(...args: any[]): boolean;
        public filter(...args: any[]): Set;
        public forEach(...args: any[]): void;
        static fromTo: (f: number, t: number, s?: number) => Set;
        public indexOf(...args: any[]): number;
        public insert(x: any): Set;
        public intersect: (a: any) => any;
        public isEmpty(): boolean;
        public isEqual(x: Set): boolean;
        public isSubsetOf(a: Set): boolean;
        public locate(x: any): number;
        public map(...args: any[]): any;
        public plus(n: any): any;
        public powerset(): Set;
        public reduce(...args: any[]): any;
        public remove(a: any): Set;
        static createSetOperation: (left: any, both: any, right: any) => (a: any) => any;
        public slice(...args: any[]): any;
        public some(...args: any[]): boolean;
        public splice(...args: any[]): any;
        public times(n: any): any;
        public toArray(): any[];
        public toContentMathML(): string;
        public toLaTeX(): string;
        public toMathML(): string;
        public toString(): string;
        public union: (a: any) => any;
        public without: (a: any) => any;
        public xor: (a: any) => any;
    }
}
