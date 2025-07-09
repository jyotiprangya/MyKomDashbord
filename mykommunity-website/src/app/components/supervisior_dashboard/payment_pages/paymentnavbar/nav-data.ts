import { INavbarData } from "./helper";

export const navbarData:INavbarData[]=[
   
    {
        routeLink:'dashboard',
        icon:'dashboard',
        label:'Dashboard'
    },
{
    routeLink:'rentalunitsetup',
    icon:'house',
    label:'HousingUnit Setup'
},
{
    routeLink: 'account',
    icon: 'real_estate_agent',
    label: 'Payment Setup',
    items: [
      { routeLink: 'account', label: ' Society Account' },
      { routeLink: 'gl', label: 'General Ledger' },
      { routeLink: 'chartoa', label: 'Chart Of Account' },
  
      // Add more dropdown items as needed
    ]
    
  },
  {
    routeLink: 'chargelist',
    icon: 'receipt_long',
    label: 'Billing',
    items: [
      { routeLink: 'chargelist', label: 'Charge List' },
      { routeLink: 'allocatecharge', label: 'Allocate Charges' },
  
      // Add more dropdown items as needed
    ]
    
  },
{
    routeLink:'payment',
    icon:'paid',
    label:'Payment Overview'
},
{
    routeLink:'paymentintimation',
    icon:'event_note',
    label:'Payment Intimation'
},
{
  routeLink:'invoicehistory',
  icon:'home_work',
  label:'Invoice History'
},
{
    routeLink: 'vendorlist',
    icon: 'bubble_chart',
    label: 'Vendor',
    items: [
      { routeLink: 'vendorlist', label: 'Vendor List' },
      { routeLink: 'vendorbooking', label: 'Vendor Booking' },
      { routeLink: 'vendorreportdate', label: 'Vendor Report' },
  
      // Add more dropdown items as needed
    ]
    
  },
  {
    routeLink: 'cashbanktransfer',
    icon: 'account_balance',
    label: 'Cash/Bank Transfer',
    
  }, 
{
    routeLink:'generalpayment',
    icon:'wb_shade',
    label:'General Payment'
},
{
    routeLink:'bankreconcilation',
    icon:'payments',
    label:'Bank Reconcilation'
},
{
  routeLink: 'budget',
  icon: 'savings',
  label: 'Budgets',
 
  
}, 



]