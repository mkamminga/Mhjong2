/**
 * Add barrels and stuff
 * Adjust as necessary for your application needs.
 */
(function (global) {
   System.config({
     map: {
        "mock-socket" : "npm:mock-socket",
        "socket.io-client": 'npm:socket.io-client',
     },
     packages: {
        "socket.io-client": {
            main: './dist/socket.io.js'
        },
        "mock-socket" : {
            main: './dist/mock-socket.js'
        }
       // add packages here
       
     },

   });
})(this);
