export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const isEmptyObject = obj => obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;

// Validations generator

export const minLength = (minLength, message) => value => value?.length < minLength ? message : '';

export const maxLength = (maxLength, message) => value => value?.length > maxLength ? message : '';

export const notZero = (message) => value => Number(value) === 0 ? message : '';

export const isRequired = message => value => value ? '' : message;

export const isValueEqual = (fieldName, message) => (value, fields) => fields[fieldName] === value ? '' : message;

export const isEmailValid = message => email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) ? '' : message;
};

export const isValidHex = message => color => {
    if(!color || typeof color !== 'string') return '';

    // Validate hex values
    if(color.substring(0, 1) === '#') color = color.substring(1);

    switch(color.length) {
        case 3: return /^[0-9A-F]{3}$/i.test(color) && "";
        case 6: return /^[0-9A-F]{6}$/i.test(color) && "";
        case 8: return /^[0-9A-F]{8}$/i.test(color) && "";
        default: return message;
    }

    return message;
};