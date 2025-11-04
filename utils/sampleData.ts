
export const generateSampleData = () => {
  const stripeReport = `id,created_utc,description,customer_name,gross,fee,net,payout_id,payout_date
tr_1,2023-11-01T10:30:00Z,Donation for Children's Fund,John Tan,100.00,3.20,96.80,po_1,2023-11-03
tr_2,2023-11-01T11:00:00Z,Monthly Giving,"Lim, Wei",50.00,1.75,48.25,po_1,2023-11-03
tr_3,2023-11-02T14:00:00Z,Donation,Siti Binte Ahmad,250.00,7.55,242.45,po_2,2023-11-04
tr_4,2023-11-02T16:20:00Z,Donation,Rajesh Kumar,75.00,2.55,72.45,po_2,2023-11-04
tr_5,2023-11-03T09:00:00Z,Urgent Appeal,Cheryl Ong,1000.00,29.30,970.70,po_3,2023-11-05
tr_6,2023-11-03T11:45:00Z,Website Donation,Anonymous,20.00,0.90,19.10,po_3,2023-11-05
tr_7,2023-11-04T12:00:00Z,Donation,"Tan, J.",100.00,3.20,96.80,po_4,2023-11-06
tr_8,2023-11-04T18:00:00Z,Major Donor Gift,David Chen,5500.00,159.80,5340.20,po_4,2023-11-06
tr_9,2023-11-05T10:00:00Z,Donation,Emily Griffin,30.00,1.20,28.80,po_5,2023-11-07
tr_10,2023-11-05T15:00:00Z,Charity Gala Ticket,Fiona Tan,150.00,4.65,145.35,po_5,2023-11-07
`;

  const dmsReport = `donation_id,donation_date,donor_name,amount,campaign,payment_method
DMS-101,2023-11-01,"Tan, John",96.80,Children's Fund,Stripe
DMS-102,2023-11-01,Wei Lim,48.25,Monthly Giving,Stripe
DMS-103,2023-11-02,Siti B. Ahmad,242.45,General Donations,Stripe
DMS-104,2023-11-02,R Kumar,75.00,General Donations,Stripe
DMS-105,2023-11-03,"Ong, Cheryl",970.70,Urgent Appeal,Stripe
DMS-106,2023-11-04,J. Tan,96.80,Children's Fund,Stripe
DMS-107,2023-11-04,"Chen, David",5340.20,Major Gifts,Stripe
DMS-108,2023-11-06,Robert Downy,50.00,General Donations,Cash
DMS-109,2023-11-07,Emily Griffin,28.80,General Donations,Stripe
`;

  return { stripeReport, dmsReport };
};
