export function load({ cookies }) {
	const visited = cookies.get('visited');
    const name = cookies.get('name');
    const character = cookies.get('character');
    
	// cookies.set('visited', 'true', { path: '/' });
    // cookies.set('name', 'Name', { path: '/' });
    // cookies.set('character', '0', { path: '/' });

	return {
		visited,
        name,
        character
	};
}