module.exports = {

    friendlyName: 'Reset password',

    description: 'Reset password for buyer',

    inputs: {
        password: {
            description: 'The new, unencrypted password.',
            example: 'myfancypassword',
            required: true,
        },
        token: {
            description:
                'The password token that was in the forgot-password endpoint',
            example: 'gwa8gs8hgw9h2g9hg29',
            required: true,
        },
    },

    exits: {
        success: {
            description:
                'Password successfully updated, and requesting user agent automatically logged in',
        },
        invalidToken: {
            statusCode: 401,
            description:
                'The provided password token is invalid, expired, or has already been used.',
        },
    },

    fn: async function (inputs, exits) {

        if (!inputs.token) {
            return exits.invalidToken({
                error: 'Your reset token is either invalid or expired',
            });
        }
        let buyerDB = await Buyer.findOne({ passwordResetToken: inputs.token });

        if (!buyerDB || buyerDB.passwordResetTokenExpiresAt <= Date.now()) {
            return exits.invalidToken({
                error: 'Your reset token is either invalid or expired',
            });
        }

        const hashedPassword = await sails.helpers.passwords.hashPassword(
            inputs.password
        );

        await Buyer.updateOne({ id: buyerDB.id }).set({
            password: hashedPassword,
            passwordResetToken: '',
            passwordResetTokenExpiresAt: 0,
        });

        const token = await sails.helpers.generateNewJwtToken(buyerDB.email, buyerDB.id, 'buyer');

        this.req.buyerDB = buyerDB;
        return exits.success({
            message: `Password reset successful. ${buyerDB.email} has been logged in`,
            data: buyerDB,
            role: 'buyer',
            token,
        });
    }
};
