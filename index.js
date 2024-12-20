import { BitView } from 'bit-buffer';

// Используя 9 бит, мы можем кодировать числа от 0 до 511
const BITS_PER_ELEMENT = 9;

/**
 * Сжать массив чисел в строку
 * 
 * @param {number[]} input - входной массив
 * @returns {string}
 */
export function compress(input) {
    const buf = new BitView(Buffer.alloc(Math.ceil(input.length * BITS_PER_ELEMENT / 8)));
    for (let i = 0; i < input.length; i++) {
        buf.setBits(i * BITS_PER_ELEMENT, input[i], BITS_PER_ELEMENT);
    }
    return buf.buffer.toString('base64');
}

/**
 * Распаковать строку как массив
 * 
 * @param {string} compr - сжатые данные
 * @returns {number[]}
 */
export function decompress(compr) {
    const result = [];
    const inputBuf = Buffer.from(compr, 'base64');
    const buf = new BitView(Buffer.alloc(inputBuf.byteLength));
    inputBuf.copy(buf.buffer);
    const resultLength = Math.floor(buf.byteLength * 8 / BITS_PER_ELEMENT);
    for (let i = 0; i < resultLength; i++) {
        result.push(buf.getBits(i * BITS_PER_ELEMENT, BITS_PER_ELEMENT));
    }
    return result;
}
