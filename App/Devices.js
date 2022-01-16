import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, ScrollView, FlatList, AsyncStorage, TouchableOpacity, TextInput} from 'react-native';

const styles = StyleSheet.create({
    input:{
        textAlign: 'center',
        margin:'5%',
        backgroundColor: '#c1e8e3',
        borderWidth: 3,
        borderStyle:'solid',
        borderColor: '#113838',
        fontSize: 20,
        width: '80%',
    },
    hint:{
        textAlign: 'center',
        color: '#c71645',
        width: '100%',
        marginTop:10,
    },
    button:{
        flex:1,
        backgroundColor: '#063233',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    btnText:{
        color:'#b4ded6'
    }
})

const AddDeviceBox = (props) => {
    return(
        <TouchableOpacity
            style={{
                width:'40%',
                margin: '5%',
                borderColor:'#abc2be',
                borderWidth:1,
                justifyContent:'center',
                alignItems:'center',
                flexDirection:'column' }}

            onPress={props.onPress}
        >
            <Text style={{fontSize:45}}>+</Text>
        </TouchableOpacity>
    )
}

const DeviceBox = (props) => {
    return (
        <View style={{
            width: '40%',
            margin: '5%',
            backgroundColor:'#a9ccc6',
            borderColor:'#175e55',
            borderWidth:1.25,
            aspectRatio:1,
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'column'
        }}>
            <Text style={{fontSize:35, marginBottom:5, textAlign:'center', color:'#0b3838'}}>{props.data.name}</Text>
            <Text style={{fontSize:20, textAlign:'center', color:'#0b3838'}}>{props.data.place}</Text>
        </View>
    )
}

const Devices = (props) => {

    const [renderScreen, setRenderScreen] = useState('devices');
    const [addingDevice, setAddingDevice] = useState(false);
    const [devices, setDevices] = useState([]);
    const [addName, setAddName] = useState('');
    const [addPlace, setAddPlace] = useState('');
    const [addCommand, setAddCommand] = useState('');
    const [addHint, setAddHint] =  useState(false);

    useEffect(()=>{
        async function loadDevices() {
            try{
                const value = await AsyncStorage.getItem('devices');
                const valuesArr = JSON.parse(value);
                if(value!==null) {
                    setDevices(valuesArr);
                } else {
                    setDevices([{}]);
                }
            } catch (e) {
                setDevices([{}]);
            }
        }
        loadDevices();
    },[]);

    useEffect(() => {
        if(addingDevice) {
            props.navigation.setOptions({tabBarStyle:{display:'none'}, title:'New device'});
            setAddName('');
            setAddPlace('');
            setAddCommand('');
            setAddHint(false);
            setRenderScreen('newDevice');
        } else {
            props.navigation.setOptions({tabBarStyle: {display:'flex'}, title: 'Devices'});
            setRenderScreen('devices');
        }
    }, [addingDevice]);

    async function save() {
        try{
            devices.unshift({name:addName, place:addPlace, command:addCommand})
            await AsyncStorage.setItem('devices', JSON.stringify(devices));
        } catch (e) {
            console.log(e);
        } finally {
            setAddingDevice(false);
        }
    }

    if(renderScreen == 'devices'){
        return(
            <FlatList
                data={devices} numColumns={2}
                renderItem={({item}) => item.name!==undefined?<DeviceBox data={item}/>:<AddDeviceBox onPress={() => setAddingDevice(true)}/>}
            />
        );
    } else {
        return (
            <View style={{height: '100%', alignItems:'center', justifyContent: 'space-around'}}>
                <Text style={[styles.hint, {display: addHint?'flex':'none'}]}>Fill all fields before saving</Text>
                <TextInput style={styles.input} placeholder='Device name' onChangeText={(text)=>setAddName(text)}/>
                <TextInput style={styles.input} placeholder='Place' onChangeText={(text)=>setAddPlace(text)}/>
                <TextInput style={styles.input} placeholder='Command' onChangeText={(text)=>setAddCommand(text)}/>
                <View style={{width: '100%',flexDirection: 'row', flex: 1, alignItems:'flex-end', justifyContent:'space-around'}}>
                    <TouchableOpacity
                    style={styles.button} onPress={async () => {
                                        if(addName && addPlace && addCommand){
                                            save();
                                        } else {
                                            setAddHint(true);
                                        }}}>
                        <Text style={styles.btnText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button} onPress={() => {setAddingDevice(false);}}                    >
                        <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

}

export default Devices;