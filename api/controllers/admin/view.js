module.exports = {

    friendlyName: 'View',

    description: 'View Admin',

    inputs: {
        id: {
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
            description: 'Role not admin'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            if (data.role === 'employee' || data.role === 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role because not admin'
                });
            }

            if (inputs.id) {
                let adminDB = await Admin.findOne({ id: inputs.id });

                if (!adminDB) {
                    return exits.error({
                        message: 'Admin not found'
                    });
                } else {
                    return exits.success({
                        message: `Success view admin`,
                        data: adminDB
                    });
                }
            } else {
                let adminDB = await Admin.find();

                return exits.success({
                    message: `Success view all admin`,
                    data: adminDB
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
