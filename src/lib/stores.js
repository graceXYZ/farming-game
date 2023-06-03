import { writable } from 'svelte/store';

export const steps = writable(['l','r','r','d','d','d']);
export const indentsStore = writable([0,0,0,0,0,0]);
export const repCountsStore = writable([0,0,0,0,0,0]);
export const levelStore = writable(0);
export const numStepsStore = writable(0);
export const nameStore = writable("");
export const stepI = writable(-1);
export const feedback =  writable('Drag the toolbox commands into the program and press play!');
export const feedbackCodeS =  writable('drag');
export const charSelectStore = writable("");
export const successStatusStore = writable(false);
export const successStore = writable([0,0,0,0,0]);




