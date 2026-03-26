import express from 'express';
import HealthRoute, { path as healthPath } from './routes/Health.Route';
import UserRoute, { path as userPath } from './routes/User.Route';

class App {
    public express;

    constructor() {
        this.express = express();
        this.configureMiddleware();
        this.mountRoutes();
    }

    private configureMiddleware() {
        this.express.use(express.json());
    }

    private mountRoutes() {
       this.express.use(healthPath, HealthRoute);
       this.express.use(userPath, UserRoute);
    }
}

export default new App().express;

