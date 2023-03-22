/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// export const login = async (email, password) => {
//     try {
//       const res = await axios({
//         method: 'POST',
//         url: '/api/v1/users/login',
//         data: {
//           email,
//           password
//         }
//       });
//       if (res.data.status === 'success') {
//         showAlert('success', 'Logged in successfully!');
//         window.setTimeout(() => {
//           location.assign('/me');
//         }, 1500);
//       }
//     } catch (err) {
//       showAlert('error', err.response.data.message);
//     }
//   };

export const userAvailability = async () => {
  //   const userId = user.id;
  //   console.log(userId);
  //   let data;
  try {
    return await axios({
      method: 'GET',
      url: `/my-calendar-data`
    });

    //   console.log(response.data[0].create_availability.availability_start_date);
    // });
    // const res = await axios({
    //   method: 'GET',
    //   url: `/get-all-user/${userId}`
    // }).then(res => {
    //   console.log(res.data);
    // });
    // console.log(availability);
    // if ((res.data.status = 'success')) location.assign('/');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'No Availability');
  }
  //   res.render('calendar', { title: 'Calendar', availabilities: availabilities });
  //   console.log(res.data.availabilities);
};

// export const userAvailability = async () => {
//     try {
//       const res = await axios({
//         method: 'GET',
//         url: `/get-all-user/${userId}`
//       });
//       if ((res.data.status = 'success')) location.assign('/');
//     } catch (err) {
//       console.log(err.response);
//       showAlert('error', 'Error logging out! Try again.');
//     }
//   };
