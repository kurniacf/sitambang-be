module.exports = {

    friendlyName: 'Delete',

    description: 'Delete Admin',

    inputs: {
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success delete',
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
