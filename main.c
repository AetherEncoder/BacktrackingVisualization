#include <stdio.h>

void printSubset(int subset[], int size){
    printf("[");
    for(int i = 0; i < size; i++){
        printf("%d%s", subset[i], i==size-1?"":", ");
    }
    printf("]\n");
}

void powerSet(int set[], int n, int index, int subset[], int subsetSize){
    if(index == n){
        printSubset(subset, subsetSize);
        return;
    }

    // Exclude current element
    powerSet(set, n, index + 1, subset, subsetSize);

    // Include current element
    subset[subsetSize] = set[index];
    powerSet(set, n, index + 1, subset, subsetSize + 1);
}

int main(){
    int set[] = {1, 2, 3, 4, 5};
    int n = sizeof(set) / sizeof(set[0]);

    int subset[n];
    printf("Given set: [");
    for(int i = 0; i < n; i++)
      printf("%d%s", set[i], i==n-1 ? "]\n":", ");

    printf("Power Set:\n");
    powerSet(set, n, 0, subset, 0);

    return 0;
}