# AgileTaskManager - Architecture Notes

-  What is `/health`: Health is Route that used to check Uptime of the application
-  Why it exists: This helps to check whethr App is Running or not
-  Who uses it: Any developer who is using this Application server can use this endpoint to check the status of application whether it is running or not. User gets `{"status":"OK","uptime":7,"timestamp":"2026-03-25T01:43:40.277Z"}`
as response else we return a 404. Depending on the response, any API user can test the connection and make a call.