import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { saveTransaction } from '../services/storage';

const CATEGORIES = [
  { id: 'shopping', name: 'Shopping', icon: 'bag-handle-outline' },
  { id: 'travel', name: 'Travel', icon: 'airplane-outline' },
  { id: 'food', name: 'Food', icon: 'restaurant-outline' },
  { id: 'health', name: 'Health', icon: 'fitness-outline' },
  { id: 'transport', name: 'Transport', icon: 'car-outline' },
];

const KEYPAD_BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'];

const AddScreen = () => {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('0.00');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [note, setNote] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      if (amount.length > 1) {
        setAmount(amount.slice(0, -1));
      } else {
        setAmount('0');
      }
    } else {
      if (amount === '0.00' || amount === '0') {
        setAmount(key === '.' ? '0.' : key);
      } else if (key === '.' && amount.includes('.')) {
        return; // Prevent multiple dots
      } else {
        // limit to 2 decimal places if dot exists
        if (amount.includes('.')) {
          const parts = amount.split('.');
          if (parts[1] && parts[1].length >= 2) return;
        }
        setAmount(amount + key);
      }
    }
  };

  const handleSave = async () => {
    try {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      await saveTransaction({
        type,
        amount: parsedAmount,
        category: selectedCategory,
        note
      });

      alert("Transaction saved!");
      setAmount('0.00');
      setNote('');
    } catch (e) {
      alert("Failed to save transaction");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
           <View style={styles.avatarPlaceholder}>
             <Ionicons name="person" size={24} color={theme.colors.primaryLight} />
           </View>
           <Text style={styles.headerTitle}>Frosted Clarity</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Toggle Expense/Income */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, type === 'expense' && styles.toggleButtonActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActive]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, type === 'income' && styles.toggleButtonActive]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.toggleText, type === 'income' && styles.toggleTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Enter Amount</Text>
          <Text style={styles.amountValue}>${amount}</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <View style={[
                  styles.categoryIconContainer,
                  selectedCategory === cat.id && styles.categoryIconContainerActive
                ]}>
                  <Ionicons
                    name={cat.icon as any}
                    size={24}
                    color={selectedCategory === cat.id ? theme.colors.primary : theme.colors.text}
                  />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What was this for?"
            value={note}
            onChangeText={setNote}
            placeholderTextColor={theme.colors.textLight}
          />
        </View>

        {/* Keypad */}
        <View style={styles.keypadContainer}>
          {KEYPAD_BUTTONS.map((btn) => (
            <TouchableOpacity
              key={btn}
              style={styles.keypadButton}
              onPress={() => handleKeyPress(btn)}
            >
              {btn === 'delete' ? (
                <Ionicons name="backspace-outline" size={24} color={theme.colors.text} />
              ) : (
                <Text style={styles.keypadButtonText}>{btn}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Transaction</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8DEF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 4,
    marginBottom: theme.spacing.xl,
    alignSelf: 'center',
    width: '80%',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textLight,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  amountLabel: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#001A4D', // Deep blue from design
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001A4D',
    marginBottom: 12,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconContainerActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  keypadButton: {
    width: '30%',
    aspectRatio: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddScreen;
