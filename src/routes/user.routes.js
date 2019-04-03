import UserController from '../controller/user.controller';

const UserRoutes = (router) => {

    router.route('/users')
        .get(UserController.findAll)
        .post(UserController.create);
    router.route('/users/:id')
        .get(UserController.findOne);
    //     .put(UserController.update)
    //     .patch(UserController.update)
    //     .delete(UserController.delete)
    router.route('/users/login').post(UserController.login);
    router.route('/users/check-email').post(UserController.checkExistEmail);
    router.route('/users/check-username').post(UserController.checkExistUserName);
}

export default UserRoutes;