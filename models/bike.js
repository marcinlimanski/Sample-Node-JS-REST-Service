/**
 * Created by marcinlimanski on 25/07/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BikeSchema   = new Schema({
    name: String,
    type: String,
    price: Number
});

module.exports = mongoose.model('Bike', BikeSchema);