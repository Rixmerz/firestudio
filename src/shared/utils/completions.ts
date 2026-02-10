/**
 * Auto-completion definitions for Firestore queries
 * Used by JsQueryEditor and ConsolePanel
 */

export interface Completion {
  trigger: string;
  suggestion: string;
  cursorOffset: number;
  description: string;
  fullMatch?: string; // for filtering
  kind?: 'method' | 'collection' | 'field' | 'operator' | 'direction' | 'keyword' | 'snippet' | 'value' | 'property';
  priority?: number;
  keywords?: string[];
  insertText?: string;
}

// Common Firestore completions - each entry has trigger (what user types) and fullMatch (for filtering)
export const firestoreCompletions: Completion[] = [
  // Database reference
  {
    trigger: 'db.collection',
    suggestion: "('')",
    cursorOffset: -2,
    description: 'Collection reference',
    fullMatch: 'db.collection',
  },
  { trigger: 'db.doc', suggestion: "('')", cursorOffset: -2, description: 'Document reference', fullMatch: 'db.doc' },

  // Query building
  {
    trigger: '.collection',
    suggestion: "('')",
    cursorOffset: -2,
    description: 'Sub-collection',
    fullMatch: '.collection',
  },
  {
    trigger: '.collectionGroup',
    suggestion: "('')",
    cursorOffset: -2,
    description: 'Collection group',
    fullMatch: '.collectionGroup',
  },
  { trigger: '.doc', suggestion: "('')", cursorOffset: -2, description: 'Document reference', fullMatch: '.doc' },
  {
    trigger: '.where',
    suggestion: "('', '==', '')",
    cursorOffset: -11,
    description: 'Where clause',
    fullMatch: '.where',
  },
  {
    trigger: '.orderBy',
    suggestion: "('', 'asc')",
    cursorOffset: -7,
    description: 'Order by',
    fullMatch: '.orderBy',
  },
  { trigger: '.limit', suggestion: '(50)', cursorOffset: -1, description: 'Limit results', fullMatch: '.limit' },
  {
    trigger: '.limitToLast',
    suggestion: '(10)',
    cursorOffset: -1,
    description: 'Limit to last',
    fullMatch: '.limitToLast',
  },
  {
    trigger: '.offset',
    suggestion: '(0)',
    cursorOffset: -1,
    description: 'Offset (pagination)',
    fullMatch: '.offset',
  },
  { trigger: '.startAt', suggestion: '()', cursorOffset: -1, description: 'Start at cursor', fullMatch: '.startAt' },
  {
    trigger: '.startAfter',
    suggestion: '()',
    cursorOffset: -1,
    description: 'Start after cursor',
    fullMatch: '.startAfter',
  },
  { trigger: '.endAt', suggestion: '()', cursorOffset: -1, description: 'End at cursor', fullMatch: '.endAt' },
  {
    trigger: '.endBefore',
    suggestion: '()',
    cursorOffset: -1,
    description: 'End before cursor',
    fullMatch: '.endBefore',
  },
  { trigger: '.select', suggestion: "('')", cursorOffset: -2, description: 'Select fields', fullMatch: '.select' },

  // Read operations
  { trigger: '.get', suggestion: '()', cursorOffset: 0, description: 'Get documents', fullMatch: '.get' },
  { trigger: '.stream', suggestion: '()', cursorOffset: 0, description: 'Stream documents', fullMatch: '.stream' },
  {
    trigger: '.onSnapshot',
    suggestion: '((snapshot) => {\n  \n})',
    cursorOffset: -3,
    description: 'Real-time listener',
    fullMatch: '.onSnapshot',
  },
  { trigger: '.count', suggestion: '()', cursorOffset: 0, description: 'Count documents', fullMatch: '.count' },

  // Write operations
  { trigger: '.add', suggestion: '({})', cursorOffset: -2, description: 'Add document', fullMatch: '.add' },
  { trigger: '.set', suggestion: '({})', cursorOffset: -2, description: 'Set document', fullMatch: '.set' },
  { trigger: '.update', suggestion: '({})', cursorOffset: -2, description: 'Update document', fullMatch: '.update' },
  { trigger: '.delete', suggestion: '()', cursorOffset: -1, description: 'Delete document', fullMatch: '.delete' },

  // Converters and listing
  {
    trigger: '.withConverter',
    suggestion: '()',
    cursorOffset: -1,
    description: 'With converter',
    fullMatch: '.withConverter',
  },
  {
    trigger: '.listDocuments',
    suggestion: '()',
    cursorOffset: 0,
    description: 'List documents',
    fullMatch: '.listDocuments',
  },
  {
    trigger: '.listCollections',
    suggestion: '()',
    cursorOffset: 0,
    description: 'List collections',
    fullMatch: '.listCollections',
  },

  // Batch and transaction
  { trigger: 'batch', suggestion: ' = db.batch()', cursorOffset: 0, description: 'Batch write', fullMatch: 'batch' },
  { trigger: '.batch', suggestion: '()', cursorOffset: 0, description: 'Create batch', fullMatch: '.batch' },
  {
    trigger: 'transaction',
    suggestion: ' = await db.runTransaction(async (t) => {\n  \n})',
    cursorOffset: -3,
    description: 'Transaction',
    fullMatch: 'transaction',
  },
  {
    trigger: '.runTransaction',
    suggestion: '(async (transaction) => {\n  \n})',
    cursorOffset: -3,
    description: 'Run transaction',
    fullMatch: '.runTransaction',
  },

  // Field values
  {
    trigger: 'FieldValue.serverTimestamp',
    suggestion: '()',
    cursorOffset: 0,
    description: 'Server timestamp',
    fullMatch: 'FieldValue.serverTimestamp',
  },
  {
    trigger: 'FieldValue.increment',
    suggestion: '(1)',
    cursorOffset: -1,
    description: 'Increment field',
    fullMatch: 'FieldValue.increment',
  },
  {
    trigger: 'FieldValue.arrayUnion',
    suggestion: '([])',
    cursorOffset: -2,
    description: 'Array union',
    fullMatch: 'FieldValue.arrayUnion',
  },
  {
    trigger: 'FieldValue.arrayRemove',
    suggestion: '([])',
    cursorOffset: -2,
    description: 'Array remove',
    fullMatch: 'FieldValue.arrayRemove',
  },
  {
    trigger: 'FieldValue.delete',
    suggestion: '()',
    cursorOffset: 0,
    description: 'Delete field',
    fullMatch: 'FieldValue.delete',
  },

  // Snapshot operations
  { trigger: '.data', suggestion: '()', cursorOffset: 0, description: 'Get document data', fullMatch: '.data' },
  {
    trigger: '.exists',
    suggestion: '',
    cursorOffset: 0,
    description: 'Check if document exists',
    fullMatch: '.exists',
  },
  { trigger: '.id', suggestion: '', cursorOffset: 0, description: 'Get document ID', fullMatch: '.id' },
  { trigger: '.ref', suggestion: '', cursorOffset: 0, description: 'Get document reference', fullMatch: '.ref' },
  { trigger: '.docs', suggestion: '', cursorOffset: 0, description: 'Get documents array', fullMatch: '.docs' },
  {
    trigger: '.empty',
    suggestion: '',
    cursorOffset: 0,
    description: 'Check if snapshot is empty',
    fullMatch: '.empty',
  },
  { trigger: '.size', suggestion: '', cursorOffset: 0, description: 'Get snapshot size', fullMatch: '.size' },
  {
    trigger: '.forEach',
    suggestion: '(doc => {\n  \n})',
    cursorOffset: -3,
    description: 'Iterate documents',
    fullMatch: '.forEach',
  },
  {
    trigger: '.map',
    suggestion: '(doc => doc.data())',
    cursorOffset: -1,
    description: 'Map documents',
    fullMatch: '.map',
  },
];

