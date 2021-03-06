import React, { useState, } from 'react';
import { Animated, StyleSheet, View, Platform } from "react-native";
import { StatusBar } from 'react-native';
import * as SplashScreen from "expo-splash-screen";

import RootStackNavigator from './src/navigators/RootStackNavigator';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './src/components/CredentialsContext';
//import { LanguageContext } from './src/components/LanguageContext';

import { themeReducer } from "./src/reducers/themeReducer";

import { createStore } from "redux";
import { Provider } from 'react-redux';

// import i18n from 'i18n-js';
// import { si, en, ta } from './src/i18n/SupportedLanguages';
// i18n.translations = { si, en, ta };

// i18n.locale = 'en'
//console.log(i18n.locale);

const store = createStore(themeReducer);

SplashScreen.preventAutoHideAsync().catch(() => { });

export default function App () {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");
  //const [storedLanguage, setStoredLanguage] = useState(en);


  const checkLoginCredentials = () => {
    AsyncStorage.getItem('suwenSitimuCredentials').then((result) => {
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    }).catch(error => console.log(error));
    //console.log(storedCredentials);
  };

  // const checkStoredLanguage = () => {
  //   AsyncStorage.getItem('chosenLanguage').then((result) => {
  //     if (result !== null) {
  //       setStoredLanguage(result);
  //       i18n.fallbacks = true;

  //     } else {
  //       setStoredLanguage(null);
  //     }
  //   }).catch(error => console.log(error))
  //   console.log(storedLanguage);
  // }

  if (!appReady) {
    return (
      <>
        <AppLoading
          startAsync={checkLoginCredentials}
          onFinish={() => setAppReady(true)}
          onError={console.warn}
        />

        {/* <AppLoading
          startAsync={checkStoredLanguage}
          onFinish={() => setAppReady(true)}
          onError={console.warn}
        /> */}
      </>
    );
  }

  return (
    <>
      <AnimatedAppLoader image={require("./assets/splash.png")}>
        <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }} >
          {/* <LanguageContext.Provider value={{ storedLanguage, setStoredLanguage }}> */}
          <Provider store={store}>
            <StatusBar backgroundColor="gray" />
            <RootStackNavigator />
          </Provider>
          {/* </LanguageContext.Provider> */}
        </CredentialsContext.Provider>
      </AnimatedAppLoader>
    </>
  );
}


function AnimatedAppLoader ({ children, image }) {
  const [isSplashReady, setSplashReady] = React.useState(false);

  const startAsync = React.useMemo(
    () => () => Asset.fromURI(image).downloadAsync(),
    [image]
  );

  const onFinish = React.useMemo(() => setSplashReady(true), []);

  if (!isSplashReady) {
    return (
      <AppLoading
        autoHideSplash={false}
        startAsync={startAsync}
        onError={console.error}
        onFinish={onFinish}
      />
    );
  }
  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen ({ children, image }) {
  const animation = React.useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = React.useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = React.useState(
    false
  );

  React.useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 6000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = React.useMemo(() => async () => {
    try {
      await SplashScreen.hideAsync();
      await Promise.all([]);
    } catch (e) {
    } finally {
      setAppReady(true);
    }
  });

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              // backgroundColor: "#ffffff",
              // opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}


