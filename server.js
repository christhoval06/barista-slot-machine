var Hapi = require('hapi');
var Hoek = require('hoek');


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.register(require('vision'), function (err) {
    Hoek.assert(!err, err);
    server.views({
        engines: { html: require('handlebars') },
        relativeTo: __dirname
    });
});

server.register(require('inert'), function (err) {

    server.route({
        method: 'GET',
        path: '/css/{param*}',
        handler: { directory: { path: 'dist' } }
    });

    server.route({
        method: 'GET',
        path: '/js/{param*}',
        handler: { directory: { path: 'dist' } }
    });

    // Add the route
    server.route({
        method: 'GET',
        path:'/',
        handler: {
            view: 'index'
        }
    });

    // Start the server
    server.start(function (err) {
        Hoek.assert(!err, err);
        console.log('Server running at:', server.info.uri);
    });
});
