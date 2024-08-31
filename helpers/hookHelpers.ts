import {InitialState, Settings, Validators} from "../types/Types";

export const objectsEqual = (obj1: {[key: string]: any}, obj2: {[key: string]: any}) => JSON.stringify(obj1) === JSON.stringify(obj2);

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

export const getEqualValidationValues = (obj: InitialState|null, validators: Validators|undefined) => {
    let newObj = {};

    if (!obj)
        return newObj;

    // Go and check every field
    for (const [key, value] of Object.entries(obj)) {
        // If field is no required add value to result
        if (!validators?.[key])
            newObj[key] = value;

        // Validator exist and data key is equal add value to result
        if (!!validators && validators.hasOwnProperty(key))
            newObj[key] = value;
    }

    return newObj;
};

export const excludeNotRequired = (arr1, arr2) => arr1.filter(value => arr2.includes(value));;
export const errorsValuesExist = (errors: {[key: string]: any}) => Object.values(errors).some(value => value !== '');
export const defaultValidation = (errors: {[key: string]: any}, settings: Settings) => {
    const errorKeys = excludeNotRequired(Object.keys(errors), Object.keys(settings.validators));

    if (!settings?.validators)
        return false;

    return (arraysEqual(errorKeys, Object.keys(settings.validators)) && !errorsValuesExist(errors))
};
