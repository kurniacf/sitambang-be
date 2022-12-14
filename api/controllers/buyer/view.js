module.exports = {

    friendlyName: 'View',

    description: 'View Employee',

    inputs: {
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
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            if (data.role !== 'buyer' && data.role !== 'admin' && data.role !== 'employee') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            let idBuyer = this.req.param('id');

            if (idBuyer) {
                let buyerDB = await Buyer.findOne({ id: idBuyer });

                return exits.success({
                    message: `Success view Buyer`,
                    data: buyerDB
                });
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
