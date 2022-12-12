module.exports = {

    friendlyName: 'Delete',

    description: 'Delete Employee',

    inputs: {
        token: {
            required: true,
            type: 'string',
        },
        employeId: {
            type: 'string',
        },
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
            description: 'Role not admin or employee'
        },
        onlyAdmin: {
            statusCode: 404,
            description: 'only admin access'
        }
    },


    fn: async function (inputs, exits) {
        try {
            const data = await sails.helpers.decodeJwtToken(inputs.token);

            if (data.role === 'buyer') {
                return exits.notRole({
                    message: 'Role not admin or employee'
                });
            }

            if (inputs.employeId) {
                if (data.role === 'admin') {
                    await Employee.destroyOne({ id: inputs.employeId });
                } else {
                    return exits.onlyAdmin({
                        message: `Error update because only admin`,
                        error: error.message + `Only Admin Access Tokens are allowed`
                    });
                }
            } else {
                await Employee.destroyOne({ id: data.id });
            }

            return exits.success({
                message: `Success delete employee`
            });

        } catch (error) {
            return exits.error({
                message: `Error delete employee`,
                error: error.message
            });
        }
    }
};
