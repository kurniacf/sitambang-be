module.exports = {
    friendlyName: 'Register',

    description: 'Register admin.',

    inputs: {
        name: {
            type: 'string',
            required: true,
        },
        email: {
            type: 'string',
            required: true,
            unique: true,
            isEmail: true,
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6,
        },
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'New admin created',
        },
        emailAlreadyInUse: {
            statusCode: 400,
            description: 'Email address already in use',
        },
        error: {
            description: 'Something went wrong',
        },
    },

    fn: async function (inputs, exits) {
        // All done.
        try {
            const newEmailAddress = inputs.email.toLowerCase();
            let newAdmin = await Admin.create({
                name: inputs.name,
                email: newEmailAddress,
                password: inputs.password
            });

            return exits.success({
                message: `An account has been created for ${inputs.email} successfully.`,
                data: newAdmin
            });
        } catch (error) {
            if (error.code === 'E_UNIQUE') {
                return exits.emailAlreadyInUse({
                    message: 'Oops :) an error occurred',
                    error: 'This email address already exits',
                });
            }
            return exits.error({
                message: 'Oops :) an error occurred',
                error: error.message,
            });
        }
    },
};
