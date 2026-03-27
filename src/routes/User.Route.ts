import { Router } from 'express';
import UserController from '../controllers/User.Controller';

class UserRoute {
    public router;

    constructor() {
        this.router = Router();        
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', UserController.getAllUsers);
        this.router.post('/', UserController.createUser);
        this.router.get('/:id', UserController.getUser);
        this.router.put('/:id', UserController.updateUser);
        this.router.delete('/:id', UserController.deleteUser);  
    };
}

const userRoute = new UserRoute();
export const path = '/users';
export default userRoute.router;

