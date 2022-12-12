module.exports = {

    friendlyName: 'View',

    description: 'View Employee',

    inputs: {
        token: {
            required: true,
            type: 'string',
        },
        employeeId: {
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
            description: 'Role not admin or employee'
        }
    },

    fn: async function (inputs, exits) {
        try {
            const data = await sails.helpers.decodeJwtToken(inputs.token);

            if (data.role === 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role because not admin or employee'
                });
            }

            if (inputs.employeeId) {
                let employeeDB = await Employee.findOne({ id: inputs.employeeId });

                if (!employeeDB) {
                    return exits.error({
                        message: 'Employee not found'
                    });
                } else {
                    return exits.success({
                        message: `Success view Employee`,
                        data: employeeDB
                    });
                }
            } else {
                let employeeDB = await Employee.find();

                return exits.success({
                    message: `Success view all Employee`,
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
