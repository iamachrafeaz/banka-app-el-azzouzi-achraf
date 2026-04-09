import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { initialAccounts } from './src/data/accounts';
import { colors } from './src/theme/colors';

import DashboardScreen    from './src/screens/DashboardScreen';
import AccountDetailScreen from './src/screens/AccountDetailScreen';
import TransferScreen     from './src/screens/TransferScreen';
import HistoryScreen      from './src/screens/HistoryScreen';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack imbriqué dans l'onglet "Comptes"
function AccountsStack({ accounts, onDebit, onCredit, onTransfer }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:      { backgroundColor: colors.primary },
        headerTintColor:  '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="Dashboard" options={{ title: 'Mes Comptes' }}>
        {(props) => (
          <DashboardScreen {...props} accounts={accounts} />
        )}
      </Stack.Screen>

      <Stack.Screen name="AccountDetail" options={{ title: 'Détail du Compte' }}>
        {(props) => (
          <AccountDetailScreen
            {...props}
            accounts={accounts}
            onDebit={onDebit}
            onCredit={onCredit}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Transfer" options={{ title: 'Virement' }}>
        {(props) => (
          <TransferScreen
            {...props}
            accounts={accounts}
            onTransfer={onTransfer}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  // ─── État global des comptes ────────────────────────────────────────────────
  const [accounts, setAccounts] = useState(initialAccounts);

  // ─── Opération : Débit ──────────────────────────────────────────────────────
  const handleDebit = (accountId, amount, label) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id !== accountId) return acc;

        // Règle métier : rejet si solde insuffisant
        if (acc.balance < amount) return null; // signal d'échec

        const newTransaction = {
          id:     'T' + Date.now(),
          type:   'debit',
          amount,
          label,
          date:   new Date().toLocaleDateString('fr-FR'),
        };
        return {
          ...acc,
          balance:      acc.balance - amount,
          transactions: [newTransaction, ...acc.transactions],
        };
      }).filter(Boolean) // retire null si rejet
      // ⚠️ Ce filtre supprime le compte en cas d'erreur — à corriger (voir Tâche 2.1)
    );
  };

  // ─── Opération : Crédit ─────────────────────────────────────────────────────
  const handleCredit = (accountId, amount, label) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id !== accountId) return acc;
        const newTransaction = {
          id:     'T' + Date.now(),
          type:   'credit',
          amount,
          label,
          date:   new Date().toLocaleDateString('fr-FR'),
        };
        return {
          ...acc,
          balance:      acc.balance + amount,
          transactions: [newTransaction, ...acc.transactions],
        };
      })
    );
  };

  // ─── Opération : Virement ───────────────────────────────────────────────────
  const handleTransfer = (fromId, toId, amount, label) => {
    // À compléter à l'Étape 4
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor:   colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            borderTopColor: colors.border,
            height:         60,
            paddingBottom:  6,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="AccountsTab"
          options={{
            tabBarLabel: 'Comptes',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏦</Text>,
          }}
        >
          {() => (
            <AccountsStack
              accounts={accounts}
              onDebit={handleDebit}
              onCredit={handleCredit}
              onTransfer={handleTransfer}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="HistoryTab"
          options={{
            tabBarLabel: 'Historique',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
            headerShown: true,
            headerStyle:      { backgroundColor: colors.primary },
            headerTintColor:  '#fff',
            headerTitleStyle: { fontWeight: '700' },
            title: 'Historique',
          }}
        >
          {() => <HistoryScreen accounts={accounts} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}