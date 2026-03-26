import { Request, Response } from "express";
import UserService from "../services/User.Service";
import ValidationError from "../errors/Validation.Error";

class UserController {
    public createUser = async (req: Request, res: Response) => {
        try {
            const user = req.body;
            const createdUser = await UserService.createUser(user);
            res.status(201).json(createdUser);
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    public getUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    public updateUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updatedUser = req.body;
            const user = await UserService.updateUser(id, updatedUser);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    public deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserService.deleteUser(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json({ message: 'User deleted successfully' });
    }
}

export default new UserController();