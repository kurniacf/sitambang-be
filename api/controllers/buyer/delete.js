module.exports = {

    friendlyName: 'Delete',

    description: 'Delete Buyer',

    inputs: {
        buyerId: {
            type: 'string',
        },
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success update',
        },
        error: {
            statusCode: 500,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not access'
        },
        onlyAdmin: {
            statusCode: 404,
            description: 'only admin access'
        }
    },


    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            if (!data) {
                return exits.notRole({
                    message: 'Role not access'
                });
            }

            if (inputs.buyerId) {
                if (data.role === 'admin') {
                    await Buyer.destroyOne({ id: inputs.buyerId });
                } else {
                    return exits.onlyAdmin({
                        message: `Error update because only admin`,
                        error: error.message + `Only Admin Access Tokens are allowed`
                    });
                }
            } else {
                await Buyer.destroyOne({ id: data.id });
            }

            return exits.success({
                message: `Success delete Buyer`
            });

        } catch (error) {
            return exits.error({
                message: `Error delete Buyer`,
                error: error.message
            });
        }
    }
};
