// Simple API service. Replace baseURL with real endpoint.
const BASE = 'https://mobile.handswork.pro/api';

async function getShifts(lat, lon){
  const url = `${BASE}/shifts?lat=${lat}&lon=${lon}`;
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();
    return json;
  }catch(err){
    console.warn('API fetch failed, returning mock data:', err.message);
    // Mocked data
    return [
      {
        id: '1',
        logo: 'https://via.placeholder.com/128',
        address: 'Lenina, 1',
        companyName: 'Company A',
        dateStartByCity: '2025-10-06',
        timeStartByCity: '09:00',
        timeEndByCity: '18:00',
        currentWorkers: 2,
        planWorkers: 5,
        workTypes: 'Delivery',
        priceWorker: 1500,
        customerFeedbacksCount: 12,
        customerRating: 4.6
      },
      {
        id: '2',
        logo: 'https://via.placeholder.com/128',
        address: 'Tverskaya, 12',
        companyName: 'Company B',
        dateStartByCity: '2025-10-07',
        timeStartByCity: '08:00',
        timeEndByCity: '17:00',
        currentWorkers: 1,
        planWorkers: 4,
        workTypes: 'Warehouse',
        priceWorker: 1300,
        customerFeedbacksCount: 8,
        customerRating: 4.2
      },
      {
        id: '3',
        logo: 'https://via.placeholder.com/128',
        address: 'Arbat, 5',
        companyName: 'Company C',
        dateStartByCity: '2025-10-08',
        timeStartByCity: '10:00',
        timeEndByCity: '19:00',
        currentWorkers: 3,
        planWorkers: 3,
        workTypes: 'Delivery',
        priceWorker: 1600,
        customerFeedbacksCount: 20,
        customerRating: 4.8
      }
    ];
  }
}

export default { getShifts };
