var msgUrl = 'http://127.1:8080/SpringTask1/messages';

var msgSelector = '.message';
var timeSelector = '.message-time';
var $msgTemplate = $('#msg-template').clone();
var $messages = $("#messages");

$msgTemplate.removeAttr('id');
$msgTemplate.removeAttr('style');

$(function() {
 fetchAllMessages();
 $('#sendMessageBtn').click(function() {
    sendMessage();
 });
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