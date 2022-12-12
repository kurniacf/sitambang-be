/**
 * Stock.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'stocks',
    attributes: {
        name: {
            type: 'string',
            required: true,
            columnName: 'name'
        },
        totalStocks: {
            type: 'number',
            required: true,
            columnName: 'total_stocks'
        },
        priceStock: {
            type: 'number',
            required: true,
            columnName: 'price_stock'
        }
    },
};

