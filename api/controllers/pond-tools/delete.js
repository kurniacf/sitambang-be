module.exports = {

    friendlyName: 'Delete',

    description: 'Delete pond tool.',

    inputs: {
        id: {
            type: 'number',
            required: true
        },
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success update',
        },
        error: {
            statusCode: 500,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not employee'
        },
        failDeleted: {
            statusCode: 404,
            description: 'Fail deleted'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];

            const data = await sails.helpers.decodeJwtToken(token);

            if (data.role === 'buyer') {
                return exits.notRole({
                message: 'Role not employee or admin'
                });
            }

            let pondToolData = await PondTools.findOne({ id: inputs.id });

            if (!pondToolData) {
                return exits.error({
                message: 'Pond tool not found'
                });
            }

            await PondTools.destroyOne({ id: inputs.id });

            return exits.success({
                message: `Success delete pond tool`
            });

        } catch (error) {
            return exits.error({
                message: `Error delete pond tool`,
                error: error.message
            });
        }
    }
};
