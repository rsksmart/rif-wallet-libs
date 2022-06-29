export interface IResolver {
    methodName: string;
    resolve: (params: any[]) => Promise<any>;
}
export declare class RPCAdapter {
    private resolvers;
    constructor(resolvers: IResolver[]);
    handleCall(method: string, params: any[]): Promise<any>;
}
