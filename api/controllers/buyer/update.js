module.exports = {

    friendlyName: 'Update',

    description: 'Update Data Buyer',

    inputs: {
        buyerId: {
            type: 'number',
        },
        name: {
            type: 'string',
        },
        email: {
            type: 'string'
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
            description: 'Role not admin or Buyer'
        },
        onlyAdmin: {
            statusCode: 404,
            description: 'only admin access'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let tokenHeader = credential[1];
            const data = await sails.helpers.decodeJwtToken(tokenHeader);

            if (!data) {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            let buyerDB;

            if (inputs.buyerId) {
                if (!(data.role === 'admin')) {
                    return exits.onlyAdmin({
                        message: `Error update because only admin`,
                        error: error.message + `Only Admin Access Tokens are allowed`
                    });
                } else {
                    await Buyer.updateOne({ id: inputs.buyerId }).set({
                        name: inputs.name,
                        email: inputs.email
                    });
                    buyerDB = await Buyer.findOne({ id: inputs.buyerId });
                }
            } else {
                await Buyer.updateOne({ id: data.id }).set({
                    name: inputs.name,
                    email: inputs.email,
                });
                buyerDB = await Buyer.findOne({ id: data.id });
            }

            const token = await sails.helpers.generateNewJwtToken(buyerDB.email, buyerDB.id, 'buyer');

            return exits.success({
                message: `Success update Buyer Data`,
                data: buyerDB,
                role: 'Buyer',
                token: token
            });

        } catch (error) {
            return exits.error({
                message: `Error update Buyer Data`,
                error: error.message
            });
        }
    }
};
