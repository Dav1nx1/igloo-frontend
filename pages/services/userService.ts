import axios from 'axios';

export const getAllUsers = async () => {
    const response = await fetch( 'http://localhost:3000/users');

    const json = await response.json();
    return json
}