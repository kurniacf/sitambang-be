/**
 * PondTools.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'pond_tools',
    attributes: {
        name: {
            type: 'string',
            required: true,
            columnName: 'name'
        },
        employeeID: {
            type: 'number',
            required: true,
            columnName: 'employee_id',
        },
        condition: {
            type: 'string',
            columnName: 'condition'
        }
    },
};

