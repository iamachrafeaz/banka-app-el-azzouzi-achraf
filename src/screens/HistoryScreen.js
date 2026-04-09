import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import TransactionItem from '../components/TransactionItem';

export default function HistoryScreen({ accounts }) {
  // Agréger toutes les transactions de tous les comptes
  const allTransactions = accounts
    .flatMap(acc =>
      acc.transactions.map(tx => ({
        ...tx,
        accountLabel: acc.label,
        uniqueKey: acc.id + '-' + tx.id,
      }))
    )
    // Tri par date décroissante (simpliste — les dates sont des strings ici)
    .reverse();

  return (
    <View style={styles.container}>
      <FlatList
        data={allTransactions}
        keyExtractor={(item) => item.uniqueKey}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.accountTag}>{item.accountLabel}</Text>
            <TransactionItem transaction={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune opération dans l'historique.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.background },
  accountTag: {
    fontSize:         11,
    color:            colors.textLight,
    paddingHorizontal:16,
    paddingTop:       10,
    paddingBottom:    2,
    textTransform:    'uppercase',
    letterSpacing:    0.6,
  },
  empty: { padding: 30, textAlign: 'center', color: colors.textLight },
});