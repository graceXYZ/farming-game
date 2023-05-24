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

export const actions = {
	signIn: async ({ cookies, request }) => {
		const data = await request.formData();
        let name = data.get('name');
        let character = data.get('character');
        cookies.set('name', name, { path: '/' });
        cookies.set('visited',"true",{ path: '/' });
        cookies.set('character', character, { path: '/' });
        console.log("SETTING DATA")
	}
};