module.exports = {

    friendlyName: 'View',

    description: 'View pond tools.',

    inputs: {
        id: {
            type: 'number'
        }
    },

    exits: {
        success: {
        statusCode: 200,
        description: 'Success View',
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
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            if (data.role !== 'employee' && data.role !== 'admin' && data.role !== 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            if (inputs.id) {
                let pondTool = await PondTools.findOne({ id: inputs.id });

                if (!pondTool) {
                    return exits.error({
                        message: 'Pond tool not found'
                    });
                } else {
                    return exits.success({
                        message: `Success view pond`,
                        data: pondTool
                    });
                }
            } else {
                let pondTools = await PondTools.find();

                return exits.success({
                message: `Success view all pond`,
                data: pondTools
                });
            }
        } catch (error) {
            return exits.error({
                message: 'Something went wrong',
                error: error.message
            });
        }
    }
};
