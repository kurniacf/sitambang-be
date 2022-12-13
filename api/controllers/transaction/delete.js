module.exports = {

    friendlyName: 'Delete',

    description: 'Delete Transaction',

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
            statusCode: 404,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not access'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];

            const data = await sails.helpers.decodeJwtToken(token);

            if (data.role !== 'buyer' && data.role !== 'admin' && data.role !== 'employee') {
                return exits.notRole({
                message: 'Role not access'
                });
            }

            let transactionData = await Transaction.findOne({ id: inputs.id });

            if (!transactionData) {
                return exits.error({
                    message: 'Transaction not found'
                });
            }

            await Transaction.destroyOne({ id: inputs.id });

            return exits.success({
                message: `Success delete transaction`
            });

        } catch (error) {
            return exits.error({
                message: `Error delete transaction`,
                error: error.message
            });
        }
    }
};
