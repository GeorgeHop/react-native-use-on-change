# react-native-use-on-change
Hook provides easy functionality to validate and handle forms. Don't duplicate your code! Just use this hook to build all your validation.

# Installation
expo: `expo install react-native-use-on-change`  
npm: `npm i react-native-use-on-change`  
yarn: `yarn add react-native-use-on-change`

## Basic usage

```Input.jsx```

```JS
import {TextInput, View} from "react-native";
import React from "react";


export default function Input({name, error, onChange, value}) {
    let errorToShow = error?.[name];

    const handleChange = text => onChange({name, value: text});

    return(
        <View
            style={{
                height: 60,
                marginVertical: 5,
                backgroundColor: 'gray',
                width: '100%'
            }}
        >
            <TextInput style={{flex: 1,}} value={value?.[name]} onChangeText={handleChange}/>
        </View>
    )
}

```

```JS
import useOnChange from "react-native-use-on-change";

export default function YourComponent() {
// You can use many things from hook and define names you want. 
// 1. data is basicaly your data Object with key:value for each field.
// 2. onChange function which should be passed to inputs to handle their state.
   const [data, onChange] = useOnChange({
        initialState: {
            field1: '',
            field2: '',
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
                <Input name={'field1'} value={data} onChange={onChange}/>
                <Input name={'field2'} value={data} onChange={onChange}/>                    
            </View>               
        </View>
   )
}

// more about customizing below
```

## Advanced usage

In case you want to use this hook you should prepare any form components to use 
```onChange```, ```value```, ```errors```, ```name```. Remember they required to use this hook! 

For example: 
```Input.jsx```

```JS 
import {TextInput, View} from "react-native";
import React from "react";


export default function Input({name, error, onChange, value}) {
    let errorToShow = error?.[name];

    const handleChange = text => onChange({name, value: text});

    return(
        <View
            style={{
                height: 60,
                marginVertical: 5,
                backgroundColor: 'gray',
                width: '100%'
            }}
        >
            <TextInput style={{flex: 1,}} value={value?.[name]} onChangeText={handleChange}/>
        </View>
    )
}

```

Then we use our prepared input somewhere in our app with ```useOnChange``` hook. 
And that's all.

```JS

// Custom validator
const customValidator = (paramToCheck, message) => (value) => value === paramToCheck ? '' : message;

export default function Container() {
   const [otherValue, setOtherValue] = useState(false);
   // You can use many things from hook and define names you want. 
   // 1. data is basicaly your data Object with key:value for each field.
   // 2. onChange function which should be passed to inputs to handle their state.
   // 3. errors created by validation functions.
   // 4. canSave property which shows to us when all fields is filled and passed validation.
   // 5. requestFunction is function you want to use to save validated data.
   // 6. loading based or requestFunction state you can show users when you process their data.
    const [data, onChange, errors, canSave, save, saving] = useOnChange({
        // Initial state
        initialState: {
            field1: '',
            field2: '',
            // Field 3 is not required
            field3: '',
        },
        // Validators with validate functions for each field
        validators: {
            field1: [
                isRequired('This field is required'),
                minLength(5, 'Min value is 5'),
                maxLength(255, 'Max is 255'),
            ],
            field2: [
                isRequired('This field is required'),
                minLength(5, 'Min value is 5'),         
                maxLength(255, 'Max is 255'),
                // We added our custom validator
                customValidator('Sample string', 'Value should be sample string')
            ],
            // If we want validation to skip field3 we just do not list it here
        },
        config: {
            // Method for saving
            fetchMethod: async (data) => {
                // Save data somewhere
            }
        },
        canSaveConfig: {
            // For example if we have edit flow, when button should toggle when data in form has changed
            cantSaveUnchanged: true,
            // Custom validation checker
            validationFunction: (data, errors, state) => {
                // Some of your custom validation code it should return boolean
            }
        }
        // Deeps to reset hook
    }, [otherValue]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Input name={'field1'} value={data} onChange={onChange} error={errors}/>
            <Input name={'field2'} value={data} onChange={onChange} error={errors}/>
            <TouchableOpacity
                disabled={!canSave}
                style={[{
                    flexDirection: 'row',
                    height: 60,
                    width: '100%',
                    backgroundColor: 'green',
                    justifyContent: 'center',
                    alignItems: 'center',
                }, !canSave && {
                    backgroundColor: 'red',
                }]}
                onPress={save}
            >
                <Text>
                    Save
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[{
                    flexDirection: 'row',
                    height: 60,
                    width: '100%',
                    backgroundColor: 'blue',
                    justifyContent: 'center',
                    alignItems: 'center',
                }]}
                onPress={() => setOtherValue(!otherValue)}
            >
                <Text>
                    Reset hook
                </Text>
            </TouchableOpacity>
        </View>
    )
}
// more about customizing below
```

## Validators

| Name                       | Params      | Params      |
| -------------------------- | --------- | --------- |
| ```minLength(8, 'Your min message') ```       | (number, string)   | Number of min characters and message to show when validation fails |
| ```maxLength(8, 'Your max message') ```       | (number, string)   | Number of max characters and message to show when validation fails |
| ```isRequired('Your message') ```       | (string)   | Required field validation |
| ```isValueEqual('field_name', 'Your message') ```       | (string, string)   | Take field name to check if value equal to this field value |
| ```isPhoneValid('Your message') ```       | (string)   | Validate phone number field |
| ```isEmailValid('Your message') ```       | (string) | Validate your email field |
| ```isValidHex('Your message') ```       | (string) | Hex validation |


### 

