module.exports = {

    friendlyName: 'Delete',

    description: 'Delete Admin',

    inputs: {
        token: {
            required: true,
            type: 'string',
        }
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
            description: 'Role not admin'
        }
    },


    fn: async function (inputs, exits) {
        try {
            const data = await sails.helpers.decodeJwtToken(inputs.token);

            if (data.role === 'buyer' || data.role === 'employee') {
                return exits.notRole({
                    message: 'Role not admin'
                });
            }

            let adminDB = await Admin.findOne({ id: data.id });

            if (!adminDB) {
                return exits.error({
                    message: 'Admin not found'
                });
            }

            await Admin.destroyOne({ id: data.id });

            return exits.success({
                message: `Success delete admin`
            });

        } catch (error) {
            return exits.error({
                message: `Error delete admin`,
                error: error.message
            });
        }
    }
};
