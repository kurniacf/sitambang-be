module.exports = {

    friendlyName: 'Update',

    description: 'Update stock',

    inputs: {
        id: {
            type: 'number',
            required: true
        },
        name: {
            type: 'string',
        },
        totalStocks: {
            type: 'number',
        },
        priceStock: {
            type: 'number',
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success update',
        },
        error: {
            statusCode: 404,
            description: 'Error',
        },
        notRole: {
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
                return exits.notRole({
                message: 'Role not employee or admin'
                });
            }

            await Stocks.updateOne({ id: inputs.id }).set({
                name: inputs.name,
                totalStocks: inputs.totalStocks,
                priceStock: inputs.priceStock,
            });

            let stock = await Stocks.findOne({ id: inputs.id });

            return exits.success({
                message: `Success update stock`,
                data: stock
            });

        } catch (error) {
            return exits.error({
                message: `Error update stock`,
                error: error.message
            });
        }
    }
};
