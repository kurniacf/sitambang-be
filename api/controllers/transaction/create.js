module.exports = {

    friendlyName: 'Create',

    description: 'Create Transaction',

    inputs: {
        paymentMethod: {
            type: 'string',
            required: true,
        },
        idStock : {
            type: 'number',
        },
        purchasedStock: {
            type: 'number',
        },
        idBuyer : {
            type: 'number',
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success Create',
        },
        error: {
            statusCode: 404,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not access'
        },
        notEnoughStock: {
            statusCode: 404,
            description: 'Stock not enough'
        },
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            if (data.role !== 'buyer' && data.role !== 'admin' && data.role !== 'employee') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            let stockData = await Stocks.findOne({ id: inputs.idStock });
            let transaction;

            if (inputs.purchasedStock > stockData.stock) {
                return exits.notEnoughStock({
                    message: 'Stock not enough'
                });
            }

            let totalPayment = stockData.priceStock * inputs.purchasedStock;

            if(data.role === 'buyer') {
                if(inputs.idBuyer) {
                    return exits.error({
                        message: 'You dont have access to change buyer'
                    });
                } else {
                    transaction = await Transaction.create({
                        totalPayment: totalPayment,
                        paymentMethod: inputs.paymentMethod,
                        statusPayment: 'pending',
                        paymentImage: null,
                        idStock: inputs.idStock,
                        idBuyer: data.id,
                        purchasedStock: inputs.purchasedStock
                    }).fetch();
                }
            } else {
                if(inputs.idBuyer) {
                    transaction = await Transaction.create({
                        totalPayment: totalPayment,
                        paymentMethod: inputs.paymentMethod,
                        statusPayment: 'pending',
                        paymentImage: null,
                        idStock: inputs.idStock,
                        idBuyer: inputs.idBuyer,
                        purchasedStock: inputs.purchasedStock
                    }).fetch();
                } else {
                    return exits.error({
                        message: 'Id buyer is required'
                    });
                }
            }

            return exits.success({
                message: `Success create transaction`,
                data: transaction
            });

        } catch (error) {
            return exits.error({
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};
