import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatBubble from 'react-native-chat-bubble';

import getFoodSuggestions from '../utils/bot';
import findClosestFood from '../utils/bot';

const Message = ({ message }) => {
  const messageStyle = message.type === 'user' ? styles.userMessage : {};
  const iconName = message.type === 'user' ? 'send' : 'chatbubble-outline';

  return (
    <ChatBubble
      isOwnMessage={message.type === 'user'}
      position={'left'} // Adjust based on message type
      textStyle={{ color: 'white' }}
      bubbleColor={message.type === 'user' ? '#1084ff' : '#f0f0f0'}
      tailColor={message.type === 'user' ? '#1084ff' : '#f0f0f0'}
      withTail={true}
    >
      <Text>{message.text}</Text>
    </ChatBubble>
  );
};

const InputAndSend = ({ userInput, setUserInput, handleSendMessage }) => (
  <View style={styles.inputContainer}>
    <TextInput
      placeholder="Enter budget"
      value={userInput}
      onChangeText={setUserInput}
      keyboardType="numeric"
      style={styles.input}
    />
    <Ionicons name="send" size={24} onPress={handleSendMessage} />
  </View>
);


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = () => {
    setMessages([...messages, { type: 'user', text: userInput }]);
  
    try {
      const suggestions = getFoodSuggestions(parseInt(userInput));
      console.log('Suggestions:', suggestions);
      if (suggestions && suggestions.length > 0) {
       // console.log(suggestions)
        const formattedResponse = `With a budget of ${userInput} cedis, you can try ${suggestions.join(' or ')}`;
        setMessages([...messages, { type: 'bot', text: formattedResponse }]);
      } else {
        // Find the closest food item and calculate the difference
        
        const closestFood = findClosestFood(suggestions, parseInt(userInput));
        console.log('Closest Food:', closestFood);
        if (closestFood) {
          const difference = closestFood.price - parseInt(userInput);
          const formattedResponse = `Unfortunately, there's no exact match for your budget. The closest option is ${closestFood.name} at ${closestFood.price} cedis. You need an additional ${difference} cedis.`;
          setMessages([...messages, { type: 'bot', text: formattedResponse }]);
        } else {
          setMessages([...messages, { type: 'bot', text: 'No suggestions found' }]);
        }
      }
    } catch (error) {
      console.error('Error fetching food suggestions:', error);
      setMessages([...messages, { type: 'bot', text: 'An error occurred' }]);
    }

    setUserInput('');
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message message={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <InputAndSend
        userInput={userInput}
        setUserInput={setUserInput}
        handleSendMessage={handleSendMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
});

export default Chat;
