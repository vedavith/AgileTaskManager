import { Router } from "express";
import HealthController from "../controllers/Health.Controller";

class HealthRoute {   

    public router;
    constructor() {
        this.router = Router();
    } 

    public initializeRoutes() {
        this.router.get('/', HealthController);
        return this.router;
    }
}

export default new HealthRoute().initializeRoutes();