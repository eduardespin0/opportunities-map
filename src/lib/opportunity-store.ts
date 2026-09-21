import { Opportunity } from './types';
import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const JSON_FILE_PATH = path.resolve(process.cwd(), 'src/data/opportunities.json');

/**
 * Reads opportunities from local JSON file (cache/fallback)
 */
function readLocalJson(): Opportunity[] {
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    return JSON.parse(data) as Opportunity[];
  } catch (error) {
    console.error('Error reading local opportunities.json:', error);
    return [];
  }
}

/**
 * Writes opportunities to local JSON file (cache/fallback)
 */
function writeLocalJson(data: Opportunity[]): void {
  try {
    const dir = path.dirname(JSON_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local opportunities.json:', error);
  }
}

/**
 * Opportunity Data Store powered by Firebase Firestore
 */
export const OpportunityStore = {
  /**
   * Fetches all opportunities from Firestore (with local cache fallback)
   */
  async getAll(): Promise<Opportunity[]> {
    try {
      const colRef = collection(db, 'opportunities');
      const snapshot = await getDocs(colRef);
      const list: Opportunity[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Opportunity);
      });

      // Ordenar por fecha de creación o publicación descendente
      list.sort(
        (a, b) =>
          new Date(b.createdAt || b.publishedAt || 0).getTime() -
          new Date(a.createdAt || a.publishedAt || 0).getTime()
      );

      // Mantener sincronizado el respaldo local
      writeLocalJson(list);

      return list;
    } catch (error) {
      console.warn('Firestore getAll falló, usando respaldo local:', error);
      return readLocalJson();
    }
  },

  /**
   * Fetches an opportunity by id or slug from Firestore
   */
  async getBySlugOrId(identifier: string): Promise<Opportunity | null> {
    try {
      // 1. Búsqueda directa por ID de documento
      const docRef = doc(db, 'opportunities', identifier);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Opportunity;
      }

      // 2. Búsqueda por campo slug
      const q = query(
        collection(db, 'opportunities'),
        where('slug', '==', identifier),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        return querySnap.docs[0].data() as Opportunity;
      }
    } catch (error) {
      console.warn('Firestore getBySlugOrId falló, buscando en respaldo:', error);
    }

    const all = await this.getAll();
    return all.find((o) => o.slug === identifier || o.id === identifier) || null;
  },

  /**
   * Creates or updates an opportunity in Firestore
   */
  async save(opportunity: Opportunity): Promise<Opportunity> {
    const now = new Date().toISOString();
    const updated: Opportunity = {
      ...opportunity,
      status: opportunity.status || 'published',
      createdAt: opportunity.createdAt || now,
      updatedAt: now,
    };

    try {
      const docRef = doc(db, 'opportunities', updated.id);
      await setDoc(docRef, updated);
    } catch (error) {
      console.error('Error guardando en Firestore:', error);
      throw error;
    }

    // Actualizar respaldo local
    const list = readLocalJson();
    const existingIndex = list.findIndex((o) => o.id === updated.id);
    if (existingIndex >= 0) {
      list[existingIndex] = updated;
    } else {
      list.unshift(updated);
    }
    writeLocalJson(list);

    return updated;
  },

  /**
   * Deletes an opportunity from Firestore
   */
  async delete(id: string): Promise<boolean> {
    try {
      // 1. Intento de eliminación directa por doc ID
      const docRef = doc(db, 'opportunities', id);
      await deleteDoc(docRef);

      // 2. Por si el documento en Firestore fue guardado con slug o id distinto
      const qSlug = query(collection(db, 'opportunities'), where('slug', '==', id));
      const snapSlug = await getDocs(qSlug);
      for (const d of snapSlug.docs) {
        await deleteDoc(d.ref);
      }

      const qId = query(collection(db, 'opportunities'), where('id', '==', id));
      const snapId = await getDocs(qId);
      for (const d of snapId.docs) {
        await deleteDoc(d.ref);
      }
    } catch (error) {
      console.error('Error eliminando de Firestore:', error);
      throw error;
    }

    // Actualizar respaldo local
    const list = readLocalJson();
    const filtered = list.filter((o) => o.id !== id && o.slug !== id);
    writeLocalJson(filtered);

    return true;
  },

  /**
   * Generates a unique slug from title
   */
  slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};
