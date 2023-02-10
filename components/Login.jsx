import { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TextInput } from 'react-native';
import { API_URL } from "@env"

export const Login = ({navigation}) => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [errMsg, setErrMsg] = useState('')

  function onEmailChange(val) {
    setForm({...form, email: val})
  }
  
  function onPasswordChange(val) {
    setForm({...form, password: val})
  }

  async function login() {
    setErrMsg('')
    const result = await fetch(API_URL + '/user/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      })
    });
    const response = await result.json()
    if (result.ok) {
      navigation.navigate('SearchName', { token: response.token })
    } else {
      if (response.err && result.status === 400) {
        setErrMsg(response.err)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Login</Text>
      <Text style={[styles.err_msg, errMsg.length > 0? styles.err_msg_show : '']}>{errMsg}</Text>
      <TextInput
        style={styles.input}
        onChangeText={onEmailChange}
        placeholder="Email"
        keyboardType="email"
      />
      <TextInput
        style={[styles.input, styles.input2]}
        onChangeText={onPasswordChange}
        placeholder="Password"
        keyboardType="text"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.login_btn} onPress={login}>
        <Text style={[styles.btn_text, styles.btn_text_white]}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.register_btn} onPress={() => navigation.navigate('Register') }>
        <Text style={styles.btn_text}>Register</Text>
      </TouchableOpacity>
    </View>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 30,
    textDecorationLine: 'underline',
    marginBottom: 20
  },
  err_msg: {
    color: '#DC143C',
    fontSize: 15,
    paddingHorizontal: 20,
    opacity: 0
  },
  err_msg_show: {
    opacity: 1
  },
  input: {
    marginVertical: 20,
    marginHorizontal: 20,
    borderColor: '#000000',
    borderWidth: 2,
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 10,
    minWidth: 200
  },
  input2: {
    marginTop: 0
  },
  login_btn: {
    marginTop: 20,
    width: 200,
    borderColor: '#000000',
    borderWidth: 2,
    backgroundColor: '#3700B3',
    paddingVertical: 5
  },
  register_btn: {
    marginTop: 10,
    paddingVertical: 5
  },
  btn_text: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 15
  },
  btn_text_white: {
    color: '#ffffff'
  }
});