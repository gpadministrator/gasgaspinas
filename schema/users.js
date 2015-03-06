var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var vehiclesSchema = new Schema({
        _id: Schema.Types.ObjectId,
        vehicle_name: String, 
        vehicle_type: String, 
        fuel_type: String,
        brand: String,
        model: String,
        date_modified: {type: Date, default: Date.now}
    },{versionKey: false});

	var usersSchema = new Schema({
		_id: Schema.Types.ObjectId,
        auth: [
            {
                social: String,
                social_id: String
            }
        ],
        info: {
            city : String,
            email : String,
            dp : String,
            first_name : String,
            gender : String,
            last_name : String,
            DoB : {type: Date, default: Date.now}
        },
        vehicles: [vehiclesSchema],
        isActive: {type: Boolean, default: true},
        date_modified: {type: Date, default: Date.now()}
	}, { versionKey: false});

    //usersSchema.path('feed_type').required(true, 'Feed_type cannot be blank');

	mongoose.model('users', usersSchema, 'users');

};