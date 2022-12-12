module.exports = {

    friendlyName: 'Create',

    description: 'Create stock',

    inputs: {
        name: {
            required: true,
            type: 'string',
        },
        totalStocks: {
            type: 'number',
            required: true,
        },
        priceStock: {
            type: 'number',
            required: true,
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success Create',
        },
        error: {
            statusCode: 400,
            description: 'Error',
        },
        notEmployee: {
            statusCode: 404,
            description: 'Role not employee'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            if (data.role === 'buyer') {
                return exits.notEmployee({
                    message: 'Role not employee or admin'
                });
            }

            let stock = await Stocks.create({
                name: inputs.name,
                totalStocks: inputs.totalStocks,
                priceStock: inputs.priceStock,
            });

            return exits.success({
                message: `Success create stock`,
                data: stock
            });

        } catch (error) {
            return exits.error({
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};
