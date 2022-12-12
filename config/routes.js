/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    // AUTHENTICATION
    'POST /auth/check-account': 'authentication/check-account',

    // ADMIN
    'POST /admin/register': 'admin/register',
    'POST /admin/login': 'admin/login',
    'POST /admin/forgot-password': 'admin/forgot-password',
    'POST /admin/reset-password': 'admin/reset-password',
    'POST /admin/view': 'admin/view',
    'POST /admin/update': 'admin/update',
    'POST /admin/delete': 'admin/delete',

    
};
