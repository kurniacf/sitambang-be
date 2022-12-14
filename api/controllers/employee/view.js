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

            if (data.role === 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            let idEmployee = this.req.param('id');

            if (idEmployee) {
                let employeeDB = await Buyer.findOne({ id: idEmployee });

                return exits.success({
                    message: `Success view Buyer`,
                    data: employeeDB
                });
            } else {
                let employeeDB = await Buyer.find();

                return exits.success({
                    message: `Success view all Buyer`,
                    data: employeeDB
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
