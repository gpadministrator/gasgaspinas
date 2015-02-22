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
        modified_date: {type: Date, default: Date.now}
	});

    feedsSchema.path('feed_type').required(true, 'Feed_type cannot be blank');
//    feedsSchema.path('franchise_id').required(true, 'Franchise cannot be blank');
    //feedsSchema.path('station_id').required(true, 'Station ID cannot be blank');
    //feedsSchema.path('user_id').required(true, 'User ID cannot be blank');
/*
    commentsSchema.statics = {
    	list: function(query, options, cb) {
    		var criteria = options.criteria || {};

    		this.find(query,{},options)
    		.populate('user_id', 'firstname lastname')
    		.populate('station_id', 'name rating')
    		.sort({'date_modified': -1})
    		.exec(cb);
    	}
    };
*/
	mongoose.model('feeds', feedsSchema, 'feeds');

};