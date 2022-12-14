module.exports = {

    friendlyName: 'Update',

    description: 'Update pond tools.',

    inputs: {
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
            statusCode: 404,
            description: 'Error',
        },
        notRole: {
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
                return exits.notRole({
                message: 'Role not employee or admin'
                });
            }

            let employeeData = await Employee.findOne({ id: data.id });

            await PondTools.updateOne({ id: inputs.id }).set({
                name: inputs.name,
                condition: inputs.condition,
                nameEmployee: employeeData.name
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