// JavaScript boilerplate completions
export const jsBoilerplateCompletions: Completion[] = [
  // Async function
  { trigger: 'async', suggestion: ' function run() {\n  \n}', cursorOffset: -2, description: 'Async run function' },
  { trigger: 'asyncfn', suggestion: ' async () => {\n  \n}', cursorOffset: -2, description: 'Async arrow function' },

  // Await patterns
  { trigger: 'await', suggestion: " db.collection('').get()", cursorOffset: -8, description: 'Await collection get' },
  { trigger: 'awaitDoc', suggestion: " db.doc('').get()", cursorOffset: -8, description: 'Await doc get' },

  // Common patterns
  { trigger: 'const', suggestion: ' snapshot = await ', cursorOffset: 0, description: 'Const snapshot' },
  {
    trigger: 'snap',
    suggestion: 'shot.docs.map(doc => ({ id: doc.id, ...doc.data() }))',
    cursorOffset: 0,
    description: 'Map snapshot docs',
  },
  {
    trigger: 'foreach',
    suggestion: 'snapshot.forEach(doc => {\n  console.log(doc.id, doc.data());\n})',
    cursorOffset: 0,
    description: 'ForEach docs',
  },

  // Return patterns
  {
    trigger: 'return snap',
    suggestion: 'shot.docs.map(doc => ({ id: doc.id, ...doc.data() }))',
    cursorOffset: 0,
    description: 'Return mapped docs',
  },
  { trigger: 'return doc', suggestion: 's', cursorOffset: 0, description: 'Return docs' },

  // Error handling
  {
    trigger: 'trycatch',
    suggestion: 'try {\n  \n} catch (error) {\n  console.error(error);\n}',
    cursorOffset: -40,
    description: 'Try-catch block',
  },

  // Console
  { trigger: 'log', suggestion: 'console.log()', cursorOffset: -1, description: 'Console log' },
  { trigger: 'console.', suggestion: 'log()', cursorOffset: -1, description: 'Console log' },

  // JSON
  { trigger: 'JSON.str', suggestion: 'ingify(, null, 2)', cursorOffset: -10, description: 'JSON stringify' },
  { trigger: 'JSON.par', suggestion: 'se()', cursorOffset: -1, description: 'JSON parse' },
];

