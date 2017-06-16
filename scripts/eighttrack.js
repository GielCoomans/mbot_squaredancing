var five = require("johnny-five");

var board = new five.Board({port: process.argv[2]});

board.on("ready", function (err) {
    // log errors
    if (err) {
            console.log(err);
            return;
    }

      // motors
      var max_speed_l = 80;
      var max_speed_r = 80;
      var l_motor = r_motor = null;
      l_motor = new five.Motor({pins: {pwm: 6, dir: 7}});
      r_motor = new five.Motor({pins: {pwm: 5, dir: 4}});

      //light sensor
      var threshold = 200;

  // Create a new `reflectance` hardware instance.
  var eyes = new five.IR.Reflect.Array({
    emitter: 13,
    pins: ["A3", "A2"], // any number of pins
    freq: 10,
    autoCalibrate: true,
  });

  eyes.on('data', function () {
    console.log("Raw Values: ", this.raw);
            // Gives you values of the reflectance sensor.
              var sensor_right = this.raw[0];
              var sensor_left = this.raw[1];

              if(sensor_right > threshold && sensor_left > threshold){
                    // linksom rondje draaien
                    console.log("rond draaien tot weer zwarte lijn");
                    l_motor.forward(100);
                    r_motor.stop();
              }
              else if(sensor_right > threshold){
                      //rechtsaf
                      console.log("rechtsaf tot weer zwarte lijn");
                      l_motor.forward(max_speed_l);
                      r_motor.forward(max_speed_r);
              }
              else if(sensor_left > threshold){
                  // linksaf
                  console.log("linksaf tot weer zwarte lijn");
                  l_motor.reverse(max_speed_l);
                  r_motor.reverse(max_speed_r);
              }
              else{
                  //rechtdoor
                  console.log("rechtdoor tot weer zwarte lijn");
                  l_motor.reverse(max_speed_l);
                  r_motor.forward(max_speed_r);
              }
  });

  eyes.enable();

});
