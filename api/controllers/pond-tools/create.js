module.exports = {

    friendlyName: 'Create',

    description: 'Create pond tools.',

    inputs: {
        token: {
            required: true,
            type: 'string',
        },
        name: {
            required: true,
            type: 'string',
        },
        condition: {
            type: 'string',
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success Create',
        },
        error: {
            statusCode: 500,
            description: 'Error',
        },
        notEmployee: {
            statusCode: 404,
            description: 'Role not employee'
        }
    },

    fn: async function (inputs, exits) {
        try {
            const data = await sails.helpers.decodeJwtToken(inputs.token);

            if (data.role === 'buyer') {
                return exits.notEmployee({
                message: 'Role not employee or admin'
                });
            }

            let pondTool = await PondTools.create({
                name: inputs.name,
                condition: inputs.condition,
                employeeID: data.id
            });

            return exits.success({
                message: `Success create pond tool`,
                data: pondTool
            });

        } catch (error) {
            return exits.error({
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};
