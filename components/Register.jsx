import { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, TextInput } from 'react-native';
import { API_URL } from "@env"
import emailValidator from 'email-validator'

export const Register = ({navigation}) => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [msg, setMsg] = useState({
    content: '',
    isErr: true
  })

  const [formErr, setFormErr] = useState(true)

  function onNameChange(val) {

    val = val.replace(/[^A-Za-z]/ig, '')
  
    setForm({...form, name: val})
  }

  function onEmailChange(val) {
    const emailIsValid = emailValidator.validate(val)

    if (!emailIsValid) {
      setMsg({ content: 'Email is invalid', isErr: true })
      setFormErr(true)
    } else {
      setMsg({ content: '', isErr: false })
      setFormErr(false)
    }

    setForm({...form, email: val})
  }
  
  function onPasswordChange(val) {
    setForm({...form, password: val})
  }

  async function register() {

    let emptyField = []

    if (form.name === '') {
      emptyField.push('Name')
    }

    if (form.email === '') {
      emptyField.push('Email')
    }

    if (form.password === '') {
      emptyField.push('Password')
    }

    if (emptyField.length > 0) {
      setMsg({ content: emptyField.toString() + ' cannot be empty.', isErr: true })
      return
    }

    if (formErr) {
      return
    }

    setMsg({
      content: '',
      isErr: true
    })
    const result = await fetch(API_URL + '/user/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    });
    const response = await result.json()
    if (result.ok) {
      setMsg({ content: 'Register successful, please proceed to login', isErr: false })
    } else {
      if (response.err && result.status === 400) {
        setMsg({ content: response.err, isErr: true })
      }
    }
  
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Register</Text>
      <Text style={[styles.err_msg, msg.content.length > 0? styles.err_msg_show : '', msg.isErr? '' : styles.non_err_msg]}>{msg.content}</Text>
      <TextInput
        style={styles.input}
        onChangeText={onNameChange}
        placeholder="Name"
        keyboardType="text"
        value={form.name}
      />
      <TextInput
        style={[styles.input, styles.input2]}
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
      <TouchableOpacity style={styles.register_btn} onPress={register}>
        <Text style={[styles.btn_text, styles.btn_text_white]}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.login_btn} onPress={() => navigation.navigate('Login') }>
        <Text style={styles.btn_text}>Login</Text>
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
  non_err_msg: {
    color: '#000000'
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
  register_btn: {
    marginTop: 20,
    width: 200,
    borderColor: '#000000',
    borderWidth: 2,
    backgroundColor: '#3700B3',
    paddingVertical: 5
  },
  login_btn: {
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