export const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const isEmptyObject = (obj: object) => obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;

// Validations generator

export const minLength = (minLength: number, message: any) => (value: string) => value?.replace(/ /g, '')?.length < minLength ? message : '';

export const maxLength = (maxLength: number, message: any) => (value: string) => value?.replace(/ /g, '')?.length > maxLength ? message : '';

export const notZero = (message: any) => (value: string) => Number(value) === 0 ? message : '';

export const isRequired = (message: any) => {
    function required(value: any) {
        return  value ? '' : message;
    }

    return required;
};

export const isValueEqual = (fieldName: string, message: any) => (value: string, fields: object) => fields[fieldName as keyof typeof fields] === value ? '' : message;

export const isPhoneValid = (message: any) => (value: string) => {
    const re = /(?:(?:(\s*\(?([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\)?\s*(?:[.-]\s*)?)([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/;
    return re.test(value) ? '' : message;
};

export const isEmailValid = (message: any) => (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) ? '' : message;
};

export const isValidHex = (message: any) => (color: string) => {
    if (!color) return '';

    // Validate hex values
    if (color.substring(0, 1) === '#') color = color.substring(1);

    switch (color.length) {
        case 3:
            return /^[0-9A-F]{3}$/i.test(color) && "";
        case 6:
            return /^[0-9A-F]{6}$/i.test(color) && "";
        case 8:
            return /^[0-9A-F]{8}$/i.test(color) && "";
        default:
            return message;
    }
};
