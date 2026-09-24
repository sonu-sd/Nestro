// success response
const sendSuccess = (res, message = "success") => {
  return res.status(200).json({
    success: true,
    message,
  });
};

//created response
const sendCreated = (res, message = "Create successfully") => {
  return res.status(201).json({
    success: true,
    message,
  });
};

//basd request (validation errors)
const sendBadRequest = (res, message = "Bad request") => {
  return res.status(400).json({
    success: false,
    message,
  });
};

//not found
const sendNotFound = (res, message = "Resource not found") => {
  return res.status(404).json({
    success: false,
    message,
  });
};

// conflict (already exists)
const sendConflict = (res, message = "Data already exists") => {
  return res.status(409).json({
    success: false,
    message,
  });
};

const sendUnauthorized = (res, message = "Authentication required") => {
  return res.status(401).json({
    success: false,
    message,
  });
};

const sendForbidden = (res, message = "Access denied") => {
  return res.status(403).json({
    success: false,
    message,
  });
};

//server error
const sendServerError = (res, error) => {
  console.error(
    JSON.stringify({
      level: "error",
      requestId: res.req?.requestId,
      message: error?.message || "Unknown server error",
    }),
  );
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    requestId: res.req?.requestId,
  });
};

export {
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendForbidden,
  sendNotFound,
  sendServerError,
  sendSuccess,
  sendUnauthorized,
};

// function sendErrorServer(res) {
//   return  res.status(500).json({
//         message: "internal server error",
//         success: false

//     })
// }

// function sendBadReq(res, message = "Bad request") {

//     return res.status(400).json({
//         message,
//         success: false
//     })
// }
// export { sendErrorServer,sendBedReq }
