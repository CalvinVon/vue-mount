function isType(value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
}

function isEmptyObject(obj) {
    return isType(obj, 'Object') && !Object.keys(obj).length;
}

export {
    isType,
    isEmptyObject,
}