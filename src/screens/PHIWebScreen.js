import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text } from 'react-native'
import { WebViewComponent } from "../components/WebViewComponent";
import { AdMobBannerComponent } from "../components/AdMobBannerComponent";
//import { pharmacyConfig } from '../components/Configurations';
import { checkConnected } from '../components/CheckConnectedComponent';
import NoNetworkConnection from "../components/NoNetworkConnection";

import AppLoading from 'expo-app-loading';
import { useFonts, ExpletusSans_500Medium, } from '@expo-google-fonts/expletus-sans';

const phiURL = "https://c1aca754.caspio.com/dp/f2398000705cb9046a5f4f07a419"

export default function PHIWebScreen() {
    const [connectStatus, setConnectStatus] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            checkConnected().then(res => {
                setConnectStatus(res)
            })
        }, 10);
        return () => clearInterval(interval);
    }, []);
    let [fontsLoaded] = useFonts({ ExpletusSans_500Medium });
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            connectStatus ? (
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <WebViewComponent source={{ uri: `${phiURL}` }} />
                    </View>
                    <View style={{ alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: "gray", fontFamily: 'ExpletusSans_500Medium' }}>
                            Data Source: https://phi.lk
                        </Text>
                    </View>
                    <AdMobBannerComponent />
                </SafeAreaView>
            ) : (<NoNetworkConnection navigation={false} />)
        );
    }
}