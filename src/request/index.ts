
export const requestUrl = {
  loginUrl: '/EmailRegister/loginUser',
  registerUrl: '/EmailRegister/register',
  boothLayoutUrl: '/boothLayout/json',
  boothLayoutUrlHeader: '/boothLayout/headerjson',
  detail: '/boothLayout/frontDetail',
  getCategoryByExhibitorId: '/front/getCategoryByExhibitorId',
  listByCatIdAndExhibitorId: '/front/listByCatIdAndExhibitorId',
  linkCustomServiceUrl: '/front/addFirend',
  saveCustomerLogUrl: '/pc/saveCustomerLog',
  isLoginUrl: '/pc/isCustomerLogin',
}

export const frontBaseUrl = 'https://fairsroom.com';
//export const frontBaseUrl = 'http://localhost:8080';

export function request(url: string, data: {[key: string]: any}):Promise<any>{

  // const isDetail = url.indexOf('/boothLayout/detail') > -1 || url.indexOf('pc/saveCustomerLog') > -1
  const isDetail = true
  const keys     = Object.keys(data);
  const formData: FormData = new FormData();
  for (let i = 0; i < keys.length; i++) {
    formData.append(keys[i], data[keys[i]]);
  }

  return fetch(`${frontBaseUrl}${url}`, {
    method: 'POST',
    body: isDetail ? formData : JSON.stringify(data),
  }).then((response) => {
    return response.json();
  }).then(data => {
    return Promise.resolve(data);
  })
}
