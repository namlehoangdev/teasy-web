const SORT_DIRECTION = {
    ASC: 'asc',
    DESC: 'desc'
};

const directionMap = {
    greaterThan: {asc: 1, desc: -1}, // greater-than
    lessThan: {asc: -1, desc: 1} // less-than
};

const doSort = (A, B, property, direction = SORT_DIRECTION.ASC) => {
    const a = A[property];
    const b = B[property];
    if (a < b) {
        return directionMap.lessThan[direction];
    }
    if (a > b) {
        return directionMap.greaterThan[direction];
    }
    return 0;
};

const createSorter = (...args) => {
    if (typeof args[0] === 'string') {
        args = [{direction: args[1], property: args[0]}];
    }

    return (A, B) => {
        let ret = 0;
        args.some(sorter => {
            const {property, direction = SORT_DIRECTION.ASC} = sorter;
            const value = doSort(A, B, property, direction);
            if (value === 0) {
                // they are equal, continue to next sorter if any
                return false;
            } else {
                // they are different, stop at current sorter
                ret = value;
                return true;
            }
        });

        return ret;
    }
};

/**
 **@USAGE-EXAMPLES
 *@
 */

export {createSorter};
