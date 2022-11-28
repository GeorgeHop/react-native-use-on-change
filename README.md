# react-native-use-on-change
Hook provides easy functionality to validate and handle forms. Don't duplicate your code! Just use this hook to build all your validation.

# Installation
expo: `expo install react-native-use-on-change`  
npm: `npm i react-native-use-on-change`  
yarn: `yarn add react-native-use-on-change`

## Basic usage

```JS
import useOnChange from "react-native-use-on-change";

export default function YourComponent() {
// You can use many things from hook and define names you want. 
// 1. data is basicaly your data Object with key:value for each field.
// 2. onChange function which should be passed to inputs to handle their state.
const [data, onChange] = useOnChange({
        // Your initial state here
        initialState: {
            email: '',
        },
        // Validators will check values from your state and respond to you with message which you can disaplay on UI
        validators: {
             // Each field may have our prepared validators and your custom
             email: [
                isRequired('Email is required'),
                isEmailValid('Email not valid'),
            ],
        },
    });

   return(
       <View
            style={{
                flex: 0.7
            }}
        >
            <View
                style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                <Input placeholder={'Email'} value={data?.email} name={'email'} onChange={onChange}/>                    
            </View>               
        </View>
   )
}

// more about customizing below
```

## Advanced usage
```JS
import useOnChange from "react-native-use-on-change";

export default function YourComponent() {
// You can use many things from hook and define names you want. 
// 1. data is basicaly your data Object with key:value for each field.
// 2. onChange function which should be passed to inputs to handle their state.
// 3. errors created by validation functions.
// 4. canSave property which shows to us when all fields is filled and passed validation.
// 5. requestFunction is function you want to use to save validated data.
// 6. loading based or requestFunction state you can show users when you process their data.
const [data, onChange, errors, canSave, requestFunction, loading] = useOnChange({
        // Your initial state here
        initialState: {
            email: '',
            password: '',
            confirm_password: ''
        },
        // Validators will check values from your state and respond to you with message which you can disaplay on UI
        validators: {
             // Each field may have our prepared validators and your custom
             email: [
                isRequired('Email is required'),
                isEmailValid('Email not valid'),
            ],
            password: [
                // Define message and other params 
                isRequired('Password is required'),
                minLength(8, 'Min length is 5'),
                maxLength(40, 'Min length is 40')
            ],
            confirm_password: [
                isRequired('Confirmation is required'),
                // Especially if you need to check if confirm password is equal to password
                isValueEqual('password', 'Confirm password should be the same as password'),
            ]
        },
        // This is hook config
        config: {
            // Here we add our saving function 
            fetchMethod: async data => {
                API.Auth.register(data).then(res => console.log(res.data))
            },
        },
        canSaveConfig: {

        }
    });

   return(
       <View
            style={{
                flex: 0.7
            }}
        >
            <View
                style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                <Input placeholder={'Email'} value={data?.email} name={'email'} onChange={onChange}/>
                <Input placeholder={'Password'} value={data?.password} name={'password'} onChange={onChange}/>
                <Input placeholder={'Repeat password'} value={data?.confirm_password} name={'confirm_password'} onChange={onChange}/>
            </View>
            <View
                style={{
                    flex: 0.3,
                    justifyContent: 'center'
                }}
            >
                <Button
                    disabled={!canSave}
                    label={'Registration'}
                    onPress={requestFunction}
                    loading={saving}
                />
            </View>
        </View>
   )
}

// more about customizing below
```


## Best practices
## Hook configs

### Basic config
### With deps
### Loading/Disabling buttons UI/UX response
### Custom validators
### Equal data validation

## Validators

| Name                       | Params      | Params      |
| -------------------------- | --------- | --------- |
| minLength       | (number, message)   | Number of min characters and message to show when validation fails |


### 

