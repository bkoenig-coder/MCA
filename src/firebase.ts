import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, onSnapshot, getDocFromServer, addDoc, serverTimestamp, orderBy, limit, writeBatch, increment, getDocs } from 'firebase/firestore';
export { doc, getDoc, setDoc, collection, query, where, onSnapshot, getDocFromServer, addDoc, serverTimestamp, orderBy, limit, writeBatch, increment, getDocs };
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    try {
      // Create user profile if it doesn't exist
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const isSuperAdmin = user.email?.toLowerCase() === 'emeraldtorstein@gmail.com';
        const isDefaultAdmin = user.email?.toLowerCase() === 'batmunkh.unen@gmail.com';
        const userData: any = {
          uid: user.uid,
          email: user.email || '',
          role: isSuperAdmin || isDefaultAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        };
        if (user.displayName) userData.displayName = user.displayName;
        if (user.photoURL) userData.photoURL = user.photoURL;

        await setDoc(userRef, userData);
      }
    } catch (firestoreError) {
      console.error("Firestore error creating user profile:", firestoreError);
      // We do not throw here, so that the user can still be logged in via Auth
      // handleFirestoreError(firestoreError, OperationType.WRITE, `users/${user.uid}`);
    }
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      // User closed the popup, handle gracefully without logging as error
      console.log("Sign-in popup closed by user.");
      return null;
    }
    console.error("Error signing in with Google", error);
    throw error;
  }
}

export async function logOut() {
  await signOut(auth);
}

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
