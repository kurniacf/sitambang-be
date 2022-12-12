module.exports = {

    friendlyName: 'Delete',

    description: 'Delete Stock',

    inputs: {
        id: {
            type: 'number',
            required: true
        },
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success delete',
        },
        error: {
            statusCode: 500,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not employee'
        },
        failDeleted: {
            statusCode: 404,
            description: 'Fail deleted'
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

            let stockData = await Stocks.findOne({ id: inputs.id });

            if (!stockData) {
                return exits.error({
                    message: 'Stock not found'
                });
            }

            await Stocks.destroyOne({ id: inputs.id });

            return exits.success({
                message: `Success delete stock`
            });

        } catch (error) {
            return exits.error({
                message: `Error delete stock`,
                error: error.message
            });
        }
    }
};
