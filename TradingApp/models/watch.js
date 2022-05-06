const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User'},
    watchedItems:{
        type: [{
            itemId: {type: Schema.Types.ObjectId},
            itemName: {type: String}
        }]
    }
})

module.exports = mongoose.model('watch', watchSchema);