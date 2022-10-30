console.log(a);

const x = a * 10;

({
	multiply(a, b) {
		return a * b;
	},

	async multiplyBy50(num) {
		return x * num;
	},

	collection: new Map(),
});