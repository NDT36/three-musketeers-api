import rateLimit from 'express-rate-limit';

export default function limiter(max = 300, ms = 60000) {
  return rateLimit({
    windowMs: ms,
    max: max,
    message: `{
            "success": false,
            "errorCode": -1,
            "errorMessage": "Maximum_Request",
            "data": null
        }`,
  });
}
