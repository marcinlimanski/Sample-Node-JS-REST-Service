/**
 * Created by marcinlimanski on 25/07/15.
 */

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose'); //importing the mongoose lib
var cors       = require('cors')

//This will allow our server to use the bike model
var Bike     = require('./models/bike');

//Connecting to the mongodb database
mongoose.connect('<mongoDB link>');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    //No longer needed as we use cors lib
    /*
    // do logging
    console.log('Someone made a request.');
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    */
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'REST API! ready to use' });
    console.log("get request made");
});

//router.rout allows to handle multiple routes for the same URI.
router.route('/bikes')

    // create a bike (accessed at POST http://localhost:8080/api/bikes)
    .post(function(req, res) {

        var bike = new Bike();      // create a new instance of the bike model
        bike.name = req.body.name;  // set the bikes name (comes from the request)
        bike.type  = req.body.type;
        bike.price = req.body.price;
        // save the bike and check for errors
        bike.save(function(err) {
            if (err)
                res.send(err);
            else
            res.json({ message: 'Bike created!' });
        });

    })

    // get all the bike (accessed at GET http://localhost:8080/api/bikes)
    .get(function(req, res) {
        Bike.find(function(err, bikes) {
            if (err)
                res.send(err);
            else
            res.json(bikes);
        });
    });

router.route('/bikes/:bike_id')

    // get the bike with that id (accessed at GET http://localhost:8080/api/bikes/:bike_id)
    .get(function(req, res) {
        Bike.findById(req.params.bike_id, function(err, bike) {
            if (err)
                res.send(err);
            else
            res.json(bike);
        });
    })

    // update the bike with this id (accessed at PUT http://localhost:8080/api/bikes/:bike_id)
    .put(function(req, res) {
    // use our bike model to find the bike we want
    Bike.findById(req.params.bike_id, function (err, bike) {

        if (err)
            res.send(err);
        else
            bike.name = req.body.name;
            bike.type = req.body.type;
            bike.price = req.body.price;
            bike.save(function (err) {
                if (err)
                    res.send(err);
                else
                    res.json({message: 'Bike name updated!'});
            });
        });
    })

    // delete the bike with this id
    .delete(function(req, res) {
        Bike.remove({
            _id: req.params.bike_id
        }, function(err, bike) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Server is listening on port:  ' + port);