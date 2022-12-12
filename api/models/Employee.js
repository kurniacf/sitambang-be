/* eslint-disable camelcase */
/**
 * Employee.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'employee',
    attributes: {
        name: {
            type: 'string',
            required: true,
            columnName: 'name'
        },
        email: {
            type: 'string',
            required: true,
            columnName: 'email',
            unique: true
        },
        password: {
            type: 'string',
            required: true,
            columnName: 'password'
        },
        gender: {
            type: 'string',
            isIn: ['male', 'female'],
            defaultsTo: 'male',
            columnName: 'gender'
        },
        address: {
            type: 'string',
            columnName: 'address'
        },
        place_of_birth: {
            type: 'string',
            columnName: 'place_of_birth'
        },
        date_of_birth: {
            type: 'ref',
            columnType: 'datetime',
            columnName: 'date_of_birth'
        },
        position: {
            type: 'string',
            required: true,
            description: 'Position of user. example CEO, cashier, service, manager, etc',
            columnName: 'position'
        },
        phone_number: {
            type: 'string',
            columnName: 'phone_number'
        },
        passwordResetToken: {
            type: 'string',
            description:
                'A unique token used to verify the admin\'s identity when recovering a password.',
            columnName: 'password_reset_token',
        },
        passwordResetTokenExpiresAt: {
            type: 'number',
            description:
                'A timestamp representing the moment when this admin\'s `passwordResetToken` will expire (or 0 if the admin currently has no such token).',
            example: 1508944074211,
            columnName: 'password_reset_token_expires_at',
        },
    },
    customToJSON: function () {
        return _.omit(this, ['password']);
    },

    // LIFE CYCLE
    beforeCreate: async function (values, proceed) {
        // Hash password
        const hashedPassword = await sails.helpers.passwords.hashPassword(
            values.password
        );
        values.password = hashedPassword;
        return proceed();
    },
};

