import request from '../utils/network';

export function login(data: any) {
  return request.post('/api/login', data);
}

// 从 html 中导入表格
export function load_table_from_html(data: any) {
  // params example {
  //    data: '<HTML> string'
  //    table_name: 'string'
  // }
  return request.post('/api/filltable/load_table_from_html', data);
}
