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
        },
        idEmployee: {
            type: 'number',
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'Success Create',
        },
        error: {
            statusCode: 404,
            description: 'Error',
        },
        notRole: {
            statusCode: 404,
            description: 'Role not access'
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

            let employeeData;

            if (data.role === 'buyer') {
                return exits.notRole({
                    message: 'Role not employee or admin'
                });
            } else if (data.role === 'employee') {
                if(inputs.idEmployee)  {
                    return exits.notRole({
                        message: 'Role not admin'
                    });
                }
                employeeData = await Employee.findOne({ id: data.id });
            } else if (data.role === 'admin') {
                if (!inputs.idEmployee) {
                    return exits.mustInput({
                        message: 'must input id employee'
                    });
                }
                employeeData = await Employee.findOne({ id: inputs.idEmployee });
            }

            let pondTool = await PondTools.create({
                name: inputs.name,
                condition: inputs.condition,
                idEmployee: data.id,
                nameEmployee: employeeData.name
            }).fetch();

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
