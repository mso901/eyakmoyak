import { put, get, post, del } from './api';

export const addMyPills = async ( name:string, expiredat:string,alarmstatus:boolean,  onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await post('/api/mypills', {name:name, expiredat:expiredat, alarmstatus:alarmstatus} );
      if (onSuccess) onSuccess(data);  
  
    } catch (error) {
      console.error('Add My Pills failed', error);
      if (onFailure) onFailure(error);
    }
  };

  export const fetchMyPills = async (
    limit: number,
    offset: number,
    sortedBy: string,
    order: string,
    onSuccess?:(arg0:any)=>void, 
    onFailure?:(arg0:any)=>void) => {
    try {
      const data = await get('/api/mypills', {
        limit: limit,
        offset: offset,
        sortedBy: sortedBy,
        order: order
      } );

      if (onSuccess) onSuccess(data);  
  
    } catch (error) {
      console.error('Fetch My Pills failed', error);
      if (onFailure) onFailure(error);
    }
  };

  export const fetchExpiredPills = async () => {
    try {
      const data = await get('/api/mypills/expiredtoday' );
      return data;
  
    } catch (error) {
      console.error('fetch Expired Pills failed', error);
      throw error;
    }
  };

  export const updateMyPills = async (
    mypillid:string,
    name:string, 
    expiredat:string,
    alarmstatus:boolean,
    onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await put(`/api/mypills/${mypillid}`,  {name, expiredat, alarmstatus} );
      if (onSuccess) onSuccess(data);  
  
    } catch (error) {
      console.error('Update My Pills failed', error);
      if (onFailure) onFailure(error);
    }
  };

  export const deleteMyPills = async (
    mypillid:string,
    onSuccess?:(arg0:any)=>void, onFailure?:(arg0:any)=>void) => {
    try {
      const data = await del(`/api/mypills/${mypillid}` );
      if (onSuccess) onSuccess(data);  
  
    } catch (error) {
      console.error('Delete My Pills failed', error);
      if (onFailure) onFailure(error);
    }
  };