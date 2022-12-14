module.exports = {

    friendlyName: 'View',

    description: 'View transaction pending',

    inputs: {
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success View',
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

            let idBuyer = this.req.param('id_buyer');
            let transactionData

            if (data.role === 'buyer') {
                if (idBuyer) {
                    return exits.notRole({
                        message: 'Dont not access role. Only Admin and Employee'
                    });
                }
                transactionData = await Transaction.find({ idBuyer: data.id, statusPayment: 'pending' });
            } else if (data.role === 'employee' || data.role === 'admin') {
                if (idBuyer) {
                    transactionData = await Transaction.findOne({idBuyer: idBuyer, statusPayment: 'pending'});
                } else {
                    transactionData = await Transaction.find({statusPayment: 'pending'});
                }
            }
            return exits.success({
                message: `Success view transaction`,
                data: transactionData
            });
        } catch (error) {
            return exits.error({
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};
