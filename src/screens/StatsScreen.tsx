import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-svg-charts';
import { theme } from '../theme/theme';
import { getTransactions, Transaction } from '../services/storage';
import { useIsFocused } from '@react-navigation/native';

const CATEGORY_COLORS: Record<string, string> = {
  shopping: theme.colors.food, // re-using colors for demo
  travel: theme.colors.primary,
  food: theme.colors.food,
  health: theme.colors.entertainment,
  transport: theme.colors.transportation,
  housing: theme.colors.primary,
  default: theme.colors.border,
};

const CATEGORY_NAMES: Record<string, string> = {
  shopping: 'Shopping',
  travel: 'Travel',
  food: 'Food & Dining',
  health: 'Health',
  transport: 'Transportation',
  housing: 'Housing',
};

const StatsScreen = () => {
  const isFocused = useIsFocused();
  const [totalSpent, setTotalSpent] = useState(0); // Fallback to mock if empty
  const [categories, setCategories] = useState([
    { key: '1', amount: 2052.30, svg: { fill: theme.colors.primary }, name: 'Housing', percentage: 60 },
    { key: '2', amount: 684.10, svg: { fill: theme.colors.food }, name: 'Food & Dining', percentage: 20 },
    { key: '3', amount: 410.46, svg: { fill: theme.colors.transportation }, name: 'Transportation', percentage: 12 },
    { key: '4', amount: 273.64, svg: { fill: theme.colors.entertainment }, name: 'Entertainment', percentage: 8 },
  ]);

  useEffect(() => {
    const loadData = async () => {
      const txs = await getTransactions();
      const expenses = txs.filter(t => t.type === 'expense');

      if (expenses.length > 0) {
        const total = expenses.reduce((sum, t) => sum + t.amount, 0);
        setTotalSpent(total);

        // Group by category
        const grouped: Record<string, number> = {};
        expenses.forEach(t => {
          grouped[t.category] = (grouped[t.category] || 0) + t.amount;
        });

        const newCategories = Object.keys(grouped).map((catId, index) => {
          const amount = grouped[catId];
          return {
            key: index.toString(),
            amount,
            svg: { fill: CATEGORY_COLORS[catId] || CATEGORY_COLORS.default },
            name: CATEGORY_NAMES[catId] || catId,
            percentage: (amount / total) * 100
          };
        }).sort((a, b) => b.amount - a.amount);

        setCategories(newCategories);
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const pieData = categories.map((item, index) => ({
    value: item.amount,
    svg: item.svg,
    key: `pie-${item.key}`,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
           <View style={styles.avatarPlaceholder}>
             <Ionicons name="person" size={24} color={theme.colors.primaryLight} />
           </View>
           <Text style={styles.headerTitle}>Frosted Clarity</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
      </View>

      <ScrollView style={styles.container}>
        {/* Total Spent */}
        <View style={styles.totalHeader}>
          <Text style={styles.totalLabel}>TOTAL SPENT</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalAmount}>${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            <View style={styles.monthSelector}>
              <Text style={styles.monthText}>November</Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.textLight} />
            </View>
          </View>
        </View>

        {/* Allocation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Allocation</Text>
          <View style={styles.chartContainer}>
            <PieChart
              style={{ height: 200, width: 200 }}
              valueAccessor={({ item }) => item.value}
              data={pieData}
              innerRadius={'45%'}
              outerRadius={'100%'}
              padAngle={0}
            />
            {/* Center Text of Pie Chart */}
            <View style={styles.chartCenterOverlay}>
               <View style={styles.chartCenterInner}>
                 <Ionicons name="wallet-outline" size={20} color={theme.colors.text} />
                 <Text style={styles.chartCenterText}>100%</Text>
               </View>
            </View>
          </View>
        </View>

        {/* Categories Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Categories</Text>
            <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.primary} />
          </View>

          {categories.map((cat) => (
            <View key={cat.key} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View style={[styles.colorDot, { backgroundColor: cat.svg.fill }]} />
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryAmount}>
                  ${cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              </View>
              {/* Progress Bar */}
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${cat.percentage}%`, backgroundColor: cat.svg.fill }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Monthly Comparison Card */}
        <View style={styles.card}>
           <View style={styles.comparisonHeader}>
             <Text style={styles.cardTitle}>Monthly{'\n'}Comparison</Text>
             <View style={styles.legend}>
               <View style={styles.legendItem}>
                 <View style={[styles.legendDot, { borderColor: theme.colors.primaryLight, borderWidth: 2 }]} />
                 <Text style={styles.legendText}>LAST{'\n'}MO</Text>
               </View>
               <View style={styles.legendItem}>
                 <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                 <Text style={styles.legendText}>THIS{'\n'}MO</Text>
               </View>
             </View>
           </View>

           {/* Placeholder for bar chart, using basic views for visual representation */}
           <View style={styles.barChartPlaceholder}>
             {/* W1 */}
             <View style={styles.barGroup}>
               <View style={styles.barContainer}>
                 <View style={[styles.bar, styles.barLastMo, { height: '30%' }]} />
                 <View style={[styles.bar, styles.barThisMo, { height: '40%' }]} />
               </View>
               <Text style={styles.barLabel}>W1</Text>
             </View>
             {/* W2 */}
             <View style={styles.barGroup}>
               <View style={styles.barContainer}>
                 <View style={[styles.bar, styles.barLastMo, { height: '50%' }]} />
                 <View style={[styles.bar, styles.barThisMo, { height: '60%' }]} />
               </View>
               <Text style={styles.barLabel}>W2</Text>
             </View>
             {/* W3 */}
             <View style={styles.barGroup}>
               <View style={styles.barContainer}>
                 <View style={[styles.bar, styles.barLastMo, { height: '80%' }]} />
                 <View style={[styles.bar, styles.barThisMo, { height: '30%' }]} />
               </View>
               <Text style={styles.barLabel}>W3</Text>
             </View>
             {/* W4 */}
             <View style={styles.barGroup}>
               <View style={styles.barContainer}>
                 <View style={[styles.bar, styles.barLastMo, { height: '40%' }]} />
                 <View style={[styles.bar, styles.barThisMo, { height: '50%' }]} />
               </View>
               <Text style={styles.barLabel}>W4</Text>
             </View>
           </View>

           {/* Summary Footer */}
           <View style={styles.summaryFooter}>
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Ionicons name="trending-down" size={20} color={theme.colors.entertainment} style={{marginRight: 8}} />
               <Text style={styles.summaryText}>Overall spending is down</Text>
             </View>
             <Text style={styles.summaryValue}>-12%</Text>
           </View>
        </View>
        <View style={{height: 20}} />
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
  },
  totalHeader: {
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textLight,
    letterSpacing: 1,
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#001A4D',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  monthText: {
    fontSize: 14,
    color: theme.colors.text,
    marginRight: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001A4D',
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.md,
  },
  chartCenterOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCenterInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartCenterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 4,
  },
  categoryRow: {
    marginBottom: theme.spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001A4D',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F0F2F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  legend: {
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  barChartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    marginTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  barGroup: {
    alignItems: 'center',
    width: 40,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    width: 20,
    justifyContent: 'space-between',
  },
  bar: {
    width: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLastMo: {
    backgroundColor: theme.colors.primaryLight,
  },
  barThisMo: {
    backgroundColor: theme.colors.primary,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#FFF4F2',
    padding: 12,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.entertainment,
  }
});

export default StatsScreen;
