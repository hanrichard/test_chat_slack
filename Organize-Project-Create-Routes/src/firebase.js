import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyB0N8qvsLcVfBWAshqtwW5ZRaDoZpLHyS4',
	authDomain: 'react-slack-123.firebaseapp.com',
	databaseURL: 'https://react-slack-123.firebaseio.com',
	projectId: 'react-slack-123',
	storageBucket: 'react-slack-123.appspot.com',
	messagingSenderId: '105424041573',
	appId: '1:105424041573:web:14f8c4f1ce88376c81f88c',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
