(function() {
  let app = null;
  let realtimeDb = null;
  let firestoreDb = null;

  function init() {
    if (app) {
      return { app, realtimeDb, firestoreDb };
    }

    if (!window.firebase) {
      throw new Error('Firebase SDK is not loaded.');
    }

    if (!window.VESAK_FIREBASE_CONFIG) {
      throw new Error('Firebase config is missing.');
    }

    const config = window.VESAK_FIREBASE_CONFIG;
    const requiredKeys = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];
    const missingKeys = requiredKeys.filter((key) => !config[key]);

    if (missingKeys.length) {
      throw new Error(`Firebase config is incomplete: ${missingKeys.join(', ')}`);
    }

    app = firebase.initializeApp(config);
    realtimeDb = firebase.database();
    firestoreDb = firebase.firestore ? firebase.firestore() : null;

    return { app, realtimeDb, firestoreDb };
  }

  function getRealtimeDb() {
    return realtimeDb;
  }

  function getFirestoreDb() {
    return firestoreDb;
  }

  function withRealtimeTimestamp(data) {
    return {
      ...data,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
  }

  function withFirestoreTimestamp(data) {
    const output = { ...data };

    if (firebase.firestore && firebase.firestore.FieldValue) {
      output.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    }

    return output;
  }

  async function pushRealtime(path, data) {
    if (!realtimeDb) return null;
    return realtimeDb.ref(path).push(data);
  }

  async function addFirestore(collectionName, data) {
    if (!firestoreDb) return null;
    return firestoreDb.collection(collectionName).add(data);
  }

  async function saveBoth(path, collectionName, data) {
    const [realtimeResult, firestoreResult] = await Promise.allSettled([
      pushRealtime(path, withRealtimeTimestamp(data)),
      addFirestore(collectionName, withFirestoreTimestamp(data))
    ]);

    if (realtimeResult.status === 'rejected') {
      throw realtimeResult.reason;
    }

    if (firestoreResult.status === 'rejected') {
      console.warn('Firestore mirror save failed:', firestoreResult.reason);
    }

    return {
      realtime: realtimeResult.value,
      firestore: firestoreResult.status === 'fulfilled' ? firestoreResult.value : null
    };
  }

  window.VesakFirebase = {
    init,
    getRealtimeDb,
    getFirestoreDb,
    saveBoth,
    withRealtimeTimestamp,
    withFirestoreTimestamp
  };
})();
