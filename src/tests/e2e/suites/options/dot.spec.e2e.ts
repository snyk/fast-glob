import * as runner from '../../runner';

runner.suite('e2e → options → dot (implicitly)', [
	{
		pattern: 'fixtures/.*',
		expected: ['fixtures/.file']
	},
	{
		pattern: 'fixtures/.**',
		expected: ['fixtures/.file']
	},
	{
		pattern: 'fixtures/**/.*',
		expected: ['fixtures/.file']
	},
	{
		pattern: 'fixtures/{.,}*',
		expected: [
			'fixtures/.file',
			'fixtures/file.md'
		]
	}
]);

runner.suite('e2e → options → dot', [
	{
		pattern: 'fixtures/*',
		options: { dot: true },
		expected: [
			'fixtures/.file',
			'fixtures/file.md'
		]
	},
	{
		pattern: 'fixtures/**',
		options: { dot: true },
		expected: [
			'fixtures/.directory/file.md',
			'fixtures/.file',
			'fixtures/file.md',
			'fixtures/first/file.md',
			'fixtures/first/nested/directory/file.md',
			'fixtures/first/nested/file.md',
			'fixtures/second/file.md',
			'fixtures/second/nested/directory/file.md',
			'fixtures/second/nested/file.md'
		]
	}
]);
