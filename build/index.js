"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const salesforce_queries_1 = require("salesforce-queries");
function getFields(info) {
    const fields = new Set([]);
    info.fieldNodes.map((fieldNode) => {
        if (fieldNode.selectionSet) {
            fieldNode.selectionSet.selections.map((value) => {
                if (!value.selectionSet)
                    fields.add(value.name.value);
            });
        }
    });
    return [...fields];
}
function getWheres(args) {
    const wheres = [];
    // info.fieldNodes.map((fieldNode: any) => {
    //   fieldNode.arguments.map((val: any) => {
    //     const field = val.name.value;
    //     const value = val.value.value;
    //     if (field !== 'limit') {
    //       wheres.push({ field, value, operator: '=' });
    //     }
    //   });
    // });
    Object.entries(args).map(([field, value]) => wheres.push({ field, value, operator: "=" }));
    return wheres;
}
function getLimit(info) {
    let limit;
    info.fieldNodes.map((fieldNode) => {
        fieldNode.arguments.map((value) => {
            if (value.name.value === 'limit') {
                limit = value.value.value;
            }
        });
    });
    return limit;
}
class Salesforce {
    constructor(props) {
        this.query = (parent, info, args) => {
            const queryBuilder = new salesforce_queries_1.SOQL(info.returnType.ofType || info.returnType).select(getFields(info));
            const limit = getLimit(info);
            if (limit) {
                queryBuilder.limit(limit);
            }
            const wheres = getWheres(args);
            wheres.map(({ field, operator, value }) => queryBuilder.where(field, operator, value));
            Object.keys(parent).map((key) => queryBuilder.where(key, '=', parent[key]));
            const query = queryBuilder.build();
            return this.conn.query(query);
        };
        this.conn = props.conn;
    }
}
exports.Salesforce = Salesforce;
//# sourceMappingURL=index.js.map