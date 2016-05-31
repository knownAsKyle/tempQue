var app = app || {};
app.QueueService = app.QueueService || {};
app.MailService = app.MailService || {};
(function() {
    // var worker = new Worker('queueChecker.js');
    // worker.addEventListener('message', function(e) {
    // 	console.log('Worker said: ', e.data);
    // 	if(e.data.startsWith("-D")){
    // 		app.QueueService.remove(e.data.substring(2))
    // 	}
    // }, false);
    // worker.postMessage(app.QueueService.get()); 
    var mockData = {
        "cart": [{
            "cartThing 1": "cartthing1 price"
        }, {
            "cartThing 2": "cartthing2 price"
        }]
    };
    var buttons = document.getElementsByClassName("actionButton");
    for (var i = 0, len = buttons.length; i < len; i++) {
        buttons[i].addEventListener("click", handleClick);
    }
    var action = {};
    action.addToQue = function() {
        var data = prompt("enter your email");
        if (data) {
            //Validate Data
            mockData.sendTo = data;
            app.QueueService.set(mockData, setResponse);
        }

        function setResponse(data) {
            alert(data);
        }
    };
    action.getAll = function() {
        var all = app.QueueService.get();
        console.log(all);
    };
    action.remove = function() {
        var data = prompt("enter email");
        if (data) {
            app.QueueService.remove(data, res);
        }

        function res(data) {
            console.log(data);
        }
    }
    action.removeAll = function() {
        app.QueueService.removeAll(res);

        function res(data) {
            console.log(data);
        }
    }
    action.sendMail = function() {
        var me = this;
        var mailToSend = app.QueueService.next();
        if (mailToSend) {
            // console.log("sending:", mailToSend)
            app.MailService.send(mailToSend, function(data) {
                console.log(data, mailToSend);
                var t = app.QueueService.get(mailToSend).sendTo;
                console.log(t)
                if (data) {
                    app.QueueService.remove(t, function(d) {
                        if (d) {
                        	console.log(me)
                            // me.sendMail();
                        }
                    });
                    // app.QueueService.sendMail(mailToSend, sendMailResponse);
                }
            });
        } else {
            alert("no more mail in que!")
        }
    }

    function handleClick(e) {
        action[e.target.id]();
    }
})();