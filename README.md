# react-native-tm
Fully customizable toast component for your react-native applications supported on IOS and Android. Also you can use it with expo or pure react-native. 

![ezgif com-gif-maker (8)](https://user-images.githubusercontent.com/47904385/120900240-1225d380-c634-11eb-9842-3aadf5902967.gif)

# Installation
expo: `expo install react-native-tm`  
npm: `npm i react-native-tm`  
yarn: `yarn add react-native-tm`

## Basic usage
```JS
import Toast from "react-native-tm";

export default function YourComponent() {
   return(
      <YourComponentsHere></YourComponentsHere>
      <Toast
        show={true}
        withClose={true}
        style={{
          toast: {
            width: '100%',
            height: 50,
            backgroundColor: 'red'
          }
        }}
      />
   )
}

// more about customizing below
```

## How customize your toast ? 
```JS
import Toast from "react-native-tm";

export default function YourComponent() {
   
   return(
      <YourComponentsHere></YourComponentsHere>
      <Toast
        show={true}
        // set the animation type of toast choose the best for you in props
        animationType={'bounce'}
        // add the closing toast function on press
        withClose={true}
        // pass toast styles object to style
        style={{
          toast: {
            width: '100%',
            height: 50,
            backgroundColor: 'red'
          }
        }}
      >
        // and for sure you can add childrens here
        // to customize your toast 
        <View style={{height: 50, width: 50, backgroundColor: 'black', borderRadius: 30}}/>
        <View
          style={{
              marginLeft: 10
          }}
        >
            <Text>
                  Title top
            </Text>
            <Text>
                  Description on the bottom
            </Text>
        </View>
      </Toast>
   )
}

```

## How customize your animation ? 

By default toast use the linear animation, just show and hide nothing special. But if you want to change the animation type use description below.

#### For bounce animation.

<table>
<tr>
<td>

```JS
     <Toast
        ...
         // Add the animation type bounce
        animationType={'bounce'}
       ...
      />
```

</td>
<td>
<img src="https://user-images.githubusercontent.com/47904385/120920413-edc30900-c6be-11eb-82bf-9aa5b31dd1c8.gif" alt="drawing" width="600" height="300"/>
</td>
</tr>
</table>

#### For elastic animation.

<table>
<tr>
<td>

```JS
     <Toast
        ...
         // Add the animation type elastic
        animationType={'elastic'}
       ...
      />
```

</td>
<td>
<img src="https://user-images.githubusercontent.com/47904385/120920546-9f623a00-c6bf-11eb-852e-867d40f3b65f.gif" alt="drawing" width="600" height="300"/>
</td>
</tr>
</table>

## Props
Below are the props you can pass to the React Component.

| Prop  | Type | Default | Example | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| show  | boolean | | show={true} | Put the toast state |
| animationType | string | | animationType={'bounce'} | If you what different animations on your toast |
| toastOnPress | function | | toastOnPress={() => console.log('check')} | You can add many other functions here or just navigate to other screen |
| withClose | boolean | false | withClose={true} | Added posibility to close toast on press. You can use it with toastOnPress at one time. |
| children | component | | ``` <Toast><YourComponent/></Toast> ``` | You can add yout own component for example messages from users in your app or internet connection notifications. |
| style | object | | {toast: {backgroundColor: 'black', height: 50}} | The styles object for styling the toast details. More about styling in Custom styling step.|
| showingDuration | int | 8000 | showingDuration={3000} | How much time toast will show on the screen |
| statusBarHeight | int | 180 | statusBarHeight={150} | If you have a specific status bar on your device you may want to pass this props to aware some UI bugs on the device |
| onHide  | function | | onHide={() => yourFunctionToDoSomething()} | Function which call when toast hiding. |

## ToDos

1. TypeScript support.
2. More animation for customizing.

