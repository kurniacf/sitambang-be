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
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success Create',
        },
        error: {
            statusCode: 500,
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

            if (data.role !== 'employee' && data.role !== 'admin' && data.role !== 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            let stockData = await Stocks.findOne({ id: inputs.idStock });

            if (inputs.purchasedStock > stockData.stock) {
                return exits.notEnoughStock({
                    message: 'Stock not enough'
                });
            }

            let totalPayment = stockData.priceStock * inputs.purchasedStock;

            let transaction = await Transaction.create({
                totalPayment: totalPayment,
                paymentMethod: inputs.paymentMethod,
                statusPayment: 'pending',
                paymentImage: null,
                idStock: inputs.idStock,
                idBuyer: data.id,
                purchasedStock: inputs.purchasedStock
            }).fetch();

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
