import * as assert from 'assert';

import * as ng from 'glob';

import * as fg from '../..';
import { Pattern } from '../../types';
import { Options } from '../../settings';

import Table = require('easy-table'); // eslint-disable-line @typescript-eslint/no-require-imports

export type SuiteTest = {
	broken?: boolean;
	debug?: boolean;
	description?: string;
	expected: string[];
	issue?: number | number[];
	options?: Options;
	pattern: Pattern | Pattern[];
};

type MochaDefinition = Mocha.TestFunction | Mocha.ExclusiveTestFunction;
type SuiteTestFunction = (pattern: Pattern | Pattern[], options?: Options) => Promise<string[]>;

export function suite(title: string, tests: SuiteTest[]): void {
	describe(title, () => {
		for (const test of tests) {
			const name = formatSuiteTestName(test);
			const definition = getTestCaseMochaDefinition(test);

			definition(`${name} (sync)`, () => suiteTestRunner(test, getFastGlobEntriesSync));
		}
	});
}

function formatSuiteTestName(test: SuiteTest): string {
	let title = `pattern: '${test.pattern}'`;

	if (test.options?.ignore !== undefined) {
		title += ', ignore: ' + test.options.ignore.join(', ');
	}

	return title;
}

function getTestCaseMochaDefinition(test: SuiteTest): MochaDefinition {
	return test.debug === true ? it.only : it;
}

async function suiteTestRunner(test: SuiteTest, func: SuiteTestFunction): Promise<void> {
	const expected = test.expected;

	const actual = await func(test.pattern, test.options);

	if (test.debug !== undefined) {
		let message = '';

		const nodeGlobEntries = await getNodeGlobEntriesSync(test.pattern, test.options);

		const report = formatDebugMessage(actual, expected, nodeGlobEntries);

		if (test.description !== undefined) {
			message += ['Description:', test.description].join('\n') + '\n';
		}

		console.log(`${message}\n${report}`);
	}

	if (test.broken === true && test.issue === undefined) {
		assert.fail("This test is marked as «broken», but it doesn't have a issue key.");
	}

	assert.deepStrictEqual(actual, expected);
}

function getNodeGlobEntriesSync(pattern: Pattern | Pattern[], options?: Options): Promise<string[]> {
	const result: Set<string> = new Set();
	const patterns = ([] as string[]).concat(pattern);

	const ngOptions: ng.IOptions = {
		nosort: true,
		nounique: true,
		nocase: options?.caseSensitiveMatch === false,
		nodir: [true, undefined].includes(options?.onlyFiles),
		matchBase: options?.baseNameMatch,
		absolute: options?.absolute,
		cwd: options?.cwd ?? process.cwd(),
		dot: options?.dot,
		ignore: options?.ignore
	};

	for (const item of patterns) {
		const entries = ng.sync(item, ngOptions);

		entries.sort((a, b) => a.localeCompare(b));

		for (const entry of entries) {
			result.add(entry);
		}
	}

	return Promise.resolve([...result]);
}

function getFastGlobEntriesSync(pattern: Pattern | Pattern[], options?: Options): Promise<string[]> {
	const entries = fg.sync(pattern, options);

	entries.sort((a, b) => a.localeCompare(b));

	return Promise.resolve(entries);
}

function formatDebugMessage(actual: string[], expected: string[], nodeGlobEntries: string[]): string {
	const table = new Table();

	const maxItemsCount = Math.max(actual.length, expected.length, nodeGlobEntries.length);

	if (maxItemsCount === 0) {
		return 'Empty';
	}

	for (let index = 0; index < maxItemsCount; index++) {
		table.cell('Expected', expected[index]);
		table.cell('fast-glob', actual[index]);
		table.cell('node-glob', nodeGlobEntries[index]);
		table.newRow();
	}

	return table.toString();
}
