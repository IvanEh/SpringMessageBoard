var msgUrl = 'http://localhost:8080/SpringTask1/messages';
var sockUrl = 'http://localhost:8080/SpringTask1/sampleSock?username=';

var msgSelector = '.message';
var timeSelector = '.message-time';
var $msgTemplate = $('#msg-template').clone();
var $messages = $("#messages");
var $onlineCounter = $('#online-counter');
var $notifBubble = $('#notification-bubble');
var $notifMessage = $('#notification-message');

$msgTemplate.removeAttr('id');
$msgTemplate.removeAttr('style');

$(function() {
 var onlineCount = 0;
 var sock = new SockJS(sockUrl + getQueryParam('username'));
 var notif = false;
 var notifTime = 0;
 var notifDuration = 8000;

 fetchAllMessages();

 $('#sendMessageBtn').click(function() {
    sendMessage();
 });


 var handlers = {
    "online": function(msg) { onlineCount = msg; updateOnlineCounterUi(); },
    "logged": function(msg) { onlineCount++; updateOnlineCounterUi(); pushLoggedInNotification(msg); },
    "signout": function(msg) { onlineCount--; updateOnlineCounterUi(); }
 };

 sock.onmessage= function(e) {
    var msgs = JSON.parse(e.data);

    Object.keys(msgs).forEach(function(msgType) {handlers[msgType](msgs[msgType])});
 }

 function updateOnlineCounterUi() {
    $onlineCounter.html(onlineCount);
 }

 function pushLoggedInNotification(user) {
    var msg = 'User <mark>' + user + '</mark> has logged in';
    pushNotification(msg);
 }

 function pushNotification(msg) {
    if(notif == true) {
        $notifMessage.fadeOut(250);
        $notifMessage.html(msg);
        $notifMessage.fadeIn(250);
    } else {
        $notifBubble.css('right', '2%');
        $notifMessage.html(msg);
    }
    notif = true;
    notifTime += notifDuration;

    (function scheduleNotificationHiding(duration) {
        setTimeout(function() {
            $notifBubble.css('right', '-25%');
            notif = false;
            notifTime -= duration;
            if(notifTime > 0) {
                scheduleNotificationHiding(notifTime);
            }
        }, notifTime)
    })(notifTime);
 }

})

function ajaxMessages() {
    return $.ajax({
        url: msgUrl,
        method: 'GET',
        contentType: 'application/json',
    });
}

function ajaxMessage(id) {
   return $.ajax({
        url: msgUrl + '/' + id,
        method: 'GET',
        contentType: 'application/json',
    });
}

function sendMessage() {
    var msg = $('#msg-text').val();

    console.log(msg);

    $.ajax({
        url: msgUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({text: msg})
    }).done(function(data) {
        addMessage(data);
    });

}

function fetchAllMessages() {
    ajaxMessages()
      .done(function(msgs) {
        msgs.forEach(addMessage);
      });
}

function addMessage(msg) {
    $msg = $msgTemplate.clone();
    $msg.find(msgSelector).html(msg.text);
    $messages.prepend($msg);
    $msg.find(timeSelector).html(getDateFromTimestamp(msg.timestamp.epochSecond));
}

function getDateFromTimestamp(timestamp) {
    var date = new Date(timestamp*1000);
    return $.format.date(date, 'dd-MM-yy HH:mm');
}

function getQueryParam(param) {
    location.search.substr(1)
        .split("&")
        .some(function(item) { // returns first occurence and stops
            return item.split("=")[0] == param && (param = item.split("=")[1])
        })
    return param
}