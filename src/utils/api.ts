import axios from 'axios';

// バックエンド呼び出し用の接頭辞
const SERVICE_NAME = 'express-tsnode-react';
const SVC = `/${SERVICE_NAME}`;

async function request<T = any>( path: string, config={} ){
    const response = await axios.get<T>(path, config);
    return response.data;
}

export async function getLoginUser(){
    return request(`/userInfo`);
}

export async function getSearchResults(arg: any = {}){
    return request(`${SVC}/search?key=${arg.key}`);
}

export async function postPage1( postData: { [index: string]: string}) {
    const response = await axios.post(`${SVC}/page1`, postData);
    return response;
}

export async function postPage2( postData: { [index: string]: string}) {
    const response = await axios.post(`${SVC}/page2`, postData);
    return response;
}
