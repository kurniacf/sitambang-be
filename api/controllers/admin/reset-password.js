module.exports = {
    friendlyName: 'Reset password',

    description: 'Reset password admin',

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
        let adminDB = await Admin.findOne({ passwordResetToken: inputs.token });


        if (!adminDB || adminDB.passwordResetTokenExpiresAt <= Date.now()) {
        return exits.invalidToken({
            error: 'Your reset token is either invalid or expired',
        });
        }


        const hashedPassword = await sails.helpers.passwords.hashPassword(
        inputs.password
        );


        await Admin.updateOne({ id: adminDB.id }).set({
        password: hashedPassword,
        passwordResetToken: '',
        passwordResetTokenExpiresAt: 0,
        });

        const token = await sails.helpers.generateNewJwtToken(adminDB.email, adminDB.id, 'admin');

        this.req.adminDB = adminDB;
        return exits.success({
        message: `Password reset successful. ${adminDB.email} has been logged in`,
        data: adminDB,
        role: 'admin',
        token,
        });
    },
};
