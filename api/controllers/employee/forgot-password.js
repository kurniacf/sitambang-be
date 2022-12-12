module.exports = {

    friendlyName: 'Forgot password',

    description: 'Forgot Password employee',

    inputs: {
        email: {
            type: 'string',
            required: true,
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Forgot password successful',
        },
        emailWrong: {
            statusCode: 400,
            description: 'Email admin is wrong',
        }
    },

    fn: async function (inputs, exits) {
        try {
            const employeeDB = await Employee.findOne({ email: inputs.email });
            if (!employeeDB) {
                return exits.emailWrong({
                    message: 'Email is wrong or not registered'
                });
            }

            const token = await sails.helpers.strings.random('url-friendly');

            await Employee.update({ id: employeeDB.id }).set({
                passwordResetToken: token,
                passwordResetTokenExpiresAt:
                Date.now() + sails.config.custom.passwordResetTokenTTL,
            });

            return exits.success({
                message: 'Forgot password successful',
                token: token
            });

        } catch (error) {
            return exits.error({
                message: error.message
            });
        }
    }
};
