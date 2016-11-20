import run from './index';

if ((window as any)['monaco']) {
	run();
} else {
	(window as any)['onMonacoReady'] = run;
}
