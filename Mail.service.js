var app = app || {};
(function() {
    var MailService = function() {
        this.message = {
            "success": "Sent!",
            "error": "An error occured"
        };
    };
    var p = MailService.prototype;
    p.isConnected = function() {
        return !(Math.random() + .5 | 0);
    }
    p.send = function(data, cb) {
        var me = this;
        if (this.isConnected) {
            //Simulate mail api
            setTimeout(function() {
                var res = !(Math.random() + .5 | 0);
                console.info("SIM: " + data + " did send?: " + res)
                cb((res ? me.message.success : false));
            }, 2000);
        } else {
            cb((false));
        }
    }
    app.MailService = new MailService();
})();