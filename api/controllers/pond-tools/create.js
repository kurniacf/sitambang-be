module.exports = {

    friendlyName: 'Create',

    description: 'Create pond tools.',

    inputs: {
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
            statusCode: 400,
            description: 'Error',
        },
        notEmployee: {
            statusCode: 404,
            description: 'Role not employee'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

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
                //data: token
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
