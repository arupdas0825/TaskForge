import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './config';

function requireUid() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not signed in');
  return uid;
}

export async function listCollection(name) {
  const uid = requireUid();
  try {
    const q = query(collection(db, 'users', uid, name), orderBy('created_at', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // Fallback if orderBy fails due to missing index or uninitialized timestamps
    const snap = await getDocs(collection(db, 'users', uid, name));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

export async function getDocById(name, id) {
  const uid = requireUid();
  const snap = await getDoc(doc(db, 'users', uid, name, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createDoc(name, data) {
  const uid = requireUid();
  const payload = {
    ...data,
    user_id: uid,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const ref = await addDoc(collection(db, 'users', uid, name), payload);
  return { id: ref.id, ...payload };
}

export async function updateDocById(name, id, updates) {
  const uid = requireUid();
  const ref = doc(db, 'users', uid, name, id);
  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };
  await updateDoc(ref, payload);
  const snap = await getDoc(ref);
  return { id: snap.id, ...snap.data() };
}

export async function deleteDocById(name, id) {
  const uid = requireUid();
  await deleteDoc(doc(db, 'users', uid, name, id));
}
