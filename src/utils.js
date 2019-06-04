import Vue from 'vue';

function isType(value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
}

function isEmptyObject(obj) {
    return isType(obj, 'Object') && !Object.keys(obj).length;
}

function isVueInstance(el) {
    return el.__vue__ && el.__vue__ instanceof Vue && el.__vue__;
}

function getElement(target) {
    if (target instanceof Vue) {
        return target.$el;
    }
    else if (target instanceof Element) {
        return target;
    }
    else if (typeof target === 'string') {
        return document.querySelector(target);
    }
    else {
        return null;
    }
}

function findParentVm(el) {
    let dom = getElement(el);
    if (!dom) return null;

    let parentVm, currentVm;
    if (currentVm = isVueInstance(dom)) {
        return parentVm = currentVm.$parent;
    }
    else {
        let parentNode = dom.parentNode;
        while (parentNode && !(parentVm = isVueInstance(parentNode))) {
            parentNode = parentNode.parentNode;
        }
        return parentVm;
    }
}


export {
    isType,
    isEmptyObject,
    isVueInstance,
    getElement,
    findParentVm
}