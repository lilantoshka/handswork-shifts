import { makeAutoObservable, runInAction } from 'mobx';
import api from '../services/api';

class ShiftsStore {
  shifts = [];
  loading = false;
  error = null;
  filter = 'ALL'; // ALL or specific workType

  constructor(){
    makeAutoObservable(this);
  }

  setFilter(f){
    this.filter = f;
  }

  async fetchShifts(lat, lon){
    this.loading = true;
    this.error = null;
    try{
      const data = await api.getShifts(lat, lon);
      runInAction(()=>{
        this.shifts = data;
        this.loading = false;
      });
    }catch(e){
      runInAction(()=>{
        this.error = e.message || 'Error';
        this.loading = false;
      });
    }
  }

  get filteredShifts(){
    if(this.filter === 'ALL') return this.shifts;
    return this.shifts.filter(s => String(s.workTypes).toLowerCase().includes(this.filter.toLowerCase()));
  }
}

export default new ShiftsStore();
