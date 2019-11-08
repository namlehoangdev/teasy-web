export function normalizer(array, key = 'id') {

    if (!Array.isArray(array)) {
        return array;
    }

    if (!array.length) {
        return {
            byHash: {},
            byId: []
        };
    }

    return array.reduce(
        (obj, item) => {
            obj.byId = obj.byId || [];
            obj.byHash = obj.byHash || {};

            obj.byId.push(item[key]);
            obj.byHash[item[key]] = item;

            return obj;
        }, {}
    );
}


export function denormalizer(object) {
    if (typeof object !== "object") {
        return object;
    }
    return object.byId.map(id => object.byHash[id])
}


export function normalize(data, schema) {
    if (Array.isArray(data)) {
        return data.map(item => (
            normalize(item, schema)
        ));
    } else {
        let result = {...data};
        Object.keys(schema).forEach(function (key) {
            if (!schema[key]) {
                return data
            }
            const {
                schema: childSchema,
                id: childId
            } = schema[key];

            if (childSchema) {
                const child = normalize(data[key], childSchema);
                result[key] = normalizer(child, childId)
            } else {
                result[key] = normalizer(data[key], childId)
            }
        });

        return result
    }
}


export function denormalize(data, schema) {
    if (Array.isArray(data)) {
        return data.map(item => (
            denormalize(item, schema)
        ));
    } else {
        let result = {...data};
        Object.keys(schema).forEach(function (key) {
            if (!schema[key]) {
                return data
            }
            const {schema: childSchema} = schema[key];
            if (childSchema) {
                result[key] = data[key].byId.map(id => {
                    return denormalize(data[key].byHash[id], childSchema)
                })
            } else {
                result[key] = denormalizer(data[key])
            }
        });

        return result
    }
}


export const defaultNormalizer = {byId: [], byHash: {}};
