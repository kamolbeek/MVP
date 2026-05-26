import { User, MasterProfile, Category, Review } from "@/types";

// ==========================================
// Categories - 10 ta kategoriya
// ==========================================
export const categories: Category[] = [
  { id: "cat-1", name: "Santexnik", icon: "🔧", slug: "santexnik" },
  { id: "cat-2", name: "Elektrik", icon: "⚡", slug: "elektrik" },
  { id: "cat-3", name: "Duradgor", icon: "🪚", slug: "duradgor" },
  { id: "cat-4", name: "Dasturchi", icon: "💻", slug: "dasturchi" },
  { id: "cat-5", name: "Videograf", icon: "🎬", slug: "videograf" },
  { id: "cat-6", name: "Dizayner", icon: "🎨", slug: "dizayner" },
  { id: "cat-7", name: "Bo'yoqchi", icon: "🖌️", slug: "boyoqchi" },
  { id: "cat-8", name: "Payvandchi", icon: "🔥", slug: "payvandchi" },
  { id: "cat-9", name: "Chilangar", icon: "🔑", slug: "chilangar" },
  { id: "cat-10", name: "Repetitor", icon: "📚", slug: "repetitor" },
];

// ==========================================
// Master Users - 10 ta usta
// ==========================================
export const masterUsers: User[] = [
  { id: "m-1", name: "Jasur Karimov", phone: "+998901234567", email: "jasur@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasur", createdAt: "2024-01-15" },
  { id: "m-2", name: "Bobur Toshmatov", phone: "+998901234568", email: "bobur@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bobur", createdAt: "2024-02-10" },
  { id: "m-3", name: "Sardor Rahimov", phone: "+998901234569", email: "sardor@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sardor", createdAt: "2024-01-20" },
  { id: "m-4", name: "Sherzod Aliyev", phone: "+998901234570", email: "sherzod@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sherzod", createdAt: "2024-03-05" },
  { id: "m-5", name: "Anvar Qodirov", phone: "+998901234571", email: "anvar@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anvar", createdAt: "2024-02-28" },
  { id: "m-6", name: "Dilshod Nazarov", phone: "+998901234572", email: "dilshod@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dilshod", createdAt: "2024-04-12" },
  { id: "m-7", name: "Rustam Sobirov", phone: "+998901234573", email: "rustam@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rustam", createdAt: "2024-01-08" },
  { id: "m-8", name: "Farhod Umarov", phone: "+998901234574", email: "farhod@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhod", createdAt: "2024-05-01" },
  { id: "m-9", name: "Otabek Mirzayev", phone: "+998901234575", email: "otabek@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Otabek", createdAt: "2024-03-18" },
  { id: "m-10", name: "Nodir Xasanov", phone: "+998901234576", email: "nodir@mail.uz", role: "master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nodir", createdAt: "2024-02-14" },
];

