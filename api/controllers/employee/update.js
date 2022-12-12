/* eslint-disable camelcase */
module.exports = {

    friendlyName: 'Update',

    description: 'Update Data Employee',

    inputs: {
        token: {
            required: true,
            type: 'string',
        },
        employeId: {
            type: 'number',
        },
        name: {
            type: 'string',
        },
        email: {
            type: 'string'
        },
        gender: {
            type: 'string',
            enum: ['male', 'female']
        },
        address: {
            type: 'string',
        },
        place_of_birth: {
            type: 'string',
        },
        date_of_birth: {
            type: 'string',
            format: 'date-time',
        },
        position: {
            type: 'string',
        },
        phone_number: {
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
                    message: 'Dont not access role because not admin or employee'
                });
            }

            let employeeDB;

            if (inputs.employeId) {
                if (!(data.role === 'admin')) {
                    return exits.onlyAdmin({
                        message: `Error update because only admin`,
                        error: error.message + `Only Admin Access Tokens are allowed`
                    });
                } else {
                    await Employee.updateOne({ id: inputs.employeId }).set({
                        name: inputs.name,
                        email: inputs.email,
                        gender: inputs.gender,
                        address: inputs.address,
                        place_of_birth: inputs.place_of_birth,
                        date_of_birth: inputs.date_of_birth,
                        position: inputs.position,
                        phone_number: inputs.phone_number
                    });
                    employeeDB = await Employee.findOne({ id: inputs.employeId });
                }
            } else {
                await Employee.updateOne({ id: data.id }).set({
                    name: inputs.name,
                    email: inputs.email,
                    address: inputs.address,
                    place_of_birth: inputs.place_of_birth,
                    date_of_birth: inputs.date_of_birth,
                    position: inputs.position,
                    phone_number: inputs.phone_number
                });
                employeeDB = await Employee.findOne({ id: data.id });
            }

            const token = await sails.helpers.generateNewJwtToken(employeeDB.email, employeeDB.id, 'employee');

            return exits.success({
                message: `Success update Employee Data`,
                data: employeeDB,
                role: 'employee',
                token: token
            });

        } catch (error) {
            return exits.error({
                message: `Error update Employee Data`,
                error: error.message
            });
        }
    }
};
