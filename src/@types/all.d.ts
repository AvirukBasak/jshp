import * as http from '@types/node/http';

declare class Request extends http.IncomingMessage {
    path: string;
    queryString: string;
    query: NodeJS.Dict<any>;
}

export type HTTPRequest = http.IncomingMessage | Request;
