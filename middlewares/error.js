const ErrorHandler = (error) => {
    let retObj = null;
    switch (error) {
        case "EXIST" : 
            retObj =  {result: false, status : 409, message: "Conflict"}
            break
        case "NOAUTH" : 
            retObj =  {result: false, status : 401, message: "Unauthorized"}
            break
        case "FORBIDDEN" : 
            retObj =  {result: false, status : 403, message: "Forbidden"}
            break
        case "NOCODE" :
            retObj =  {result: false, status : 403, message: "Forbidden"}
            break
        case "BADREQ" :
            retObj =  {result: false, status : 400, message: "Bad Request"}
            break
        case "NOTFOUND" :
            retObj =  {result: false, status : 404, message: "Not Found"}
            break
        default :      
            retObj =  {result: false, status : 400, message: "Process Error"}
            break
    }
    return retObj
}

module.exports = {
    ErrorHandler
}