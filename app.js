function avarage(arr) {
    let avg = 0;
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        avg += element;

    }
    return avg / (arr.length);

}
var scores = [1, 2, 3, 4, 5];
console.log(avarage(scores));