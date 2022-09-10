export interface InitialState {
    [key: string]: any
}

export interface Validators {
    [key: string]: [
        (...args: any) => boolean|string
    ]
}

export interface Config {
    shouldChangeOnUpdate: any,
    shouldCleanupOnSave: boolean,
    fetchMethod: (data: any) => Promise<any>,
    onSuccessAction?: (data: any) => void,
}

export interface CanSaveConfig {
    defaultValidation?: boolean,
    validationFunction?: (data: any, errors: object, initialState: object) => boolean,
    cantSaveUnchanged?: boolean,
    canSave?: boolean
}

export interface Settings {
    initialState: InitialState,
    validators?: {
        [key: string]: [
            (...args: any) => boolean|string
        ]
    },
    config?: Config,
    canSaveConfig?: CanSaveConfig
}
