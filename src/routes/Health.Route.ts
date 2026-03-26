import { Router } from "express";
import HealthController from "../controllers/Health.Controller";

class HealthRoute {   

    public router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    } 

    private initializeRoutes() {
        this.router.get('/', HealthController);
    }
}

const healthRoute = new HealthRoute();
export const path = '/health';
export default healthRoute.router;