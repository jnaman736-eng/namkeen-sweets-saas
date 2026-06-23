import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../store';
import { ordersAPI } from '../../api/endpoints';
import { orderActions } from '../../store/slices/orderSlice';
import { colors, spacing, typography } from '../../styles/theme';
const OrderListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      dispatch(orderActions.setLoading(true));
      const response = await ordersAPI.getAll();
      dispatch(orderActions.setOrders(response.data.data));
    } catch (error) {
      dispatch(orderActions.setError(error.message));
    } finally {
      dispatch(orderActions.setLoading(false));
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <Text style={[styles.status, styles[`status_${item.status}`]]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.customer}>{item.customer?.name || 'N/A'}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.amount}>₹{item.totalAmount}</Text>
        <Text style={styles.date}>{new Date(item.orderDate).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent=<Text style={styles.emptyText}>No orders found</Text>
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    paddingHorizontal: spacing.md
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.sm,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  orderNumber: {
    ...typography.h3,
    color: colors.dark
  },
  status: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  status_pending: {
    backgroundColor: colors.warning
  },
  status_confirmed: {
    backgroundColor: colors.secondary
  },
  status_delivered: {
    backgroundColor: colors.success
  },
  customer: {
    ...typography.body,
    color: colors.gray,
    marginBottom: spacing.sm
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  amount: {
    ...typography.h3,
    color: colors.primary
  },
  date: {
    ...typography.small,
    color: colors.gray
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.gray
  }
});

export default OrderListScreen;
