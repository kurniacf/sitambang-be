/* eslint-disable camelcase */
module.exports = {

    friendlyName: 'Register',

    description: 'Register Buyer.',

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
        phone_number: {
            type: 'string',
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'New Buyer created',
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
        try {
            const newEmailAddress = inputs.email.toLowerCase();

            let newBuyer = await Buyer.create({
                name: inputs.name,
                email: newEmailAddress,
                password: inputs.password,
                phone_number: inputs.phone_number
            });

            return exits.success({
                message: `An account has been created for ${inputs.email} successfully.`,
                data: newBuyer
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
    }
};
