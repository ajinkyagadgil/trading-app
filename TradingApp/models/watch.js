const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User'},
    watchedItems:[Schema.Types.ObjectId]
})

module.exports = mongoose.model('watch', watchSchema);