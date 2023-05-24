import * as server from '../entries/pages/_page.server.js';

export const index = 2;
export const component = async () => (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/2.593528d9.js","_app/immutable/chunks/index.96eae084.js","_app/immutable/chunks/stores.46f67ff1.js","_app/immutable/chunks/index.d15f2b6b.js"];
export const stylesheets = ["_app/immutable/assets/2.1287a5cc.css","_app/immutable/assets/styles.7b084a83.css","_app/immutable/assets/stores.275820c4.css"];
export const fonts = [];
