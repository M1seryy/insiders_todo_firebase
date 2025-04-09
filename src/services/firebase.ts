import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

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

/* Аутентифікація */
const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const logoutUser = () => {
  window.location.href = "/";
  return signOut(auth);
};

/* Робота з користувачами */
const createUserProfile = async (userId: string, name: string, email: string) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    name,
    email,
    role: 'viewer',
  });
};

const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};

/* Робота з Todo списками */
const createTodoList = async (userId: string, title: string, userEmail: string) => {
  const todoListsRef = collection(db, 'todoLists');
  return await addDoc(todoListsRef, {
    title,
    ownerId: userId,
    collaborators: [{ email: userEmail, role: 'admin' }],
    collaboratorEmails: [userEmail], 
  });
};


const getUserRoleInList = async (listId: string, userEmail: string) => {
  const listRef = doc(db, 'todoLists', listId);
  const listDoc = await getDoc(listRef);

  if (!listDoc.exists()) return null;

  const listData = listDoc.data();
  
 
  const user = auth.currentUser;
  if (user && listData.ownerId === user.uid) return 'owner';

  const collaborator = listData.collaborators?.find((c: { email: string; }) => c.email === userEmail);
  return collaborator?.role || null;
};

 const verifyAdminAccess = async (listId: string) => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("Користувач не авторизований");
  }

  const listRef = doc(db, "todoLists", listId);
  const listDoc = await getDoc(listRef);

  if (!listDoc.exists()) {
    throw new Error("Список не знайдено");
  }

  const listData = listDoc.data();

  if (listData.ownerId === user.uid) {
    return true;
  }

  const collaborator = listData.collaborators?.find(
    (c: { email: string; role: string }) => c.email === user.email
  );

  if (collaborator?.role === "admin") {
    return true;
  }

  throw new Error("Недостатньо прав для цієї дії");
};


const deleteTodoList = async (listId: string) => {
  await verifyAdminAccess(listId);
  await deleteDoc(doc(db, 'todoLists', listId));
};

// const updateTodoList = async (listId: string, newData: object) => {
//   await verifyAdminAccess(listId);
//   await updateDoc(doc(db, 'todoLists', listId), newData);
// };


export { 
  auth, 
  db, 
  registerUser, 
  loginUser, 
  logoutUser,
  createUserProfile, 
  getUserProfile, 
  createTodoList,
  deleteTodoList,
  // updateTodoList,
  getUserRoleInList
};