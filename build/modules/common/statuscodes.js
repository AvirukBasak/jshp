'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusMessage = exports.getStatusMessageList = exports.sysErrToHTTPcode = void 0;
/**
 * Returns an http error code for a given system error code.
 * @param {string} error
 * @return {number}
 */
const sysErrToHTTPcode = function (error) {
    const code = error.code;
    return (code === 'EACCES' ? 401 :
        code === 'ENOTDIR' ? 401 :
            code === 'EISDIR' ? 400 :
                code === 'ENOENT' ? 404 :
                    code === 'EPERM' ? 401 : 500);
};
exports.sysErrToHTTPcode = sysErrToHTTPcode;
/**
 * @return {NodeJS.Dict<string>} An object
 */
const getStatusMessageList = function () {
    return {
        "100": "Continue",
        "101": "Switching Protocols",
        "102": "Processing",
        "103": "Early Hints",
        "200": "OK",
        "201": "Created",
        "202": "Accepted",
        "203": "Non-Authoritative Information",
        "204": "No Content",
        "205": "Reset Content",
        "206": "Partial Content",
        "207": "Multi-Status",
        "208": "Already Reported",
        "226": "IM Used",
        "300": "Multiple Choices",
        "301": "Moved Permanently",
        "302": "Found",
        "303": "See Other",
        "304": "Not Modified",
        "305": "Use Proxy",
        "306": "Switch Proxy",
        "307": "Temporary Redirect",
        "308": "Permanent Redirect",
        "400": "Bad Request",
        "401": "Unauthorized",
        "402": "Payment Required",
        "403": "Forbidden",
        "404": "Not Found",
        "405": "Method Not Allowed",
        "406": "Not Acceptable",
        "407": "Proxy Authentication Required",
        "408": "Request Timeout",
        "409": "Conflict",
        "410": "Gone",
        "411": "Length Required",
        "412": "Precondition Failed",
        "413": "Payload Too Large",
        "414": "URI Too Long",
        "415": "Unsupported Media Type",
        "416": "Range Not Satisfiable",
        "417": "Expectation Failed",
        "418": "I'm a teapot",
        "421": "Misdirected Request",
        "422": "Unprocessable Entity",
        "423": "Locked",
        "424": "Failed Dependency",
        "425": "Too Early",
        "426": "Upgrade Required",
        "428": "Precondition Required",
        "429": "Too Many Requests",
        "431": "Request Header Fields Too Large",
        "451": "Unavailable For Legal Reasons",
        "500": "Internal Server Error",
        "501": "Not Implemented",
        "502": "Bad Gateway",
        "503": "Service Unavailable",
        "504": "Gateway Timeout",
        "505": "HTTP Version Not Supported",
        "506": "Variant Also Negotiates",
        "507": "Insufficient Storage",
        "508": "Loop Detected",
        "510": "Not Extended",
        "511": "Network Authentication Required",
    };
};
exports.getStatusMessageList = getStatusMessageList;
/**
 * @param {number} statusCode Response status code
 * @return {string} Status message
 */
