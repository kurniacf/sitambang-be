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
            required: true,
        },
        nameStock: {
            type: 'string',
        },
        purchasedStock: {
            type: 'number',
        },
        idBuyer : {
            type: 'number',
        },
        nameBuyer : {
            type: 'string',
        },
        paymentImage : {
            type: 'string',
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

            let stockData;
            let buyerData;
            let transaction;

            if(data.role === 'buyer') {
                if(inputs.idBuyer) {
                    return exits.error({
                        message: 'You dont have access to change buyer'
                    });
                }
                stockData = await Stocks.findOne({ id: inputs.idStock });
                buyerData = await Buyer.findOne({ id: data.id });

                if (inputs.purchasedStock > stockData.stock) {
                    return exits.notEnoughStock({
                        message: 'Stock not enough'
                    });
                }

                transaction = await Transaction.create({
                    paymentMethod: inputs.paymentMethod,
                    idStock: inputs.idStock,
                    nameStock: stockData.name,
                    idBuyer: buyerData.id,
                    nameBuyer: buyerData.name,
                    purchasedStock: inputs.purchasedStock,
                    paymentImage: inputs.paymentImage,
                    statusPayment: 'pending',
                    totalPayment: stockData.priceStock * inputs.purchasedStock
                }).fetch();
            } else {
                if(inputs.idBuyer) {
                    stockData = await Stocks.findOne({ id: inputs.idStock });
                    buyerData = await Buyer.findOne({ id: inputs.idBuyer });

                    if (inputs.purchasedStock > stockData.stock) {
                        return exits.notEnoughStock({
                            message: 'Stock not enough'
                        });
                    }

                    transaction = await Transaction.create({
                        paymentMethod: inputs.paymentMethod,
                        idStock: inputs.idStock,
                        nameStock: stockData.name,
                        idBuyer: buyerData.id,
                        nameBuyer: buyerData.name,
                        purchasedStock: inputs.purchasedStock,
                        paymentImage: inputs.paymentImage,
                        statusPayment: 'pending',
                        totalPayment: stockData.priceStock * inputs.purchasedStock
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
