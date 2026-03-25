import { Request, Response } from 'express';
import { uptime } from 'process';

class HealthController {
    public checkHealth(req: Request, res: Response) {
        res.status(200).json(
            { 
                status: 'OK', 
                uptime: Math.round(uptime()),
                timestamp: new Date().toISOString()
            }
        );
    }
}

export default new HealthController().checkHealth;