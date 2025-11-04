
export const generateSampleData = () => {
  const sourceA = `Transaction ID,Date,Donor Name,Amount,Payment Method,Fees
PAY-1001,2023-10-26,John Tan,100.00,Credit Card,0.30
PAY-1002,2023-10-26,Lim, Wei,50.00,PayPal,0.25
PAY-1003,2023-10-27,Siti Binte Ahmad,250.00,PayNow,0.00
PAY-1004,2023-10-27,Rajesh Kumar,75.50,Credit Card,0.30
PAY-1005,2023-10-28,Cheryl Ong,1000.00,Bank Transfer,0.00
PAY-1006,2023-10-28,Anonymous,20.00,Credit Card,0.30
PAY-1007,2023-10-29,Tan, J.,100.00,Credit Card,0.30
PAY-1008,2023-10-30,David Chen,5500.00,PayNow,0.00
PAY-1009,2023-10-30,Emily Griffin,30.00,PayPal,0.25
PAY-1011,2023-11-01,Michael Ho,200.00,Credit Card,0.30
`;

  const sourceB = `Record ID,Posting Date,Description,Amount,Donor,GST Flag,Over 5k Flag
ACC-501,2023-10-27,Donation from J. Tan,100.00,Tan, John,FALSE,FALSE
ACC-502,2023-10-27,Donation via PayPal,49.75,Wei Lim,FALSE,FALSE
ACC-503,2023-10-27,PayNow Donation,250.00,Siti B. Ahmad,FALSE,FALSE
ACC-504,2023-10-28,Online Donation CC,75.20,R Kumar,FALSE,FALSE
ACC-505,2023-10-28,Donation - C. Ong,1000.00,Ong, Cheryl,FALSE,FALSE
ACC-506,2023-10-29,General Donation,50.00,Unknown,FALSE,FALSE
ACC-507,2023-10-29,Donation - John T,99.70,J. Tan,FALSE,FALSE
ACC-508,2023-10-30,PN54321,5500.00,Chen, David,FALSE,TRUE
ACC-510,2023-11-01,Donation from SG Gives,150.00,SG Gives,FALSE,FALSE
ACC-511,2023-11-02,Donation M. Ho,200.00,Ho, Michael,FALSE,FALSE
`;

  return { sourceA, sourceB };
};
