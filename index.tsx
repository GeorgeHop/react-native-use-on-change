import React, {useRef} from 'react';
import {isEmailValid, isEmptyObject, isRequired, maxLength, minLength} from "./helpers/validateFunctions";
import {Settings} from "./types/Types";
import {defaultValidation, getEqualValidationValues, objectsEqual} from "./helpers/hookHelpers";

interface Target {
    name: string,
    value: any
}

export default function useOnChange<T>(
    settings: Settings,
    deps: any[] = []
): [
        T | null,
    (target: Target | Target[]) => void,
    { [key: string]: string },
        boolean | null,
    () => void,
    boolean,
    (value: boolean) => void
] {
    const initialState = settings?.initialState || null;
    const [saving, setSaving] = React.useState<boolean>(false);
    const [toggledCanSave, setToggleCanSave] = React.useState<boolean | null>(null);
    const [data, setData] = React.useState<T | null>(initialState);
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const canSaveErrors: { [key: string]: boolean } = {};


    React.useEffect(() => {
        setData({...initialState});
        setErrors({});
        let formFields = settings?.validators && Object.keys(settings.validators);

        if (formFields?.length) {
            formFields?.forEach((field) => {
                if (initialState?.[field]?.length) {
                    validateData(field, initialState?.[field]);
                }
            });
        }
    }, [saving, ...deps]);

    // This part checking existing fields and fills errors based on data inside
    React.useEffect(() => {
        checkErrors();
    }, []);

    const checkErrors = (cantSaveUnchanged = true) => {
        const config = settings?.canSaveConfig;

        // If we don't have validators we skip this part
        if (!!settings?.validators) {
            let formFields = Object.keys(settings.validators);

            if (formFields?.length) {
                let initialErrors: { [key: string]: string } = {};

                // Check each declarated field
                formFields?.forEach((field) => {
                    const validate = validateField(field, initialState?.[field]);

                    // We setup errors for cantSaveUnchanged to proper validate all values
                    if ((config?.cantSaveUnchanged && initialState?.[field]?.length)) {
                        initialErrors[field] = '';
                        // Skip not required fields (For cases when form has few not required fields)
                    } else if ((initialState?.[field]?.length && settings?.validators?.[field]) || (initialState?.[field]?.length === 0 && settings?.validators?.[field] && !validate)) {
                        // Check all validators
                        initialErrors[field] = validate;
                    }
                });

                setErrors(initialErrors);
            }
        }
    };

    const canSave = React.useMemo(() => {
        const canSave = settings?.canSaveConfig?.canSave;
        const canSaveConfig = settings?.canSaveConfig;

        // We get only those fiends which added in validators array
        const initialStateToCheck = getEqualValidationValues(initialState, settings?.validators);
        const dataToCheck = getEqualValidationValues(data, settings?.validators);

        if (!canSaveConfig)
            return null;

        if (settings?.validators && (isEmptyObject(settings?.validators) && isEmptyObject(canSaveConfig)) || (!!canSaveConfig && canSave === false))
            return null;

        // If nothing we just checking if no error returns and fields not empty
        if (!canSaveConfig?.defaultValidation)
            canSaveErrors['defaultValidation'] = defaultValidation(errors, settings);

        if (!!canSaveConfig && canSaveConfig?.cantSaveUnchanged && !!data && !!initialState)
            canSaveErrors['equalDataValidation'] = !objectsEqual(initialStateToCheck, dataToCheck);

        // If function exist in settings
        if (!!canSaveConfig && typeof canSaveConfig?.validationFunction === 'function')
            canSaveErrors['userValidation'] = canSaveConfig?.validationFunction(data, errors, initialState);

        return (toggledCanSave || Object.values(canSaveErrors).every(item => !!item));
    }, [data, errors, settings.canSaveConfig]);


    const toggleCanSave = (value: boolean) => setToggleCanSave(value);

    // Supports single or multi value
    const onChange = (target: Target | Target[]) => {
        if (Array.isArray(target)) {
            let preparedData = target?.reduce((acc, curr) => {
                let fieldName = curr.name;
                let fieldValue = curr.value;
                acc[fieldName] = fieldValue;

                return acc;
            }, {});

            let saveData = {
                ...data,
                ...preparedData
            };

            multiValidate(preparedData);
            return;
        }

        if (typeof target === "object" && target.hasOwnProperty('name') && target.hasOwnProperty('value')) {
            let fieldName = target.name;
            let fieldValue = target.value;
            let newData = {
                ...data,
                [fieldName]: fieldValue
            };

            setData(newData);

            validateData(fieldName, fieldValue);
        }
    };

    const multiValidate = (fields: object) => {
        Object.keys(fields)?.forEach(key => {
            validateData(key, fields[key]);
        });
    };

    const validateField = (fieldName: string, fieldValue: any) => {
        let valueValidators = settings.validators?.[fieldName];
        let validationError;

        for (let validationFunc of valueValidators) {
            if (!!validationFunc(fieldValue, data)) {
                validationError = validationFunc(fieldValue, data);
                break;
            }
        }

        return !validationError ? '' : validationError;
    };

    const validateData = (fieldName: string, fieldValue: any) => {
        if (!!settings?.validators && !isEmptyObject(settings?.validators) && !!settings.validators[fieldName]) {
            let valueValidators = settings.validators?.[fieldName];
            let validationError;

            for (let validationFunc of valueValidators) {
                // Data used in cases if function has a second argument for example to check password confirmation with password field
                const validate = validationFunc(fieldValue, data);

                if (validate) {
                    validationError = validate;
                    break;
                }
            }

            if (!validationError) {
                setErrors(errors => ({
                    ...errors,
                    [fieldName]: ''
                }));
                return;
            }

            setErrors(errors => ({
                ...errors,
                [fieldName]: validationError
            }));
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

        if (config && !isEmptyObject(config) && (!!canSave || canSave === null)) {
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
        saving,
        toggleCanSave
    ];
};
