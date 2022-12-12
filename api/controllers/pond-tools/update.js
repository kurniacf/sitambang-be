module.exports = {

    friendlyName: 'Update',

    description: 'Update pond tools.',

    inputs: {
        token: {
            required: true,
            type: 'string',
        },
        id: {
            type: 'number',
            required: true
        },
        name: {
            type: 'string',
        },
        condition: {
            type: 'string',
        }
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
        }
    },

    fn: async function (inputs, exits) {
        try {
            const data = await sails.helpers.decodeJwtToken(inputs.token);

            if (data.role === 'buyer') {
                return exits.notRole({
                message: 'Role not employee or admin'
                });
            }

            await PondTools.updateOne({ id: inputs.id }).set({
                name: inputs.name,
                condition: inputs.condition
            });

            let pondTool = await PondTools.findOne({ id: inputs.id });

            return exits.success({
                message: `Success update pond tool`,
                data: pondTool
            });

        } catch (error) {
            return exits.error({
                message: `Error update pond tool`,
                error: error.message
            });
        }
    }
};
