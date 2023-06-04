import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
	const visited = cookies.get('visited');
    const name = cookies.get('name');
    const character = cookies.get('character');
    const success = cookies.get('success');
    
	// cookies.set('visited', 'true', { path: '/' });
    // cookies.set('name', 'Name', { path: '/' });
    // cookies.set('character', '0', { path: '/' });
    if (!character){
        cookies.set('character', "0", { path: '/' });
    }
    cookies.set('visited', "true", { path: '/' });
    if (!name){
        cookies.set('name', "", { path: '/' });
    }
    if (!success){
        cookies.set('success', JSON.stringify([0,0,0,0,0]), { path: '/' });
    }

	return {
		visited,
        name,
        character,
        success
	};
}

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        let success = data.get('success');
        console.log(success+"FROM SERVER")
        cookies.set('success', success, { path: '/' });
    }
};
