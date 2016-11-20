import run from './index';

if (window['monaco']) {
	run();
} else {
	window['onMonacoReady'] = run;
}
