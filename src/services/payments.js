import axios from 'axios';

export const subscriptionFromPaystack = async (id) => {
  const subscription = await axios
  .get(
    `https://api.paystack.co/subscription/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
      },
    },
  );

  if(!subscription.data.status){
    return {
      status: false
    }
  }

  return {
    status: true,
    subscription: subscription.data.data
  }
}