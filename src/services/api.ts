import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://goproducts.herokuapp.com/api/v1',
});
