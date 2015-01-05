/**
 * Created by jeremyrobles on 1/4/15.
 */
//This is the UI file that governs all the click functions and crap

var socket = io.connect('http://localhost');

socket.on('news', function (data) {
    console.log(data);
});

socket.on('sensor', function (data) {
    console.log("Incoming sensor data:",data.raw);
    $("#inData").append(data.raw+"\r");
    $("#inData").animate({scrollTop:$("#inData")[0].scrollHeight - $("#inData").height()},1);
    $('#submitData').on('click',function(){
        var tmp = parseInt($('#inData').val(),10);
        console.log("Setting Analog Delay:",tmp)
        socket.emit('analogDelay',{delay:tmp});
    });
});

$('.servobtn').button();

$('.servobtn').on('change',function(){
    console.log("Setting Servo Pos:",$('input[name=servo1]:checked').val())
    socket.emit('servo1',{pos:$('input[name=servo1]:checked').val()});
});

$('.servobtn').on('change',function(){
    console.log("Setting Servo Pos:",$('input[name=servo2]:checked').val())
    socket.emit('servo2',{pos:$('input[name=servo2]:checked').val()});
});

$('#ledSet').on('click',function(){
    var tmp = parseInt($('#ledDelay').val(),10);
    console.log("Setting LED Delay:",tmp)
    socket.emit('led',{delay:tmp});
});