const getStatusMessage = function (statusCode = 500) {
    const listOfStatusMessages = (0, exports.getStatusMessageList)();
    if (Object.keys(listOfStatusMessages).includes(String(statusCode)))
        return listOfStatusMessages[String(statusCode)];
    else
        return "Internal Server Error";
};
exports.getStatusMessage = getStatusMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzY29kZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9jb21tb24vc3RhdHVzY29kZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYjs7OztHQUlHO0FBQ0ksTUFBTSxnQkFBZ0IsR0FBRyxVQUFTLEtBQVU7SUFDL0MsTUFBTSxJQUFJLEdBQVcsS0FBSyxDQUFDLElBQUksQ0FBQztJQUNoQyxPQUFPLENBQ0gsSUFBSSxLQUFLLFFBQVEsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsSUFBSSxLQUFLLFFBQVEsQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFCLElBQUksS0FBSyxRQUFRLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMxQixJQUFJLEtBQUssT0FBTyxDQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDakMsQ0FBQztBQUNOLENBQUMsQ0FBQTtBQVRZLFFBQUEsZ0JBQWdCLG9CQVM1QjtBQUVEOztHQUVHO0FBQ0ksTUFBTSxvQkFBb0IsR0FBRztJQUNoQyxPQUFPO1FBQ0gsS0FBSyxFQUFFLFVBQVU7UUFDakIsS0FBSyxFQUFFLHFCQUFxQjtRQUM1QixLQUFLLEVBQUUsWUFBWTtRQUNuQixLQUFLLEVBQUUsYUFBYTtRQUNwQixLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxTQUFTO1FBQ2hCLEtBQUssRUFBRSxVQUFVO1FBQ2pCLEtBQUssRUFBRSwrQkFBK0I7UUFDdEMsS0FBSyxFQUFFLFlBQVk7UUFDbkIsS0FBSyxFQUFFLGVBQWU7UUFDdEIsS0FBSyxFQUFFLGlCQUFpQjtRQUN4QixLQUFLLEVBQUUsY0FBYztRQUNyQixLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLEtBQUssRUFBRSxTQUFTO1FBQ2hCLEtBQUssRUFBRSxrQkFBa0I7UUFDekIsS0FBSyxFQUFFLG1CQUFtQjtRQUMxQixLQUFLLEVBQUUsT0FBTztRQUNkLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxjQUFjO1FBQ3JCLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxjQUFjO1FBQ3JCLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsS0FBSyxFQUFFLG9CQUFvQjtRQUMzQixLQUFLLEVBQUUsYUFBYTtRQUNwQixLQUFLLEVBQUUsY0FBYztRQUNyQixLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsS0FBSyxFQUFFLGdCQUFnQjtRQUN2QixLQUFLLEVBQUUsK0JBQStCO1FBQ3RDLEtBQUssRUFBRSxpQkFBaUI7UUFDeEIsS0FBSyxFQUFFLFVBQVU7UUFDakIsS0FBSyxFQUFFLE1BQU07UUFDYixLQUFLLEVBQUUsaUJBQWlCO1FBQ3hCLEtBQUssRUFBRSxxQkFBcUI7UUFDNUIsS0FBSyxFQUFFLG1CQUFtQjtRQUMxQixLQUFLLEVBQUUsY0FBYztRQUNyQixLQUFLLEVBQUUsd0JBQXdCO1FBQy9CLEtBQUssRUFBRSx1QkFBdUI7UUFDOUIsS0FBSyxFQUFFLG9CQUFvQjtRQUMzQixLQUFLLEVBQUUsY0FBYztRQUNyQixLQUFLLEVBQUUscUJBQXFCO1FBQzVCLEtBQUssRUFBRSxzQkFBc0I7UUFDN0IsS0FBSyxFQUFFLFFBQVE7UUFDZixLQUFLLEVBQUUsbUJBQW1CO1FBQzFCLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxrQkFBa0I7UUFDekIsS0FBSyxFQUFFLHVCQUF1QjtRQUM5QixLQUFLLEVBQUUsbUJBQW1CO1FBQzFCLEtBQUssRUFBRSxpQ0FBaUM7UUFDeEMsS0FBSyxFQUFFLCtCQUErQjtRQUN0QyxLQUFLLEVBQUUsdUJBQXVCO1FBQzlCLEtBQUssRUFBRSxpQkFBaUI7UUFDeEIsS0FBSyxFQUFFLGFBQWE7UUFDcEIsS0FBSyxFQUFFLHFCQUFxQjtRQUM1QixLQUFLLEVBQUUsaUJBQWlCO1FBQ3hCLEtBQUssRUFBRSw0QkFBNEI7UUFDbkMsS0FBSyxFQUFFLHlCQUF5QjtRQUNoQyxLQUFLLEVBQUUsc0JBQXNCO1FBQzdCLEtBQUssRUFBRSxlQUFlO1FBQ3RCLEtBQUssRUFBRSxjQUFjO1FBQ3JCLEtBQUssRUFBRSxpQ0FBaUM7S0FDM0MsQ0FBQztBQUNOLENBQUMsQ0FBQTtBQWxFWSxRQUFBLG9CQUFvQix3QkFrRWhDO0FBRUQ7OztHQUdHO0FBQ0ksTUFBTSxnQkFBZ0IsR0FBRyxVQUFTLGFBQXFCLEdBQUc7SUFDN0QsTUFBTSxvQkFBb0IsR0FBc0IsSUFBQSw0QkFBb0IsR0FBRSxDQUFDO0lBQ3ZFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUQsT0FBTyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7UUFFaEQsT0FBTyx1QkFBdUIsQ0FBQztBQUN2QyxDQUFDLENBQUE7QUFOWSxRQUFBLGdCQUFnQixvQkFNNUIifQ==