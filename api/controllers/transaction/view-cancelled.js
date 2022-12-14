module.exports = {

    friendlyName: 'View',

    description: 'View transaction cancelled',

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

            if (data.role !== 'employee' && data.role !== 'admin' && data.role !== 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            let idBuyer = this.req.param('id_buyer');

            if (idBuyer) {
                if(data.role === 'buyer') {
                    return exits.notRole({
                        message: 'Dont not access role. Only Admin and Employee'
                    });
                }

                let transactionData = await Transaction.find({ idBuyer: idBuyer, statusPayment: 'cancelled' });

                if (!transactionData) {
                    return exits.error({
                        message: 'Transaction not found'
                    });
                }

                return exits.success({
                    message: `Success view Transaction cancelled with id buyer`,
                    data: transactionData
                });
            } else {
                if(data.role === 'buyer') {
                    let transactionData = await Transaction.find({idBuyer: data.id, statusPayment: 'cancelled'});

                    return exits.success({
                        message: `Success view all Transaction cancelled by buyer`,
                        data: transactionData
                    });
                } else {
                    let transactionData = await Transaction.find({statusPayment: 'cancelled'});

                    return exits.success({
                        message: `Success view all Transaction cancelled by employee or Admin`,
                        data: transactionData
                    });
                }
            }
        } catch (error) {
            return exits.error({
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};
