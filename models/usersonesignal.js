let mongoose = require('mongoose');

let userOnesignalSchema = mongoose.Schema({
    idApp: String,
        id: String,
        identifier: String,
        session_count:Number,
        language: String,
        timezone: Number,
        game_version:String,
        device_os: String,
        device_type: Number,
        device_model: String,
        ad_id: String,
        tags: Object,
        last_active: Date,
        playtime: Number,
        amount_spent: Number,
        created_at: Date,
        invalid_identifier: Boolean,
        badge_count: Number,
        sdk: String,
        test_type: Number,
        isTest: Boolean,
        ip:String,
});

let usersonesignal = module.exports = mongoose.model('usersonesignals', userOnesignalSchema);