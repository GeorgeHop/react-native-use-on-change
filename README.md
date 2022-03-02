# react-native-use-on-change
[BETA]

# Installation
expo: `expo install react-native-use-on-change`  
npm: `npm i react-native-use-on-change`  
yarn: `yarn add react-native-use-on-change`

## Basic usage
```JS
import useOnChange from "react-native-use-on-change";

export default function YourComponent() {
const [data, onChange, errors, canSave, addRecord] = useOnChange({
        initialState: {
            email: '',
            password: '',
            confirm_password: ''
        },
        validators: {
             email: [
                isRequired('Email is required'),
                isEmailValid('Email not valid'),
            ],
            password: [
                isRequired('Password is required'),
                minLength(8, 'Min length is 5'),
                maxLength(40, 'Min length is 40')
            ],
            confirm_password: [
                isRequired('Confirmation is required'),
                isValueEqual('password', 'Confirm password should be the same as password'),
            ]
        },
        config: {
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

