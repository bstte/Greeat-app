import axios from "axios";
// live server url
const BASE_API_URL = 'https://gestione.greeat.it/api/';
export const Image_Base_Url = 'https://gestione.greeat.it/public/images/';


// devloper server url
// const BASE_API_URL = 'https://teamwebdevelopers.com/greeat/api/';
// export const Image_Base_Url = 'https://teamwebdevelopers.com/greeat/public/images/';

const instance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const api = {
  login: (Credential) => instance.post('login', Credential),
  get_user: (token) => instance.get('user', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  country: (token) => instance.get('country', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  logout: (token) => instance.get('/logout', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  SavedPunchData: (token, credential) => instance.post('/punch/store', credential, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  Document: (token, LocationId) => instance.get(`/document/${LocationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  location: (token) => instance.get(`/location`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  searchDocument: (token, userId, description) => instance.get(`/document/search/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
    
      description: description
    }
  }),
 
  // for invoice data
  Invoice: (token, location_id) => instance.get(`/invloice/${location_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  searchInvoice: (token,params) => instance.post(`/invoice/search`, params,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  
  }),

  Addinvoicedata: (token) => instance.get(`/invoice/data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  submitInvoice: (token, userId, formData) => instance.post(`/store/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  }),


  updateInvoice: (token, InvoiceId, formData) => instance.post(`/update/${InvoiceId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  }),
  dashboardcount: (token, userId) => instance.get(`/dashboard/count/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  }),

  getevent: (token) => instance.get(`/get/event`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  }),
  getcalender: (token,date) => instance.get(`/calender`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
    params: {
      date: date,
     
    }
  }),
  notice: (token) => instance.get(`/notice`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  }),
  task: (token, shopId,date) => instance.get(`/sop/item/${shopId}/${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
 
  }),

  storetask: (token, userId, formData) => instance.post(`/item/store/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  }),

  updateProfile: (token, userId, formData) => instance.post(`/profile/update/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  }),

  // supplier
  closer_list: (token) => instance.get(`closer/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  supplier: (token) => instance.get(`/supplier`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
  searchsupplier: (token, title) => instance.get(`/supplier/search/${title}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
   
  }),

  // closer
  searchcloser: (token, shiftid, fdate, tdate) => {
    // Make a GET request with shiftid, fdate, and tdate as query parameters
    return instance.get(`/closer/search?shift=${shiftid}&fdate=${fdate}&tdate=${tdate}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
},

  submitcloser: (token, formData) => instance.post(`closer/store`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  }),

  schedule: (token,week) => instance.get(`/schedule`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      
      week: week
    }
  }),
  
  getpunchdata: (token, userId) => instance.get(`punch/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
   
  }),
  Leave: (token,params) => instance.post(`/leave`, params,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  
  }),

  Leave_without_schedule: (token,params) => instance.post(`/no-schedule-leave`, params,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  
  }),


};

export default api;
