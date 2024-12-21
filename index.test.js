import fs from 'fs';
import { compress, decompress } from './index';

const N_MIN = 1;
const N_MAX = 300;
const LOG_FILE = 'stats.log';
let log;

beforeAll(() => {
    log = fs.openSync(LOG_FILE, 'w');
});

afterAll(() => {
    fs.closeSync(log);
});

function logStats(testName, source, compressed) {
    if (Array.isArray(source)) {
        source = JSON.stringify(source);
    }
    const ratio = Math.round(compressed.length * 100 / source.length);
    fs.writeSync(log,
        testName + '\n' +
        source + '\n' +
        compressed + '\n' +
        'Сжатие: ' + ratio + '%\n\n'
    );
}

const getRandom = () => Math.round(Math.random() * (N_MAX - N_MIN) + N_MIN);

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

const testSuite = {
    '50 случайных чисел': () => getRandomData(50),
    '100 случайных чисел': () => getRandomData(100),
    '500 случайных чисел': () => getRandomData(500),
    '1000 случайных чисел': () => getRandomData(1000),
    'Все числа из 1 знака': () => getRangeData(1, 9),
    'Все числа из 2 знаков': () => getRangeData(10, 99),
    'Все числа из 3 знаков': () => getRangeData(100, N_MAX),
    'Каждого числа по 3': () => getRangeData(N_MIN, N_MAX, 3),
};

Object.entries(testSuite).forEach(([testName, getData]) => {
    test(testName, () => {
        const src = getData();
        const z = compress(src);
        expect(decompress(z)).toEqual(src);
        logStats(testName, src, z);
    });
});
