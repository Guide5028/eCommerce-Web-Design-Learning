// employeeId of the placeholder "Online Store" employee row -- pos-api's `sale.employee_id`
// is NOT NULL (every sale is attributed to whoever rang it up), so a self-service checkout
// by a logged-in *customer* (who has no employeeId of their own) is attributed to this
// account instead. It has no password and is disabled, so it can never actually log in --
// it only exists as a checkout attribution target. See CheckoutPage.jsx.
//
export const ONLINE_STORE_EMPLOYEE_ID = 10;
