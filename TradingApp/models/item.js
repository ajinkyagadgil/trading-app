const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {type: String, required:[true, 'title is required']},
    itemDescription: {type: String, required:[true, 'author is required']},
    itemImage: {type: String}
},
{timestamps: true});

const item = mongoose.model('item', itemSchema);

const tradeSchema = new Schema({
    categoryName: {type: String, required:[true, 'title is required']},
    items: [itemSchema]
},
{timestamps: true});

const trade = mongoose.model('trade', tradeSchema);

module.exports = {
    itemModel: item,
    tradeModel: trade
  }

// const { DateTime } = require('luxon');
// const { v4: uuidv4 } = require('uuid');

// const tradeItems = [
    // {
    //     categoryId: '1',
    //     categoryName: 'Outdoors Equipments',
    //     items: [
    //         {
    //             itemId: '1',
    //             itemName: 'Camping Tent',
    //             itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
    //             itemImage: '/images/camping-tent.jpeg',
    //             createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    //         },
    //         {
    //             itemId: '2',
    //             itemName: 'Camping Chair',
    //             itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
    //             itemImage: '/images/camping-chair.jpeg',
    //             createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    //         },
    //         {
    //             itemId: '3',
    //             itemName: 'Camping Table',
    //             itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
    //             itemImage: '/images/camping-table.jpeg',
    //             createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    //         },
    //     ]
    // },
//     {
//         categoryId: '2',
//         categoryName: 'Electrical Equipments',
//         items: [
//             {
//                 itemId: '4',
//                 itemName: 'Electric Drill',
//                 itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
//                 itemImage: '/images/electric-drill.jpeg',
//                 createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
//             },
//             {
//                 itemId: '5',
//                 itemName: 'Screw Drivers',
//                 itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
//                 itemImage: '/images/electric-screwdrivers.jpeg',
//                 createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
//             },
//             {
//                 itemId: '6',
//                 itemName: 'Electric Tape',
//                 itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
//                 itemImage: '/images/electric-tape.jpg',
//                 createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
//             },
//         ]
//     },
//     {
//         categoryId: '3',
//         categoryName: 'Carpentry Equipments',
//         items: [
//             {
//                 itemId: '7',
//                 itemName: 'Hammer',
//                 itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
//                 itemImage: '/images/carpentry-hammer.jpeg',
//                 createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
//             },
//             {
//                 itemId: '8',
//                 itemName: 'Nails',
//                 itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
//                 itemImage: '/images/carpentry-nails.jpeg',
//                 createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
//             },
//             {
//                 itemId: '9',
//                 itemName: 'Tape',
//                 itemDescription: 'A tent is a shelter consisting of sheets of fabric or other material draped over, attached to a frame of poles or attached to a supporting rope. While smaller tents may be free-standing or attached to the ground, large tents are usually anchored using guy ropes tied to stakes or tent pegs. First used as portable homes by nomads, tents are now more often used for recreational camping and as temporary shelters.',
//                 itemImage: '/images/carpentry-tape.jpeg',
//                 createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
//             },
//         ]
//     },
// ]

// exports.getAllTradeItems = function () {
//     return tradeItems;
// }

// exports.findItemById = function (categoryId, itemId) {
//     let category = tradeItems.find(category => category.categoryId == categoryId);
//     if (category) {
//         let tradeItem = category.items.find(item => item.itemId == itemId);
//         if (tradeItem) {
//             let item = {
//                 categoryId: category.categoryId,
//                 categoryName: category.categoryName,
//                 item: { ...tradeItem }
//             };
//             return item;
//         }
//     }
// }

// exports.createTrade = function (item) {
//     let category = tradeItems.find(category => category.categoryName === item.categoryName);
//     item.itemId = uuidv4();
//     item.itemImage = '/images/carpentry-tape.jpeg';
//     if (category) {
//         category.items.push(item);
//     } else {
//         let tradeItem = {
//             categoryId: uuidv4(),
//             categoryName: item.categoryName,
//             items: [item]
//         }
//         tradeItems.push(tradeItem);
//     }
// }

// exports.deleteById = function (categoryId, itemId) {
//     let tradeCategory = tradeItems.find(category => category.categoryId == categoryId);
//     if (tradeCategory) {
//         let tradeItem = tradeCategory.items.find(item => item.itemId == itemId);
//         if (tradeItem) {
//             let itemIndex = tradeCategory.items.findIndex(item => item.itemId == tradeItem.itemId);
//             if (itemIndex != -1) {
//                 tradeCategory.items.splice(itemIndex, 1);
//                 return true;
//             }
//             else {
//                 return false;
//             }
//         }
//     } else {
//         return false;
//     }
// }

// exports.updateById = function (itemId, categoryId, tradeItem) {
//     let category = tradeItems.find(category => category.categoryId == categoryId);
//     if (category) {
//         category.categoryName = tradeItem.categoryName;
//         let item = category.items.find(item => item.itemId == itemId);
//         if (item) {
//             item.itemName = tradeItem.itemName;
//             item.itemDescription = tradeItem.itemDescription;

//             return true;
//         } else {
//             return false;
//         }
//     }
//     else {
//         return false;
//     }
// }
