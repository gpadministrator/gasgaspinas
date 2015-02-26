var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var vehiclesSchema = new Schema({
        _id: Schema.Types.ObjectId,
        user_id: Schema.Types.ObjectId,
        vehicle_name: String, 
        vehicle_type: String, 
        fuel_type: String,
        brand: String,
        model: String,
        date_modified: {type: Date, default: Date.now}
    },{versionKey: false});

    //usersSchema.path('feed_type').required(true, 'Feed_type cannot be blank');

	mongoose.model('vehicles', vehiclesSchema, 'vehicles');

};