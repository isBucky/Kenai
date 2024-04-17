import { z as zod } from 'zod';

export const Symbols = {
    router: Symbol('Kenai-Routers'),
    controller: Symbol('Kenai-Controllers'),
    resolved: Symbol('Kenai-Resolved'),
    global: Symbol('Kenai'),
};

export const RequestSchema = zod.object({
    id: zod.string(),
    query: zod.object({}).optional(),
    params: zod.object({}).optional(),
});

export const ReplySchema = zod.object({
    raw: zod.object({}).optional(),
    request: zod.object({}).optional(),
    statusCode: zod.number().optional(),
});

// export const resolveKeys = (...keys: string[]) => keys.join(':');

export function getObjectValue(path: string, data: object): any | undefined {
    return path
        .split('/')
        .filter(Boolean)
        .reduce((acc, key) => acc?.[key], data);
}

export enum MethodsEnum {
    'GET' = 'GET',
    'POST' = 'POST',
    'PATCH' = 'PATCH',
    'DELETE' = 'DELETE',
    'PUT' = 'PUT',
}

export type Methods = keyof typeof MethodsEnum | Lowercase<keyof typeof MethodsEnum>;

export const Status = {
    // Respostas de informação
    Continue: 100,
    Switching_Protocols: 101,
    Processing: 102,
    Early_Hints: 103,

    // Respostas bem-sucedidas
    OK: 200,
    Created: 201,
    Accepted: 202,
    Non_Authoritative_Information: 203,
    No_Content: 204,
    Reset_Content: 205,
    Partial_Content: 206,
    Multi_Status: 207,
    Already_Reported: 208,
    IM_Used: 226,

    // mensagens de redirecionamento
    Multiple_Choices: 300,
    Moved_Permanently: 301,
    Found: 302,
    See_Other: 303,
    Not_Modified: 304,
    Use_Proxy: 305,
    Temporary_Redirect: 307,
    Permanent_Redirect: 308,

    // Respostas de erro do cliente
    Bad_Request: 400,
    Unauthorized: 401,
    Payment_Required: 402,
    Forbidden: 403,
    Not_Found: 404,
    Method_Not_Allowed: 405,
    Not_Acceptable: 406,
    Proxy_Authentication_Required: 407,
    Request_Timeout: 408,
    Conflict: 409,
    Gone: 410,
    Length_Required: 411,
    Precondition_Failed: 412,
    Payload_Too_Large: 413,
    URI_Too_Long: 414,
    Unsupported_Media_Type: 415,
    Range_Not_Satisfiable: 416,
    Expectation_Failed: 417,
    Im_a_Teapot: 418,
    Misdirected_Request: 421,
    Unprocessable_Entity: 422,
    Locked: 423,
    Failed_Dependency: 424,
    Too_Early: 425,
    Upgrade_Required: 426,
    Precondition_Required: 428,
    Too_Many_Requests: 429,
    Request_Header_Fields_Too_Large: 431,
    Unavailable_For_Legal_Reasons: 451,

    // Respostas de erro do servidor
    Internal_Server_Error: 500,
    Not_Implemented: 501,
    Bad_Gateway: 502,
    Service_Unavailable: 503,
    Gateway_Timeout: 504,
    HTTP_Version_Not_Supported: 505,
    Variant_Also_Negotiates: 506,
    Insufficient_Storage: 507,
    Loop_Detected: 508,
    Bandwidth_Limit_Exceeded: 509,
    Not_Extended: 510,
    Network_Authentication_Required: 511,
};
