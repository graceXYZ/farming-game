import { redirect } from '@sveltejs/kit';

// export function load({ cookies }) {
// 	const visited = cookies.get('visited');
//     const name = cookies.get('name');
//     const character = cookies.get('character');
//     const success = cookies.get('success');
    
// 	// cookies.set('visited', 'true', { path: '/' });
//     // cookies.set('name', 'Name', { path: '/' });
//     // cookies.set('character', '0', { path: '/' });

// 	return {
// 		visited,
//         name,
//         character,
//         success
// 	};
// }

// export const actions = {

//     default: async ({ request, cookies }) => {
// 		const data = await request.formData();
//         let name = data.get('name');
//         let character = data.get('character');
//         let visited = data.get('visited');
//         let success = data.get('success');
//         cookies.set('name', name, { path: '/' });
//         cookies.set('visited',"true",{ path: '/' });
//         cookies.set('character', character, { path: '/' });
//         cookies.set('success', success, { path: '/' });
        
//         throw redirect(303,'/game')
// 	}
// }
