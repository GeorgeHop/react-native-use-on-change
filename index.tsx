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
    React.useEffect(() => checkErrors(), []);

    // This part makes initial data validation for default logic and cantSaveUnchaged
    const checkErrors = () => {
        const validators = settings?.validators;
        const config = settings?.canSaveConfig;

        // If no validators are provided, we skip the error initialization
        if (!validators) return;

        const formFields = Object.keys(validators);
        const initialErrors: { [key: string]: string } = {};

        formFields.forEach((field) => {
            const fieldValue = initialState?.[field];
            const validate = validateField(field, fieldValue);

            // Handle cantSaveUnchanged logic and validation for fields in validators
            if (config?.cantSaveUnchanged && fieldValue?.length) {
                initialErrors[field] = '';
            } else if ((fieldValue?.length && validators?.[field]) || (fieldValue?.length === 0 && validators?.[field] && !validate)) {
                initialErrors[field] = validate;
            }
        });

        setErrors(initialErrors);
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
        // Get updated value
        const updatedData = Array.isArray(target)
            ? target.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {})
            : { [target.name]: target.value };

        // Merge new and old state
        const newData = { ...data, ...updatedData };
        // Set data without validation?
        setData(newData);
        // And then we validate fields only related to updated data? so how hookWillKnow about updated fields
        Object.keys(newData).forEach(fieldName => {
            const value = newData?.[fieldName];
            validateData(fieldName, value);
        });
    };

    const runValidators = (validators: Function[], fieldValue: any, data: T | null) => {
        // Validate if validators exist
        if (validators) {
            for (let validate of validators) {
                const validationError = validate(fieldValue, data);
                if (validationError) return validationError;
            }
        }

        // If no validators just toggle
        return '';
    };

    const validateField = (fieldName: string, fieldValue: any) => {
        // Get validators if they exist
        const validators = settings.validators?.[fieldName];
        // If validators exist we validate in other case return empty string to toggle canSave
        return runValidators(validators, fieldValue, data);
    };

    const validateData = (fieldName: string, fieldValue: any) => {
        // Validate error should be error string or empty string
        const validationError = validateField(fieldName, fieldValue);
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: validationError
        }));
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
        toggleCanSave,
        cleanUp,
    ];
};
