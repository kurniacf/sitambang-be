module.exports = {

    friendlyName: 'Login',

    description: 'Login buyer.',

    inputs: {
        email: {
        type: 'string',
        required: true,
        isEmail: true,
        description: 'Buyer email.'
        },
        password: {
        type: 'string',
        required: true,
        description: 'Buyer password.'
        }
    },

    exits: {
        success: {
        statusCode: 200,
        description: 'Login successful',
        },
        notBuyer: {
        statusCode: 404,
        description: 'Buyer not found',
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
        const buyerDB = await Buyer.findOne({ email: inputs.email });

        if (!buyerDB) {
            return exits.notBuyer({
            message: `${inputs.email} is not registered as buyer`
            });
        }

        await sails.helpers.passwords.checkPassword(inputs.password, buyerDB.password)
            .intercept('incorrect', (error) => {
            return exits.passwordIsWrong({
                message: error.message
            });
            });

        const token = await sails.helpers.generateNewJwtToken(buyerDB.email, buyerDB.id, 'buyer');

        return exits.success({
            message: `${buyerDB.email} has been logged in`,
            data: buyerDB,
            role: 'buyer',
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
