var app = app || {};
(function() {
	var worker = new Worker('queueChecker.js');
	worker.addEventListener('message', function(e) {
		console.log('Worker said: ', e.data);
	}, false);

	

	var buttons = document.getElementsByClassName("actionButton");
	for (var i = 0, len = buttons.length; i < len; i++) {
		buttons[i].addEventListener("click", handleClick);
	}

	var action = {};
	action.sendMail = function() {
		worker.postMessage('Hello World'); // Send data to our worker.
		var data = prompt("enter your email");
		if (data) {
			app.QueueService.set({
				"sendTo": data,
				"cart": [{
					"cartThing 1": "cartthing1 price"
				}, {
					"cartThing 2": "cartthing2 price"
				}]
			}, function(data) {
				alert(data);
			});
		}

	};
	action.getAll = function() {
		var all = app.QueueService.getAll();
		console.log(all);
	};


	function handleClick(e) {
		action[e.target.id]();
	}
})();

(function() {
	var QueueService = function() {
		this.ls = localStorage;
		this.key = "dci_mailQue";
	};

	var p = QueueService.prototype;

	p.set = function(data, cb) {
		var key = Math.random().toString(36).slice(2) + "--" + (new Date().toString()).replace(/\s+/g, '');
		var allOfIt = this.getAll(this.key);
		allOfIt[key] = data;
		this.ls.setItem(this.key, JSON.stringify(allOfIt));
		cb("Limited internet connection - we will send you're email as soon as we connect.  Thanks!");
	};

	p.getAll = function(key) {
		key = key || this.key;
		var allOfIt = this.ls.getItem(key);
		return (allOfIt ? JSON.parse(allOfIt) : {});
	};

	// p.remove = function(id, cb) {
	// 	if (this.queueFile[id]) {
	// 		delete this.queueFile[id];
	// 	}
	// 	this.WS.writer(this.queuePath, JSON.stringify(this.queueFile, null, 2), cb);
	// };
	// p.get = function(id, cb) {
	// 	var messageInQueue = this.queueFile[id];
	// 	if (messageInQueue) {
	// 		if (cb) {
	// 			cb(messageInQueue);
	// 		} else {
	// 			return messageInQueue;
	// 		}
	// 	}
	// };
	// /*returns array of keys currently in queue*/
	// p.getAllKeys = function(cb) {
	// 	var arrayOfKeys = [];
	// 	for (var key in this.queueFile) {
	// 		if (this.queueFile.hasOwnProperty(key)) {
	// 			arrayOfKeys.push(key);
	// 		}
	// 	}
	// 	if (cb) {
	// 		cb(arrayOfKeys);
	// 	} else {
	// 		return arrayOfKeys;
	// 	}
	// };
	// /*Returns the size of the queue*/
	// p.size = function(cb) {
	// 	var size = 0,
	// 		key;
	// 	for (key in this.queueFile) {
	// 		if (this.queueFile.hasOwnProperty(key)) {
	// 			size++;
	// 		}
	// 	}
	// 	if (cb) {
	// 		cb(size);
	// 	} else {
	// 		return size;
	// 	}
	// };

	app.QueueService = new QueueService();
})();