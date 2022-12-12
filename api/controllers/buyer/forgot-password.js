module.exports = {

    friendlyName: 'Forgot password',

    description: 'Forgot Password Buyer',

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
        description: 'Email buyer is wrong',
        }
    },


    fn: async function (inputs, exits) {
        try {
        const buyerDB = await Buyer.findOne({ email: inputs.email });
        if (!buyerDB) {
            return exits.emailWrong({
            message: 'Email is wrong or not registered'
            });
        }

        const token = await sails.helpers.strings.random('url-friendly');

        await Buyer.update({ id: buyerDB.id }).set({
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
