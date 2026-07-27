/**
 * Binary min-heap priority queue.
 * Supports lazy re-insertion (caller skips stale priorities on dequeue).
 */
class MinPriorityQueue {
  constructor() {
    this.values = [];
  }

  get size() {
    return this.values.length;
  }

  isEmpty() {
    return this.values.length === 0;
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.#bubbleUp();
  }

  dequeue() {
    const { values } = this;
    if (values.length === 0) return null;
    if (values.length === 1) return values.pop();

    const min = values[0];
    values[0] = values.pop();
    this.#sinkDown();
    return min;
  }

  #bubbleUp() {
    const { values } = this;
    let idx = values.length - 1;
    const element = values[idx];

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = values[parentIdx];
      if (element.priority >= parent.priority) break;

      values[parentIdx] = element;
      values[idx] = parent;
      idx = parentIdx;
    }
  }

  #sinkDown() {
    const { values } = this;
    const length = values.length;
    const element = values[0];
    let idx = 0;

    while (true) {
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      let swap = null;

      if (leftIdx < length && values[leftIdx].priority < element.priority) {
        swap = leftIdx;
      }

      if (
        rightIdx < length &&
        values[rightIdx].priority < (swap === null ? element.priority : values[leftIdx].priority)
      ) {
        swap = rightIdx;
      }

      if (swap === null) break;

      values[idx] = values[swap];
      values[swap] = element;
      idx = swap;
    }
  }
}

export default MinPriorityQueue;
