//this is a js file, but it is written in javascript since simulation wants a js file
import java.util.ArrayList;
import java.util.Collections;

public class PowerOfTwoMaxHeap {
    private final int exponent; // formerly "x"
    private final int branchingFactor;
    private final ArrayList<Integer> heap;

    public PowerOfTwoMaxHeap(int exponent) {
        this.exponent = exponent;
        this.branchingFactor = (int) Math.pow(2, exponent);
        this.heap = new ArrayList<>();
    }

    public void insert(int value) {
        heap.add(value);
        heapifyUp(heap.size() - 1);
    }

    public int popMax() {
        if (heap.isEmpty()) throw new IllegalStateException("Heap is empty.");
        int max = heap.get(0);
        int last = heap.remove(heap.size() - 1);
        if (!heap.isEmpty()) {
            heap.set(0, last);
            heapifyDown(0);
        }
        return max;
    }

    private void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / branchingFactor;
            if (heap.get(index) > heap.get(parent)) {
                Collections.swap(heap, index, parent);
                index = parent;
            } else break;
        }
    }

    private void heapifyDown(int index) {
        int size = heap.size();
        while (true) {
            int maxIndex = index;
            for (int i = 1; i <= branchingFactor; i++) {
                int childIndex = branchingFactor * index + i;
                if (childIndex < size && heap.get(childIndex) > heap.get(maxIndex)) {
                    maxIndex = childIndex;
                }
            }
            if (maxIndex != index) {
                Collections.swap(heap, index, maxIndex);
                index = maxIndex;
            } else break;
        }
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }

    public int size() {
        return heap.size();
    }

    public void printHeap() {
        System.out.println(heap);
    }

    public static void main(String[] args) {
        PowerOfTwoMaxHeap heap = new PowerOfTwoMaxHeap(1); // 2^1 = 2 children (binary heap)
        heap.insert(10);
        heap.insert(20);
        heap.insert(5);
        heap.insert(30);
        heap.printHeap(); // [30, 10, 5, 20]
        System.out.println("Popped max: " + heap.popMax()); // 30
        heap.printHeap(); // Remaining heap
    }
}

