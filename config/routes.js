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

    // EMPLOYEE
    'POST /employee/register': 'employee/register',
    'POST /employee/login': 'employee/login',
    'POST /employee/forgot-password': 'employee/forgot-password',
    'POST /employee/reset-password': 'employee/reset-password',
    'GET /employee/view': 'employee/view',
    'GET /employee/view/:id': 'employee/view',
    'POST /employee/update': 'employee/update',
    'POST /employee/delete': 'employee/delete',

    // BUYER
    'POST /buyer/register': 'buyer/register',
    'POST /buyer/login': 'buyer/login',
    'POST /buyer/forgot-password': 'buyer/forgot-password',
    'POST /buyer/reset-password': 'buyer/reset-password',
    'GET /buyer/view': 'buyer/view',
    'GET /buyer/view/:id': 'buyer/view',
    'POST /buyer/update': 'buyer/update',
    'POST /buyer/delete': 'buyer/delete',

    // POND TOOLS
    'POST /pondtool/create': 'pond-tools/create',
    'GET /pondtool/view/': 'pond-tools/view',
    'GET /pondtool/view/:id': 'pond-tools/view',
    'POST /pondtool/update': 'pond-tools/update',
    'POST /pondtool/delete': 'pond-tools/delete',

    // STOCKS
    'POST /stock/create': 'stocks/create',
    'GET /stock/view/': 'stocks/view',
    'GET /stock/view/:id': 'stocks/view',
    'POST /stock/update': 'stocks/update',
    'POST /stock/delete': 'stocks/delete',

    // TRANSACTIONS
    'POST /transaction/create': 'transaction/create',
    'POST /transaction/update': 'transaction/update',
    'POST /transaction/delete': 'transaction/delete',
    'GET /transaction/view/': 'transaction/view',
    'GET /transaction/view/:id_transaction&:id_buyer': 'transaction/view',
    'GET /transaction/view-confirmed/': 'transaction/view-confirmed',
    'GET /transaction/view-confirmed/:id_buyer': 'transaction/view-confirmed',
    'GET /transaction/view-pending/': 'transaction/view-pending',
    'GET /transaction/view-pending/:id_buyer': 'transaction/view-pending',
    'GET /transaction/view-cancelled/': 'transaction/view-cancelled',
    'GET /transaction/view-cancelled/:id_buyer': 'transaction/view-cancelled',
};
