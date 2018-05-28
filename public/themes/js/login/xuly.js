var socket = io('http://localhost:3000');
// var socket = io('https://dev.deployapp.net');
socket.on('user-online', function() {
    $('#accessfuntionlogin').hide();
    $('#accessfuntionlogout').show();
});