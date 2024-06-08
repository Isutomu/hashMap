import LinkedList from "./linked-list.mjs";

class LinkedListForHashmap extends LinkedList {
  contains(key) {
    const headNode = this._tailNode.next;
    let currentNode = headNode;

    do {
      if (currentNode.key === key) {
        return true;
      }
      currentNode = currentNode.next;
    } while (currentNode !== headNode);

    return false;
  }

  find(key) {
    const headNode = this._tailNode.next;
    let currentNode = headNode;
    let currentIndex = 0;

    do {
      if (currentNode.key === key) {
        return currentIndex;
      }
      currentIndex += 1;
      currentNode = currentNode.next;
    } while (currentNode !== headNode);

    return null;
  }

  keysFromList() {
    let headNode = this._tailNode.next;
    let currentNode = headNode;
    let keys = [];

    do {
      keys.push(currentNode.key);
      currentNode = currentNode.next;
    } while (currentNode !== headNode);
    return keys;
  }

  valuesFromList() {
    let headNode = this._tailNode.next;
    let currentNode = headNode;
    let values = [];

    do {
      values.push(currentNode.value);
      currentNode = currentNode.next;
    } while (currentNode !== headNode);
    return values;
  }

  nodes() {
    let headNode = this._tailNode.next;
    let currentNode = headNode;
    let entries = [];

    do {
      entries.push([currentNode.key, currentNode.value]);
      currentNode = currentNode.next;
    } while (currentNode !== headNode);
    return entries;
  }
}

class HashMap {
  _buckets;
  constructor() {
    this._buckets = new Array(16);
  }

  loadFactor() {
    const numberOfBuckets = this._buckets.length;
    const bucketsOccupied = this._buckets.reduce(
      (acum, bucket) => (bucket ? acum + 1 : acum),
      0
    );

    return bucketsOccupied / numberOfBuckets;
  }

  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode =
        (primeNumber * hashCode + key.charCodeAt(i)) % this._buckets.length; // doing the module here prevents big number inconsistencies but makes hash not be a pure function anymore
    }

    return hashCode;
  }

  set(key, value, skipGrowCheck = false) {
    const hashNewEntry = this.hash(key);

    if (this._buckets[hashNewEntry]) {
      const keyIndex = this._buckets[hashNewEntry].find(key);

      if (keyIndex) {
        this._buckets[hashNewEntry].removeAt(keyIndex);
      }
      this._buckets[hashNewEntry].append({ key, value });
    } else {
      this._buckets[hashNewEntry] = new LinkedListForHashmap({ key, value });
    }

    if (!skipGrowCheck && this.loadFactor() > 0.75) {
      this.grow();
    }
  }

  get(key) {
    const hashedKey = this.hash(key);

    if (!this._buckets[hashedKey]) return null;

    const keyIndex = this._buckets[hashedKey].find(key);
    return keyIndex !== null ? this._buckets[hashedKey].at(keyIndex) : null;
  }

  has(key) {
    const hashedKey = this.hash(key);

    return !!this._buckets[hashedKey] && this._buckets[hashedKey].contains(key);
  }

  remove(key) {
    const hashedKey = this.hash(key);

    if (!this._buckets[hashedKey]) return false;

    const keyIndex = this._buckets[hashedKey].find(key);
    if (keyIndex !== null) {
      if (this._buckets[hashedKey].size() > 1) {
        this._buckets[hashedKey].removeAt(keyIndex);
      } else {
        this._buckets[hashedKey] = undefined;
      }
      return true;
    }

    return false;
  }

  length() {
    return this._buckets.reduce(
      (keysCount, bucket) => (bucket ? keysCount + bucket.size() : keysCount),
      0
    );
  }

  clear() {
    this._buckets = new Array(16);
  }

  keys() {
    return this._buckets.reduce(
      (keys, bucket) => (bucket ? [...keys, ...bucket.keysFromList()] : keys),
      []
    );
  }

  values() {
    return this._buckets.reduce(
      (values, bucket) =>
        bucket ? [...values, ...bucket.valuesFromList()] : values,
      []
    );
  }

  entries() {
    return this._buckets.reduce(
      (entries, bucket) => (bucket ? [...entries, ...bucket.nodes()] : entries),
      []
    );
  }

  grow() {
    const entries = this.entries();

    this._buckets = new Array(this._buckets.length * 2);
    entries.forEach((entry) => this.set(entry[0], entry[1], true));
  }
}
