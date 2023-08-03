import React from 'react';
import useSWR, { SWRConfig } from 'swr';
import { StyleSheet, AppState, AppStateStatus } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from '@/components/Themed';
import { FlatList } from 'react-native-gesture-handler';

const fetcher = (request: RequestInfo) =>
  fetch(request).then((res) => res.json());

const cacheKey = 'https://jsonplaceholder.typicode.com/users';
const App = () => {
  const { data, isLoading } = useSWR(cacheKey, fetcher);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar style={'dark'} />
      <Header title={'Users'} />

      <FlatList
        data={[...data]}
        renderItem={({ item, index }) => (
          <View
            key={index}
            style={{
              backgroundColor: '#222',
              padding: 20,
              margin: 4,
              borderRadius: 10,
            }}
          >
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

function RootScreen() {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true;
        },
        initFocus,
      }}
    >
      <App />
    </SWRConfig>
  );
}

export default RootScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

const initFocus = (callback: () => void) => {
  let appState = AppState.currentState;

  const onAppStateChange = (nextAppState: AppStateStatus) => {
    /* If it's resuming from background or inactive mode to active one */
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      callback();
    }
    appState = nextAppState;
  };

  // Subscribe to the app state change events
  const subscription = AppState.addEventListener('change', onAppStateChange);

  return () => {
    subscription.remove();
  };
};

// Create a header component
const Header = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        backgroundColor: '#222',
        padding: 20,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>
    </View>
  );
};