export const jsTemplateCompletions: Completion[] = [
  {
    trigger: 'find',
    suggestion: ` const snapshot = await db.collection('').where('', '==', '').limit(50).get()`,
    insertText: `const snapshot = await db.collection('').where('', '==', '').limit(50).get()`,
    cursorOffset: -35,
    description: 'Template: filter + limit + get',
    kind: 'snippet',
    keywords: ['query', 'where', 'limit'],
    priority: 18,
  },
  {
    trigger: 'paginate',
    suggestion: ` const snapshot = await db.collection('').orderBy('').startAfter(lastDoc).limit(25).get()`,
    insertText: `const snapshot = await db.collection('').orderBy('').startAfter(lastDoc).limit(25).get()`,
    cursorOffset: -52,
    description: 'Template: pagination (startAfter)',
    kind: 'snippet',
    keywords: ['page', 'cursor', 'orderBy'],
    priority: 18,
  },
  {
    trigger: 'count',
    suggestion: ` const countSnapshot = await db.collection('').count().get()`,
    insertText: `const countSnapshot = await db.collection('').count().get()`,
    cursorOffset: -21,
    description: 'Template: count documents',
    kind: 'snippet',
    keywords: ['aggregate'],
    priority: 16,
  },
  {
    trigger: 'doc',
    suggestion: ` const docSnap = await db.doc('').get()`,
    insertText: `const docSnap = await db.doc('').get()`,
    cursorOffset: -9,
    description: 'Template: get document',
    kind: 'snippet',
    keywords: ['get', 'document'],
    priority: 16,
  },
  {
    trigger: 'create',
    suggestion: ` await db.collection('').add({})`,
    insertText: `await db.collection('').add({})`,
    cursorOffset: -2,
    description: 'Template: add document',
    kind: 'snippet',
    keywords: ['insert', 'add'],
    priority: 14,
  },
  {
    trigger: 'update',
    suggestion: ` await db.doc('').update({})`,
    insertText: `await db.doc('').update({})`,
    cursorOffset: -2,
    description: 'Template: update document',
    kind: 'snippet',
    keywords: ['patch'],
    priority: 14,
  },
  {
    trigger: 'delete',
    suggestion: ` await db.doc('').delete()`,
    insertText: `await db.doc('').delete()`,
    cursorOffset: -2,
    description: 'Template: delete document',
    kind: 'snippet',
    keywords: ['remove'],
    priority: 14,
  },
  {
    trigger: 'group',
    suggestion: ` const snapshot = await db.collectionGroup('').where('', '==', '').get()`,
    insertText: `const snapshot = await db.collectionGroup('').where('', '==', '').get()`,
    cursorOffset: -30,
    description: 'Template: collection group query',
    kind: 'snippet',
    keywords: ['collectionGroup', 'query'],
    priority: 16,
  },
  {
    trigger: 'compound',
    suggestion: ` const snapshot = await db.collection('').where('', '==', '').where('', '==', '').get()`,
    insertText: `const snapshot = await db.collection('').where('', '==', '').where('', '==', '').get()`,
    cursorOffset: -30,
    description: 'Template: compound where',
    kind: 'snippet',
    keywords: ['where', 'and'],
    priority: 15,
  },
  {
    trigger: 'array',
    suggestion: ` const snapshot = await db.collection('').where('', 'array-contains', '').get()`,
    insertText: `const snapshot = await db.collection('').where('', 'array-contains', '').get()`,
    cursorOffset: -30,
    description: 'Template: array-contains query',
    kind: 'snippet',
    keywords: ['array-contains', 'filter'],
    priority: 15,
  },
  {
    trigger: 'order',
    suggestion: ` const snapshot = await db.collection('').orderBy('').limit(25).get()`,
    insertText: `const snapshot = await db.collection('').orderBy('').limit(25).get()`,
    cursorOffset: -24,
    description: 'Template: order + limit',
    kind: 'snippet',
    keywords: ['orderBy', 'limit'],
    priority: 14,
  },
  {
    trigger: 'batch',
    suggestion: ` const batch = db.batch();\nconst ref = db.collection('').doc();\nbatch.set(ref, {});\nawait batch.commit();`,
    insertText: `const batch = db.batch();\nconst ref = db.collection('').doc();\nbatch.set(ref, {});\nawait batch.commit();`,
    cursorOffset: -47,
    description: 'Template: batch write',
    kind: 'snippet',
    keywords: ['batch', 'write'],
    priority: 14,
  },
  {
    trigger: 'transaction',
    suggestion: ` await db.runTransaction(async (t) => {\n  const ref = db.doc('');\n  const snap = await t.get(ref);\n  if (!snap.exists) return;\n  t.update(ref, {});\n});`,
    insertText: `await db.runTransaction(async (t) => {\n  const ref = db.doc('');\n  const snap = await t.get(ref);\n  if (!snap.exists) return;\n  t.update(ref, {});\n});`,
    cursorOffset: -20,
    description: 'Template: transaction',
    kind: 'snippet',
    keywords: ['transaction', 'runTransaction'],
    priority: 14,
  },
  {
    trigger: 'timestamp',
    suggestion: ` await db.doc('').update({ updatedAt: FieldValue.serverTimestamp() })`,
    insertText: `await db.doc('').update({ updatedAt: FieldValue.serverTimestamp() })`,
    cursorOffset: -2,
    description: 'Template: server timestamp update',
    kind: 'snippet',
    keywords: ['FieldValue', 'serverTimestamp'],
    priority: 13,
  },
];

