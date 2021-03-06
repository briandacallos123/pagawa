import React, {useState, useEffect, useRef} from 'react'
import {Dimensions, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native'
import Header from './header'
import { retEmail } from '../../login/Index'
import { firestore } from '../../../../firebase'
import ModalDropdown from 'react-native-modal-dropdown';
import Logo from './logo'
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const hayt = Math.round(Dimensions.get('window').height)
const Payfare = ({navigation}) => {
    const [data, setData] = useState([])
    const [location, setOption] = useState([
       "Malabon",
       "Navotas",
    ])
    const myRef = useRef()

    const [isDisabled, setDisabled] = useState(true)
    const [email, setEmail] = useState("")
    const [routes, setRoutes] = useState([])
    const [amount, setAmount] = useState(0)
    const [driverEmail, setDriverEmail] = useState([])
    const [index, setIndex] = useState(0)
    const [fee, setFee] = useState(0)
    
    useEffect(()=>{
        findUser()
        ewan()
    },[index])

    // console.log("data to: ", data);

    const findUser = () =>{

        firestore.collection('commuters').where('email', '==', retEmail()).get()
        .then((res)=>{
            res.docs.forEach(doc => {
                setData(doc.data())
            })
           
        })
    }
  
    // console.log("user: ", data.id);
    
    const getDriverInfo = () => {
        firestore.collection('commuters').where('email', '==', email).get()
        .then((res)=>{
            res.docs.forEach((doc)=>{
                setDriverEmail(doc.data())
                
            })
            
        })
        .catch((e)=>{
            console.log("error: ", e.message);
        })
        // add to driver
    }
    // if(driverEmail){
    //     getDriverInfo()
    // }else{
    //     // console.log("driver again: ",driverEmail.id);
    //     getDriverInfo()
    // }
    const ewan = () =>{
        if(driverEmail){
            // updateDriver()
            // console.log("meron na");
            // console.log(driverEmail.id);
            updateDriver()
        }else{
            console.log("wala pa");
        }
    }

    const updateDriver = () => {
        let prevBalance = driverEmail.balance
        firestore.collection('commuters').doc(driverEmail.id).update({
            balance:prevBalance + amount
        }).then(()=>{
              
              setIndex(index+1)
              navigation.navigate("Receipt")
              console.log("success");
        })
    }


    const pay = () => {
    
      
        if(email){
            firestore.collection('commuters').where("email", "==", email).where('driver',"==",true).get()
            .then((snapshot) => {
                
                snapshot.docs.forEach(doc=>{
                // //   navigate to other component
                // navigation.navigate("Receipt")
                if(data.balance > amount){
                //   user muna
                    let diff = data.balance - amount
                    firestore.collection('commuters').doc(data.id).update({
                        balance:diff
                    }).then(()=>{
                      
                        getDriverInfo()
                        // updateDriver()
                      
                    }).catch((e)=>{
                        console.log("error: ", e.message);
                    })
                }else{
                    Alert.alert("Kulang")
                }
                })
               
            }).catch((e)=>{
                console.log("error: ",e.message);
            })
        }else{
            Alert.alert("Please provide driver's email account first.")
            myRef.current.focus()
        }
     
    }
    

    const dog = (a) => {
       setDisabled(false)
       if(a == "Malabon"){
        setRoutes([
            "Concepcion - Hulo",
            "Concepcion - Bayan",
            "Concepcion - Mc",
            "Concepcion - Monumento",
        ])
       }else{
        setRoutes([
            "Tangos - Sipac",
            "Tangos - C4",
            "Tangos - Mc",
            "Tangos - Monumento",
        ])
       }
       
    }

    const cat = (a) =>{
        
        if(a == "Concepcion - Hulo" || a == "Tangos - Sipac"){
            setAmount(9)
        }
        else if(a == "Concepcion - Bayan" || a ==  "Tangos - C4"){
            setAmount(10)
        }
        else if(a == "Concepcion - Mc" || a ==  "Tangos - Mc"){
            setAmount(12)
        }
        else if(a ==  "Concepcion - Monumento" || a ==  "Tangos - Monumento"){
            setAmount(15)
        }
    }

   
    
    return (
        <View style={styles.container}>
            <View style={{alignItems:'center', position:'relative',
        top:100}}>
                <Header/>
              
            </View> 
            <View style={{
                alignItems:'center',
                padding:20
            }}>
                <View>
                    <View style={{marginBottom:15}}>
                        <Text style={{fontWeight:'bold'}}>Select your current location:</Text>
                        <ModalDropdown 
                                options={location}
                                defaultValue={"Please select..."}
                                dropdownTextStyle={{color:'black',textAlign:'center',fontWeight:'bold',fontSize:12}}
                                textStyle={{color:'black', width:200,paddingHorizontal:10,paddingVertical:5,borderWidth:1,borderColor:'black',fontSize:15,backgroundColor:'#D2F1E2'}}
                                style={{marginRight:20}}
                                // onSelect={dog}
                                renderButtonText={dog}
                                >
                                </ModalDropdown>
                    </View>
                    <View style={{marginBottom:30}}>
                        <Text style={{fontWeight:'bold'}}>Select your Destination:</Text>
                        <ModalDropdown 
                                options={routes}
                                // defaultValue={routes[0]}
                                dropdownTextStyle={{color:'black',textAlign:'center',fontWeight:'bold',fontSize:12}}
                                textStyle={{color:'black',width:200,paddingHorizontal:10,paddingVertical:5,borderWidth:1,borderColor:'black',fontSize:15,backgroundColor:'#D2F1E2'}}
                                style={{marginRight:20}}
                                // onSelect={dog}
                                renderButtonText={cat}
                                >
                                </ModalDropdown>
                    </View>

                    {/* fare */}
                    <View style={{ alignItems:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{marginRight:20, fontSize:15}}>Your total Fare:</Text>
                            <Text style={{fontWeight:'bold',fontSize:25}}>??? {amount}</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{marginRight:60, fontSize:15}}>Balance: </Text>
                            <Text style={{fontWeight:'bold',fontSize:25}}>??? {data.balance}</Text>
                        </View>
                    </View>

                    {/* pay time */}
                    <View style={{marginTop:15}}>
                        <Text style={{fontWeight:'bold'}}>Pay to (Jeepney Driver's Email)</Text>
                        <TextInput
                        style={{
                            borderBottomWidth:1,
                            borderBottomColor:'black',
                            width:200,
                            padding:5,
                            marginBottom:50
                        }}
                        ref={myRef}
                        onChangeText={(e)=>setEmail(e)}
                        />
                        <View style={{alignItems:'center'}}>
                            <TouchableOpacity style={{
                                backgroundColor:'#058F4D',
                                padding:10,
                                width:100
                            }}
                            onPress={pay}
                            >
                                <Text style={{
                                    color:'white',
                                    fontWeight:'bold',
                                    textAlign:'center',
                                    fontSize:20
                                }}>PAY</Text>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                </View>
            </View>
           
          
           <Logo/>
        </View>
    )
}

export default Payfare

const styles = StyleSheet.create({

    container:{
        flex:1,
        padding:10,
        height:hayt,
        justifyContent:'space-between'
    },
    TextInput:{
        borderWidth:1,
        borderColor:'black',
        width:200,
        padding:10,
        borderRadius:10
    },
    balance:{
        fontWeight:'bold',
        fontSize:15,
        marginRight:20
        
    }
})
