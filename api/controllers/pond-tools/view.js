module.exports = {

    friendlyName: 'View',

    description: 'View pond tools.',

    inputs: {
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success View',
        },
        error: {
            statusCode: 404,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not employee'
        },
        mustInput: {
            statusCode: 404,
            description: 'Must input id'
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            let idPondTool = this.req.param('id');
            let pondTool;

            if (data.role === 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            } else if (data.role === 'employee' || data.role === 'admin') {
                if (idPondTool) {
                    pondTool = await PondTools.findOne({id: idPondTool});
                } else {
                    pondTool = await PondTools.find();
                }
            }

            return exits.success({
                message: `Success view pond`,
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
