console.log("in worker... how to do mesages now...");
var interval = null;
var checkTheQue = function() {
	clearInterval(interval);
	interval = setInterval(function() {
		console.log("I'm checking the que every 3 seconds or so... do I have internet conneciton? If yes, start trying to send from the que - upon sccessful email sending - remove from que and move on to the next..");
	}, 3000);
};
self.addEventListener('message', function(e) {
	checkTheQue();
	// self.postMessage(e.data);
}, false);