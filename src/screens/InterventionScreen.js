// InterventionScreen.js
// Cœur de l'application : formulaire de saisie pour une intervention sur une station.

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// On importe le "hook" qui nous donne accès à la base de données
import {useDatabase} from '@nozbe/watermelondb/hooks';

// On simule les données qui seraient reçues de l'écran précédent (ex: la carte)
const MOCK_STATION_DATA = {
  id: 'STA-007',
  name: 'Station 7 - Local Technique',
  site: 'Siège Social Corp.',
};

const InterventionScreen = ({route}) => {
  // route.params pourrait contenir les vraies données de la station. On utilise des données simulées pour l'exemple.
  const station = route?.params?.station || MOCK_STATION_DATA;

  // On récupère l'instance de la base de données via le hook
  const database = useDatabase();

  // --- GESTION DE L'ÉTAT DU FORMULAIRE ---
  const [consumption, setConsumption] = useState(0);
  const [traces, setTraces] = useState({
    droppings: false,
    tracks: false,
    damage: false,
    nest: false,
    smell: false,
  });
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState('');

  // --- FONCTIONS DE MANIPULATION ---

  const toggleTrace = traceKey => {
    setTraces(prevTraces => ({
      ...prevTraces,
      [traceKey]: !prevTraces[traceKey],
    }));
  };

  const handleTakePhoto = () => {
    const newPhotoUri = `file:///storage/emulated/0/DCIM/photo_${Date.now()}.jpg`;
    setPhotos(prevPhotos => [...prevPhotos, newPhotoUri]);
    Alert.alert('Photo Ajoutée', `Photo simulée : ${newPhotoUri}`);
  };

  const handleReportIncident = () => {
    Alert.alert(
      'Signaler un Incident',
      "Ici, on ouvrirait un formulaire pour décrire l'incident (station endommagée, animal non-cible, etc.).",
    );
  };

  /**
   * Fonction principale appelée lors de l'enregistrement.
   * Elle écrit les données du formulaire directement dans la base de données WatermelonDB.
   */
  const handleSave = async () => {
    // On utilise un bloc "write" pour garantir que l'écriture est sécurisée et atomique
    await database.write(async () => {
      // On demande à la base de données de créer une nouvelle 'intervention'
      const newIntervention = await database
        .get('interventions')
        .create(intervention => {
          intervention.stationId = station.id;
          intervention.consumption = consumption;
          intervention.notes = notes;
          intervention.traceDroppings = traces.droppings;
          intervention.traceTracks = traces.tracks;
          intervention.traceDamage = traces.damage;
          intervention.traceNest = traces.nest;
          intervention.traceSmell = traces.smell;
          // WatermelonDB s'occupe de 'created_at' et 'updated_at' automatiquement si les champs existent
        });

      console.log(
        'Intervention sauvegardée avec succès dans la BDD !',
        newIntervention,
      );

      Alert.alert(
        'Intervention Enregistrée',
        "Les données ont été sauvegardées dans la base de données de l'application.",
      );
    });
  };

  // --- COMPOSANT D'INTERFACE (CE QUI EST AFFICHÉ) ---

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Icon name="map-marker-check" size={24} color="#1E88E5" />
        <Text style={styles.headerTitle}>{station.name}</Text>
        <Text style={styles.headerSubtitle}>{station.site}</Text>
      </View>

      {/* Section Consommation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Niveau de Consommation</Text>
        <Text style={styles.sliderValue}>{consumption.toFixed(0)} %</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={25}
          value={consumption}
          onValueChange={setConsumption}
          minimumTrackTintColor="#1E88E5"
          maximumTrackTintColor="#BDBDBD"
          thumbTintColor="#1565C0"
        />
      </View>

      {/* Section Traces de Présence */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Traces de Présence</Text>
        <View style={styles.checkboxContainer}>
          <CheckboxItem
            label="Crottes"
            value={traces.droppings}
            onToggle={() => toggleTrace('droppings')}
          />
          <CheckboxItem
            label="Traces de passage"
            value={traces.tracks}
            onToggle={() => toggleTrace('tracks')}
          />
          <CheckboxItem
            label="Dégâts matériels"
            value={traces.damage}
            onToggle={() => toggleTrace('damage')}
          />
          <CheckboxItem
            label="Nid"
            value={traces.nest}
            onToggle={() => toggleTrace('nest')}
          />
          <CheckboxItem
            label="Odeur"
            value={traces.smell}
            onToggle={() => toggleTrace('smell')}
          />
        </View>
      </View>

      {/* Section Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Preuves Visuelles ({photos.length})
        </Text>
        <ActionButton
          icon="camera-plus"
          text="Ajouter une Photo"
          onPress={handleTakePhoto}
        />
      </View>

      {/* Section Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes et Commentaires</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Ajouter des observations spécifiques ici..."
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Section Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <ActionButton
          icon="alert-circle-outline"
          text="Signaler un Incident"
          onPress={handleReportIncident}
          color="#FF9800"
        />
      </View>

      {/* Bouton de validation final */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Icon name="check-circle-outline" size={24} color="#FFF" />
        <Text style={styles.saveButtonText}>Enregistrer l'Intervention</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// --- SOUS-COMPOSANTS POUR GARDER LE CODE PROPRE ---

const CheckboxItem = ({label, value, onToggle}) => (
  <TouchableOpacity style={styles.checkboxItem} onPress={onToggle}>
    <Icon
      name={value ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
      size={28}
      color={value ? '#1E88E5' : '#757575'}
    />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const ActionButton = ({icon, text, onPress, color = '#1E88E5'}) => (
  <TouchableOpacity
    style={[styles.actionButton, {borderColor: color}]}
    onPress={onPress}>
    <Icon name={icon} size={22} color={color} />
    <Text style={[styles.actionButtonText, {color: color}]}>{text}</Text>
  </TouchableOpacity>
);

// --- FEUILLE DE STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  sliderValue: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1565C0',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  checkboxContainer: {
    // Affiche les checkboxes les unes sous les autres
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#212121',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Vert pour la validation
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
    // Ombre pour un effet plus pro
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default InterventionScreen;
