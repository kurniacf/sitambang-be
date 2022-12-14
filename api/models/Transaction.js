/**
 * Stock.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'transaction',
    attributes: {
        totalPayment: {
            type: 'number',
            required: true,
            columnName: 'total_payment'
        },
        paymentMethod: {
            type: 'string',
            required: true,
            columnName: 'payment_method'
        },
        statusPayment: {
            type: 'string',
            isIn: ['confirmed', 'cancelled', 'pending'],
            defaultsTo: 'pending',
            columnName: 'status_payment'
        },
        paymentImage: {
            type: 'string',
            allowNull: true,
            columnName: 'payment_image'
        },
        idStock : {
            model: 'stocks',
            columnName: 'id_stock'
        },
        nameStock : {
            type: 'string',
            columnName: 'name_stock'
        },
        idBuyer : {
            model: 'buyer',
            columnName: 'id_buyer'
        },
        nameBuyer : {
            type: 'string',
            columnName: 'name_buyer'
        },
        purchasedStock: {
            type: 'number',
            required: true,
            columnName: 'purchase_stock'
        },
    },
};

