// import the screens
import Start from './components/Start'
import Chat from './components/Chat'

// import navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// import firebase
import { initializeApp } from 'firebase/app'
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence
} from 'firebase/auth'

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { useNetInfo } from '@react-native-community/netinfo'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAErcd1xZdRMUs5-0HF_lXAjPEG2ZmdTZQ',
  authDomain: 'elephant-chat-96361.firebaseapp.com',
  projectId: 'elephant-chat-96361',
  storageBucket: 'elephant-chat-96361.appspot.com',
  messagingSenderId: '962794736925',
  appId: '1:962794736925:web:76a2078d0d29a405e5e5f4',
  measurementId: 'G-94H6KQ0S82'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// initialize Firebase Auth for that app immediately
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

// initialize Cloud Firestore and get a reference
const db = getFirestore(app)
const storage = getStorage(app)
// import LogBox from react-native
import { Alert } from 'react-native'
import { useEffect } from 'react'

// this is the app container
const Stack = createNativeStackNavigator()
const App = () => {
  // check the connection status, alert if lost, disable firebase and pass it as prop
  const connectionStatus = useNetInfo()

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost')
      void disableNetwork(db)
    } else if (connectionStatus.isConnected === true) {
      void enableNetwork(db)
    }
  }, [connectionStatus.isConnected, db])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat'>
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
