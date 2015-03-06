var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

	var vehicleLogs = new Schema({
		_id: Schema.Types.ObjectId,
        user_id: Schema.Types.ObjectId,
        vehicle_id: Schema.Types.ObjectId,
        station_id:  Schema.Types.ObjectId,
        distance_traveled: Number,
        liters: Number,
        amount: Number,
        fuel_savings: Number,
        fuel_consumed: Number,
        modified_date: {type: Date, default: Date.now}
	}, { versionKey: false});


    vehicleLogs.path('vehicle_id').required(true, '\'vehicle_id\' cannot be blank');
    vehicleLogs.path('station_id').required(true, '\'station_id\' cannot be blank');
    vehicleLogs.path('user_id').required(true, '\'user_id\' cannot be blank');

	mongoose.model('vehicle_logs', vehicleLogs, 'vehicle_logs');

};