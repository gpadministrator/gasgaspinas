var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

	var usersSchema = new Schema({
		_id: Schema.Types.ObjectId,
        auth: Schema.Types.Mixed,
        info: Schema.Types.Mixed,
        vehicles: [Schema.Types.Mixed],
        isActive: {type: Boolean, default: true},
        date_modified: {type: Date, default: Date.now()}
	}, { versionKey: false});

    //usersSchema.path('feed_type').required(true, 'Feed_type cannot be blank');

	mongoose.model('users', usersSchema, 'users');

};