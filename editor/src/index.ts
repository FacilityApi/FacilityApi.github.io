/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />
import * as _ from 'lodash';

interface IFile {
	name?: string;
	text: string;
}

export default function() {
	// get various HTML elements
	const fileList = document.getElementsByClassName('file-list')[0] as HTMLSelectElement;
	const generatorPicker = document.getElementsByClassName('generator-picker')[0] as HTMLSelectElement;
	const outputHeader = document.getElementsByClassName('right-top-container')[0];

	// register FSD language
	monaco.languages.register({
		id: 'fsd',
		extensions: [ '.fsd' ],
		aliases: [ 'fsd' ]
	});
	monaco.languages.setMonarchTokensProvider('fsd', {
		defaultToken: 'invalid',
		tokenPostfix: '',
		tokenizer: {
			root: [
				{ include: '@whitespace' },
				{ include: '@attribute' },
				[/service\b/, 'keyword'],
				[/[a-zA-Z][a-zA-Z0-9]*/, 'type.identifier'],
				[/{/, 'delimiter.curly', '@service'],
				[/^(?=#)/, 'markdown', '@markdown']
			],

			service: [
				{ include: '@whitespace' },
				{ include: '@attribute' },
				[/(method|data|errors|enum)\b/, 'keyword'],
				[/:/, 'delimiter' ],
				[/[a-zA-Z][a-zA-Z0-9]*/, 'type.identifier'],
				[/{/, 'delimiter.curly', '@member'],
				[/}/, 'delimiter.curly', '@pop']
			],

			member: [
				{ include: '@whitespace' },
				{ include: '@attribute' },
				[/,/, 'delimiter' ],
				[/[a-zA-Z][a-zA-Z0-9]*/, ''],
				[/:/, 'delimiter', '@typeName'],
				[/}/, 'delimiter.curly', '@pop']
			],

			typeName: [
				{ include: '@whitespace' },
				[/[a-zA-Z][a-zA-Z0-9]*/, { cases: { 'string|boolean|double|int32|int64|bytes|object|error|result|map': 'keyword', '@default': 'type.identifier' } }],
				[/[\[\]<>]/, '@brackets'],
				[/;/, 'delimiter', '@pop' ]
			],

			whitespace: [
					[/[ \t\r\n]+/, 'white'],
					[/\/\/.*$/, 'comment']
			],

			attribute: [
				[/\[/, 'delimiter', '@attrName']
			],

			attrName: [
				{ include: '@whitespace' },
				[/[a-zA-Z0-9\.\+\_\-]+/, 'annotation'],
				[/[\(\),]/, 'delimiter'],
				[/:/, 'delimiter', '@attrValue'],
				[/\]/, 'delimiter', '@pop']
			],

			attrValue: [
				{ include: '@whitespace' },
				[/[a-zA-Z0-9\.\+\_\-]+/, 'string'],
				[/"([^"\\]|\\.)*$/, 'string.invalid' ],
				[/"/, { token: 'string.quote', bracket: '@open', next: '@string' } ],
				[/[,\)]/, 'delimiter', '@pop']
			],

			string: [
				[/[^\\"]+/, 'string'],
				[/\\(?:[bfnrt\\"']|u[0-9A-Fa-f]{4})/, 'string.escape'],
				[/\\./, 'string.escape.invalid'],
				[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' } ]
			],

			markdown: [
				[/^\s*##+.*/, 'strong'],
				[/^\s*#.*/, 'strong type.identifier'],
				[/^\s*([\*\-+:]|\d\.)/, 'string.list'],
				[/^\s*>+/, 'string.quote' ],
				[/\b__([^\\_]|_(?!_))+__\b/, 'strong'],
				[/\*\*([^\\*]|\*(?!\*))+\*\*/, 'strong'],
				[/\b_[^_]+_\b/, 'emphasis'],
				[/\*[^\\*]+\*/, 'emphasis'],
				[/(!?\[)((?:[^\]\\])+)(\]\([^\)]+\))/, ['string.link', '', 'string.link' ]],
				[/(!?\[)((?:[^\]\\])+)(\])/, 'string.link'],
				[/[^*_`([!]+/, '' ],
				[/[\*_`([!]/, '' ]
			]
		}
	});

	// create Monaco editors
	const leftMonacoOptions = {
		value: localStorage['fsdText'] || '',
		theme: 'vs-dark',
		language: 'fsd'
	};
	const leftMonaco = monaco.editor.create(document.getElementsByClassName('left-bottom-container')[0] as HTMLElement, leftMonacoOptions);
	const rightMonacoOptions = {
		readOnly: true,
		theme: 'vs-dark',
		wrappingColumn: -1
	};
	const rightMonaco = monaco.editor.create(document.getElementsByClassName('right-bottom-container')[0] as HTMLElement, rightMonacoOptions);
	window.onresize = () => {
		leftMonaco.layout();
		rightMonaco.layout();
	}

	// create function for setting output
	const lastFileName: { [generator: string]: string } = {};
	const setOutputFile = (file: IFile) => {
		const language = file && file.name && _.find(monaco.languages.getLanguages(), lang => {
			return _.find(lang.extensions, ext => {
				return _.endsWith(file.name, ext);
			});
		});
		const languageId = language && language.id;

		// word wrap some languages
		const wrappingColumn = languageId === 'markdown' ? 0 : -1;

		// update output editor
		rightMonaco.getModel().setValue('');
		monaco.editor.setModelLanguage(rightMonaco.getModel(), language && language.id);
		rightMonacoOptions.wrappingColumn = wrappingColumn;
		rightMonaco.updateOptions(rightMonacoOptions);
		rightMonaco.getModel().setValue(file && file.text || '');

		// update file name
		outputHeader.removeChild(outputHeader.firstChild);
		outputHeader.appendChild(document.createTextNode(file && file.name || '\u00a0'));

		// remember last file name to maintain selection
		if (file && file.name) {
			lastFileName[generatorPicker.value] = file.name;
		}
	};

	// set output as selection changes
	const setOutputToSelection = () => {
		const option = fileList.options[fileList.selectedIndex];
		setOutputFile(option && (option as any)['data-file']);
	};
	fileList.onchange = setOutputToSelection;

	// create function that generates output
	let generating = false;
	const generate = () => {
		if (generating) {
			generateSoon();
		} else {
			generating = true;
			const request: RequestInit = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					generator: {
						name: generatorPicker.value
					},
					definition: {
						name: 'api.fsd',
						text: leftMonaco.getModel().getValue()
					}
				}),
				cache: 'no-cache'
			};
			const generateUrl = _.startsWith(window.location.href, 'http://local') ? 'http://localhost:45054/generate' : 'https://fsdgen.calexanderdev.com/generate';
			fetch(generateUrl, request)
				.then(response => {
					if (response.status === 200) {
						return response.json();
					} else {
						throw TypeError(response.status + ' ' + response.statusText);
					}
				})
				.then(json => {
					while (fileList.firstChild) {
						fileList.removeChild(fileList.firstChild);
					}
					if (json.output && json.output.length) {
						json.output.sort((a: IFile, b: IFile) => {
							const aParts = a.name.split('/');
							const bParts = b.name.split('/');
							for (let index = 0; ; index++) {
								if (index === aParts.length) {
									return index === bParts.length ? 0 : -1;
								} else if (index === bParts.length) {
									return 1;
								} else {
									const aIsFile = index + 1 === aParts.length;
									const bIsFile = index + 1 === bParts.length;
									if (aIsFile === bIsFile) {
										if (aParts[index] < bParts[index]) {
											return -1;
										} else if (aParts[index] > bParts[index]) {
											return 1;
										}
									} else if (aIsFile) {
										return -1;
									} else {
										return 1;
									}
								}
							}
						});
						let selected = false;
						let optgroup: HTMLOptGroupElement = null;
						json.output.forEach((file: IFile) => {
							const path = file.name.split('/');
							const name = path.pop();

							if (path.length) {
								const groupLabel = path.join('/') + '/';
								if (!optgroup || optgroup.label !== groupLabel) {
									optgroup = document.createElement("optgroup");
									optgroup.label = groupLabel;
									fileList.appendChild(optgroup);
								}
							}

							const option = document.createElement("option");
							option.label = name;
							if (!selected && lastFileName[generatorPicker.value] === name) {
								option.selected = true;
								selected = true;
							}
							(option as any)['data-file'] = file;
							if (optgroup) {
								optgroup.appendChild(option);
							} else {
								fileList.appendChild(option);
							}
						});
						if (!selected) {
							fileList.selectedIndex = 0;
						}
						setOutputToSelection();
					} else if (json.parseError) {
						setOutputFile({
							text: '(' + json.parseError.line + ',' + json.parseError.column + '): ' + json.parseError.message
						});
					} else {
						setOutputFile(undefined);
					}
					generating = false;
				})
				.catch(error => {
					setOutputFile({
						text: 'Error: ' + error.message
					});
					rightMonaco.getModel().setValue('Error: ' + error.message);
					generating = false;
				});
		}
	}
	generatorPicker.onchange = generate;

	// create function that generates output soon
	let generateTimeout: number;
	const generateSoon = () => {
		window.clearTimeout(generateTimeout);
		generateTimeout = window.setTimeout(generate, 500);
	}
	leftMonaco.getModel().onDidChangeContent(() => {
		localStorage['fsdText'] = leftMonaco.getModel().getValue();
		generateSoon();
	});

	// start with example
	if (!leftMonaco.getModel().getValue()) {
		leftMonaco.getModel().setValue(require('raw-loader!./example.fsd'));
	}

	leftMonaco.focus();
	generate();
}
