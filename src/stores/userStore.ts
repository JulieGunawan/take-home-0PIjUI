import User from '../types/User';
import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const useUserStore = defineStore('user', () => {
    
    
   const users= ref<User[] >([]);

   const user = ref<User | null>(null);
   const fetchUsers= async () => {
        try{
            const response = await fetch('https://retoolapi.dev/0PIjUI/users',
            );
            users.value = await response.json();
        } catch (error) {
            console.error(error);
        }
   }

   const fetchUserById = async (id: string) => {
        try{
            const response = await fetch(`https://retoolapi.dev/0PIjUI/users/${id}`);
            user.value= await response.json();
        } catch (error) {
            console.error(error);
        }
   }

   const editUser = async (id: string, updatedUser: User) => {
        try{
            const response = await fetch(`https://retoolapi.dev/0PIjUI/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });
            user.value= await response.json();
        } catch (error) {
            console.error(error);
        }
   }
   
   const userCount = computed(() => users.value.length);
   return {users, user, fetchUsers, fetchUserById, editUser, userCount}
});