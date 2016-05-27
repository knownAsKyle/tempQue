console.log("Worker is ready to work!");

var queue = null;
var interval = null;
var counter = 0;

clearInterval(interval);
interval = setInterval(function() {
	counter++;
	if (checkForConnection(counter)) {
		self.postMessage("No internet connection, retrying... attempt: " + counter);
	} else {
		self.postMessage("You are connected to the internet --  attempt: " + counter);
		clearInterval(interval);
		if (checkQue()) {
			processQue();
		}
	}
}, 2000);

function checkForConnection(mock) {
	if (mock === 4) {return false;}
	return (navigator && navigator.onLine ? true : false);
}

function checkQue() {
	for (var key in queue) {
		if (queue.hasOwnProperty(key)) {return true;}
	}
	return false;
}

function processQue() {
	var k = Object.keys(queue)[0];
	//Send the object to the web service api, on OK return then remove it from the que
	self.postMessage(queue[k].sendTo + " sent!! and removed from que");
	setTimeout(function(){
		self.postMessage("-D"+k);
		delete queue[k];
		if(Object.keys(queue)[0]){
			processQue();
		}else{

		}
	},1000);
	
	
}

self.addEventListener('message', function(e) {
	queue = e.data;
}, false);
