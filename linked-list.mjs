function node(value) {
  return { ...value, next: null };
}

export default class LinkedList {
  _tailNode;
  constructor(value) {
    this._tailNode = node(value);
    this._tailNode.next = this._tailNode;
  }

  append(value) {
    const newTail = node(value);

    if (!this._tailNode.next) {
      this._tailNode.next = newTail;
      newTail.next = this._tailNode;
    } else {
      newTail.next = this._tailNode.next;
      this._tailNode.next = newTail;
    }
    this._tailNode = newTail;
  }

  prepend(value) {
    const newHead = node(value);

    if (!this._tailNode.next) {
      this._tailNode.next = newHead;
      newHead.next = this._tailNode;
    } else {
      newHead.next = this._tailNode.next;
      this._tailNode.next = newHead;
    }
  }

  head() {
    if (this._tailNode.next) {
      return this._tailNode.next.value;
    } else {
      return this._tailNode.value;
    }
  }

  tail() {
    return this._tailNode.value;
  }

  size() {
    let size = 1;
    let nextNode = this._tailNode.next;

    while (nextNode && nextNode !== this._tailNode) {
      size += 1;
      nextNode = nextNode.next;
    }

    return size;
  }

  at(index) {
    const headNode = this._tailNode.next;

    let currentIndex = 0;
    let currentNode = headNode;

    do {
      if (currentIndex === index) {
        return currentNode.value;
      }

      currentIndex += 1;
      currentNode = currentNode.next;
    } while (currentNode !== headNode);

    return undefined;
  }

  pop() {
    const headNode = this._tailNode.next;
    if (this._tailNode === headNode) {
      return "Only one value in linked list!";
    }

    const poppedNodeValue = this._tailNode.value;
    let currentNode = headNode;
    while (currentNode.next !== this._tailNode) {
      currentNode = currentNode.next;
    }

    this._tailNode = currentNode;
    this._tailNode.next = headNode;
    return poppedNodeValue;
  }

  contains(value) {
    // does not work if value has more than 1 key-value pair
    const headNode = this._tailNode.next;
    let currentNode = headNode;

    do {
      if (currentNode.value === value) {
        return true;
      }

      currentNode = currentNode.next;
    } while (currentNode !== headNode);

    return false;
  }

  find(value) {
    // does not work if value has more than 1 key-value pair
    const headNode = this._tailNode.next;
    let currentNode = headNode;
    let currentIndex = 0;

    do {
      if (currentNode.value === value) {
        return currentIndex;
      }

      currentIndex += 1;
      currentNode = currentNode.next;
    } while (currentNode !== headNode);

    return null;
  }

  toString() {
    const headNode = this._tailNode.next;
    let currentNode = headNode;
    let listStringified = `( ${currentNode.value} )`;

    while (currentNode.next !== headNode) {
      currentNode = currentNode.next;
      listStringified = `${listStringified} -> ( ${currentNode.value} )`;
    }

    listStringified = `${listStringified} -> null`;
    return listStringified;
  }

  insertAt(value, index) {
    if (index === 0) {
      this.prepend(value);
      return;
    }

    const headNode = this._tailNode.next;

    let currentIndex = 1;
    let currentNode = headNode.next;
    let previousNode = headNode;

    do {
      if (currentIndex === index) {
        const newNode = new node(value);
        previousNode.next = newNode;
        newNode.next = currentNode;
        if (newNode.next === headNode) {
          this._tailNode = newNode;
        }
        return;
      }

      currentIndex += 1;
      previousNode = currentNode;
      currentNode = currentNode.next;
    } while (previousNode !== headNode);

    return "Index too big!";
  }

  removeAt(index) {
    const headNode = this._tailNode.next;
    if (this._tailNode === headNode) {
      return "Only one value in linked list!";
    }

    if (index === 0) {
      this._tailNode.next = headNode.next;
      return;
    }

    let currentIndex = 1;
    let currentNode = headNode.next;
    let previousNode = headNode;

    do {
      if (currentIndex === index) {
        previousNode.next = currentNode.next;
        if (currentNode === this._tailNode) {
          this._tailNode = previousNode;
        }
        return;
      }

      currentIndex += 1;
      previousNode = currentNode;
      currentNode = currentNode.next;
    } while (currentNode !== headNode);

    return "Index too big!";
  }
}
