import React, {useRef} from 'react';
import {isEmailValid, isEmptyObject, isRequired, maxLength, minLength} from "./helpers/validateFunctions";

// Sample settings which you should put inside hook when call
const settingsSample = {
    // Basic initial state
    initialState: {
        fieldName1: '',
        fieldName2: 'georgehopekek@gmail.com',
    },
    // Rules to validate onChange data
    validators: {
        fieldName1: [
            isRequired(),
            minLength(5),
            maxLength(30),
        ],
        fieldName2: [
            isEmailValid(),
        ]
    },
    config: {
        //fetchMethod: API.User.profile,
        dispatchMethod: () => {
        },
        onSuccessAction: () => console.log('action'),
        successMessage: '',
        // Data keys on which hook state should be changed
        shouldChangeOnUpdate: 'state',
        shouldCleanupOnSave: false
    },
    // Here you can define your own validation function or use predefined string values like allowInitial
    // or false if you want just disable canSave or don't put anything and give validation to hook
    canSaveConfig: {
        cantSaveUnchanged: false,
        canSave: false,
        validationFunction: () => {
        }
    }, // function, boolean, string
};

// ToDo if validators not specified and canSave config empty doesn't fire canSave function
const newCanSaveSample = {
    cantSaveUnchanged: false,
    canSave: false,
    validationFunction: () => {
    }
};

const objectsEqual = (obj1, obj2) => {
    let aProps = Object.getOwnPropertyNames(obj1);
    let bProps = Object.getOwnPropertyNames(obj2);

    if (aProps.length !== bProps.length) return false;

    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];

        if (obj1[propName] !== obj2[propName]) return false;
    }

    return true;
};

const arraysEqual = (aArr, bArr) => {
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

const errorsValuesExist = errors => Object.values(errors).some(value => value !== '');
const defaultValidation = (errors, settings) => (arraysEqual(Object.keys(errors), Object.keys(settings?.validators)) && !errorsValuesExist(errors));

export default function useOnChange(settings = {}) {
    const initialState = settings?.initialState;
    const [saving, setSaving] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const canSaveErrors = {};

    React.useEffect(() => {
        setData({...initialState});
        setErrors({});
        // let formFields = Object.keys(settings.validators);
        //
        // if (formFields?.length) {
        //     formFields?.forEach((field) => {
        //         if (initialState?.[field]?.length)
        //             validateData(field, initialState?.[field]);
        //     });
        // }
    }, [saving, settings?.config?.shouldChangeOnUpdate]);


    React.useEffect(() => {
        const config = settings?.canSaveConfig;

        if (config?.cantSaveUnchanged) {
            let formFields = Object.keys(settings.validators);

            if (formFields?.length) {
                let initialErrors = {};

                formFields?.forEach((field) => {
                    if (initialState?.[field]?.length) {
                        initialErrors[field] = '';
                    }
                });

                setErrors(initialErrors);
            }
        }
    },[]);

    const canSave = React.useMemo(() => {
        const canSave = settings?.canSaveConfig?.canSave;
        const canSaveConfig = settings?.canSaveConfig;

        if (!canSaveConfig)
            return null;

        if ((isEmptyObject(settings?.validators) && isEmptyObject(canSaveConfig)) || (!!canSaveConfig && canSave === false))
            return null;

        // If nothing we just checking if no error returns and fields not empty
        if (!canSaveConfig?.defaultValidation)
            canSaveErrors['defaultValidation'] = defaultValidation(errors, settings);

        // If function exist in settings
        if (!!canSaveConfig && typeof canSaveConfig?.validationFunction === 'function')
            canSaveErrors['userValidation'] = canSaveConfig?.validationFunction(data, errors, initialState);

        if (!!canSaveConfig && canSaveConfig?.cantSaveUnchanged && !!data && !!initialState)
            canSaveErrors['equalDataValidation'] = !objectsEqual(data, initialState);

        return Object.values(canSaveErrors).every(item => !!item);
    }, [data, errors, settings.canSaveConfig]);

    const onChange = obj => {
        let fieldName = obj.name;
        let fieldValue = obj.value;

        setData({
            ...data,
            [fieldName]: fieldValue
        });

        validateData(fieldName, fieldValue);
    };

    const validateData = (fieldName, fieldValue) => {
        if (!!settings?.validators && !isEmptyObject(settings?.validators) && !!settings.validators[fieldName]) {
            let valueValidators = settings.validators?.[fieldName];
            let validationError;

            for (let validationFunc of valueValidators) {
                if (!!validationFunc(fieldValue, data)) {
                    validationError = validationFunc(fieldValue, data);
                    break;
                }
            }

            if (!validationError) {
                setErrors({
                    ...errors,
                    [fieldName]: ''
                });
                return;
            }

            setErrors({
                ...errors,
                [fieldName]: validationError
            });
        }
    };

    const cleanUp = React.useCallback(() => {
        if (!!settings?.config?.shouldCleanupOnSave) {
            setData(null);
            setErrors({});
        }
    }, [saving, data, initialState]);

    const requestFunction = React.useCallback(() => {
        let {config} = settings;
        let onFinalSaved = false;

        if (!isEmptyObject(config) && (!!canSave || canSave === null)) {
            setSaving(true);

            if (typeof config?.fetchMethod === 'function') {
                config.fetchMethod(data).then(() => {
                    if (typeof config?.onSuccessAction === 'function')
                        config.onSuccessAction(data);
                }).finally(() => {
                    onFinalSaved = true;
                    setSaving(false);
                });

                if (onFinalSaved)
                    cleanUp();

                onFinalSaved = false;
            }
        }
    }, [saving, data, initialState]);

    return [
        data,
        onChange,
        errors,
        canSave,
        requestFunction,
        saving
    ];
};
