
/*----- Command blocks -----*/
    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.wait_random = function(callback) {
        wait = Math.random();
        console.log('Waiting for ' + wait + ' seconds');
        window.setTimeout(function() {
            callback();
        }, wait*1000);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'wait for random time', 'wait_random'],
        ]
    };


/*----- Reporter blocking blocks -----*/
    ext.power = function(base, exponent) {
        return Math.pow(base, exponent);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name, param1 default value, param2 default value
            ['r', '%n ^ %n', 'power', 2, 3],
        ]
    };


/*----- Reporter non-blocking blocks -----*/
    ext.get_temp = function(location, callback) {
        // Make an AJAX call to the Open Weather Maps API
        $.ajax({
              url: 'http://api.openweathermap.org/data/2.5/weather?q='+location+'&units=imperial',
              dataType: 'jsonp',
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  temperature = weather_data['main']['temp'];
                  callback(temperature);
              }
        });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'current temperature in city %s', 'get_temp', 'Boston, MA'],
        ]
    };


/*----- Hat blocks -----*/
    ext.set_alarm = function(time) {
       window.setTimeout(function() {
           alarm_went_off = true;
       }, time*1000);
    };

    ext.when_alarm = function() {
       // Reset alarm_went_off if it is true, and return true
       // otherwise, return false.
       if (alarm_went_off === true) {
           alarm_went_off = false;
           return true;
       }

       return false;
    };



/*
Blocks

The blocks property is an array of block definitions. 
Each block definition is an array of three or more items. 
The required items are: op code, formatted label, and method name. 
These may optionally be followed by default block argument values.

The full list of block types available to an extension is as follows. 
Note that any operation that will run for more than a few milliseconds or will wait for an external event should be run asynchronously, 
as described above in the Reporter blocks that wait and Command blocks that wait sections.

Op Code Meaning
' ' (space) Synchronous command
'w' Asynchronous command
'r' Synchronous reporter
'R' Asynchronous reporter
'h' Hat block (synchronous, returns boolean, true = run stack)
Each block argument is identified by a % character and the character following it specifies the type. 
The types are: 
%n for number, 
%s for string, 
%m for menu. 
Menus also identify which menu to use with a period and the name of the menu like this: %m.menuName.
*/
