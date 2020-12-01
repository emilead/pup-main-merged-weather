
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import {API_KEY } from './utils/WeatherAPIKey.js';
import { weatherInfo } from './utils/WeatherDescriptions.js';

import weatherDog from '../assets/weatherDog.png';

export default function WeatherScreen ({ navigation, route, API_KEY }){
    const [temperature, setTemperature] = useState(0);
    const [weatherCondition, setWeathercondition] = useState(null);
    const [icon, setIcon] = useState(null);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);


    const getLocation = async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.BestForNavigation});
      const {latitude, longitude } = location.coords
      setLocation({latitude, longitude});
    };

    //Den gider ikke hente API_KEY ordentligt, så jeg har bare sat den ind i url'en
    const fetchWeather = () => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&APPID=849338767c0e95025b5559533d26b7c4&units=metric`)
        .then(res => res.json())
        .then(json => {
            setTemperature(json.main.temp);
            setWeathercondition(json.weather[0].main);
            setIcon(json.weather[0].icon);
        });
      };

    useEffect(() => {
        getLocation().then(()=> {
            fetchWeather();
        })
    }, [location]);
  



        return (
            <View style={styles.container}>
                <Image style={{width: 130, height: 130}} source={{uri: "https://openweathermap.org/img/w/" + icon + ".png"}}/>
                <Text style={styles.title}>PUP Weather Expert</Text>
                <Text style={styles.paragraph1}>{weatherCondition ? 'Today ' + weatherInfo[weatherCondition].title : ' Loading weather conditions'}</Text>
                <Text style={styles.paragraph2}>{temperature ? temperature + '°': ' Loading weather conditions'}</Text>
                <Image style={{width: 130, height: 130}} source={weatherDog}/>
            </View>
        );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBBF99',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 32,
        color: "lightseagreen",
    },
    paragraph1: {
        fontSize: 28,
        color: "#fff",
    },
    paragraph2: {
        color: "#fff",
        fontSize: 24,
    }
});