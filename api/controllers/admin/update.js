module.exports = {

    friendlyName: 'Update',

    description: 'Update Data Admin',

    inputs: {
        token: {
            required: true,
            type: 'string',
        },
        name: {
            type: 'string',
        },
        email: {
            type: 'string'
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

            if (data.role === 'employee' || data.role === 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role because not admin'
                });
            }

            await Admin.updateOne({ id: data.id }).set({
                name: inputs.name,
                email: inputs.email
            });

            let adminDB = await Admin.findOne({ id: data.id });

            const token = await sails.helpers.generateNewJwtToken(adminDB.email, adminDB.id, 'admin');

            return exits.success({
                message: `Success update Admin Data`,
                data: adminDB,
                role: 'admin',
                token: token
            });

        } catch (error) {
            return exits.error({
                message: `Error update Admin Data`,
                error: error.message
            });
        }
    }
};
