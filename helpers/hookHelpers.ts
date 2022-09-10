import {Settings} from "../types/Types";

export const objectsEqual = (obj1: {[key: string]: any}, obj2: {[key: string]: any}) => {
    let aProps = Object.getOwnPropertyNames(obj1);
    let bProps = Object.getOwnPropertyNames(obj2);

    if (aProps.length !== bProps.length) return false;

    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];

        if (obj1[propName] !== obj2[propName]) return false;
    }

    return true;
};

export const arraysEqual = (aArr: any[], bArr: any[]) => {
    const a = aArr.sort();
    const b = bArr.sort();

    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }

    return true;
};

export const errorsValuesExist = (errors: {[key: string]: any}) => Object.values(errors).some(value => value !== '');
export const defaultValidation = (errors: {[key: string]: any}, settings: Settings) => {
    if (!settings?.validators)
        return false;

    return (arraysEqual(Object.keys(errors), Object.keys(settings.validators)) && !errorsValuesExist(errors))
};