// Console-specific completions (simpler)
export const consoleCompletions: Completion[] = [
  {
    trigger: 'db.collection',
    suggestion: "('')",
    cursorOffset: -2,
    description: 'Collection reference',
    fullMatch: 'db.collection',
  },
  { trigger: 'db.doc', suggestion: "('')", cursorOffset: -2, description: 'Document reference', fullMatch: 'db.doc' },
  {
    trigger: '.collection',
    suggestion: "('')",
    cursorOffset: -2,
    description: 'Sub-collection',
    fullMatch: '.collection',
  },
  {
    trigger: '.collectionGroup',
    suggestion: "('')",
    cursorOffset: -2,
    description: 'Collection group',
    fullMatch: '.collectionGroup',
  },
  { trigger: '.doc', suggestion: "('')", cursorOffset: -2, description: 'Document reference', fullMatch: '.doc' },
  {
    trigger: '.where',
    suggestion: "('', '==', '')",
    cursorOffset: -11,
    description: 'Where clause',
    fullMatch: '.where',
  },
  {
    trigger: '.orderBy',
    suggestion: "('', 'asc')",
    cursorOffset: -7,
    description: 'Order by',
    fullMatch: '.orderBy',
  },
  { trigger: '.limit', suggestion: '(50)', cursorOffset: -1, description: 'Limit results', fullMatch: '.limit' },
  {
    trigger: '.limitToLast',
    suggestion: '(10)',
    cursorOffset: -1,
    description: 'Limit to last',
    fullMatch: '.limitToLast',
  },
  { trigger: '.offset', suggestion: '(0)', cursorOffset: -1, description: 'Offset results', fullMatch: '.offset' },
  { trigger: '.startAt', suggestion: '()', cursorOffset: -1, description: 'Start at cursor', fullMatch: '.startAt' },
  {
    trigger: '.startAfter',
    suggestion: '()',
    cursorOffset: -1,
    description: 'Start after cursor',
    fullMatch: '.startAfter',
  },
  { trigger: '.endAt', suggestion: '()', cursorOffset: -1, description: 'End at cursor', fullMatch: '.endAt' },
  {
    trigger: '.endBefore',
    suggestion: '()',
    cursorOffset: -1,
    description: 'End before cursor',
    fullMatch: '.endBefore',
  },
  { trigger: '.select', suggestion: "('')", cursorOffset: -2, description: 'Select fields', fullMatch: '.select' },
  { trigger: '.get', suggestion: '()', cursorOffset: 0, description: 'Get documents', fullMatch: '.get' },
  { trigger: '.add', suggestion: '({})', cursorOffset: -2, description: 'Add document', fullMatch: '.add' },
  { trigger: '.set', suggestion: '({})', cursorOffset: -2, description: 'Set document', fullMatch: '.set' },
  { trigger: '.update', suggestion: '({})', cursorOffset: -2, description: 'Update document', fullMatch: '.update' },
  { trigger: '.delete', suggestion: '()', cursorOffset: -1, description: 'Delete document', fullMatch: '.delete' },
  { trigger: '.count', suggestion: '()', cursorOffset: 0, description: 'Count documents', fullMatch: '.count' },
  {
    trigger: '.withConverter',
    suggestion: '()',
    cursorOffset: -1,
    description: 'With converter',
    fullMatch: '.withConverter',
  },
  {
    trigger: '.listDocuments',
    suggestion: '()',
    cursorOffset: 0,
    description: 'List documents',
    fullMatch: '.listDocuments',
  },
  {
    trigger: '.listCollections',
    suggestion: '()',
    cursorOffset: 0,
    description: 'List collections',
    fullMatch: '.listCollections',
  },
  {
    trigger: 'help',
    suggestion: '',
    cursorOffset: 0,
    description: 'Help',
    kind: 'keyword',
    keywords: ['?', 'commands'],
  },
  { trigger: 'clear', suggestion: '', cursorOffset: 0, description: 'Clear', kind: 'keyword', keywords: ['reset'] },
  {
    trigger: 'find',
    suggestion: ` db.collection('').where('', '==', '').limit(10).get()`,
    insertText: `db.collection('').where('', '==', '').limit(10).get()`,
    cursorOffset: -32,
    description: 'Template: filter + limit + get',
    kind: 'snippet',
    keywords: ['query', 'where'],
  },
  {
    trigger: 'doc',
    suggestion: ` db.doc('').get()`,
    insertText: `db.doc('').get()`,
    cursorOffset: -6,
    description: 'Template: get document',
    kind: 'snippet',
    keywords: ['get', 'document'],
  },
  {
    trigger: 'count',
    suggestion: ` db.collection('').count().get()`,
    insertText: `db.collection('').count().get()`,
    cursorOffset: -15,
    description: 'Template: count documents',
    kind: 'snippet',
    keywords: ['aggregate'],
  },
  {
    trigger: 'group',
    suggestion: ` db.collectionGroup('').where('', '==', '').get()`,
    insertText: `db.collectionGroup('').where('', '==', '').get()`,
    cursorOffset: -24,
    description: 'Template: collection group query',
    kind: 'snippet',
    keywords: ['collectionGroup', 'query'],
  },
  {
    trigger: 'array',
    suggestion: ` db.collection('').where('', 'array-contains', '').get()`,
    insertText: `db.collection('').where('', 'array-contains', '').get()`,
    cursorOffset: -24,
    description: 'Template: array-contains query',
    kind: 'snippet',
    keywords: ['array-contains', 'filter'],
  },
  {
    trigger: 'order',
    suggestion: ` db.collection('').orderBy('').limit(10).get()`,
    insertText: `db.collection('').orderBy('').limit(10).get()`,
    cursorOffset: -18,
    description: 'Template: order + limit',
    kind: 'snippet',
    keywords: ['orderBy', 'limit'],
  },
  {
    trigger: 'whereIn',
    suggestion: ` db.collection('').where('', 'in', []).get()`,
    insertText: `db.collection('').where('', 'in', []).get()`,
    cursorOffset: -10,
    description: 'Template: where in',
    kind: 'snippet',
    keywords: ['in', 'filter'],
  },
];

