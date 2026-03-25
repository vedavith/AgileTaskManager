import express from 'express';
import HealthRoute from './routes/Health.Route';

class App {
    public express;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes() {
       this.express.use('/health', HealthRoute);
    }
}

export default new App().express;

