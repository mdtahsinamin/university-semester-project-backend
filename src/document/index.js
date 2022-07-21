module.exports = (order) => {
  const rows = order[0].orderItems?.map(
    (item) => `
   <tr>
     <td>${item.title}</td>
     <td>${item.price}</td>
     <td>${item.quantity}</td>
   </tr>
 `
  );

  const createTable = (rows) => `
   <table>
     <tr>
        <th>Product Name</td>
        <th>Price</td>
        <th>quantity</td>
    </tr>
    ${rows}
  </table>
`;
  const table = createTable(rows);

  return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
               table {
                  font-family: arial, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
               }
               
               td, th {
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
               }
               
               tr:nth-child(even) {
                  background-color: #dddddd;
               }
               .justify-center {
                  text-align: center;
               }
               .invoice-box {
                  max-width: 800px;
                  margin: auto;
                  padding: 30px;
                  border: 1px solid #eee;
                  box-shadow: 0 0 10px rgba(0, 0, 0, .15);
                  font-size: 16px;
                  line-height: 24px;
                  font-family: 'Helvetica Neue', 'Helvetica',
                  color: #555;
                  }
          </style>
       </head>
       <body>
          <div class="invoice-box">
             <table cellpadding="0" cellspacing="0">
                <tr class="top">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td class="title"><img  src="https://i.ibb.co/41kCMLP/logo.png"
                               style="width:100%; max-width:156px;"></td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="information">
                   <td colspan="2">
                      <table>
                         <tr>
                            <p>
                               Customer email: ${order[0].email} 
                            </p>
                            <p>
                               Pay At: ${order[0].paidAt}
                            </p>
                             <br/>
                            <p>
                             Address: ${order[0].shippingInfo.address}
                           </p>
                         </tr>
                      </table>
                   </td>
                </tr>
             </table>
             <br />
             <h1 class="justify-center">Total price:${order[0].totalPrice}</h1>
             <h3 class="justify-center">Payment: ${order[0].paymentInfo?.status}</h3>
             <h3 class="justify-center">Order Status: ${order[0].orderStatus}</h3>
          </div>
       </body>
    </html>
    `;
};
