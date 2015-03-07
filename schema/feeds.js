var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

	var feedsSchema = new Schema({
		_id: Schema.Types.ObjectId,
        feed_type: String,
        title: {type: String, trim: true},
        description: String,
        url: {type: String, trim: true},
        image: String,
        promo_start_date: Date,
        promo_end_date: Date,
        date_modified: {type: Date, default: Date.now}
	}, { versionKey: false});

    feedsSchema.path('feed_type').required(true, 'feed_type cannot be blank');

	mongoose.model('feeds', feedsSchema, 'feeds');

};