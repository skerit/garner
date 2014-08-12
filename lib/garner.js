var Garner;

Garner = function Garner(fnc) {

	var that = this;

	// Store the main function
	this.fnc = fnc;

	// Create the exists object
	this.exists = {};

	// Bind the next function
	this.next = function next() {

		// Do not leak the arguments object
		var args, len, i;

		len = arguments.length;
		args = new Array(len);

		for (i = 0; i < len; i++) {
			args[i] = arguments[i];
		}

		// Call next
		that._next(that, args);
	};
};

/**
 * This function will be called back after yielded calls and store
 * the result
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Garner.prototype._next = function _next(that, args) {

	that[that.current] = args[1];

	that.continue();
};

/**
 * Does we need to run the code attached to this variable name?
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Garner.prototype.var = function declare(name) {

	if (this.exists[name]) {
		return false;
	}

	this.current = name;
	this.exists[name] = true;

	return true;
};

/**
 * Does we need to run the code attached to this variable name?
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Garner.prototype.yield = function doYield(fnc) {

	// Do not leak the arguments object
	var args, len, i;

	len = arguments.length;
	args = new Array(len);

	for (i = 1; i < len; i++) {
		args[i-1] = arguments[i];
	}

	// Add the callback
	args[len-1] = this.next;

	fnc.apply(null, args);
};

/**
 * Continue the code
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Garner.prototype.continue = function doContinue(fnc) {
	this.fnc.apply(this.context, this.args);
};

/**
 * Create a garnered function
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Garner.create = function create(fnc) {

	return function() {

		var self,
		    args,
		    len,
		    i;

		// Create the new self
		self = new Garner(fnc, this);

		len = arguments.length+1;
		args = new Array(len);

		for (i = 1; i < len; i++) {
			args[i] = arguments[i-1];
		}

		args[0] = self;

		self.args = args;
		self.context = this;
		self.continue();
	};
};

module.exports = Garner;