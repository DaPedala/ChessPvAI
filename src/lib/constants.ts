import type { TimeControl } from './types';

export const TIME_CONTROLS: TimeControl[] = [
	{ label: '1+0',   type: 'Bullet',    base: 60,   inc: 0  },
	{ label: '2+1',   type: 'Bullet',    base: 120,  inc: 1  },
	{ label: '3+0',   type: 'Blitz',     base: 180,  inc: 0  },
	{ label: '3+2',   type: 'Blitz',     base: 180,  inc: 2  },
	{ label: '5+0',   type: 'Blitz',     base: 300,  inc: 0  },
	{ label: '5+3',   type: 'Blitz',     base: 300,  inc: 3  },
	{ label: '10+0',  type: 'Rapid',     base: 600,  inc: 0  },
	{ label: '10+5',  type: 'Rapid',     base: 600,  inc: 5  },
	{ label: '15+10', type: 'Rapid',     base: 900,  inc: 10 },
	{ label: '30+0',  type: 'Classical', base: 1800, inc: 0  },
	{ label: '30+20', type: 'Classical', base: 1800, inc: 20 },
	{ label: 'Custom', type: 'Custom',   base: -1,   inc: -1 }
];
