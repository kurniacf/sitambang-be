module.exports = {

    friendlyName: 'View',

    description: 'View stock transaction',

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

            let idTransaction = this.req.param('id_transaction');
            let idBuyer = this.req.param('id_buyer');

            // View By ID Transaction
            if(idTransaction) {
                if(data.role === 'buyer') {
                    let transactionData = await Transaction.find({ idBuyer: data.id, id: idTransaction});

                    return exits.success({
                        message: `Success view transaction buyer`,
                        data: transactionData
                    });
                } else {
                    let transactionData = await Transaction.find({ idBuyer: idBuyer, id: idTransaction});

                    return exits.success({
                        message: `Success view transaction`,
                        data: transactionData
                    });
                }
            } else {
                if(data.role === 'buyer') {
                    let transactionData = await Transaction.find({ idBuyer: data.id });

                    return exits.success({
                        message: `Success view transaction buyer`,
                        data: transactionData
                    });
                }

                if(idBuyer) {
                    let transactionData = await Transaction.find({ idBuyer: idBuyer });

                    return exits.success({
                        message: `Success view transaction`,
                        data: transactionData
                    });
                }

                let transactionData = await Transaction.find();

                return exits.success({
                    message: `Success view all Transactions`,
                    data: transactionData
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
