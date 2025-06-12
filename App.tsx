// App.tsx
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

// --- CORRECTION DE L'IMPORT ---
// On importe DatabaseProvider directement depuis le paquet, sans sous-dossier
import {DatabaseProvider} from '@nozbe/watermelondb/DatabaseProvider';
import {database} from './src/db';
// --- FIN DE LA CORRECTION ---

import InterventionScreen from './src/screens/InterventionScreen';

function App(): React.JSX.Element {
  return (
    <DatabaseProvider database={database}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <InterventionScreen route={{}} />
      </SafeAreaView>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default App;
