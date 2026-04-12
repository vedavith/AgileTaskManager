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
            res.status(500).json({message: 'Internal server error'});
        }
    }

    public getAllUsers = async (req: Request, res: Response) => {

        // Get the soft delete users
        const includeDeleted = req.query.includeDeleted === "true";

        const users = await UserService.getAllUsers(includeDeleted);
        if (users.length === 0) {
            return res.status(404).json({message: 'No users found'});
        }
        res.status(200).json(users);
    }

    public getUser = async (req: Request, res: Response) => {
        const {id} = req.params;
        const user = await UserService.getUserById(id);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user);
    }

    public updateUser = async (req: Request, res: Response) => {
        try {
            const {id} = req.params;
            const updatedUser = req.body;
            const user = await UserService.updateUser(id, updatedUser);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            res.status(200).json(user);
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            res.status(500).json({message: 'Internal server error'});
        }
    }

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const {id} = req.params;

            const user = await UserService.deleteUser(id);

            if (!user) {
                return res.status(404).json({
                    error: {
                        message: "User not found",
                        code: "NOT_FOUND"
                    }
                });
            }

            return res.status(200).json({
                data: {
                    id: user.id,
                    isDeleted: user.isDeleted,
                    deletedAt: user.deletedAt
                },
                message: "User soft deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: {
                    message: "Internal server error",
                    code: "INTERNAL_ERROR"
                }
            });
        }
    };

    public permanentlyDeleteUser = async (req: Request, res: Response) => {
        try {
            const {id} = req.params;

            const user = await UserService.permanentlyDeleteUser(id);

            if (!user) {
                return res.status(404).json({
                    error: {
                        message: "User not found",
                        code: "NOT_FOUND"
                    }
                });
            }

            return res.status(200).json({
                data: {
                    id: user.id,
                    isDeleted: user.isDeleted,
                    deletedAt: user.deletedAt
                },
                message: "User soft deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                error: {
                    message: "Internal server error",
                    code: "INTERNAL_ERROR"
                }
            });
        }
    };
}

export default new UserController();