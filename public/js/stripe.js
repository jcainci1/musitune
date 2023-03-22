/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51KGApaEmr68gMOioOCc6QOhgCcjAnfmyiXubcLsau5NMoDMHmD0ECJpRNZ9emJ8RJPJotcei5PdVH8ppczjZVpT8002N9kyYMG'
);

export const bookStudio = async studioId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${studioId}`
    );
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
