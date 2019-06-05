import Vue from 'vue';
import Mount from '.';

function isOneOf(value, ...opt) {
    let options = opt;
    if (isType(opt[0]) === 'Array') {
        options = opt[0];
    }
    return options.some(it => it === value);
}

function isType(value, type) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
}

function isEmptyObject(obj) {
    return isType(obj, 'Object') && !Object.keys(obj).length;
}


/**
 * judge is an instance of Vue and return vm
 * @param {Element} el
 */
function isVueInstance(el) {
    return el.__vue__ && el.__vue__ instanceof Vue && el.__vue__;
}

function isMountInstance(el) {
    return el.__mount__ && el.__mount__ instanceof Mount && el.__mount__;
}

function getElement(target) {
    if (!target) return null;
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

        if (parentVm.$children[0]) {
            const child = parentVm.$children[0];
            if (child.$el === parentVm.$el) {
                // Is an Vue root instance but not an Vue component
                return child;
            }
        }
        return parentVm;
    }
}


export {
    isOneOf,
    isType,
    isEmptyObject,
    isVueInstance,
    isMountInstance,
    getElement,
    findParentVm
}