var app = app || {};
(function() {
    var QueueService = function() {
        this.ls = localStorage;
        this.key = "dci_mailQue";
        this.message = {
            "success": "Sent!",
            "error": "AN error occured"
        };
    };
    var p = QueueService.prototype;
    p.get = function(k) {
        var allOfIt = this.ls.getItem(this.key);
        if (k && allOfIt) {
            console.log(k,allOfIt)
            alert(k)
            allOfIt = allOfIt[k];
        }
        return (allOfIt ? JSON.parse(allOfIt) : {});
    };
    p.isEmpty = function(obj) {
        obj = obj || this.get();
        return (Object.keys(obj).length === 0 && obj.constructor === Object);
    };
    p.getByField = function(field, value) {
        var queue = this.get(this.key);
        for (var key in queue) {
            if (queue[key][field] === value) {
                return key;
            }
        }
        return false;
    };
    p.makeKey = function() {
        return (Math.random().toString(36).slice(2) + "--" + (new Date().toString()).replace(/\s+/g, ''));
    };
    p.set = function(data, cb) {
        data = data || {};
        var queue = this.get();
        if (this.isEmpty()) {
            queue[p.makeKey()] = data;
            this.ls.setItem(this.key, JSON.stringify(queue));
            cb("was empty and added");
            return true;
        }
        var objAlreadyInQueueKey = this.getByField("sendTo", data.sendTo)
        if (objAlreadyInQueueKey) {
            queue[objAlreadyInQueueKey] = data;
            this.ls.setItem(this.key, JSON.stringify(queue));
            cb("Updated Item alread in queue: " + data.sendTo);
            return true;
        } else {
            queue[p.makeKey()] = data;
            this.ls.setItem(this.key, JSON.stringify(queue));
            cb("Added to Queue");
            return true;
        }
    };
    p.remove = function(data, cb) {
        var allOfIt = this.get(this.key);
        delete allOfIt[this.getByField("sendTo", data)];
        this.ls.setItem(this.key, JSON.stringify(allOfIt));
        if (cb) {
            cb("removed");
        }
    };
    p.removeAll = function(cb) {
        this.ls.removeItem(this.key);
        if (cb) {
            cb("removed");
        }
    };
    p.next = function() {
        var allOfIt = this.get();
        for (var k in allOfIt) {
            if (allOfIt.hasOwnProperty(k)) {
                return k;
            }
        }
        return false;
    }
    // p.sendMail = function(k, cb) {
    //     var me = this;
    //     var allOfIt = me.get(me.key);
    //     var mail = allOfIt[k];
    //     if (mail) {
    //         setTimeout(function(err, data) {
    //             data = true;
    //             if (data) {
    //                 me.remove(mail.sendTo, function(res) {
    //                     console.log("Mail send and has been " + res + " from q.")
    //                     cb(me.message.success);
    //                 });
    //             } else {
    //                 cb((me.messages.error = "Error, will try to send later!"));
    //             }
    //         }, 2000);
    //     } else {
    //         cb((me.messages.error = "Error, couldn't find: " + k));
    //     }
    // }
    app.QueueService = new QueueService();
})();