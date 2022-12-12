module.exports = {

    friendlyName: 'View',

    description: 'View stock information',

    inputs: {
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success View',
        },
        error: {
            statusCode: 400,
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

            let idStock = this.req.param('id');

            if (idStock) {
                let stockData = await Stocks.findOne({ id: idStock });

                if (!stockData) {
                    return exits.error({
                        message: 'Stock not found'
                    });
                } else {
                    return exits.success({
                        message: `Success view stock`,
                        data: stockData
                    });
                }
            } else {
                let stocksData = await Stocks.find();

                return exits.success({
                    message: `Success view all stocks`,
                    data: stocksData
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
