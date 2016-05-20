
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
}

NLoop.prototype.addEventListener = function(type, listener) {
	if(!this.subscribers[type]) {
		this.subscribers[type] = [];
	}
	this.subscribers[type].push(listener);
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
}

NLoop.prototype.run = function() {
	var tempLoop = this.root.currentLoop;
	this.root.currentLoop.step();
}

NLoop.prototype.step = function() {
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
}

NLoop.prototype.reset = function() {
	this.i = this.min;
	if(this.child) {
		this.child.reset();
	}
}

NLoop.prototype.log = function(msg) { 
	console.log("Loop " + this.id + " - " + msg);
}

var loop1 = new NLoop(0,2, function(i, data){ console.log("A " + i); }, 1);
var loop2 = new NLoop(0,2, function(i, data){ console.log("   B " + i); }, 2);
var loop3 = new NLoop(0,2, function(i, data){ console.log("   	   C" + i); }, 3);
var loop4 = new NLoop(0,6, function(i, data){ console.log("   	    	D" + i); }, 4);

loop1.add(loop2);
loop2.add(loop3);
loop3.add(loop4);

loop1.addEventListener("COMPLETE", completeHandler);

function completeHandler(event) {
	alert("COMPLETE EVENT HEARD");
	clearInterval(interval);
}

var interval = setInterval(function() { loop1.run() }, 10);



