import { BasicFormData } from '@/types/Form'
import User from '../types/User'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FilterProps } from '@/types/Filter'

export const useUserStore = defineStore('user', () => {
    const users = ref<User[] >([])

    const user = ref<User | null>(null)

    const initializeUser = () => {
        user.value = {
            id: 0,
            plan: '',
            email: '',
            company: '',
            first_name: '',
            last_name: '',
            phone_number: '',
        }
        return user.value
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://retoolapi.dev/0PIjUI/users',
            )
            users.value = await response.json()
        }
        catch (error) {
            console.error(error)
        }
    }

    const fetchUserById = async (id: string) => {
        try {
            const response = await fetch(`https://retoolapi.dev/0PIjUI/users/${id}`)
            user.value = await response.json()
        }
        catch (error) {
            console.error(error)
        }
    }

    const fetchUsersByFilter = async (filter: FilterProps) => {
        const queryParams = new URLSearchParams()

        if (filter.firstName) {
            queryParams.append('first_name', filter.firstName)
        }
        if (filter.lastName) {
            queryParams.append('last_name', filter.lastName)
        }
        if (filter.plan && filter.plan !== 'All Plans') {
            queryParams.append('plan', filter.plan)
        }

        try{
            const allResponse = await fetch('https://retoolapi.dev/0PIjUI/users');
            let allUsers:User[] = await allResponse.json();

            if(filter.firstName){
                allUsers = allUsers.filter((user)=> user.first_name.toLowerCase().includes(filter.firstName.toLowerCase()));
            }
            if(filter.lastName){
                allUsers = allUsers.filter((user)=> user.last_name.toLowerCase().includes(filter.lastName.toLowerCase()));
            }
            if(filter.plan && filter.plan !== 'All Plans'){
                allUsers = allUsers.filter((user)=> user.plan.toLowerCase().includes(filter.plan.toLowerCase()));
            }
        
            users.value=allUsers;
        } catch (error) {
            console.error(error);
        }
    }

    const updateUser = async (id: number, updatedUser: BasicFormData) => {
        try {
            const response = await fetch(`https://retoolapi.dev/0PIjUI/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            })
            const updatedUserData = await response.json()
            const index = users.value.findIndex(user => user.id === id)
            if (index !== -1) {
                users.value[index] = updatedUserData
            }
            return updatedUserData
        }
        catch (error) {
            console.error(error)
        }
    }

    const createNewUser = async (newUser: BasicFormData) => {
        try {
            const response = await fetch('https://retoolapi.dev/0PIjUI/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            })
            const createdUserData = await response.json()
            users.value.push(createdUserData)
            return createdUserData
        }
        catch (error) {
            console.error(error)
        }
    }

    return { users, user, initializeUser, fetchUsers, fetchUserById, fetchUsersByFilter, updateUser, createNewUser }
})
