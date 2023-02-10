import { useState } from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, Item } from 'react-native';
import { API_URL } from "@env"
export const SearchName = ({navigation, route}) => {
  const { token } = route.params
  // if token not found, back to login to get new token
  if (!token) {
    navigation.navigate('Login')
  }

  const [name, setName] = useState('')
  const [suggest, setSuggest] = useState([])
  const debounceTimer = 250
  let debounce = setTimeout(() => {}, 0)

  function onNameChange(val) {

    val = val.replace(/[^A-Za-z]/ig, '')

    // prevent multiple search api in a short time
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      getNameFromAPI(val)
    }, debounceTimer);
    
    setName(val)
  }

  function onSuggestSelect(val) {
    setName(val)
    setSuggest([])
  }

  async function getNameFromAPI(val) {
    const result = await fetch(API_URL + `/user/getUser/name?name=${val}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token
      }
    });
    const response = await result.json()
    if (result.ok) {
      setSuggest(response)
    } else {
      if (response.err && result.status === 400) {
        console.log(response.err)
      }
    }
  
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Search User By Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={onNameChange}
        placeholder="Name"
        keyboardType="text"
        value={name}
      />

      <FlatList
        data={suggest}
        renderItem={(item, index) => <Text style={styles.listText} onPress={() => onSuggestSelect(item.item)}>{item.item}</Text>}
        keyExtractor={item => item}
        style={[styles.list, suggest.length < 1? styles.list_hide : '']}
      />
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
  input: {
    marginTop: 20,
    marginHorizontal: 20,
    borderColor: '#000000',
    borderWidth: 2,
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 10,
    minWidth: 200
  },
  list: {
    borderColor: '#000000',
    borderWidth: 2,
    maxHeight: 91,
    width: 200,
    flexGrow: 0,
    marginTop: -2
  },
  list_hide: {
    opacity: 0
  },
  listText: {
    fontSize: 20,
    borderColor: '#000000',
    borderWidth: 1,
    textAlign: 'center',
  }
});