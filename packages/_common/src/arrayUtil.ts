export function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const uint8Array = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
}

export function uint8ArrayToCSV(uint8Array: Uint8Array): string {
    const csvArray = [];
    for (let i = 0; i < uint8Array.length; i++) {
        csvArray.push(uint8Array[i].toString());
    }
    return csvArray.join(',');
}

// The two functions above are condensed into this one function
export function base64BinToCSV(base64: string): string {
    const binaryString = window.atob(base64);
    const csvArray = new Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        csvArray[i] = binaryString.charCodeAt(i).toString();
    }
    return csvArray.join(',');
}
