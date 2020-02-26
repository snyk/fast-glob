import * as runner from '../../runner';

const CWD = process.cwd().replace(/\\/g, '/');

function getExpected(values: string[]): string[] {
	return values.map((value) => `${CWD}/${value}`);
}

runner.suite('e2e → options → absolute (implicitly)', [
	{
		pattern: `${CWD}/fixtures/*`,
		expected: getExpected(['fixtures/file.md'])
	},
	{
		pattern: `${CWD}/fixtures/**`,
		expected: getExpected([
			'fixtures/file.md',
			'fixtures/first/file.md',
			'fixtures/first/nested/directory/file.md',
			'fixtures/first/nested/file.md',
			'fixtures/second/file.md',
			'fixtures/second/nested/directory/file.md',
			'fixtures/second/nested/file.md'
		])
	},
	{
		pattern: `${CWD}/fixtures/first/../*`,
		expected: getExpected(['fixtures/first/../file.md'])
	}
]);

runner.suite('e2e → options → absolute', [
	{
		pattern: 'fixtures/*',
		options: { absolute: true },
		expected: getExpected(['fixtures/file.md'])
	},
	{
		pattern: 'fixtures/**',
		options: { absolute: true },
		expected: getExpected([
			'fixtures/file.md',
			'fixtures/first/file.md',
			'fixtures/first/nested/directory/file.md',
			'fixtures/first/nested/file.md',
			'fixtures/second/file.md',
			'fixtures/second/nested/directory/file.md',
			'fixtures/second/nested/file.md'
		])
	},
	{
		pattern: 'fixtures/first/../*',
		options: { absolute: true },
		expected: getExpected(['fixtures/file.md'])
	}
]);

runner.suite('e2e → options → absolute (ignore)', [
	{
		pattern: 'fixtures/*',
		options: { absolute: true, ignore: ['fixtures/*'] },
		expected: getExpected([])
	},
	{
		pattern: 'fixtures/*/*',
		options: { absolute: true, ignore: ['fixtures/*'] },
		expected: getExpected([
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	},
	{
		pattern: 'fixtures/*/*',
		options: { absolute: true, ignore: ['fixtures/*/nested'] },
		expected: getExpected([
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	},
	{
		pattern: 'fixtures/**',
		options: { absolute: true, ignore: ['**/nested'] },
		expected: getExpected([
			'fixtures/file.md',
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	},

	{
		pattern: 'fixtures/*',
		options: { absolute: true, ignore: [`${CWD}/fixtures/*`] },
		expected: getExpected([])
	},
	{
		pattern: 'fixtures/*/*',
		options: { absolute: true, ignore: [`${CWD}/fixtures/*`] },
		expected: getExpected([
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	},
	{
		pattern: 'fixtures/*/*',
		options: { absolute: true, ignore: [`${CWD}/fixtures/*/nested`] },
		expected: getExpected([
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	},
	{
		pattern: 'fixtures/**',
		options: { absolute: true, ignore: [`${CWD}/**/nested/**`] },
		expected: getExpected([
			'fixtures/file.md',
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	}
]);

runner.suite('e2e → options → absolute (cwd)', [
	{
		pattern: './*',
		options: { cwd: `${CWD}/fixtures`, absolute: true },
		expected: getExpected(['fixtures/file.md'])
	},
	{
		pattern: '../*',
		options: { cwd: `${CWD}/fixtures/first`, absolute: true },
		expected: getExpected(['fixtures/file.md'])
	},
	{
		pattern: '../../*',
		options: { cwd: `${CWD}/fixtures/first/nested`, absolute: true },
		expected: getExpected(['fixtures/file.md'])
	}
]);

runner.suite('e2e → options → absolute (cwd, ignore)', [
	{
		pattern: '*',
		options: { cwd: 'fixtures', absolute: true, ignore: ['*'] },
		expected: getExpected([])
	},
	{
		pattern: '*/*',
		options: { cwd: 'fixtures', absolute: true, ignore: ['*'] },
		expected: getExpected([
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	},
	{
		pattern: '*/*',
		options: { cwd: 'fixtures', absolute: true, ignore: ['*/nested'] },
		expected: getExpected([
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	},

	{
		pattern: '*',
		options: { cwd: 'fixtures', absolute: true, ignore: [`${CWD}/fixtures/*`] },
		expected: getExpected([])
	},
	{
		pattern: '*/*',
		options: { cwd: 'fixtures', absolute: true, ignore: [`${CWD}/fixtures/*`] },
		expected: getExpected([
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	},
	{
		pattern: '*/*',
		options: { cwd: 'fixtures', absolute: true, ignore: [`${CWD}/fixtures/*/nested`] },
		expected: getExpected([
			'fixtures/first/file.md',
			'fixtures/second/file.md'
		])
	}
]);
