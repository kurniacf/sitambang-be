module.exports = {

    friendlyName: 'View',

    description: 'View Employee',

    inputs: {
        token: {
            required: true,
            type: 'string',
        },
        buyerId: {
            type: 'number'
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success View',
        },
        error: {
            statusCode: 500,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not admin or employee'
        }
    },

    fn: async function (inputs, exits) {
        try {
            const data = await sails.helpers.decodeJwtToken(inputs.token);

            if (!data) {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            if (inputs.buyerId) {
                let buyerDB = await Buyer.findOne({ id: inputs.buyerId });

                if (!buyerDB) {
                    return exits.error({
                        message: 'Buyer not found'
                    });
                } else {
                    return exits.success({
                        message: `Success view Buyer`,
                        data: buyerDB
                    });
                }
            } else {
                let buyerDB = await Buyer.find();

                return exits.success({
                    message: `Success view all Buyer`,
                    data: buyerDB
                });
            }
        } catch (error) {
            return exits.error({
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};
