import LinkedList from "./linked-list.mjs";

class LinkedListForHashset extends LinkedList {
  keys() {
    const headNode = this._tailNode.next;
    let currentNode = headNode;
    const keysArr = [];

    do {
      keysArr.push(currentNode.value);
      currentNode = currentNode.next;
    } while (currentNode !== headNode);

    return keysArr;
  }
}

class HashSet {
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

  set(value, skipGrowCheck = false) {
    const hashNewEntry = this.hash(value);

    if (this._buckets[hashNewEntry]) {
      const valueIndex = this._buckets[hashNewEntry].find(value);

      if (valueIndex) {
        this._buckets[hashNewEntry].removeAt(valueIndex);
      }
      this._buckets[hashNewEntry].append({ value });
    } else {
      this._buckets[hashNewEntry] = new LinkedListForHashset({ value });
    }

    if (!skipGrowCheck && this.loadFactor() > 0.75) {
      this.grow();
    }
  }

  has(value) {
    const hashedValue = this.hash(value);

    return (
      !!this._buckets[hashedValue] && this._buckets[hashedValue].contains(value)
    );
  }

  remove(value) {
    const hashedValue = this.hash(value);

    if (!this._buckets[hashedValue]) return false;

    const valueIndex = this._buckets[hashedValue].find(value);
    if (valueIndex !== null) {
      if (this._buckets[hashedValue].size() > 1) {
        this._buckets[hashedValue].removeAt(valueIndex);
      } else {
        this._buckets[hashedValue] = undefined;
      }
      return true;
    }

    return false;
  }

  length() {
    return this._buckets.reduce(
      (valuesCount, bucket) =>
        bucket ? valuesCount + bucket.size() : valuesCount,
      0
    );
  }

  clear() {
    this._buckets = new Array(16);
  }

  keys() {
    return this._buckets.reduce(
      (values, bucket) => (bucket ? [...values, ...bucket.keys()] : values),
      []
    );
  }

  grow() {
    const entries = this.keys();

    this._buckets = new Array(this._buckets.length * 2);
    entries.forEach((key) => this.set(key, true));
  }
}