export const firestoreOperatorCompletions: Completion[] = [
  {
    trigger: '==',
    suggestion: '',
    cursorOffset: 0,
    description: 'Equals',
    kind: 'operator',
    keywords: ['eq', 'equals'],
  },
  {
    trigger: '!=',
    suggestion: '',
    cursorOffset: 0,
    description: 'Not equal',
    kind: 'operator',
    keywords: ['neq', 'not'],
  },
  { trigger: '>=', suggestion: '', cursorOffset: 0, description: 'Greater or equal', kind: 'operator' },
  { trigger: '<=', suggestion: '', cursorOffset: 0, description: 'Less or equal', kind: 'operator' },
  { trigger: '>', suggestion: '', cursorOffset: 0, description: 'Greater than', kind: 'operator' },
  { trigger: '<', suggestion: '', cursorOffset: 0, description: 'Less than', kind: 'operator' },
  {
    trigger: 'array-contains',
    suggestion: '',
    cursorOffset: 0,
    description: 'Array contains value',
    kind: 'operator',
  },
  {
    trigger: 'array-contains-any',
    suggestion: '',
    cursorOffset: 0,
    description: 'Array contains any',
    kind: 'operator',
  },
  { trigger: 'in', suggestion: '', cursorOffset: 0, description: 'Value in array', kind: 'operator' },
  { trigger: 'not-in', suggestion: '', cursorOffset: 0, description: 'Value not in array', kind: 'operator' },
];

