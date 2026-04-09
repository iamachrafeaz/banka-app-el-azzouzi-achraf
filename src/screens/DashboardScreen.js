import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import AccountCard from '../components/AccountCard';

export default function DashboardScreen({ navigation, accounts }) {
  // Calcul du solde total
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <View style={styles.container}>
      {/* Bandeau solde total */}
      <View style={styles.totalBanner}>
        <Text style={styles.totalLabel}>Patrimoine Total</Text>
        <Text style={styles.totalAmount}>
          {totalBalance.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
          })} MAD
        </Text>
        <Text style={styles.totalSub}>{accounts.length} compte(s) actif(s)</Text>
      </View>

      {/* Liste des comptes */}
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            onPress={() =>
              navigation.navigate('AccountDetail', { accountId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Sélectionnez un compte</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.background },
  totalBanner: {
    backgroundColor: colors.primary,
    padding:         24,
    alignItems:      'center',
  },
  totalLabel:  { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  totalAmount: { color: '#fff', fontSize: 32, fontWeight: '800', marginVertical: 4 },
  totalSub:    { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  list:        { paddingBottom: 24 },
  sectionTitle:{
    fontSize:       13,
    color:          colors.textLight,
    paddingHorizontal: 16,
    paddingVertical:   12,
    textTransform:  'uppercase',
    letterSpacing:  0.8,
  },
});