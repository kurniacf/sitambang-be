const jwt = require('jsonwebtoken');
module.exports = {
    friendlyName: 'Generate new jwt token',

    description: '',

    inputs: {
        subject1: {
        type: 'string',
        required: true,
        },
        subject2: {
        type: 'string',
        },
        subject3: {
        type: 'string',
        }
    },

    exits: {
        success: {
        description: 'All done.',
        },
    },

    fn: async function (inputs) {
        const payload = {
        email: inputs.subject1,
        id: inputs.subject2,
        role: inputs.subject3,
        iss: 'kurniacf SailsJS API',
        };

        const secret = sails.config.JWT_SECRET || process.env.JWT_SECRET || 'secret';
        const token = jwt.sign(payload, secret, { expiresIn: '1d' });
        return token;
    },
};
