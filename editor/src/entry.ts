import run from './index';

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
require('es6-promise/auto');

if ((window as any)['monaco']) {
	run();
} else {
	(window as any)['onMonacoReady'] = run;
}
