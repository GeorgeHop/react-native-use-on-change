import React, {useRef} from 'react';
import {isEmailValid, isEmptyObject, isRequired, maxLength, minLength} from "./helpers/validateFunctions";
import {Settings} from "./types/Types";
import {defaultValidation, objectsEqual} from "./helpers/hookHelpers";

export default function useOnChange(settings:Settings) {
    const initialState = settings?.initialState;
    const [saving, setSaving] = React.useState<boolean>(false);
    const [data, setData] = React.useState<object|null>(null);
    const [errors, setErrors] = React.useState<object>({});
    const canSaveErrors:{[key:string]: boolean} = {};

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

    // This part checking existing fields and fills errors based on data inside
    React.useEffect(() => {
        const config = settings?.canSaveConfig;

        // If we don't have validators we skip this part
        if (config?.cantSaveUnchanged && !!settings?.validators) {
            let formFields = Object.keys(settings.validators);

            if (formFields?.length) {
                let initialErrors:{[key: string]: string} = {};

                formFields?.forEach((field) => {
                    if (initialState?.[field]?.length) {
                        initialErrors[field] = '';
                    }
                });

                setErrors(initialErrors);
            }
        }
    }, []);

    const canSave = React.useMemo(() => {
        const canSave = settings?.canSaveConfig?.canSave;
        const canSaveConfig = settings?.canSaveConfig;

        if (!canSaveConfig)
            return null;

        if (settings?.validators && (isEmptyObject(settings?.validators) && isEmptyObject(canSaveConfig)) || (!!canSaveConfig && canSave === false))
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

    const onChange = (obj: {name: string, value: any}) => {
        let fieldName = obj.name;
        let fieldValue = obj.value;

        setData({
            ...data,
            [fieldName]: fieldValue
        });

        validateData(fieldName, fieldValue);
    };

    const validateData = (fieldName: string, fieldValue: any) => {
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
        saving
    ];
};
