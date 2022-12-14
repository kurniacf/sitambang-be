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
        }
    },

    fn: async function (inputs, exits) {
        try {
            let credential = this.req.headers.authorization.split(' ');

            let token = credential[1];
            const data = await sails.helpers.decodeJwtToken(token);

            let idPondTool = this.req.param('id');

            if (data.role !== 'employee' && data.role !== 'admin' && data.role !== 'buyer') {
                return exits.notRole({
                    message: 'Dont not access role'
                });
            }

            let employeeData = await Employee.findOne({ id: data.id });
            let nameEmployee = employeeData.name;

            if (idPondTool) {
                let pondTool = await PondTools.findOne({ id: idPondTool });
                pondTool.nameEmployee = nameEmployee;

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
                pondTools.forEach(pondTool => {
                    pondTool.nameEmployee = nameEmployee;
                });

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
