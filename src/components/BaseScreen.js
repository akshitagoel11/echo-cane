import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BaseScreen = ({ title, navigation, color, children, icon }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={[styles.titleBadge, { borderColor: color }]}>
          <Text style={[styles.title, { color: color }]}>{title}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Ionicons name={icon} size={80} color={color} style={styles.mainIcon} />
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  titleBadge: {
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainIcon: {
    marginBottom: 30,
  }
});

export default BaseScreen;