// ==========================================
// Client Users - 5 ta mijoz
// ==========================================
export const clientUsers: User[] = [
  { id: "c-1", name: "Aziza Yusupova", phone: "+998901111111", email: "aziza@mail.uz", role: "client", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aziza", createdAt: "2024-03-01" },
  { id: "c-2", name: "Madina Karimova", phone: "+998901111112", email: "madina@mail.uz", role: "client", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Madina", createdAt: "2024-03-15" },
  { id: "c-3", name: "Bekzod Tursunov", phone: "+998901111113", email: "bekzod@mail.uz", role: "client", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bekzod", createdAt: "2024-04-01" },
  { id: "c-4", name: "Nilufar Abdullayeva", phone: "+998901111114", email: "nilufar@mail.uz", role: "client", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar", createdAt: "2024-04-20" },
  { id: "c-5", name: "Jamshid Ergashev", phone: "+998901111115", email: "jamshid@mail.uz", role: "client", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamshid", createdAt: "2024-05-10" },
];

// ==========================================
// Master Profiles - 10 ta usta profili
// ==========================================
export const masterProfiles: MasterProfile[] = [
  {
    id: "mp-1", userId: "m-1", bio: "10 yillik tajribaga ega professional santexnik. Har qanday murakkablikdagi santexnika ishlarini bajaraman.",
    categories: ["cat-1"], rating: 4.8, reviewCount: 45, isAvailable: true, experience: 10,
    hourlyRate: 80000, workHours: "Du-Sha: 08:00-20:00",
    location: { lat: 41.3111, lng: 69.2797, address: "Yunusobod tumani, 7-mavze", city: "Toshkent", region: "Toshkent shahri", district: "Yunusobod" },
    portfolio: ["/portfolio/santexnik-1.svg", "/portfolio/santexnik-2.svg"],
  },
  {
    id: "mp-2", userId: "m-2", bio: "Sifatli va ishonchli elektr montaj ishlari. Kvartira va ofislar uchun to'liq elektr ta'minoti.",
    categories: ["cat-2"], rating: 4.6, reviewCount: 38, isAvailable: true, experience: 7,
    hourlyRate: 100000, workHours: "Du-Sha: 09:00-18:00",
    location: { lat: 41.2855, lng: 69.2044, address: "Chilonzor tumani, 10-kvartal", city: "Toshkent", region: "Toshkent shahri", district: "Chilonzor" },
    portfolio: ["/portfolio/elektrik-1.svg", "/portfolio/elektrik-2.svg"],
  },
  {
    id: "mp-3", userId: "m-3", bio: "Professional duradgor — mebel yasash, ta'mirlash va o'rnatish. Buyurtmachi xohishiga ko'ra ishlash.",
    categories: ["cat-3"], rating: 4.9, reviewCount: 52, isAvailable: false, experience: 12,
    hourlyRate: 120000, workHours: "Du-Ju: 09:00-18:00",
    location: { lat: 41.3385, lng: 69.3346, address: "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li", city: "Toshkent", region: "Toshkent shahri", district: "Mirzo Ulug'bek" },
    portfolio: ["/portfolio/duradgor-1.svg", "/portfolio/duradgor-2.svg"],
  },
  {
    id: "mp-4", userId: "m-4", bio: "Full-stack dasturchi. React, Next.js, Node.js texnologiyalarida veb va mobil ilovalar yarataman.",
    categories: ["cat-4"], rating: 4.7, reviewCount: 29, isAvailable: true, experience: 5,
    hourlyRate: 200000, workHours: "Har kuni: 10:00-22:00",
    location: { lat: 41.3045, lng: 69.2511, address: "Shayxontohur tumani, Navoiy ko'chasi", city: "Toshkent", region: "Toshkent shahri", district: "Shayxontohur" },
    portfolio: ["/portfolio/dasturchi-1.svg"],
  },
  {
    id: "mp-5", userId: "m-5", bio: "Professional videograf. To'ylar, tadbirlar va reklama videolarini suratga olaman.",
    categories: ["cat-5"], rating: 4.5, reviewCount: 33, isAvailable: true, experience: 6,
    hourlyRate: 150000, workHours: "Du-Ya: 09:00-20:00",
    location: { lat: 41.2965, lng: 69.2782, address: "Yakkasaroy tumani, Bobur ko'chasi", city: "Toshkent", region: "Toshkent shahri", district: "Yakkasaroy" },
    portfolio: ["/portfolio/videograf-1.svg", "/portfolio/videograf-2.svg"],
  },
  {
    id: "mp-6", userId: "m-6", bio: "Grafik va UI/UX dizayner. Logotip, brending, veb-sayt va mobil ilova dizaynlari.",
    categories: ["cat-6"], rating: 4.8, reviewCount: 41, isAvailable: true, experience: 8,
    hourlyRate: 180000, workHours: "Du-Ju: 10:00-19:00",
    location: { lat: 41.3111, lng: 69.2797, address: "Yunusobod tumani, 19-mavze", city: "Toshkent", region: "Toshkent shahri", district: "Yunusobod" },
    portfolio: ["/portfolio/dizayner-1.svg", "/portfolio/dizayner-2.svg"],
  },
  {
    id: "mp-7", userId: "m-7", bio: "Professional bo'yoqchi. Kvartira va ofis devorlarini bo'yash, dekorativ bo'yoq ishlari.",
    categories: ["cat-7"], rating: 4.3, reviewCount: 27, isAvailable: false, experience: 9,
    hourlyRate: 70000, workHours: "Du-Sha: 08:00-18:00",
    location: { lat: 41.2855, lng: 69.2044, address: "Chilonzor tumani, 3-kvartal", city: "Toshkent", region: "Toshkent shahri", district: "Chilonzor" },
    portfolio: ["/portfolio/boyoqchi-1.svg"],
  },
  {
    id: "mp-8", userId: "m-8", bio: "Tajribali payvandchi. Metall konstruksiyalar, darvozalar, panjaralar yasash va ta'mirlash.",
    categories: ["cat-8"], rating: 4.6, reviewCount: 35, isAvailable: true, experience: 11,
    hourlyRate: 100000, workHours: "Du-Sha: 08:00-20:00",
    location: { lat: 41.3385, lng: 69.3346, address: "Mirzo Ulug'bek tumani, Temur ko'chasi", city: "Toshkent", region: "Toshkent shahri", district: "Mirzo Ulug'bek" },
    portfolio: ["/portfolio/payvandchi-1.svg", "/portfolio/payvandchi-2.svg"],
  },
  {
    id: "mp-9", userId: "m-9", bio: "Professional chilangar. Eshik qulflari, avtomobil kalitlari va seyf ochish xizmati.",
    categories: ["cat-9"], rating: 4.4, reviewCount: 22, isAvailable: true, experience: 4,
    hourlyRate: 60000, workHours: "Har kuni: 08:00-22:00",
    location: { lat: 41.3045, lng: 69.2511, address: "Shayxontohur tumani, Zarqaynar", city: "Toshkent", region: "Toshkent shahri", district: "Shayxontohur" },
    portfolio: ["/portfolio/chilangar-1.svg"],
  },
  {
    id: "mp-10", userId: "m-10", bio: "Matematika va fizika fanlari bo'yicha tajribali repetitor. DTM ga tayyorlov kurslari.",
    categories: ["cat-10"], rating: 4.9, reviewCount: 48, isAvailable: true, experience: 15,
    hourlyRate: 90000, workHours: "Du-Sha: 09:00-21:00",
    location: { lat: 41.2965, lng: 69.2782, address: "Yakkasaroy tumani, Shota Rustaveli", city: "Toshkent", region: "Toshkent shahri", district: "Yakkasaroy" },
    portfolio: ["/portfolio/repetitor-1.svg"],
  },
];

// ==========================================
// Reviews - 20 ta sharh
// ==========================================
export const reviews: Review[] = [
  { id: "r-1", masterId: "m-1", clientId: "c-1", clientName: "Aziza Yusupova", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aziza", rating: 5, comment: "Juda zo'r usta! Hammasi tez va sifatli bajarildi. Tavsiya qilaman!", createdAt: "2024-06-01" },
  { id: "r-2", masterId: "m-1", clientId: "c-2", clientName: "Madina Karimova", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Madina", rating: 5, comment: "Santexnika ishlarini a'lo darajada bajardilar. Rahmat!", createdAt: "2024-06-05" },
  { id: "r-3", masterId: "m-2", clientId: "c-3", clientName: "Bekzod Tursunov", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bekzod", rating: 4, comment: "Yaxshi usta, lekin biroz kech keldi. Ish sifati a'lo.", createdAt: "2024-06-10" },
  { id: "r-4", masterId: "m-2", clientId: "c-4", clientName: "Nilufar Abdullayeva", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar", rating: 5, comment: "Elektr simlarini professional tarzda almashtirib berdi.", createdAt: "2024-06-12" },
  { id: "r-5", masterId: "m-3", clientId: "c-1", clientName: "Aziza Yusupova", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aziza", rating: 5, comment: "Oshxona mebelini buyurtma qildim. Natija kutganimdan ham yaxshi!", createdAt: "2024-06-15" },
  { id: "r-6", masterId: "m-3", clientId: "c-5", clientName: "Jamshid Ergashev", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamshid", rating: 5, comment: "Yog'och bilan ishlash mahorati yuqori. Mebel sifatli chiqdi.", createdAt: "2024-06-18" },
  { id: "r-7", masterId: "m-4", clientId: "c-2", clientName: "Madina Karimova", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Madina", rating: 5, comment: "Biznesim uchun ajoyib veb-sayt yaratdi. Professional yondashuv!", createdAt: "2024-06-20" },
  { id: "r-8", masterId: "m-4", clientId: "c-3", clientName: "Bekzod Tursunov", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bekzod", rating: 4, comment: "Mobil ilova yaxshi ishlaydi, bir-ikki xatolik bor edi, tuzatib berdi.", createdAt: "2024-06-22" },
  { id: "r-9", masterId: "m-5", clientId: "c-4", clientName: "Nilufar Abdullayeva", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar", rating: 5, comment: "To'yimizni juda chiroyli suratga oldi. Xotiralar uchun rahmat!", createdAt: "2024-06-25" },
  { id: "r-10", masterId: "m-5", clientId: "c-1", clientName: "Aziza Yusupova", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aziza", rating: 4, comment: "Reklama videosi zo'r chiqdi. Montaj ham professional.", createdAt: "2024-06-28" },
  { id: "r-11", masterId: "m-6", clientId: "c-5", clientName: "Jamshid Ergashev", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamshid", rating: 5, comment: "Kompaniyamiz uchun ajoyib logotip yaratdi. Juda ijodiy!", createdAt: "2024-07-01" },
  { id: "r-12", masterId: "m-6", clientId: "c-2", clientName: "Madina Karimova", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Madina", rating: 5, comment: "UI dizayn juda zamonaviy va foydalanuvchilarga qulay.", createdAt: "2024-07-03" },
  { id: "r-13", masterId: "m-7", clientId: "c-3", clientName: "Bekzod Tursunov", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bekzod", rating: 4, comment: "Devorlarni chiroyli bo'yab berdi. Rang tanlashda yordam berdi.", createdAt: "2024-07-05" },
  { id: "r-14", masterId: "m-7", clientId: "c-4", clientName: "Nilufar Abdullayeva", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar", rating: 4, comment: "Ish sifati yaxshi, vaqtida tugatdi. Tavsiya qilaman.", createdAt: "2024-07-07" },
  { id: "r-15", masterId: "m-8", clientId: "c-1", clientName: "Aziza Yusupova", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aziza", rating: 5, comment: "Darvoza yasab berdi, juda chiroyli va mustahkam chiqdi!", createdAt: "2024-07-10" },
  { id: "r-16", masterId: "m-8", clientId: "c-5", clientName: "Jamshid Ergashev", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamshid", rating: 5, comment: "Panjara ishlarini zo'r bajardi. Sifat va narx mos.", createdAt: "2024-07-12" },
  { id: "r-17", masterId: "m-9", clientId: "c-2", clientName: "Madina Karimova", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Madina", rating: 4, comment: "Eshik qulfini tez va sifatli almashtirib berdi.", createdAt: "2024-07-14" },
  { id: "r-18", masterId: "m-9", clientId: "c-3", clientName: "Bekzod Tursunov", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bekzod", rating: 5, comment: "Avtomobil kalitini yo'qotgan edim, tezda dublikat yasab berdi.", createdAt: "2024-07-16" },
  { id: "r-19", masterId: "m-10", clientId: "c-4", clientName: "Nilufar Abdullayeva", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar", rating: 5, comment: "Bolam matematikadan DTMga tayyorlandi, natija a'lo!", createdAt: "2024-07-18" },
  { id: "r-20", masterId: "m-10", clientId: "c-5", clientName: "Jamshid Ergashev", clientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamshid", rating: 5, comment: "Eng yaxshi repetitor! Fizikadan bilimim ancha oshdi.", createdAt: "2024-07-20" },
];

// ==========================================
// 420 Generated Masters (14 viloyat × 10 kasb × 3 master)
// ==========================================

const _FIRST: string[] = [
  "Jasur","Bobur","Sardor","Sherzod","Anvar","Dilshod","Rustam","Farhod","Otabek","Nodir",
  "Ulugbek","Sanjar","Behruz","Eldor","Kamol","Timur","Mirzo","Alisher","Hamza","Doniyor",
  "Zafar","Jahongir","Mansur","Ravshan","Bahodir","Ilhom","Murod","Nozim","Orif","Parviz",
  "Rauf","Suxrob","Tohir","Umid","Xurshid","Azizjon","Bekzod","Dostonbek","Elbek","Farrux",
  "Komil","Laziz","Muzaffar","Nuriddin","Oybek","Sarvar","Baxtiyor","Davron","Erkin","Furqat",
  "Islom","Javlon","Mahmudbek","Navruz","Temurali","Shohruh","Ibrohim","Hamid","Lochinbek","Nurbek",
];

const _LAST: string[] = [
  "Karimov","Rahimov","Xasanov","Yusupov","Mirzayev","Toshmatov","Ergashev","Aliyev","Nazarov","Sobirov",
  "Qodirov","Umarov","Abdullayev","Tursunov","Xolmatov","Botirov","Haydarov","Yo'ldoshev","Zokirov","Tillayev",
  "Mamatov","Holiqov","Ismoilov","Jalolov","Kenjayev","Latipov","Mo'minov","Nishonov","Ortiqov","Qosimov",
  "Sotvoldiyev","Tojimatov","Usmonov","Valiyev","Xo'jayev","Yunusov","Zaripov","Atajonov","Baxtiyorov","Choriyev",
  "Dusmatov","Eshmatov","Fayzullayev","G'aniyev","Hamidov","Ibragimov","Normatov","Raximov","Sultonov","Tojiboyev",
];

interface _RegionGen { region: string; districts: [string, string, string]; lat: number; lng: number; }
const _REGIONS: _RegionGen[] = [
  // district[0]=cat-1,4,7,10 | district[1]=cat-2,5,8 | district[2]=cat-3,6,9
  { region:"Toshkent shahri",         districts:["Chilonzor","Yunusobod","Mirzo Ulug'bek"],   lat:41.283,lng:69.204 },
  { region:"Toshkent viloyati",        districts:["Yangiyo'l","Qibray","Zangiota"],            lat:41.113,lng:69.045 },
  { region:"Samarqand viloyati",       districts:["Samarqand tumani","Urgut","Kattaqo'rg'on"], lat:39.649,lng:66.975 },
  { region:"Farg'ona viloyati",        districts:["Farg'ona tumani","Rishton","Oltiariq"],      lat:40.384,lng:71.787 },
  { region:"Andijon viloyati",         districts:["Asaka","Shahrixon","Marhamat"],              lat:40.636,lng:72.238 },
  { region:"Namangan viloyati",        districts:["Namangan tumani","Pop","Chortoq"],           lat:40.990,lng:71.679 },
  { region:"Buxoro viloyati",          districts:["Buxoro tumani","G'ijduvon","Romitan"],       lat:39.767,lng:64.421 },
  { region:"Xorazm viloyati",          districts:["Urganch tumani","Xiva tumani","Shovot"],     lat:41.551,lng:60.621 },
  { region:"Qashqadaryo viloyati",     districts:["Shahrisabz tumani","Qarshi tumani","Kitob"], lat:39.137,lng:66.877 },
  { region:"Surxondaryo viloyati",     districts:["Termiz tumani","Denov","Boysun"],            lat:37.224,lng:67.278 },
  { region:"Jizzax viloyati",          districts:["Jizzax tumani","Zafarobod","G'allaorol"],    lat:40.121,lng:67.835 },
  { region:"Sirdaryo viloyati",        districts:["Guliston tumani","Boyovut","Sardoba"],       lat:40.489,lng:68.784 },
  { region:"Navoiy viloyati",          districts:["Navoiy tumani","Nurota","Karmana"],          lat:40.089,lng:65.378 },
  { region:"Qoraqalpog'iston Respublikasi", districts:["Nukus tumani","Beruniy","Qo'ng'irot"], lat:42.461,lng:59.613 },
];

const _BIOS: Record<string,(d:string,e:number)=>string> = {
  "cat-1": (d,e)=>`${e} yillik santexnik. ${d}da quvur, kran va sanitariya ishlarini professional bajaraman.`,
  "cat-2": (d,e)=>`${d}da elektr montaj va ta'mirlash. ${e} yildan beri kvartira va ofislarga xizmat ko'rsataman.`,
  "cat-3": (d,e)=>`Duradgorlik ustasi — ${d}. Mebel yasash, eshik-deraza ta'miri bo'yicha ${e} yil tajriba.`,
  "cat-4": (d,e)=>`Full-stack dasturchi. ${d}dan ishlaydi. Veb va mobil ilovalar yaratish bo'yicha ${e} yillik tajriba.`,
  "cat-5": (d,e)=>`${d} videografi. To'y, tadbir va reklama videolarini ${e} yildan beri professional suratga olaman.`,
  "cat-6": (d,e)=>`Grafik dizayner — ${d}. Logotip, brending va UI dizayn bo'yicha ${e} yil ish tajribasi.`,
  "cat-7": (d,e)=>`${d}da bo'yoqchi. Kvartira va ofislarni dekorativ bo'yash bo'yicha ${e} yillik tajriba.`,
  "cat-8": (d,e)=>`Payvandchi usta — ${d}. Metall konstruksiyalar, darvoza va panjaralar bo'yicha ${e} yil.`,
  "cat-9": (d,e)=>`${d}da chilangar xizmati. Qulf, kalit va eshik ochish bo'yicha ${e} yildan beri ishlayman.`,
  "cat-10":(d,e)=>`${d} repetitori. Matematika va fizikadan ${e} yildan beri DTM va maktab o'quvchilarini tayyorlayman.`,
};

const _RATES: Record<string,number[]> = {
  "cat-1":[60000,70000,80000,90000,100000],
  "cat-2":[70000,85000,100000,110000,120000],
  "cat-3":[80000,100000,120000,130000,150000],
  "cat-4":[150000,180000,200000,250000,300000],
  "cat-5":[100000,130000,150000,180000,200000],
  "cat-6":[100000,130000,150000,180000,200000],
  "cat-7":[50000,60000,70000,75000,80000],
  "cat-8":[80000,90000,100000,110000,120000],
  "cat-9":[50000,60000,65000,70000,80000],
  "cat-10":[60000,70000,80000,90000,100000],
};

const _HOURS = ["Du-Sha: 08:00-18:00","Du-Ju: 09:00-20:00","Har kuni: 08:00-22:00","Du-Sha: 09:00-18:00","Har kuni: 09:00-21:00"];
const _CAT_IDS = ["cat-1","cat-2","cat-3","cat-4","cat-5","cat-6","cat-7","cat-8","cat-9","cat-10"];

function _buildGeneratedMasters():{users:User[];profiles:MasterProfile[]} {
  const users:User[] = [];
  const profiles:MasterProfile[] = [];
  let idx = 11;
  let ni = 0;

  _REGIONS.forEach(({ region, districts, lat, lng }, ri) => {
    _CAT_IDS.forEach((catId, ci) => {
      const district = districts[ci % 3];
      for (let k = 0; k < 3; k++) {
        const fn = _FIRST[ni % _FIRST.length];
        const ln = _LAST[(ni * 7 + Math.floor(ni / _FIRST.length) * 11) % _LAST.length];
        const name = `${fn} ${ln}`;
        const id = `m-${idx}`;
        const exp = 1 + ((ri * 30 + ci * 3 + k) % 14);
        const rating = parseFloat((4.0 + (ni % 10) * 0.1).toFixed(1));
        const reviewCount = 5 + ((ri * 13 + ci * 7 + k * 3) % 56);
        const rates = _RATES[catId];
        const hourlyRate = rates[(ni + ri + ci) % rates.length];
        const isAvailable = (ni + ri + ci) % 5 !== 0;
        const pfx = [90,91,93,94,95,97,98,99][idx % 8];
        const phone = `+998${pfx}${String(10000000 + idx).slice(1)}`;
        const month = String(1 + ni % 9).padStart(2,"0");
        const day   = String(10 + ni % 19).padStart(2,"0");

        users.push({
          id, name, phone,
          email:`${fn.toLowerCase()}${idx}@mail.uz`,
          role:"master",
          avatar:`https://api.dicebear.com/7.x/avataaars/svg?seed=${fn}${idx}`,
          createdAt:`2024-${month}-${day}`,
        });
        profiles.push({
          id:`mp-${idx}`, userId:id,
          bio:_BIOS[catId](district, exp),
          categories:[catId],
          rating, reviewCount, isAvailable, experience:exp,
          hourlyRate,
          workHours:_HOURS[(ri + ci + k) % _HOURS.length],
          location:{
            lat: parseFloat((lat + (ni % 10) * 0.005).toFixed(4)),
            lng: parseFloat((lng + (ni % 10) * 0.005).toFixed(4)),
            address:`${district}, ${1 + ni % 99}-uy`,
            city: region.split(" ")[0],
            region, district,
          },
          portfolio:[],
        });
        idx++; ni++;
      }
    });
  });
  return { users, profiles };
}

const { users: _genUsers, profiles: _genProfiles } = _buildGeneratedMasters();

export const allMasterUsers: User[]           = [...masterUsers,   ..._genUsers];
export const allMasterProfiles: MasterProfile[] = [...masterProfiles, ..._genProfiles];

// ==========================================
// Helper Functions
// ==========================================
export function getMasterWithProfile(masterId: string) {
  const user    = allMasterUsers.find((u) => u.id === masterId);
  const profile = allMasterProfiles.find((p) => p.userId === masterId);
  if (!user || !profile) return null;
  return { ...user, profile };
}

export function getAllMastersWithProfiles() {
  return allMasterUsers.map((user) => {
    const profile = allMasterProfiles.find((p) => p.userId === user.id)!;
    return { ...user, profile };
  });
}

export function getReviewsByMaster(masterId: string) {
  return reviews.filter((r) => r.masterId === masterId);
}

export function getCategoryById(categoryId: string) {
  return categories.find((c) => c.id === categoryId);
}

export function getMastersByCategory(categorySlug: string) {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return getAllMastersWithProfiles().filter((m) =>
    m.profile.categories.includes(category.id)
  );
}

export function searchMasters(filters: {
  category?: string;
  district?: string;
  rating?: number;
  isAvailable?: boolean;
}) {
  let results = getAllMastersWithProfiles();

  if (filters.category) {
    results = results.filter((m) => m.profile.categories.includes(filters.category!));
  }
  if (filters.district) {
    results = results.filter((m) => m.profile.location.district === filters.district);
  }
  if (filters.rating) {
    results = results.filter((m) => m.profile.rating >= filters.rating!);
  }
  if (filters.isAvailable !== undefined) {
    results = results.filter((m) => m.profile.isAvailable === filters.isAvailable);
  }

  return results;
}
