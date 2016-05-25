
NLoop = function (min, max, method, id) {
	this.id = id;
	this.min = min;
	this.max = max;
	this.method = method;
	this.i = this.min;
	this.parent = null;
	this.child = null;
	this.currentLoop = this;
	this.root = this;
	this.subscribers = {};
	this.cycles = 0;
	this.total = 0;
	this.timeout = 0;
	this.data = {};
	this.running = false;
}

NLoop.prototype.addEventListener = function(type, listener) {
	if(!this.subscribers[type]) {
		this.subscribers[type] = [];
	}
	this.subscribers[type].push(listener);
}

NLoop.prototype.removeEventListener = function(type, listener) {
	var arr = this.subscribers[type];
	var index = arr.indexOf(listener);
	arr.splice(index, 1);
}

NLoop.prototype.dispatchEvent = function(type) {
	var arr = this.subscribers[type];
	if(arr) {
		var event = {type:type, target:this};
		for(var i=0; i<arr.length; i++) { 
			arr[i].call(this, event);
		}
	}
}



NLoop.prototype.isComplete = function() {
	return this.i == this.max;
}


NLoop.prototype.setCurrentLoop = function(loop) {
	this.root.currentLoop = loop;
}

NLoop.prototype.up = function() {
	this.root.setCurrentLoop(this.parent);
	if(this.parent && this.parent.isComplete()) {
		this.parent.up();
	}
	
	if(!this.parent) {
		this.log("Progress " + this.root.cycles + "/" + this.root.total);
		this.dispatchEvent("COMPLETE");
	}
	

}

NLoop.prototype.down = function() {
	this.root.setCurrentLoop(this.root.currentLoop.child);
}


NLoop.prototype.add = function(loop) {
	
	this.child = loop;
	loop.parent = this;
	loop.root = this.root;
	this.root.updateTotal();
}

NLoop.prototype.run = function() {
	if(this.root.currentLoop) {
		this.root.currentLoop.step();
	}
}

NLoop.prototype.step = function() {
	this.root.cycles++;
	this.method(this.i);
	this.i++;
	if(this.child) {
		this.child.reset();
	}

	if(this.i == this.max) {
		if(this.parent && !this.child) {
			this.reset();
			this.up();
		}
	}
	
	if(this.child) {
		this.down();
	}
	
	if(!this.complete) {
		this.next();
	}
}

NLoop.prototype.reset = function() {
	this.i = this.min;
	if(this.child) {
		this.child.reset();
	}
}

NLoop.prototype.updateTotal = function() {
	var loop = this;
	var raw = [];
	var sum = [];
	this.total = 0;
	do {
		var n = loop.max - loop.min;
		if(raw.length > 0) {
			sum.push(n * sum[sum.length-1]);
		}
		else {
			sum.push(n);
		}
		raw.push(n);
		loop = loop.child;
		this.total += sum[sum.length-1];
	} while(loop) 

}

NLoop.prototype.log = function(msg) { 
	console.log("Loop " + this.id + " - " + msg);
}

NLoop.prototype.start = function() { 
	this.running = true;
	this.next();
}

NLoop.prototype.pause = function() { 
	this.root.running = false;
	clearTimeout(this.root.timeout);
}



NLoop.prototype.next = function() { 
	var root = this.root;
	if(this.root.running) {
		this.root.timeout = setTimeout(function() { root.run() }, 10);
	}
}



