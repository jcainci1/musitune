import axios from 'axios';
import { showAlert } from './alerts';

export const updateAvailability = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/availability/create',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Updated successfully!');
      window.setTimeout(() => {
        location.assign('/my-calendar');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
