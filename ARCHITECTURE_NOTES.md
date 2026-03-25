# AgileTaskManager - Architecture Notes

##  1. `/health` endpoint:

-  What is `/health`: Health is Route that used to check Uptime of the application
-  Why it exists: This helps to check whethr App is Running or not
-  Who uses it: 
 --Any app monitoring softwares like newrelic can hit this endpoint to check whether the service is running or not. If this fails, newrelic can alert the de team  
 -- Any developer who is using this Application server can use this endpoint to check the status of application whether it is running or not. User gets `{"status":"OK","uptime":7,"timestamp":"2026-03-25T01:43:40.277Z"}` as response else we return a 404. Depending on the response, any API user can test the connection and make a call.

 ###  TODO: Production Considerations

- Types of health checks:
  - Liveness (is app running?)
  - Readiness (are dependencies ready?)

- Usage:
  - Load balancers use this for routing traffic
  - Monitoring tools use this for alerting

- Design requirements:
  - Must be fast (low latency)
  - Must be lightweight (no heavy operations)

- Failure scenarios:
  - Dependency failure (DB down)
  - Partial system availability
  - Impact on traffic routing

---

## 2. `/user` endpoint: