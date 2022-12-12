module.exports = {

    friendlyName: 'Login',

    description: 'Login employee.',

    inputs: {
        email: {
            type: 'string',
            required: true,
            isEmail: true,
            description: 'Employee email.'
        },
        password: {
            type: 'string',
            required: true,
            description: 'Employee password.'
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Login successful',
        },
        notEmployee: {
            statusCode: 404,
            description: 'Employee not found',
        },
        passwordIsWrong: {
            statusCode: 400,
            description: 'Password is wrong',
        },
        error: {
            description: 'Something went wrong',
        },
    },


    fn: async function (inputs, exits) {
        try {
            const employeeDB = await Employee.findOne({ email: inputs.email });

            if (!employeeDB) {
                return exits.notEmployee({
                    message: `${inputs.email} is not registered as employee`
                });
            }

            await sails.helpers.passwords.checkPassword(inputs.password, employeeDB.password)
                .intercept('incorrect', (error) => {
                    return exits.passwordIsWrong({
                        message: error.message
                    });
            });

            const token = await sails.helpers.generateNewJwtToken(employeeDB.email, employeeDB.id, 'employee');

            return exits.success({
                message: `${employeeDB.email} has been logged in`,
                data: employeeDB,
                role: 'employee',
                token: token
            });

        } catch (error) {
            return exits.error({
                message: 'Oops :) an error occurred',
                error: error.message
            });
        }
    }
};
