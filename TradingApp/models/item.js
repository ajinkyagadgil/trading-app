const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {type: String, required:[true, 'title is required']},
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    itemDescription: {type: String, required:[true, 'Description is required']},
    itemImage: {type: String},
    status:{type: String},
    trade: {
        itemTradedAgainstUser:{type: Schema.Types.ObjectId, ref: 'User'},
        itemTradedAgainstId:{type: Schema.Types.ObjectId},
        itemToTradeId:{type: Schema.Types.ObjectId},
        itemToTradeUser: {type: Schema.Types.ObjectId, ref: 'User'}
    }

},
{timestamps: true});

const item = mongoose.model('item', itemSchema);

const tradeSchema = new Schema({
    categoryName: {type: String, required:[true, 'Category is required']},
    items: [itemSchema]
},
{timestamps: true});

const trade = mongoose.model('trade', tradeSchema);

module.exports = {
    itemModel: item,
    tradeModel: trade
  }