export const orderDirectionCompletions: Completion[] = [
  {
    trigger: 'asc',
    suggestion: '',
    cursorOffset: 0,
    description: 'Ascending order',
    kind: 'direction',
    keywords: ['ascending', 'up'],
  },
  {
    trigger: 'desc',
    suggestion: '',
    cursorOffset: 0,
    description: 'Descending order',
    kind: 'direction',
    keywords: ['descending', 'down'],
  },
];

// All JS editor completions combined
export const jsEditorCompletions: Completion[] = [
  ...firestoreCompletions,
  ...jsBoilerplateCompletions,
  ...jsTemplateCompletions,
];

/**
 * Find matching completion for given text
 */
export function findCompletion(text: string, completions: Completion[] = jsEditorCompletions): Completion | null {
  if (!text) return null;

  // Get the last part of text (last line, trimmed)
  const lines = text.split('\n');
  const lastLine = lines[lines.length - 1];

  // Sort by trigger length (longest first) to match most specific
  const sorted = [...completions].sort((a, b) => b.trigger.length - a.trigger.length);

  for (const completion of sorted) {
    // Check if the text ends with the trigger
    if (text.endsWith(completion.trigger) || lastLine.endsWith(completion.trigger)) {
      // Make sure it's at a word boundary for non-dot triggers
      if (!completion.trigger.startsWith('.')) {
        const charBeforeTrigger = text.charAt(text.length - completion.trigger.length - 1);
        // If there's a character before and it's alphanumeric, skip this match
        if (charBeforeTrigger && /[a-zA-Z0-9_]/.test(charBeforeTrigger)) {
          continue;
        }
      }
      return completion;
    }
  }
  return null;
}

/**
 * Get completions that start with given prefix
 */
export function getMatchingCompletions(prefix: string, completions: Completion[] = jsEditorCompletions): Completion[] {
  if (!prefix) return [];
  const lowerPrefix = prefix.toLowerCase();
  return completions.filter(
    (c) =>
      c.trigger.toLowerCase().startsWith(lowerPrefix) ||
      (c.description && c.description.toLowerCase().includes(lowerPrefix)),
  );
}
