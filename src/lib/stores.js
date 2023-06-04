import { writable } from 'svelte/store';

export const steps = writable(['l','r','r','d','d','d']);
export const indentsStore = writable([0,0,0,0,0,0]);
export const repCountsStore = writable([0,0,0,0,0,0]);
export const levelStore = writable(0);
export const numStepsStore = writable(0);
// export const nameStore = writable("");
export const stepI = writable(-1);
export const feedback =  writable('Drag the toolbox commands into the program and press play!');
export const feedbackCodeS =  writable('drag');
// export const charSelectStore = writable("");
export const successStatusStore = writable(false);
export const successStore = writable([0,0,0,0,0]);


// name local storage
let nameStoreS = '';
if (typeof localStorage !== 'undefined') {
    nameStoreS = localStorage.name;
}
// Set the stored value or a sane default.
export const nameStore = writable(nameStoreS || "0")

// Anytime the store changes, update the local storage value.
if (typeof localStorage !== 'undefined') {
    nameStore.subscribe((value) => localStorage.name = value);
}


// char choice local storage
let charSelectStoreS = '';
if (typeof localStorage !== 'undefined') {
    charSelectStoreS = localStorage.char;
}
// Set the stored value or a sane default.
export const charSelectStore = writable(charSelectStoreS || "0")

// Anytime the store changes, update the local storage value.
if (typeof localStorage !== 'undefined') {
    charSelectStore.subscribe((value) => localStorage.char = value);
}



// success local storage
let successLocalStore = '';
if (typeof localStorage !== 'undefined') {
    successLocalStore = localStorage.success;
}
// Set the stored value or a sane default.
export const successLOCAL = writable(successLocalStore || JSON.stringify([0,0,0,0,0]))

// Anytime the store changes, update the local storage value.
if (typeof localStorage !== 'undefined') {
    successLOCAL.subscribe((value) => localStorage.success = value);
}

