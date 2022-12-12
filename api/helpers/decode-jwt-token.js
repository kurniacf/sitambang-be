const jwt = require('jsonwebtoken');
module.exports = {
    friendlyName: 'Generate new jwt token',

    description: '',

    inputs: {
        token: {
            type: 'string',
            required: true,
        },
    },

    exits: {
        success: {
            status: 200,
            description: 'All done.',
        },
    },

    fn: async function (inputs) {
        const secret = sails.config.JWT_SECRET || process.env.JWT_SECRET || 'secret';
        const payload = jwt.verify(inputs.token, secret, { expiresIn: '1d' });
        return payload;
    },
};
