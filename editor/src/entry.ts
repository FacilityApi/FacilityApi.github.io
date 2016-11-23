import run from './index';
import 'es6-promise/auto';
import 'whatwg-fetch';

if ((window as any)['monaco']) {
	run();
} else {
	(window as any)['onMonacoReady'] = run;
}
