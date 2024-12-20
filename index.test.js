import fs from 'fs';
import { compress, decompress } from './index';

const LOG_FILE = 'stats.log';
let log;

beforeAll(() => {
    log = fs.openSync(LOG_FILE, 'w');
});

afterAll(() => {
    fs.closeSync(log);
});

function logStats(source, compressed) {
    if (Array.isArray(source)) {
        source = JSON.stringify(source);
    }
    const ratio = Math.round(compressed.length * 100 / source.length);
    fs.writeSync(log,
        expect.getState().currentTestName + '\n' +
        source + '\n' +
        compressed + '\n' +
        'Сжатие: ' + ratio + '%\n\n'
    );
}

const getRandom = () => Math.round(Math.random() * 299 + 1);

function getRandomData(length) {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(getRandom());
    }
    return result;
}

function getRangeData(min, max, dup = 1) {
    const result = [];
    for (let i = min; i <= max; i++) {
        result.push(...(Array(dup).fill(i)));
    }
    return result;
}

function genericTest(source) {
    const z = compress(source);
    expect(decompress(z)).toEqual(source);
    logStats(source, z);
}

test('50 случайных чисел', () => {
    genericTest(getRandomData(50));
});

test('100 случайных чисел', () => {
    genericTest(getRandomData(100));
});

test('500 случайных чисел', () => {
    genericTest(getRandomData(500));
});

test('1000 случайных чисел', () => {
    genericTest(getRandomData(1000));
});

test('Все числа из 1 знака', () => {
    genericTest(getRangeData(1, 9));
});

test('Все числа из 2 знаков', () => {
    genericTest(getRangeData(10, 99));
});

test('Все числа из 3 знаков', () => {
    genericTest(getRangeData(100, 300));
});

test('Каждого числа по 3', () => {
    genericTest(getRangeData(1, 300, 3));
});
