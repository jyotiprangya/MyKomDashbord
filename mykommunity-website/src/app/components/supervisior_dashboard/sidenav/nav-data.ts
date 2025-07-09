import { INavbarData } from "./helper";

export const navbarData:INavbarData[]=[
    {
        routeLink:'dashboard',
        icon:'dashboard',
        label:'Dashboard'
    },
{
    routeLink:'user',
    icon:'people',
    label:'Users'
},

{
    routeLink:'vehicle',
    icon:'no_crash',
    label:'Vehicle'
},
{
    routeLink:'notice',
    icon:'event_note',
    label:'Notice Board'
},
{
  routeLink:'booking',
  icon:'home_work',
  label:'Amenity Booking'
},

  {
    routeLink: 'complain',
    icon: 'record_voice_over',
    label: 'Complaint List',
    
  }, 
{
    routeLink:'directory',
    icon:'groups_3',
    label:'Society Directory'
},
{
    routeLink:'security',
    icon:'security',
    label:'Security'
},
// {
//   routeLink: 'emergency',
//   icon: 'phone',
//   label: 'Emergency Dial',
 
  
// }, 
{
  routeLink: 'localservices',
  icon: 'badge',
  label: 'DailyHelp',
  
}, 

{
  routeLink:'society-dailyhelp',
  icon:'badge',
  label:'Society Staff'
},

{
routeLink:'activity',
icon:'schedule',
label:'Visitor Activity'
},

{
  routeLink:'sos-details',
  icon:'local_fire_department',
  label:'SOS Record'
},
{
  routeLink:'paymentdashboard/dashboard',
  icon:'currency_rupee',
  label:'Payment'
},
{
  routeLink:'supervisor-activity',
  icon:'schedule',
  label:'Supervisor Activity'
},
{
  routeLink: 'entry/exit-record',
  icon: 'playlist_add_check_circle',
  label: 'Entry-Exit Record',
  items: [
    { routeLink: 'visitorentryexit', label: ' Visitor Entry-Exit' },
    { routeLink: 'dailyhelpentryexit', label: 'DailyHelp Entry-Exit' },
    { routeLink: 'society-dailyhelp-entry-exit-record', label: 'Society-Staff Attendance' },

    // Add more dropdown items as needed
  ]
  
}, 

{
  routeLink: 'community-setup',
  icon: 'apartment',
  label: 'Community Setup',
  items: [
    { routeLink: 'society-setup', label: 'Society Details' },
    { routeLink: 'block', label: 'Block/ Building' },
    { routeLink: 'floor', label: 'Floor' },
    { routeLink: 'flat', label: 'Flat/HousingUnit' },
    { routeLink: 'gate', label: 'Gate' },
    { routeLink: 'housetype', label: 'HouseType' },

    { routeLink: 'amenity', label: 'Amenity Category' },
    { routeLink: 'complainCategory', label: ' Complaint Category' },
    { routeLink: 'emergencyCategory', label: ' Emergency Category' },
    { routeLink: 'emergency', label: ' Emergency Contact' },
    { routeLink: 'sos', label: 'SOS Type' },
    { routeLink: 'servicecategory', label: ' DailyHelp Category' },
    { routeLink: 'qrcode', label: ' QRCode' },
    { routeLink: 'shift-setup', label: ' Shift SetUp' },
    { routeLink: 'shift-assignment-setup', label: ' Shift Assignment' },
    { routeLink: 'qrcode-status', label: ' QRCode Status' },
    // Add more dropdown items as needed
  ]
  
}, 


]