module.exports = {

    friendlyName: 'Update',

    description: 'Update pond tools.',

    inputs: {
        id: {
            type: 'number',
            required: true
        },
        idEmployee: {
            type: 'number'
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

                await PondTools.updateOne({ id: inputs.id }).set({
                    name: inputs.name,
                    condition: inputs.condition,
                    idEmployee: data.id,
                    nameEmployee: employeeData.name
                });
            } else if (data.role === 'admin') {
                if (!inputs.idEmployee) {
                    return exits.mustInput({
                        message: 'must input id employee'
                    });
                }
                employeeData = await Employee.findOne({ id: inputs.idEmployee });

                await PondTools.updateOne({ id: inputs.id }).set({
                    name: inputs.name,
                    condition: inputs.condition,
                    idEmployee: inputs.idEmployee,
                    nameEmployee: employeeData.name
                });
            }

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
