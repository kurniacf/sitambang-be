module.exports = {
    friendlyName: 'Login',

    description: 'Login admin.',

    inputs: {
        email: {
            type: 'string',
            required: true,
        },
        password: {
            type: 'string',
            required: true,
        },
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Login successful',
        },
        notAdmin: {
            statusCode: 404,
            description: 'Admin not found',
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
            const adminDB = await Admin.findOne({ email: inputs.email });

            if (!adminDB) {
                return exits.notAdmin({
                    message: `${inputs.email} is not registered as admin`
                });
            }

            await sails.helpers.passwords.checkPassword(inputs.password, adminDB.password)
                .intercept('incorrect', (error) => {
                    return exits.passwordIsWrong({
                        message: error.message
                    });
                });

            const token = await sails.helpers.generateNewJwtToken(adminDB.email, adminDB.id, 'admin');

            return exits.success({
                message: `${adminDB.email} has been logged in`,
                data: adminDB,
                role: 'admin',
                token: token
            });

        } catch (error) {
            return exits.error({
                message: 'Oops :) an error occurred',
                error: error.message
            });
        }
    },
};
