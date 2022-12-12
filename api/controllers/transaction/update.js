module.exports = {

    friendlyName: 'Update',

    description: 'Update Transaction',

    inputs: {
        idTransaction: {
            type: 'number',
            required: true
        },
        idStock: {
            type: 'number',
        },
        paymentMethod: {
            type: 'string',
        },
        statusPayment: {
            type: 'string',
            enum: ['confirmed', 'canceled', 'pending'],
        },
        paymentImage: {
            type: 'string',
        },
        purchasedStock: {
            type: 'number',
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success Update',
        },
        error: {
            statusCode: 500,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not access'
        },
        notFound: {
            statusCode: 404,
            description: 'Transaction not found'
        },
        notEnoughStock: {
            statusCode: 404,
            description: 'Stock not enough'
        },
        notChangeStatus: {
            statusCode: 404,
            description: 'Status not change'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            if (data.role !== 'employee' && data.role !== 'admin' && data.role !== 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            let transactionData = await Transaction.findOne({ id: inputs.idTransaction });
            let stockData = await Stocks.findOne({ id: inputs.idStock });
            let transaction;

            if (!transactionData) {
                return exits.notFound({
                    message: 'Transaction not found'
                });
            }

            if (inputs.purchasedStock > stockData.stock) {
                return exits.notEnoughStock({
                    message: 'Stock not enough'
                });
            }

            if (data.role === 'buyer') {
                if (inputs.statusPayment === 'confirmed') {
                    return exits.notChangeStatus({
                        message: 'Status not change becaus role not access'
                    });
                }

                transaction = await Transaction.updateOne({ id: inputs.idTransaction }).set({
                    totalPayment: stockData.priceStock * inputs.purchasedStock,
                    paymentMethod: inputs.paymentMethod,
                    statusPayment: inputs.statusPayment,
                    paymentImage: inputs.paymentImage,
                    idStock: inputs.idStock,
                    purchasedStock: inputs.purchasedStock,
                });
            } else {
                if (inputs.statusPayment === 'confirmed') {
                    await Stocks.updateOne({ id: inputs.idStock }).set({
                        stock: stockData.stock - inputs.purchasedStock
                    });
                }

                transaction = await Transaction.updateOne({ id: inputs.idTransaction }).set({
                    totalPayment: stockData.priceStock * inputs.purchasedStock,
                    paymentMethod: inputs.paymentMethod,
                    statusPayment: inputs.statusPayment,
                    paymentImage: inputs.paymentImage,
                    idStock: inputs.idStock,
                    purchasedStock: inputs.purchasedStock,
                });
            }

            return exits.success({
                message: `Success update transaction`,
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
