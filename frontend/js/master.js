$(function() {
// Configuration
 var msgUrl = 'http://localhost:8080/SpringMessageBoard/messages';
 var sockUrl = 'http://localhost:8080/SpringMessageBoard/sampleSock?username=';
 var notifDuration = 8000;
 var msgSelector = '.message';
 var timeSelector = '.message-time';

// Cached DOM
 var $msgTemplate = $('#msg-template').clone();
 var $messages = $("#messages");
 var $onlineCounter = $('#online-counter');
 var $notifBubble = $('#notification-bubble');
 var $notifMessage = $('#notification-message');
 var $loginModal = $('#login-modal');
 var $loginButton = $('#login-button');

// Page state
 var onlineCount = 0;
 var notif = false;
 var notifTime = 0;

// Logic
 $msgTemplate.removeAttr('id');
 $msgTemplate.removeAttr('style');

 uiFetchAllMessages();

 uiLoginForm().then(initSocketNotificationService);

// Functions
 function uiFetchAllMessages() {
    ajaxFetchAllMessages()
      .done(function(msgs) {
        msgs.forEach(addMessage);
      });
 }

 function uiLoginForm() {
    return {
        then: function(cb) {
             $loginModal.modal('show');

             $loginButton.click(function() {
                $loginModal.modal('hide');
                cb($('#username').val());
             });
        }
    }
 }

 function initSocketNotificationService(username) {
     var sock = new SockJS(sockUrl + username);

     $('#sendMessageBtn').click(function() {
        sendMessage();
     });

     var messageHandlers = {
        "online":  function(msg) { onlineCount = msg; uiUpdateOnlineCounter(); },
        "logged":  function(msg) { onlineCount++; uiUpdateOnlineCounter(); pushLoggedInNotification(msg); },
        "signout": function(msg) { onlineCount--; uiUpdateOnlineCounter(); }
     };

     sock.onmessage= function(e) {
        var msgs = JSON.parse(e.data);

        Object.keys(msgs).forEach(function(msgType) { messageHandlers[msgType](msgs[msgType]) });
     }
 }

 function uiUpdateOnlineCounter() {
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

 function ajaxFetchAllMessages() {
    return $.ajax({
        url: msgUrl,
        method: 'GET',
        contentType: 'application/json',
    });
 }

 function sendMessage() {
    var msg = $('#msg-text').val();

    ajaxSendMessage(msg).done(function(data) {
        addMessage(data);
    });
 }

 function ajaxSendMessage(msg) {
     return $.ajax({
        url: msgUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({text: msg})
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
});
