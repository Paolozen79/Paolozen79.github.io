import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AddScreen from '../screens/AddScreen';
import StatsScreen from '../screens/StatsScreen';
import BudgetScreen from '../screens/BudgetScreen';
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Add') {
            return (
              <View style={styles.addIconContainer}>
                <Ionicons name="add-circle" size={48} color={theme.colors.primaryLight} />
                <Ionicons name="add" size={24} color="#fff" style={styles.addIconInner} />
              </View>
            );
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Budget') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F3F6FC',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{ tabBarLabel: 'Add' }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  addIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  addIconInner: {
    position: 'absolute',
  }
});

export default TabNavigator;
