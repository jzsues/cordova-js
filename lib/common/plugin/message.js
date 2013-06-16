/**
 * Created with JetBrains WebStorm.
 * User: jiangzm
 * Date: 13-6-16
 * Time: 下午2:05
 * To change this template use File | Settings | File Templates.
 */

var cordova = require('cordova'),
    exec = require('cordova/exec');

function handlers() {
    return message.channels.messageready.numHandlers;
}

var eventName = "messageready";


var pluginName = "Message";


var EventType = {
    connect: "connect",
    login: "login",
    disconnect: "disconnect"

};


var EventResult = {
    success: "success",
    error: "error"
};

var Message = function () {
    this.channels = {
        messageready: cordova.addWindowEventHandler("messageready")
    };
    for (var key in this.channels) {
        this.channels[key].onHasSubscribersChange = Message.onHasSubscribersChange;
    }
    //console.log("Message init success, event name:" + eventName);
};

Message.onHasSubscribersChange = function () {
    //console.log("Message onHasSubscribersChange, this.numHandlers :" + this.numHandlers +",handlers():"+handlers());
    if (this.numHandlers === 1 && handlers() === 1) {
        exec(message._connect_status, message._connect_error, pluginName, EventType.connect, []);
    } else if (handlers() === 0) {
        exec(message._disconnect_status, message._disconnect_error, pluginName, EventType.disconnect, []);
    }
};


Message.prototype._connect_status = function (info) {
    console.log("connect success info:" + info);
    exec(message._login_status, message._login_error, pluginName, EventType.login, []);
};

Message.prototype._connect_error = function (e) {
    console.log("Error Message connect event: " + e);
};

Message.prototype._login_status = function (info) {
    console.log("login success info:" + info);
    if (info) {
        cordova.fireWindowEvent(eventName, info);
    }
};

Message.prototype._login_error = function (e) {
    console.log("Error Message login event: " + e);
};

Message.prototype._disconnect_status = function (info) {
    console.log("Message disconnect success info:" + info);
};

Message.prototype._disconnect_error = function (e) {
    console.log("Error Message disconnect event: " + e);
};

var message = new Message();