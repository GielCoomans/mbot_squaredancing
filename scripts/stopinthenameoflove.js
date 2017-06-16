var five = require("johnny-five");
var temporal = require("temporal");

var max_speed_l = 255;
var max_speed_r = 245;

var board = new five.Board({port: process.argv[2]});

var l_motor = r_motor = null;

    board.on("ready", function(err) {



            if (err) {
                    console.log(err);
                    return;
                    };

            l_motor = new five.Motor({pins: {pwm: 6, dir: 7}});
            r_motor = new five.Motor({pins: {pwm: 5, dir: 4}});

            // move forward
            l_motor.reverse(255);
            r_motor.forward(255);

        var proximity = new five.Proximity({
            freq: 100,
            controller: "HCSR04",
            pin: 10
            });

            //stop when necesary
            proximity.on("data", function() {
                console.log("cm: ", this.cm);

                if(this.cm < 20.0){
                l_motor.stop();
                r_motor.stop();
                console.log("im stopping");
                process.exit();
                }
            });

            console.log("Press Ctrl + c twice to quit.");

    });