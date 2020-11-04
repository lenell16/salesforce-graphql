export interface Options {
    conn: any;
}
declare class Salesforce {
    conn: any;
    constructor(props: Options);
    query: (parent: {
        [key: string]: string;
    }, info: any, args: any) => any;
}
export { Salesforce };
