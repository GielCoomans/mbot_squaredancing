var five = require("johnny-five");
var pixel = require("node-pixel");
var temporal = require("temporal");

var max_speed_l = 255;
var max_speed_r = 245;

var board = new five.Board({port: process.argv[2]});

var l_motor = r_motor = null;
var fps = 50;

board.on("ready", function (err) {
    if (err) {
        console.log(err);
        return;
    }

    l_motor = new five.Motor({pins: {pwm: 6, dir: 7}});
    r_motor = new five.Motor({pins: {pwm: 5, dir: 4}});

    strip = new pixel.Strip({
        data: 13,
        length: 2,
        board: this,
        controller: "FIRMATA"
    });

    strip.on("ready", function () {


        var colors = ["#440000", "#000044"];
        var current_colors = [0, 1];
        var current_pos = [0, 1];
        var blinker = setInterval(function () {

            strip.color("#000"); // blanks it out
            for (var i = 0; i < current_pos.length; i++) {
                if (++current_pos[i] >= strip.stripLength()) {
                    current_pos[i] = 0;
                    if (++current_colors[i] >= colors.length) current_colors[i] = 0;
                }
                strip.pixel(current_pos[i]).color(colors[current_colors[i]]);
            }
            strip.show();
        }, 1000 / fps);

    });


    l_motor.reverse(max_speed_l);
    r_motor.forward(max_speed_r);

    temporal.queue([
        {
            delay: 2500,
            task: function() {
                console.log('time to turn!');
                l_motor.forward(100);
                r_motor.forward(100);
            }
        },
        {
            delay: 800,
            task: function() {
                console.log('rechtdoor');
                l_motor.reverse(max_speed_l);
                r_motor.forward(max_speed_r);
            }
        },
        {
            delay: 2500,
            task: function() {
                console.log('time to turn!');
                l_motor.forward(100);
                r_motor.forward(100);
            }
        },
        {
            delay: 800,
            task: function() {
                console.log('rechtdoor');
                l_motor.reverse(max_speed_l);
                r_motor.forward(max_speed_r);
            }
        },
        {
            delay: 2500,
            task: function() {
                console.log('time to turn!');
                l_motor.forward(100);
                r_motor.forward(100);
            }
        },
        {
            delay: 800,
            task: function() {
                console.log('rechtdoor');
                l_motor.reverse(max_speed_l);
                r_motor.forward(max_speed_r);
            }
        },
        {
            delay: 2500,
            task: function() {
                console.log('stop');
                l_motor.stop();
                r_motor.stop();
            }
        }
    ]);
    console.log("Press Ctrl + c twice to quit.");
});