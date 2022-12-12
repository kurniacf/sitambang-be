module.exports = {

    friendlyName: 'Check account',

    description: 'Check Account Admin',

    inputs: {
        token: {
        type: 'string',
        required: true,
        }
    },

    exits: {
        success: {
        statusCode: 200,
        description: 'Check account successful',
        },
        error: {
        statusCode: 500,
        description: 'Something went wrong',
        },
        notAdmin: {
        statusCode: 401,
        description: 'Not admin',
        },
        notBuyer: {
        statusCode: 401,
        description: 'Not buyer',
        },
        notEmployee: {
        statusCode: 401,
        description: 'Not employee',
        }
    },

    fn: async function (inputs, exits) {
        try {
        const data = await sails.helpers.decodeJwtToken(inputs.token);

        if (data.role !== 'admin' && data.role !== 'buyer' && data.role !== 'employee') {
            return exits.notAdmin({
            message: 'Not admin'
            });
        }

        return exits.success({
            message: 'Check account successful',
            data
        });

        } catch (error) {
        return exits.error({
            message: error.message
        });
        }
    }
};
