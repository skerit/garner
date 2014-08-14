var Garner,
    base,
    src;

Garner = function Garner(fnc, context, callback) {

	var that = this;

	// Store the main function
	this.fnc = fnc;

	// Store the context
	this.context = context;

	// Create the exists object
	this.exists = {};

	// Create the values object
	this.values = {};

	// Store the callback, if there is one
	if (typeof callback == 'function') {
		this.callback = callback;
	} else {
		this.callback = false;
	}
};

/**
 * This function will be called back after yielded calls and store
 * the result
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Garner.prototype._next = function _next(err, result) {

	// If the function calls back with an error, end the garnering
	if (err) {
		if (that.callback) {
			that.callback(err);
		} else {
			throw err;
		}
	} else {
		this[this.current] = result;
		this.continue();
	}
};

/**
 * Do we need to run the code attached to this variable name?
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
	var that = this, args, len, i;

	len = arguments.length;
	args = new Array(len);

	for (i = 1; i < len; i++) {
		args[i-1] = arguments[i];
	}

	if (!this.next) {
		this.next = function next() {
			that._next.apply(that, arguments);
		};
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
	try {
		this.fnc.apply(this.context, this.args);
	} catch(err) {
		if (this.callback) {
			this.callback(err);
		}
	}
};

/**
 * The base function
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 */
base = function() {

	var self,
	    args,
	    last,
	    len,
	    cb,
	    i;

	last = arguments.length;
	len = last+1;
	args = new Array(len);

	for (i = 1; i < len; i++) {
		args[i] = arguments[i-1];
	}

	cb = args[last];

	// Create the new self
	self = new Garner(fnc, this, cb);

	args[0] = self;
	self.args = args;

	self.continue();
};

// The source of the base, without 'function '
var src = (''+base).slice(9);

/**
 * Create a garnered function
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Garner.create = function create(fnc) {

	var compiled;

	eval('compiled = function ' + (fnc.name||'') + src);

	return compiled;
};

module.exports = Garner;