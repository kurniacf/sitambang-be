/* eslint-disable camelcase */
module.exports = {

    friendlyName: 'Register',

    description: 'Register Employee.',

    inputs: {
        name: {
            type: 'string',
            required: true,
        },
        email: {
            type: 'string',
            required: true,
            unique: true,
            isEmail: true,
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6,
        },
        gender: {
            type: 'string',
            enum: ['male', 'female'],
            required: true,
        },
        address: {
            type: 'string',
        },
        place_of_birth: {
            type: 'string',
        },
        date_of_birth: {
            type: 'string',
            format: 'date-time',
        },
        position: {
            type: 'string',
            required: true,
        },
        phone_number: {
            type: 'string',
        }
    },

    exits: {
        success: {
            statusCode: 200,
            description: 'New Employee created',
        },
        emailAlreadyInUse: {
            statusCode: 400,
            description: 'Email address already in use',
        },
        error: {
            description: 'Something went wrong',
        },
    },


    fn: async function (inputs, exits) {
        try {
            const newEmailAddress = inputs.email.toLowerCase();

            let newEmployee = await Employee.create({
                name: inputs.name,
                email: newEmailAddress,
                password: inputs.password,
                gender: inputs.gender,
                address: inputs.address,
                place_of_birth: inputs.place_of_birth,
                date_of_birth: inputs.date_of_birth,
                position: inputs.position,
                phone_number: inputs.phone_number
            });

            return exits.success({
                message: `An account has been created for ${inputs.email} successfully.`,
                data: newEmployee
            });

        } catch (error) {
            if (error.code === 'E_UNIQUE') {
                return exits.emailAlreadyInUse({
                    message: 'Oops :) an error occurred',
                    error: 'This email address already exits',
                });
            }
            return exits.error({
                message: 'Oops :) an error occurred',
                error: error.message,
            });
        }
    }
};
