import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBuaeSFFSSXpVr-32yARwVrBFQjwr_f0fM",
    authDomain: "todo-cee6e.firebaseapp.com",
    projectId: "todo-cee6e",
    storageBucket: "todo-cee6e.firebasestorage.app",
    messagingSenderId: "789575571872",
    appId: "1:789575571872:web:48a6c97949a8288ae26cc5",
    measurementId: "G-KMY771LBD3"
  };

const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
const db = getFirestore(app);

const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const logoutUser = () => {
  return signOut(auth);
};



const createUserProfile = async (userId: string, name: string, email: string) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    name,
    email,
    role: 'viewer', // DEFAULT RORE IS  ---------   VIEWER
  });
};


const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    console.log('Користувача не знайдено!');
    return null;
  }
};


const createTodoList = async (userId: string, title: string, userEmail: string) => {
    const todoListsRef = collection(db, 'todoLists');
    await addDoc(todoListsRef, {
      title,
      ownerId: userId,
      collaborators: [{ email: userEmail, role: 'admin' }], 
    });
  };
  
  export const addTask = async (listId: string, title: string, description: string) => {
    const tasksRef = collection(db, 'todoLists', listId, 'tasks');
    try {
      await addDoc(tasksRef, {
        title,
        description,
        completed: false,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Не вдалося додати завдання:', err);
    }
  };



export { auth, db, registerUser, loginUser, logoutUser,createUserProfile, getUserProfile, createTodoList };
