import { navigate } from "./navigate";

export function checkStatus(status: number, msg: string): void {
  const $message = window['$message'];

  switch (status) {
    case 400:
      $message.error(msg);
      break;
    case 401:
      $message.error('用户没有权限!');
      break;
    case 403:
      $message.error('不允许访问！');
      break;
    case 404:
      $message.error('网络请求错误，未找到该资源!');
      navigate('/404')
      break;
    case 405:
      $message.error('网络请求错误，请求方法未允许!');
      break;
    case 408:
      $message.error('网络请求超时');
      break;
    case 500:
      $message.error('服务器错误');
      break;
    case 501:
      $message.error('网络未实现');
      break;
    case 502:
      $message.error('网络错误');
      navigate('/500')
      break;
    case 503:
      $message.error('服务不可用!');
      break;
    case 504:
      $message.error('网络超时');
      break;
    default:
      $message.error(msg);
  }
}
