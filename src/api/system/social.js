import request from '@/utils/request';

// 第三方登录
export function socialLogin(source, code, state) {
  const data = {
    source,
    code,
    state
  };
  return request({
    url: '/system/social/callback/',
    method: 'post',
    params: data
  });
}

// 绑定账号
export function authBinding(source) {
  return request({
    url: '/system/social/binding/' + source,
    method: 'get'
  });
}

// 解绑账号
export function authUnlock(authId) {
  return request({
    url: '/system/social/unlock/' + authId,
    method: 'delete'
  });
}

// 获取授权列表
export function getAuthList() {
  return request({
    url: '/system/social/list',
    method: 'get'
  });
}
