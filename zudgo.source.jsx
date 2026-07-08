import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
/* ═══════════════════════════════════════════════════════════════════
   ZOOD v9  — CartoDB Voyager · Геолокация · Мультиточки · Межгород
   ═══════════════════════════════════════════════════════════════════ */

const R="#00B341",RD="#008C32",RL="#E8F9EE";
const NV="#0D1B2A",NM="#1B2E42",BL="#1565C0",BLL="#E8F2FF";
const GR="#1B7A3D",GRL="#E8F5E9";
const DK="#111827",SL="#374151",GY="#6B7280",MG="#9CA3AF";
const BD="#E5E7EB",BG="#F8F7F4",WH="#FFFFFF";
const GD="#D97706",GDL="#FEF3C7";
const ADM="#0F172A",ADMA="#3B82F6",ADML="#EFF6FF";
const DSP="#1C1917",DSPA="#F97316",DSPL="#FFF7ED";

// ── Partner map coords (реальные, Душанбе) ───────────────────────
const DUSH_PARTNERS=[
  {e:"🍛",col:"#C42B0A",lat:38.5549,lng:68.7736,name:"Рохат",sub:"Таджикская · 25-40 мин"},
  {e:"🏛️",col:"#2460A7",lat:38.5571,lng:68.7845,name:"Shah Abbas",sub:"Персидская · 30-45 мин"},
  {e:"🍕",col:"#C94010",lat:38.5530,lng:68.7800,name:"Шарк Пицца",sub:"Пицца · 20-30 мин"},
  {e:"🛒",col:"#2E7D32",lat:38.5620,lng:68.7810,name:"Корвон Маркет",sub:"Супермаркет · 30-45 мин"},
  {e:"💊",col:"#00838F",lat:38.5640,lng:68.7755,name:"Аптека Фараш",sub:"24/7 · 25-40 мин"},
  {e:"⛽",col:"#D97706",lat:38.5600,lng:68.7720,name:"Газпромнефть",sub:"АЗС №12"},
  {e:"🏪",col:"#7B1FA2",lat:38.5558,lng:68.7758,name:"Мир Сладостей",sub:"Кондитерская"},
];

// ── Catalog ────────────────────────────────────────────────────────
const CATALOG={
  rohot:{id:"rohot",t:"restaurant",name:"Рохат",sub:"Таджикская · Узбекская",r:4.9,rev:"2.8к",time:"25–40",fee:8,min:25,open:true,g:[RD,R],e:"🍛",
    cats:["Первые блюда","Мясо и гриль","Хлеб","Напитки"],
    items:[
      {id:"r1",cat:"Первые блюда",name:"Шурбо из баранины",d:"Баранина, нут, овощи",p:18,e:"🍲",hit:1},
      {id:"r2",cat:"Первые блюда",name:"Мастоба",d:"Рис, зелень",p:15,e:"🥣"},
      {id:"r3",cat:"Мясо и гриль",name:"Кабоби дамба",d:"5 шампуров баранины",p:42,e:"🍖",hit:1},
      {id:"r4",cat:"Мясо и гриль",name:"Плов душанбинский",d:"Баранина, нут, морковь",p:30,e:"🍚",hit:1},
      {id:"r5",cat:"Хлеб",name:"Нони тандир",d:"Горячая лепёшка",p:4,e:"🫓",hit:1},
      {id:"r6",cat:"Напитки",name:"Зелёный чай (чайник)",d:"500 мл",p:7,e:"🍵"},
    ]},
  shah:{id:"shah",t:"restaurant",name:"Shah Abbas",sub:"Персидская",r:4.7,rev:"1.2к",time:"30–45",fee:10,min:30,open:true,g:["#1A3A5C","#2460A7"],e:"🏛️",
    cats:["Закуски","Горячее","Рыба"],
    items:[
      {id:"s1",cat:"Закуски",name:"Салат Ширази",d:"Огурцы, помидоры, лайм",p:14,e:"🥗",hit:1},
      {id:"s2",cat:"Горячее",name:"Жуджех кабаб",d:"Шашлык из курицы",p:35,e:"🍗",hit:1},
      {id:"s3",cat:"Рыба",name:"Форель на мангале",d:"Лимон, травы",p:52,e:"🐟",hit:1},
    ]},
  korv:{id:"korv",t:"store",bike:true,name:"Корвон Маркет",sub:"Супермаркет",r:4.7,rev:"3.2к",time:"30–45",fee:10,min:30,open:true,g:["#1B5E20","#2E7D32"],e:"🛒",
    cats:["Фрукты","Молочные","Мясо","Бакалея"],
    items:[
      {id:"g1",cat:"Фрукты",name:"Гранат 1 кг",d:"Таджикский",p:8,e:"🍎",hit:1},
      {id:"g2",cat:"Молочные",name:"Катык 0,5 л",d:"Йогурт",p:11,e:"🫙",hit:1},
      {id:"g3",cat:"Мясо",name:"Говядина охл. 1 кг",d:"",p:55,e:"🥩",hit:1},
      {id:"g4",cat:"Бакалея",name:"Рис «Девзира» 1 кг",d:"Для плова",p:15,e:"🌾",hit:1},
    ]},
  farash:{id:"farash",t:"pharmacy",bike:true,name:"Аптека Фараш",sub:"24/7",r:4.9,rev:"2.1к",time:"25–40",fee:10,min:10,open:true,g:["#004D5C","#00838F"],e:"💊",
    cats:["Болеутоляющие","Витамины","Детское","Гигиена"],
    items:[
      {id:"m1",cat:"Болеутоляющие",name:"Ибупрофен 400мг",d:"20 таб",p:15,e:"💊"},
      {id:"m2",cat:"Болеутоляющие",name:"Парацетамол 500мг",d:"",p:7,e:"💊"},
      {id:"m3",cat:"Витамины",name:"Витамин C шипучие",d:"500мг × 10",p:12,e:"🌿",hit:1},
      {id:"m4",cat:"Детское",name:"Нурофен детский 100мл",d:"Клубника",p:40,e:"🍓"},
    ]},
};
const MOCK_DRIVERS=[
  {id:"d1",name:"Акбар Д.",phone:"+992 93 111-22-33",rating:4.9,total:312,online:true,today:{orders:8,earn:87},status:"delivering",order:"o3"},
  {id:"d2",name:"Фируз К.",phone:"+992 90 444-55-66",rating:4.7,total:198,online:true,today:{orders:5,earn:55},status:"available",order:null},
  {id:"d3",name:"Зафар Т.",phone:"+992 88 777-88-99",rating:4.8,total:245,online:false,today:{orders:0,earn:0},status:"offline",order:null},
  {id:"d4",name:"Комил Р.",phone:"+992 77 222-33-44",rating:4.6,total:89,online:true,today:{orders:3,earn:32},status:"available",order:null},
];
const MOCK_PARTNERS=[
  {id:"rohot",name:"Рохат",type:"restaurant",city:"Душанбе",status:"active",orders:24,revenue:24450,rating:4.9},
  {id:"shah",name:"Shah Abbas",type:"restaurant",city:"Душанбе",status:"active",orders:12,revenue:11760,rating:4.7},
  {id:"korv",name:"Корвон Маркет",type:"store",city:"Душанбе",status:"active",orders:8,revenue:6200,rating:4.7},
  {id:"farash",name:"Аптека Фараш",type:"pharmacy",city:"Душанбе",status:"active",orders:15,revenue:4500,rating:4.9},
  {id:"p1",name:"Чойхона Нилуфар",type:"restaurant",city:"Худжанд",status:"pending",orders:0,revenue:0,rating:0},
  {id:"p2",name:"Дорухонаи Шифо",type:"pharmacy",city:"Душанбе",status:"pending",orders:0,revenue:0,rating:0},
];
const CAR_OPTIONS=[
  {id:"econom", label:"Эконом",  emoji:"🚗",time:"~2 мин",price:12,perKm:3,  base:5, col:"#0D47A1"},
  {id:"comfort",label:"Комфорт", emoji:"🚙",time:"~3 мин",price:20,perKm:4.5,base:8, col:"#1B5E20"},
  {id:"business",label:"Бизнес", emoji:"🚘",time:"~5 мин",price:32,perKm:7,  base:15,col:"#4A148C"},
];
const HELP_OPTIONS=[
  {id:"tire",name:"Подкачка шин",  emoji:"🔧",time:"15 мин",price:30},
  {id:"jump",name:"Зарядка авто",  emoji:"⚡",time:"20 мин",price:45},
  {id:"tow", name:"Буксировка",    emoji:"🚛",time:"25 мин",price:"80+"},
  {id:"fuel",name:"Бензин",        emoji:"⛽",time:"30 мин",price:25},
  {id:"wheel",name:"Замена колеса",emoji:"🔄",time:"20 мин",price:50},
];
const GAS_DATA=[
  {id:"g1",name:"Газпромнефть АЗС №12",addr:"пр. Рудаки, 125",dist:"0.8 км",open:true,fuels:[{t:"АИ-92",p:7.20},{t:"АИ-95",p:7.80},{t:"Дизель",p:6.90}]},
  {id:"g2",name:"ТАЛКО Нефть АЗС",addr:"ул. Айни, 34",dist:"1.2 км",open:true,fuels:[{t:"АИ-92",p:7.10},{t:"АИ-95",p:7.70},{t:"Дизель",p:6.80}]},
];

// ══════════════════════════════════════════════════════════════════
//  СОБСТВЕННЫЕ ЗНАЧКИ (SVG) — вместо эмодзи
// ══════════════════════════════════════════════════════════════════
function Icon({name,size=20,color="currentColor",style={}}){
  const s={width:size,height:size,display:"inline-block",verticalAlign:"middle",flexShrink:0,...style};
  const sw=2, p={fill:"none",stroke:color,strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round"};
  const paths={
    taxi:<g><path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11" {...p}/><rect x="3" y="11" width="18" height="6" rx="1.5" {...p}/><circle cx="7.5" cy="17.5" r="1.5" {...p}/><circle cx="16.5" cy="17.5" r="1.5" {...p}/><path d="M9 5V3.5h6V5" {...p}/></g>,
    car:<g><path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11" {...p}/><rect x="3" y="11" width="18" height="6" rx="1.5" {...p}/><circle cx="7.5" cy="17.5" r="1.5" {...p}/><circle cx="16.5" cy="17.5" r="1.5" {...p}/></g>,
    pin:<g><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" {...p}/><circle cx="12" cy="10" r="2.5" {...p}/></g>,
    home:<g><path d="M3 11l9-7 9 7" {...p}/><path d="M5 10v10h14V10" {...p}/><path d="M10 20v-6h4v6" {...p}/></g>,
    work:<g><rect x="3" y="7" width="18" height="13" rx="2" {...p}/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" {...p}/><path d="M3 13h18" {...p}/></g>,
    plane:<g><path d="M21 16v-2l-8-5V4a1.5 1.5 0 00-3 0v5l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-4.5z" {...p}/></g>,
    cart:<g><circle cx="9" cy="20" r="1.5" {...p}/><circle cx="17" cy="20" r="1.5" {...p}/><path d="M3 4h2l2.5 11.5a1 1 0 001 .8h8a1 1 0 001-.8L20 7H6" {...p}/></g>,
    food:<g><path d="M5 3v8a3 3 0 006 0V3" {...p}/><path d="M8 3v18" {...p}/><path d="M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v9" {...p}/></g>,
    pill:<g><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(45 12 12)" {...p}/><path d="M9 9l6 6" {...p}/></g>,
    shop:<g><path d="M4 9h16l-1 11H5L4 9z" {...p}/><path d="M4 9l1.5-5h13L20 9" {...p}/><path d="M9 13a3 3 0 006 0" {...p}/></g>,
    box:<g><path d="M3 8l9-4 9 4-9 4-9-4z" {...p}/><path d="M3 8v8l9 4 9-4V8" {...p}/><path d="M12 12v8" {...p}/></g>,
    truck:<g><rect x="2" y="7" width="12" height="9" rx="1" {...p}/><path d="M14 10h4l3 3v3h-7" {...p}/><circle cx="6" cy="17.5" r="1.5" {...p}/><circle cx="17" cy="17.5" r="1.5" {...p}/></g>,
    bike:<g><circle cx="6" cy="16" r="3.5" {...p}/><circle cx="18" cy="16" r="3.5" {...p}/><path d="M6 16l4-7h5l-3 7M10 9l-1.5-3H6" {...p}/><circle cx="15" cy="5.5" r="1" fill={color}/></g>,
    bus:<g><rect x="4" y="4" width="16" height="13" rx="2" {...p}/><path d="M4 11h16" {...p}/><circle cx="8" cy="20" r="1" {...p}/><circle cx="16" cy="20" r="1" {...p}/><path d="M6 17v2M18 17v2" {...p}/></g>,
    money:<g><rect x="2" y="6" width="20" height="12" rx="2" {...p}/><circle cx="12" cy="12" r="3" {...p}/><path d="M6 9v6M18 9v6" {...p}/></g>,
    card:<g><rect x="2" y="5" width="20" height="14" rx="2" {...p}/><path d="M2 9h20" {...p}/><path d="M6 14h4" {...p}/></g>,
    phone:<g><path d="M5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5V19a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" {...p}/></g>,
    chat:<g><path d="M4 5h16a1 1 0 011 1v9a1 1 0 01-1 1H9l-4 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z" {...p}/></g>,
    user:<g><circle cx="12" cy="8" r="4" {...p}/><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" {...p}/></g>,
    users:<g><circle cx="9" cy="8" r="3.5" {...p}/><path d="M2 19c0-3.5 3-5 7-5s7 1.5 7 5" {...p}/><path d="M16 5a3.5 3.5 0 010 7M22 19c0-3-1.5-4.5-4-5" {...p}/></g>,
    gift:<g><rect x="3" y="9" width="18" height="11" rx="1" {...p}/><path d="M3 9h18M12 9v11" {...p}/><path d="M12 9C9 9 7 7.5 7 6a2 2 0 014-.5C12 7 12 9 12 9zM12 9c3 0 5-1.5 5-3a2 2 0 00-4-.5C12 7 12 9 12 9z" {...p}/></g>,
    bolt:<g><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" {...p}/></g>,
    clock:<g><circle cx="12" cy="12" r="9" {...p}/><path d="M12 7v5l3 2" {...p}/></g>,
    shield:<g><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" {...p}/></g>,
    gas:<g><rect x="4" y="4" width="9" height="16" rx="1.5" {...p}/><path d="M4 11h9" {...p}/><path d="M13 8l4 1v8a2 2 0 01-4 0" {...p}/></g>,
    chart:<g><path d="M4 20V4M4 20h16" {...p}/><rect x="7" y="12" width="3" height="5" fill={color}/><rect x="12" y="8" width="3" height="9" fill={color}/><rect x="17" y="14" width="3" height="3" fill={color}/></g>,
    compass:<g><circle cx="12" cy="12" r="9" {...p}/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" {...p} fill={color} fillOpacity=".2"/></g>,
    refresh:<g><path d="M20 11a8 8 0 00-14-4M4 5v3h3M4 13a8 8 0 0014 4M20 19v-3h-3" {...p}/></g>,
    bell:<g><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8z" {...p}/><path d="M10.5 21a2 2 0 003 0" {...p}/></g>,
    fire:<g><path d="M12 22c4 0 7-3 7-7 0-4-3-6-3-9 0 0-2 2-3 4-1-2-1-5-1-6-3 2-7 5-7 11 0 4 3 7 6 7z" {...p}/></g>,
    target:<g><circle cx="12" cy="12" r="8" {...p}/><circle cx="12" cy="12" r="4" {...p}/><circle cx="12" cy="12" r="1" fill={color}/></g>,
    rocket:<g><path d="M12 3c3 1.5 5 5 5 9l-2.5 3h-5L7 12c0-4 2-7.5 5-9z" {...p}/><circle cx="12" cy="10" r="1.5" {...p}/><path d="M9.5 17L8 21M14.5 17L16 21" {...p}/></g>,
    check:<g><circle cx="12" cy="12" r="9" {...p}/><path d="M8 12l3 3 5-6" {...p}/></g>,
    flag:<g><path d="M5 21V4M5 4h11l-2 3 2 3H5" {...p}/></g>,
    map:<g><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" {...p}/><path d="M9 4v14M15 6v14" {...p}/></g>,
    sleep:<g><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" {...p}/><path d="M9 9h3l-3 4h3" {...p}/></g>,
    globe:<g><circle cx="12" cy="12" r="9" {...p}/><path d="M3 12h18M12 3c2.5 2.5 2.5 16 0 18M12 3c-2.5 2.5-2.5 16 0 18" {...p}/></g>,
    settings:<g><circle cx="12" cy="12" r="3" {...p}/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" {...p}/></g>,
    edit:<g><path d="M4 20h4L19 9l-4-4L4 16v4z" {...p}/><path d="M14 6l4 4" {...p}/></g>,
    doc:<g><path d="M6 3h8l4 4v14H6V3z" {...p}/><path d="M14 3v4h4M9 13h6M9 17h6" {...p}/></g>,
    search:<g><circle cx="11" cy="11" r="6" {...p}/><path d="M16 16l4 4" {...p}/></g>,
    lock:<g><rect x="5" y="11" width="14" height="9" rx="2" {...p}/><path d="M8 11V8a4 4 0 018 0v3" {...p}/></g>,
    key:<g><circle cx="8" cy="8" r="4" {...p}/><path d="M11 11l8 8M16 16l2-2M18 18l2-2" {...p}/></g>,
    inbox:<g><path d="M4 13l2-9h12l2 9v6H4v-6z" {...p}/><path d="M4 13h5a3 3 0 006 0h5" {...p}/></g>,
    list:<g><path d="M8 6h12M8 12h12M8 18h12" {...p}/><circle cx="4" cy="6" r="1" fill={color}/><circle cx="4" cy="12" r="1" fill={color}/><circle cx="4" cy="18" r="1" fill={color}/></g>,
    upload:<g><path d="M12 16V4M8 8l4-4 4 4" {...p}/><path d="M4 16v4h16v-4" {...p}/></g>,
    wrench:<g><path d="M14 6a4 4 0 01-5 5l-5 5 2 2 5-5a4 4 0 005-5l-2 2-2-2 2-2z" {...p}/></g>,
    tree:<g><path d="M12 3l5 7h-3l3 5h-4v6h-2v-6H8l3-5H8l4-7z" {...p}/></g>,
    party:<g><path d="M4 20l4-12 8 8-12 4z" {...p}/><path d="M14 4l1 2M18 6l-1 2M20 10l-2 1M16 12l2 2" {...p}/></g>,
    wave:<g><path d="M6 12c0-4 2-7 4-7M18 12c0-4-2-7-4-7" {...p}/><circle cx="12" cy="14" r="6" {...p}/><path d="M9 13v2M15 13v2M9.5 17a3 3 0 005 0" {...p}/></g>,
    person:<g><circle cx="12" cy="7" r="3.5" {...p}/><path d="M5 21c0-4 3-7 7-7s7 3 7 7" {...p}/></g>,
    cook:<g><circle cx="12" cy="8" r="3.5" {...p}/><path d="M5 21c0-4 3-7 7-7s7 3 7 7" {...p}/><path d="M8 5a4 4 0 018 0" {...p}/></g>,
    star:<g><path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5-5.5-3.5-5.5 3.5 1.5-6.5-5-4.5 6.5-.5z" {...p}/></g>,
    dish:<g><circle cx="12" cy="13" r="8" {...p}/><circle cx="12" cy="13" r="3" {...p}/><path d="M12 5V2" {...p}/></g>,
    grocery:<g><path d="M5 8h14l-1 12H6L5 8z" {...p}/><path d="M9 8V5a3 3 0 016 0v3" {...p}/></g>,
    drink:<g><path d="M6 4h12l-1.5 16h-9L6 4z" {...p}/><path d="M6.5 9h11" {...p}/></g>,
    fish:<g><path d="M3 12c3-4 9-4 13 0-4 4-10 4-13 0z" {...p}/><circle cx="8" cy="12" r=".8" fill={color}/><path d="M16 12l4-3v6l-4-3z" {...p}/></g>,
    meat:<g><circle cx="14" cy="10" r="6" {...p}/><circle cx="14" cy="10" r="2" {...p}/><path d="M9 14l-5 5M6 16l1 1M7 18l1 1" {...p}/></g>,
    apple:<g><path d="M12 7c-3-2-7 0-7 5s3 8 5 8 1-1 2-1 0 1 2 1 5-3 5-8-4-7-7-5z" {...p}/><path d="M12 7V4M12 4c0-1 1-2 2-2" {...p}/></g>,
    leaf:<g><path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16z" {...p}/><path d="M4 20C9 15 14 11 18 8" {...p}/></g>,
    dot:<g><circle cx="12" cy="12" r="5" fill={color}/></g>,
    bank:<g><path d="M3 9l9-5 9 5" {...p}/><path d="M5 9v9M9 9v9M15 9v9M19 9v9" {...p}/><path d="M3 20h18" {...p}/></g>,
    sleepz:<g><path d="M6 8h5l-5 6h5" {...p}/><path d="M14 5h4l-4 4h4" {...p}/></g>,
    mobile:<g><rect x="7" y="3" width="10" height="18" rx="2" {...p}/><path d="M11 18h2" {...p}/></g>,
    qr:<g><rect x="4" y="4" width="6" height="6" {...p}/><rect x="14" y="4" width="6" height="6" {...p}/><rect x="4" y="14" width="6" height="6" {...p}/><path d="M14 14h2v2M18 14h2M20 16v2M14 18h2v2M18 20h2" {...p}/></g>,
    thumb:<g><path d="M7 11v9H4v-9h3z" {...p}/><path d="M7 11l4-8c1.5 0 2.5 1 2.5 2.5L13 9h5a2 2 0 012 2l-1.5 7a2 2 0 01-2 1.5H7" {...p}/></g>,
    paper:<g><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" {...p}/><path d="M9 8h6M9 12h6" {...p}/></g>,
    award:<g><circle cx="12" cy="9" r="6" {...p}/><path d="M9 14l-1.5 7L12 18l4.5 3L15 14" {...p}/></g>,
  };
  return <svg viewBox="0 0 24 24" style={s} aria-hidden="true">{paths[name]||paths.pin}</svg>;
}

// Логотип ZOOD — стилизованная «Z» в виде дороги + точка-пин
function ZoodLogo({size=44,rounded=12}){
  return(
    <svg viewBox="0 0 48 48" style={{width:size,height:size,display:"block"}}>
      <defs>
        <linearGradient id="zlg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C947"/>
          <stop offset="100%" stopColor="#009E37"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="48" rx={rounded} fill="url(#zlg)"/>
      {/* Z как дорога */}
      <path d="M15 15 H33 L17 31 H34" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* пунктир дороги */}
      <path d="M15 15 H33 L17 31 H34" fill="none" stroke="#00B341" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2,3"/>
      {/* точка-пин на конце */}
      <circle cx="34" cy="31" r="3.4" fill="#fff"/>
      <circle cx="34" cy="31" r="1.5" fill="#00B341"/>
    </svg>
  );
}


// Маскот ZOOD — анимированный дружелюбный персонаж
function ZoodMascot({size=130}){
  const h=Math.round(size*1.3);
  return(
    <svg viewBox="0 0 200 260" width={size} height={h} style={{display:"block",overflow:"visible"}} aria-hidden="true">
      {/* Тень — неподвижная */}
      <ellipse cx="100" cy="254" rx="42" ry="9" fill="#000" opacity="0.09"/>

      {/* ВСЁ тело прыгает */}
      <g>
        <animateTransform attributeName="transform" type="translate"
          values="0,0;0,-7;0,0" dur="2.2s" repeatCount="indefinite"
          calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" keyTimes="0;0.5;1"/>

        {/* Ноги */}
        <rect x="83" y="183" width="15" height="52" rx="7.5" fill="#2D3748"/>
        <rect x="103" y="183" width="15" height="52" rx="7.5" fill="#2D3748"/>
        {/* Обувь */}
        <rect x="77" y="228" width="24" height="14" rx="6" fill="#18181E"/>
        <rect x="100" y="228" width="24" height="14" rx="6" fill="#18181E"/>

        {/* Тело — зелёная форма ZOOD */}
        <rect x="69" y="116" width="62" height="74" rx="22" fill="#00B341"/>
        {/* воротник */}
        <polygon points="90,118 100,133 110,118" fill="#008C32"/>
        {/* Бейдж Z */}
        <rect x="110" y="128" width="17" height="17" rx="4.5" fill="#fff"/>
        <path d="M112,131h13l-13,11h13" stroke="#00B341" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Левая рука (вниз) */}
        <rect x="55" y="120" width="15" height="50" rx="7.5" fill="#00B341"/>
        <circle cx="62.5" cy="174" r="10" fill="#FDDBB4"/>

        {/* Правая рука — МАШЕТ, ось поворота в плече (131,124) */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            values="-50 131 124;-22 131 124;-58 131 124;-22 131 124;-50 131 124"
            dur="2.4s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" keyTimes="0;0.25;0.5;0.75;1"/>
          <rect x="123.5" y="124" width="15" height="50" rx="7.5" fill="#00B341"/>
          <circle cx="131" cy="178" r="10" fill="#FDDBB4"/>
        </g>

        {/* Шея */}
        <rect x="93" y="110" width="14" height="12" rx="4" fill="#E8A882"/>
        {/* Уши */}
        <ellipse cx="56" cy="80" rx="6.5" ry="9" fill="#FDDBB4"/>
        <ellipse cx="144" cy="80" rx="6.5" ry="9" fill="#FDDBB4"/>
        {/* Голова */}
        <circle cx="100" cy="78" r="45" fill="#FDDBB4"/>

        {/* === КЕПКА ZOOD === */}
        {/* Купол кепки */}
        <ellipse cx="100" cy="49" rx="45" ry="28" fill="#00B341"/>
        <rect x="55" y="49" width="90" height="24" fill="#00B341"/>
        {/* Козырёк */}
        <rect x="48" y="70" width="104" height="13" rx="6.5" fill="#008C32"/>
        {/* Z на кепке */}
        <rect x="88" y="52" width="24" height="18" rx="4" fill="#008C32" opacity="0.75"/>
        <path d="M91,56h18l-18,10h18" stroke="#fff" strokeWidth="2.0" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Румянец */}
        <ellipse cx="70" cy="95" rx="13" ry="9" fill="#FFB3A0" opacity="0.35"/>
        <ellipse cx="130" cy="95" rx="13" ry="9" fill="#FFB3A0" opacity="0.35"/>

        {/* Брови (дружелюбно приподняты) */}
        <path d="M74,64 Q82,58 92,63" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M108,63 Q118,58 126,64" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

        {/* Глаза — белки (моргают) */}
        <ellipse cx="84" cy="81" rx="9.5" ry="11.5" fill="#fff">
          <animate attributeName="ry" values="11.5;11.5;11.5;11.5;11.5;11.5;11.5;11.5;11.5;0.5;11.5" keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.88;0.92;1" dur="5s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="116" cy="81" rx="9.5" ry="11.5" fill="#fff">
          <animate attributeName="ry" values="11.5;11.5;11.5;11.5;11.5;11.5;11.5;11.5;11.5;0.5;11.5" keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.88;0.92;1" dur="5s" repeatCount="indefinite"/>
        </ellipse>
        {/* Зрачки */}
        <circle cx="86" cy="83" r="6.5" fill="#1A1A2E">
          <animate attributeName="r" values="6.5;6.5;6.5;6.5;6.5;6.5;6.5;6.5;6.5;0.5;6.5" keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.88;0.92;1" dur="5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="118" cy="83" r="6.5" fill="#1A1A2E">
          <animate attributeName="r" values="6.5;6.5;6.5;6.5;6.5;6.5;6.5;6.5;6.5;0.5;6.5" keyTimes="0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.88;0.92;1" dur="5s" repeatCount="indefinite"/>
        </circle>
        {/* Блики в глазах */}
        <circle cx="81" cy="78" r="2.2" fill="#fff" opacity="0.85"/>
        <circle cx="113" cy="78" r="2.2" fill="#fff" opacity="0.85"/>

        {/* Нос */}
        <ellipse cx="100" cy="92" rx="4.5" ry="3.5" fill="#E8A882"/>
        {/* Улыбка */}
        <path d="M82,99 Q100,118 118,99" stroke="#8B4513" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

// Постоянное хранилище (сохраняется между сессиями)
function useStore(key,initial){
  const [val,setVal]=useState(initial);
  const loaded=useRef(false);
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{ if(typeof window!=="undefined"&&window.storage){ const r=await window.storage.get(key); if(alive&&r&&r.value!=null) setVal(JSON.parse(r.value)); } }catch(e){}
      loaded.current=true;
    })();
    return()=>{alive=false;};
  },[]);
  useEffect(()=>{
    if(!loaded.current) return;
    (async()=>{ try{ if(typeof window!=="undefined"&&window.storage) await window.storage.set(key,JSON.stringify(val)); }catch(e){} })();
  },[val]);
  return[val,setVal];
}

// Поиск реальных адресов (Nominatim OpenStreetMap)
async function geocodeSearch(query,country){
  try{
    const cc=country?`&countrycodes=${country}`:"";
    const r=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=ru&q=${encodeURIComponent(query)}${cc}`,{headers:{"Accept":"application/json"}});
    if(!r.ok) return null;
    const d=await r.json();
    return d.map(x=>({name:(x.name&&x.name.length?x.name:String(x.display_name).split(",")[0]),addr:x.display_name,lat:parseFloat(x.lat),lng:parseFloat(x.lon)}));
  }catch(e){return null;}
}
async function reverseGeocode(lat,lng){
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=ru&lat=${lat}&lon=${lng}`);
    if(!r.ok) return null;
    const d=await r.json();
    return d&&d.display_name?{name:String(d.display_name).split(",").slice(0,2).join(",").trim(),addr:d.display_name,lat,lng}:null;
  }catch(e){return null;}
}
async function osrmRoute(pts){
  try{
    const coords=pts.map(p=>`${p.lng},${p.lat}`).join(";");
    const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
    if(!r.ok) return null;
    const data=await r.json();
    if(!data.routes||!data.routes[0]) return null;
    const rt=data.routes[0];
    return{coords:rt.geometry.coordinates.map(c=>({lat:c[1],lng:c[0]})),dist:rt.distance,dur:rt.duration};
  }catch(e){return null;}
}
function useRoadRoute(stops,setRoadRoute){
  useEffect(()=>{
    const pts=stops.filter(s=>s.lat);
    if(pts.length>=2){let ok=true;osrmRoute(pts).then(r=>{if(ok)setRoadRoute(r||null);});return()=>{ok=false;};}
    setRoadRoute(null);
  },[stops]);
}
function debouncedGeo(timerRef,val,country,idx,setSuggest){
  clearTimeout(timerRef.current);
  timerRef.current=setTimeout(async()=>{
    const real=await geocodeSearch(val,country);
    if(real&&real.length) setSuggest({list:real,idx,field:idx,real:true});
  },500);
}
/* ═══════════════════════════════════════════════════════════════════
   ЗУДГО v8  — CartoDB Voyager · Геолокация · Мультиточки · Межгород
   ═══════════════════════════════════════════════════════════════════ */



// ── Cart ──────────────────────────────────────────────────────────
function useCart(){
  const [items,setItems]=useState([]);
  const add=i=>setItems(p=>{const ex=p.find(x=>x.id===i.id);return ex?p.map(x=>x.id===i.id?{...x,qty:x.qty+1}:x):[...p,{...i,qty:1}];});
  const remove=id=>setItems(p=>{const ex=p.find(x=>x.id===id);if(!ex)return p;return ex.qty===1?p.filter(x=>x.id!==id):p.map(x=>x.id===id?{...x,qty:x.qty-1}:x);});
  const clear=()=>setItems([]);
  const qty=id=>items.find(x=>x.id===id)?.qty??0;
  const total=items.reduce((s,x)=>s+x.price*x.qty,0);
  const count=items.reduce((s,x)=>s+x.qty,0);
  return{items,add,remove,clear,qty,total,count};
}

// ── Auth Screen ───────────────────────────────────────────────────
function AuthScreen({role,onAuth,accent=R,logo,title,subtitle}){
  const [step,setStep]=useState("phone");
  const [phone,setPhone]=useState("");
  const [code,setCode]=useState("");
  const [name,setName]=useState("");
  const [sending,setSending]=useState(false);
  const send=()=>{setSending(true);setTimeout(()=>{setSending(false);setStep("code");},1200);};
  const verify=()=>{if(code.length>=4)setStep("profile");};
  const finish=()=>onAuth({phone:`+992 ${phone}`,name:name||"Пользователь",role});
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:WH,overflowY:"auto"}}>
      <div style={{background:`linear-gradient(155deg,${ADM},${NM},${accent})`,padding:"44px 24px 36px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:76,height:76,background:"rgba(255,255,255,.15)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,marginBottom:14}}>{logo}</div>
        <div style={{color:WH,fontWeight:900,fontSize:23,textAlign:"center"}}>{title}</div>
        <div style={{color:"rgba(255,255,255,.6)",fontSize:13,marginTop:5,textAlign:"center"}}>{subtitle}</div>
      </div>
      <div style={{flex:1,padding:"28px 22px"}}>
        {step==="phone"&&<>
          {logo==="zood"&&<div style={{textAlign:"center",padding:"4px 0 10px"}}><ZoodMascot size={108}/><div style={{fontWeight:700,fontSize:13,color:GR,marginTop:3}}>Хуш омадед! 👋</div></div>}
          <div style={{fontWeight:800,fontSize:19,color:DK,marginBottom:4}}>Войти</div>
          <div style={{fontSize:13,color:GY,marginBottom:22}}>Введите номер — пришлём код</div>
          <div style={{display:"flex",background:BG,borderRadius:16,overflow:"hidden",border:`1.5px solid ${BD}`,marginBottom:16}}>
            <div style={{padding:"15px 14px",background:"#F1F5F9",borderRight:`1px solid ${BD}`,fontWeight:700,fontSize:14,color:DK}}>+992</div>
            <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,9))} placeholder="__ ___-__-__" style={{flex:1,padding:"15px",border:"none",outline:"none",fontSize:15,color:DK,background:"transparent",fontFamily:"inherit"}}/>
          </div>
          <button onClick={send} disabled={phone.length<9||sending} style={{width:"100%",padding:15,background:phone.length>=9?accent:BD,color:phone.length>=9?WH:MG,border:"none",borderRadius:15,fontSize:15,fontWeight:800,cursor:phone.length>=9?"pointer":"default",transition:"all .2s"}}>{sending?"Отправляем...":"Получить SMS-код →"}</button>
          <div style={{textAlign:"center",marginTop:14,fontSize:11,color:MG}}>Демо: любые 9 цифр</div>
          <div style={{textAlign:"center",marginTop:14,paddingTop:14,borderTop:`1px solid ${BD}`}}>
            <button onClick={()=>onAuth({guest:true,name:"Гость",role:"customer",phone:""})} style={{background:"none",border:"none",color:GY,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
              Войду позже → <span style={{color:MG,textDecoration:"underline",textUnderlineOffset:2}}>Пропустить</span>
            </button>
          </div>
        </>}
        {step==="code"&&<>
          <div style={{fontWeight:800,fontSize:19,color:DK,marginBottom:4}}>Введите код</div>
          <div style={{fontSize:13,color:GY,marginBottom:22}}>Отправили на +992 {phone}</div>
          <div style={{display:"flex",gap:10,marginBottom:16,justifyContent:"center"}}>
            {[0,1,2,3].map(i=><input key={i} maxLength={1} value={code[i]||""} onChange={e=>{const v=e.target.value.replace(/\D/g,"");setCode(code.slice(0,i)+v+code.slice(i+1));}} style={{width:62,height:62,textAlign:"center",fontSize:26,fontWeight:800,color:DK,background:BG,border:`2px solid ${code[i]?accent:BD}`,borderRadius:15,outline:"none",fontFamily:"inherit"}}/>)}
          </div>
          <button onClick={verify} disabled={code.length<4} style={{width:"100%",padding:15,background:code.length>=4?accent:BD,color:code.length>=4?WH:MG,border:"none",borderRadius:15,fontSize:15,fontWeight:800,cursor:code.length>=4?"pointer":"default"}}>Подтвердить</button>
          <button onClick={()=>{setStep("phone");setCode("");}} style={{width:"100%",padding:10,background:"none",border:"none",color:GY,fontSize:13,cursor:"pointer",marginTop:8}}>← Изменить номер</button>
          <div style={{textAlign:"center",marginTop:8,fontSize:11,color:MG}}>Демо: любые 4 цифры</div>
        </>}
        {step==="profile"&&<>
          <div style={{fontWeight:800,fontSize:19,color:DK,marginBottom:4}}>Ваше имя</div>
          <div style={{fontSize:13,color:GY,marginBottom:22}}>Необязательно, но приятно</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Имя" style={{width:"100%",padding:"15px",borderRadius:15,border:`1.5px solid ${BD}`,fontSize:15,color:DK,background:BG,outline:"none",boxSizing:"border-box",fontFamily:"inherit",marginBottom:16}}/>
          <button onClick={finish} style={{width:"100%",padding:15,background:accent,color:WH,border:"none",borderRadius:15,fontSize:15,fontWeight:800,cursor:"pointer"}}>Начать →</button>
        </>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  TAXI SCREEN — CartoDB Voyager · GPS геолокация · Мультиточки
// ════════════════════════════════════════════════════════════════════

function bezier(from,to,steps=40){
  const fla=from.lat??from[0],fln=from.lng??from[1];
  const tla=to.lat??to[0],  tln=to.lng??to[1];
  const mx=(fla+tla)/2+(tln-fln)*0.14,my=(fln+tln)/2-(tla-fla)*0.14;
  const pts=[];
  for(let i=0;i<=steps;i++){const t=i/steps;pts.push([(1-t)*(1-t)*fla+2*(1-t)*t*mx+t*t*tla,(1-t)*(1-t)*fln+2*(1-t)*t*my+t*t*tln]);}
  return pts;
};

// Способы оплаты (локальные для Таджикистана)
const RIDE_PAY=[
  {id:"cash",icon:"money",label:"Наличными",sub:""},
  {id:"dc",icon:"card",label:"Душанбе Сити",sub:"Городской кошелёк"},
  {id:"km",icon:"card",label:"Корти Милли •••2452",sub:"Национальная карта"},
  {id:"wallet",icon:"bank",label:"Кошелёк ZOOD",sub:"0 с."},
];
function PaymentSheet({payMethod,setPayMethod,onClose}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:300,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:WH,borderRadius:"22px 22px 0 0",padding:"10px 18px 26px",width:"100%",maxWidth:460,margin:"0 auto",animation:"fadeUp .25s ease-out"}}>
        <div style={{width:38,height:4,background:BD,borderRadius:2,margin:"0 auto 14px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontWeight:800,fontSize:17,color:DK}}>Способ оплаты</span>
          <div onClick={onClose} style={{width:30,height:30,background:BG,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,color:GY}}>✕</div>
        </div>
        {RIDE_PAY.map((m,i)=>(
          <div key={m.id} onClick={()=>{setPayMethod(m.id);onClose();}} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 2px",borderBottom:i<RIDE_PAY.length-1?`1px solid ${BG}`:"none",cursor:"pointer"}}>
            <div style={{width:38,height:38,background:m.id===payMethod?GRL:BG,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={m.icon} size={18} color={m.id===payMethod?GR:DK}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:m.id===payMethod?700:500,color:DK}}>{m.label}</div>
              {m.sub&&<div style={{fontSize:10,color:GY,marginTop:1}}>{m.sub}</div>}
            </div>
            <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${m.id===payMethod?GR:BD}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {m.id===payMethod&&<div style={{width:11,height:11,borderRadius:"50%",background:GR}}/>}
            </div>
          </div>
        ))}
        <button style={{width:"100%",padding:"11px",marginTop:10,background:"none",border:"none",color:GR,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>+ Добавить карту</button>
      </div>
    </div>
  );
}
function TaxiScreen({onBack,onHelp}){
  const [stops,setStops]=useState([{id:"a",addr:"",ph:"📍 Откуда",lat:null,lng:null},{id:"b",addr:"",ph:"🏁 Куда",lat:null,lng:null}]);
  const [tTariff,setTTariff]=useState(null);
  const [tStatus,setTStatus]=useState("idle");
  const [meter,setMeter]=useState(0);
  const [showCancel,setShowCancel]=useState(false);
  const [addingStop,setAddingStop]=useState(false);
  const [newStopAddr,setNewStopAddr]=useState("");
  const [suggest,setSuggest]=useState({list:[],idx:null,field:null});
  const [waitSec,setWaitSec]=useState(0);
  const [payMethod,setPayMethod]=useState("cash");
  const [showPayPick,setShowPayPick]=useState(false);
  const [callToast,setCallToast]=useState(false);
  const [userLoc,setUserLoc]=useState(null);
  const [roadRoute,setRoadRoute]=useState(null);
  const [carProg,setCarProg]=useState(0);
  const geoTimer=useRef(null);
  const statusRef=useRef("idle");

  const distKm=roadRoute&&roadRoute.dist?Math.max(1,Math.round(roadRoute.dist/100)/10):Math.round(8+stops.filter(s=>s.addr).length*4);
  const interCity=distKm>80;
  const canOrder=stops[0].addr&&stops[stops.length-1].addr&&tTariff;

  useRoadRoute(stops,setRoadRoute);
  function locate(){
    if(typeof navigator==="undefined"||!navigator.geolocation)return;
    navigator.geolocation.getCurrentPosition(pos=>{
      const p={lat:pos.coords.latitude,lng:pos.coords.longitude};
      setUserLoc(p);
      reverseGeocode(p.lat,p.lng).then(r=>{setStops(prev=>prev.map((s,i)=>i===0&&!s.addr?{...s,addr:(r?r.name:"Моё местоположение"),lat:p.lat,lng:p.lng}:s));});
    },()=>{},{enableHighAccuracy:true,timeout:8000,maximumAge:60000});
  }
  useEffect(()=>{locate();},[]);
  useEffect(()=>{
    if(tStatus==="inprogress"){setCarProg(0);const t=setInterval(()=>setCarProg(p=>Math.min(1,p+0.012)),300);return()=>clearInterval(t);}
    if(tStatus==="idle")setCarProg(0);
  },[tStatus]);

  useEffect(()=>{statusRef.current=tStatus;},[tStatus]);
  useEffect(()=>{
    if(tStatus==="inprogress"){
      const t=setInterval(()=>setMeter(p=>Math.round((p+0.028)*10)/10),1000);
      return()=>clearInterval(t);
    }
    if(tStatus==="waiting"){
      const t=setInterval(()=>setWaitSec(p=>p+1),1000);
      return()=>clearInterval(t);
    }
    if(tStatus==="idle"){setMeter(0);setWaitSec(0);}
  },[tStatus]);

  function confirmRide(){
    setTStatus("found");statusRef.current="found";
    setTimeout(()=>{if(statusRef.current==="found"){setTStatus("arrived");statusRef.current="arrived";}},4000);
  }
  function startTrip(){setTStatus("inprogress");statusRef.current="inprogress";}
  function cancelRide(){setShowCancel(true);}
  function doCancel(){setShowCancel(false);setTStatus("idle");statusRef.current="idle";}

  function onInput(val,idx){
    setStops(p=>p.map((s,i)=>i===idx?{...s,addr:val}:s));
    if(val.length>0){
      const q=val.toLowerCase();
      setSuggest({list:DUSHANBE_PLACES.filter(p=>p.name.toLowerCase().includes(q)||p.addr.toLowerCase().includes(q)).slice(0,5),idx,field:idx});
      if(val.length>=3)debouncedGeo(geoTimer,val,"tj",idx,setSuggest);
    }else{setSuggest({list:[],idx:null,field:null});}
  }
  function pickSuggest(place){
    setSuggest({list:[],idx:null,field:null});
    setStops(p=>p.map((s,i)=>i===suggest.field?{...s,addr:place.name,lat:place.lat,lng:place.lng}:s));
  }
  function addStop(){
    const newS={id:"s"+Date.now(),addr:"",ph:"📍 Остановка",lat:null,lng:null};
    setStops(p=>[...p.slice(0,-1),newS,...p.slice(-1)]);
  }
  function addStopDuringRide(){
    if(!newStopAddr.trim())return;
    setStops(p=>[...p.slice(0,-1),{id:"s"+Date.now(),addr:newStopAddr,ph:"📍 Точка",lat:null,lng:null},...p.slice(-1)]);
    setNewStopAddr("");setAddingStop(false);
  }

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#F2F1EE",position:"relative"}}>

      {/* Живая карта */}
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <SchematicMap markers={stops.filter(s=>s.lat)} route={(roadRoute&&roadRoute.coords)||(stops.filter(s=>s.lat).length>=2?stops.filter(s=>s.lat):null)} carProg={tStatus==="inprogress"?carProg:null} follow={tStatus==="inprogress"} userLoc={userLoc} etaMin={roadRoute&&roadRoute.dur&&tStatus==="idle"?Math.max(1,Math.round(roadRoute.dur/60)):null} fitKey={stops.map(s=>s.lat?s.lat.toFixed(4):"").join("|")}/>
        <button onClick={locate} style={{position:"absolute",right:12,bottom:64,width:42,height:42,borderRadius:"50%",background:WH,border:"none",boxShadow:"0 3px 12px rgba(0,0,0,.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:5}}><Icon name="compass" size={20} color={GR}/></button>
        {roadRoute&&roadRoute.dur&&tStatus==="idle"&&<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"rgba(255,255,255,.95)",borderRadius:12,padding:"5px 12px",display:"flex",gap:8,alignItems:"center",boxShadow:"0 2px 10px rgba(0,0,0,.15)",zIndex:5}}>
          <span style={{fontWeight:800,fontSize:12,color:GR}}>{Math.max(1,Math.round(roadRoute.dur/60))} мин</span>
          <span style={{color:MG,fontSize:11}}>·</span>
          <span style={{fontWeight:700,fontSize:12,color:DK}}>{(roadRoute.dist/1000).toFixed(1)} км</span>
        </div>}
        {/* ETA badge */}
        {tStatus==="idle"&&tTariff&&<div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",background:"rgba(255,255,255,.96)",borderRadius:14,padding:"6px 16px",boxShadow:"0 4px 16px rgba(0,0,0,.15)",display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontWeight:800,fontSize:13,color:DK}}>≈ {distKm} км</span>
          <span style={{color:MG}}>·</span>
          <span style={{fontWeight:700,fontSize:13,color:tTariff.col}}>~{Math.round(distKm*3+tTariff.base)} с.</span>
        </div>}
      </div>

      {/* Bottom sheet */}
      <div style={{background:WH,borderRadius:"22px 22px 0 0",boxShadow:"0 -6px 32px rgba(0,0,0,.1)",flexShrink:0,maxHeight:"62%",overflowY:"auto"}}>
        <div style={{width:38,height:4,background:BD,borderRadius:2,margin:"10px auto 0"}}/>

        {/* IDLE — route form */}
        {tStatus==="idle"&&<div style={{padding:"10px 14px 16px"}}>
          {/* Stops */}
          <div style={{background:BG,borderRadius:16,overflow:"hidden",marginBottom:10,position:"relative"}}>
            {stops.map((s,idx)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderBottom:idx<stops.length-1?`1px solid ${BD}`:"none"}}>
                <div style={{width:10,height:10,borderRadius:idx===0?"50%":"3px",background:idx===0?"#2E7D32":idx===stops.length-1?R:GD,flexShrink:0}}/>
                <input value={s.addr} onChange={e=>onInput(e.target.value,idx)} placeholder={s.ph} style={{flex:1,border:"none",outline:"none",fontSize:13,color:DK,background:"transparent",fontFamily:"inherit"}}/>
                {stops.length>2&&idx>0&&idx<stops.length-1&&<button onClick={()=>setStops(p=>p.filter((_,i)=>i!==idx))} style={{border:"none",background:"none",color:MG,cursor:"pointer",fontSize:16,padding:0}}>✕</button>}
              </div>
            ))}
            {/* Autocomplete dropdown */}
            {suggest.list.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:WH,borderRadius:"0 0 14px 14px",boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:50,maxHeight:180,overflowY:"auto"}}>
              {suggest.list.map(p=>(
                <div key={p.name} onClick={()=>pickSuggest(p)} style={{padding:"10px 14px",fontSize:12,color:DK,borderBottom:`1px solid ${BD}`,cursor:"pointer",display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:14}}>📍</span>
                  <div><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:10,color:GY}}>{p.addr}</div></div>
                </div>
              ))}
            </div>}
          </div>

          <button onClick={addStop} style={{width:"100%",padding:"8px 14px",background:BG,border:`1px dashed ${BD}`,borderRadius:11,fontSize:12,color:MG,cursor:"pointer",marginBottom:10,fontFamily:"inherit"}}>+ Добавить остановку</button>

          {/* Tariffs */}
          <div style={{display:"flex",gap:8,marginBottom:10,overflowX:"auto",paddingBottom:2}}>
            {CAR_OPTIONS.map(t=>(
              <button key={t.id} onClick={()=>setTTariff(t)} style={{flexShrink:0,padding:"9px 12px",borderRadius:14,border:`2px solid ${tTariff?.id===t.id?t.col:BD}`,background:tTariff?.id===t.id?t.col+"18":BG,cursor:"pointer",textAlign:"center",fontFamily:"inherit",minWidth:76,boxShadow:tTariff?.id===t.id?`0 4px 14px ${t.col}33`:"none"}}>
                <div style={{fontSize:18,marginBottom:2}}>{t.emoji}</div>
                <div style={{fontSize:10,fontWeight:700,color:tTariff?.id===t.id?t.col:DK}}>{t.label}</div>
                <div style={{fontSize:9,color:GY}}>от {t.price} с.</div>
              </button>
            ))}
          </div>

          {/* Price estimate */}
          {tTariff&&canOrder&&<div style={{background:tTariff.col+"18",border:`1px solid ${tTariff.col}33`,borderRadius:12,padding:"8px 13px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,color:DK,fontWeight:600}}>Ориент. стоимость</span>
            <span style={{fontWeight:900,fontSize:15,color:tTariff.col}}>~{Math.round(distKm*3+tTariff.base)} с.</span>
          </div>}

          <button onClick={()=>{if(canOrder){setTStatus("searching");setTimeout(()=>{if(statusRef.current==="searching"){confirmRide();}},2500);}}} disabled={!canOrder} style={{width:"100%",padding:15,background:canOrder?NV:BD,color:canOrder?WH:MG,border:"none",borderRadius:16,fontSize:14,fontWeight:800,cursor:canOrder?"pointer":"default",boxShadow:canOrder?`0 6px 20px ${NV}44`:"none",fontFamily:"inherit",transition:"all .2s"}}>
            {canOrder?`Заказать${stops.length>2?` · ${stops.length} точки`:""} · ${tTariff?.label}`:"Введите маршрут и тариф"}
          </button>
        </div>}

        {/* SEARCHING */}
        {tStatus==="searching"&&<div style={{padding:"22px",textAlign:"center"}}>
          <div style={{fontSize:52,marginBottom:10,animation:"spin 2s linear infinite",display:"inline-block"}}>⏳</div>
          <div style={{fontWeight:800,fontSize:16,color:DK}}>Ищем водителя...</div>
          <div style={{fontSize:12,color:GY,marginTop:4,marginBottom:10}}>{interCity?"Межгородской · поиск займёт дольше":"Обычно 10–30 секунд"}</div>
          <div style={{display:"flex",gap:6,justifyContent:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:R,opacity:.3+i*.3}}/>)}</div>
        </div>}

        {/* FOUND — driver card */}
        {tStatus==="found"&&<div style={{padding:"10px 16px 14px",animation:"fadeUp .3s ease-out"}}>
          <div style={{background:WH,borderRadius:20,padding:16,boxShadow:"0 6px 26px rgba(0,0,0,.10)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
              <div><div style={{fontWeight:800,fontSize:16,color:DK}}>Через ≈ 3 мин приедет</div><div style={{fontSize:12,color:GY,marginTop:2}}>Белая Chevrolet Nexia 3</div></div>
              <div style={{display:"flex",alignItems:"center",gap:7,background:BG,borderRadius:12,padding:"6px 10px"}}>
                <span style={{fontSize:11,fontWeight:800,color:DK}}>1234 AB</span>
              </div>
            </div>
            <div style={{height:1,background:BD,marginBottom:13}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-around",marginBottom:13}}>
              <div style={{textAlign:"center"}}>
                <div style={{position:"relative",width:58,height:58,margin:"0 auto 5px"}}>
                  <div style={{width:58,height:58,borderRadius:"50%",background:`linear-gradient(135deg,#F0C9A0,#D99B6C)`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}><Icon name="user" size={32} color="#7A4A28"/></div>
                  <div style={{position:"absolute",bottom:-3,left:"50%",transform:"translateX(-50%)",background:GR,color:WH,fontSize:9,fontWeight:800,padding:"1px 7px",borderRadius:8,border:`2px solid ${WH}`}}>4.9</div>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:DK}}>Хасан</div>
              </div>
              <div onClick={()=>{setCallToast(true);setTimeout(()=>setCallToast(false),2200);}} style={{textAlign:"center",cursor:"pointer"}}>
                <div style={{width:54,height:54,borderRadius:"50%",background:BG,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 5px",border:`1px solid ${BD}`}}><Icon name="phone" size={24} color={DK}/></div>
                <div style={{fontSize:11,color:GY}}>Связь с<br/>водителем</div>
              </div>
              <div style={{textAlign:"center",cursor:"pointer"}}>
                <div style={{width:54,height:54,borderRadius:"50%",background:BG,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 5px",border:`1px solid ${BD}`}}><Icon name="list" size={24} color={DK}/></div>
                <div style={{fontSize:11,color:GY}}>Детали</div>
              </div>
            </div>
            <div style={{height:1,background:BD,marginBottom:11}}/>
            <div onClick={()=>setShowPayPick(true)} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:13}}>
              <div style={{width:32,height:32,background:GRL,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="card" size={16} color={GR}/></div>
              <span style={{flex:1,fontSize:13,fontWeight:600,color:DK}}>{RIDE_PAY.find(m=>m.id===payMethod)?.label||"Наличными"}</span>
              <span style={{color:MG,fontSize:16}}>›</span>
            </div>
            <button onClick={cancelRide} style={{width:"100%",padding:11,background:BG,border:`1px solid ${BD}`,borderRadius:13,fontSize:13,fontWeight:600,color:R,cursor:"pointer",fontFamily:"inherit"}}>Отменить вызов</button>
          </div>
        </div>}
        {showPayPick&&<PaymentSheet payMethod={payMethod} setPayMethod={setPayMethod} onClose={()=>setShowPayPick(false)}/>}
        {callToast&&<div style={{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",background:DK,color:WH,padding:"10px 18px",borderRadius:14,fontSize:13,fontWeight:600,zIndex:400,display:"flex",alignItems:"center",gap:8,boxShadow:"0 6px 20px rgba(0,0,0,.3)"}}><Icon name="phone" size={15} color="currentColor"/>Звоним Хасану…</div>}

        {/* ARRIVED */}
        {tStatus==="arrived"&&<div style={{padding:"10px 16px 14px",animation:"fadeUp .3s ease-out"}}>
          <div style={{background:GDL,border:`1.5px solid ${GD}`,borderRadius:14,padding:14}}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:32}}>🎯</div>
              <div><div style={{fontWeight:800,fontSize:14,color:DK}}>Водитель прибыл!</div><div style={{fontSize:11,color:GY}}>Хасан Р. ожидает вас · Nexia 3</div></div>
            </div>
            <div style={{background:"rgba(255,255,255,.8)",borderRadius:10,padding:"6px 12px",marginBottom:8,fontSize:10,color:"#78350F"}}>⏱ 3 мин бесплатно, далее 1 с./мин</div>
            <button onClick={()=>{setTStatus("inprogress");statusRef.current="inprogress";}} style={{width:"100%",padding:11,background:`linear-gradient(135deg,#1B5E20,${GR})`,color:WH,border:"none",borderRadius:12,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginBottom:6}}>🚀 Начать поездку</button>
            <button onClick={cancelRide} style={{width:"100%",padding:10,background:"none",border:`1.5px solid ${R}33`,borderRadius:11,fontSize:11,color:R,cursor:"pointer",fontFamily:"inherit"}}>Отменить (штраф 3 с.)</button>
          </div>
        </div>}

        {/* IN PROGRESS — meter */}
        {tStatus==="inprogress"&&<div style={{padding:"10px 16px 14px",animation:"fadeUp .3s ease-out"}}>
          <div style={{background:`linear-gradient(135deg,${NV},#1B3A5C)`,borderRadius:16,padding:"14px 16px",marginBottom:10,boxShadow:`0 8px 28px ${NV}33`}}>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:11,marginBottom:2}}>💰 По счётчику</div>
            <div style={{fontWeight:900,fontSize:32,color:WH,letterSpacing:-1,transition:"all .3s"}}>{meter.toFixed(1)} <span style={{fontSize:16,fontWeight:600,opacity:.8}}>с.</span></div>
          </div>
          {!addingStop
            ?<div style={{display:"flex",gap:8}}>
              <button onClick={()=>setAddingStop(true)} style={{flex:1,padding:"11px 8px",background:BLL,border:`1.5px solid ${BL}`,borderRadius:13,fontSize:12,fontWeight:700,color:BL,cursor:"pointer",fontFamily:"inherit"}}>📍 Добавить точку</button>
              <button onClick={cancelRide} style={{flex:1,padding:"11px 8px",background:"none",border:`1.5px solid ${R}44`,borderRadius:13,fontSize:12,color:R,cursor:"pointer",fontFamily:"inherit"}}>Отменить</button>
              <button onClick={()=>alert("🆘 SOS! Местоположение отправлено!")} style={{padding:"11px 13px",background:R,border:"none",borderRadius:13,fontSize:11,fontWeight:800,color:WH,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 14px ${R}44`}}>🆘</button>
            </div>
            :<div style={{background:BG,borderRadius:13,padding:"10px 12px",border:`1.5px solid ${BD}`}}>
              <input value={newStopAddr} onChange={e=>setNewStopAddr(e.target.value)} placeholder="Новая точка маршрута..." style={{width:"100%",border:"none",outline:"none",fontSize:13,color:DK,background:"transparent",marginBottom:7,fontFamily:"inherit",boxSizing:"border-box"}}/>
              <div style={{display:"flex",gap:7}}>
                <button onClick={addStopDuringRide} style={{flex:2,padding:9,background:newStopAddr.trim()?R:BD,color:WH,border:"none",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Добавить</button>
                <button onClick={()=>{setAddingStop(false);setNewStopAddr("");}} style={{flex:1,padding:9,background:"none",border:`1px solid ${BD}`,borderRadius:10,fontSize:11,color:GY,cursor:"pointer",fontFamily:"inherit"}}>Отмена</button>
              </div>
            </div>
          }
        </div>}

        {/* DONE */}
        {tStatus==="done"&&<div style={{padding:"14px 16px",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:8}}>🎉</div>
          <div style={{fontWeight:800,fontSize:17,color:DK,marginBottom:4}}>Поездка завершена!</div>
          <div style={{background:NV,borderRadius:14,padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"rgba(255,255,255,.7)",fontSize:12}}>Итого по счётчику</span>
            <span style={{fontWeight:900,fontSize:22,color:WH}}>{meter>0?`${meter.toFixed(1)} с.`:`${tTariff?.price||0} с.`}</span>
          </div>
          <button onClick={onBack} style={{width:"100%",padding:14,background:R,color:WH,border:"none",borderRadius:15,fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 20px ${R}44`,fontFamily:"inherit"}}>← На главную</button>
        </div>}
      </div>

      {/* Cancel modal */}
      {showCancel&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
        <div style={{background:WH,borderRadius:"22px 22px 0 0",width:"100%",padding:"18px 18px 32px",textAlign:"center"}}>
          <div style={{fontSize:38,marginBottom:8}}>❌</div>
          <div style={{fontWeight:800,fontSize:16,color:DK,marginBottom:6}}>Отменить поездку?</div>
          {(tStatus==="arrived"||tStatus==="inprogress")&&<div style={{fontSize:11,color:R,background:RL,borderRadius:10,padding:"6px 12px",marginBottom:10}}>Штраф 3 с. — водитель уже на месте</div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={doCancel} style={{flex:1,padding:13,background:R,color:WH,border:"none",borderRadius:13,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Да, отменить</button>
            <button onClick={()=>setShowCancel(false)} style={{flex:1,padding:13,background:BG,border:`1px solid ${BD}`,borderRadius:13,fontSize:13,color:DK,cursor:"pointer",fontFamily:"inherit"}}>Нет</button>
          </div>
        </div>
      </div>}
    </div>
  );
}


function IntercityScreen({onBack}){
  const [step,setStep]=useState("route");
  const [rt,setRt]=useState(null);
  const [mode,setMode]=useState("shared");
  const [seats,setSeats]=useState(1);
  const [day,setDay]=useState("today");
  const [drv,setDrv]=useState(null);
  const [fromCity,setFromCity]=useState("");
  const [toCity,setToCity]=useState("");
  const [showCityPick,setShowCityPick]=useState(null); // 'from'|'to'

  const sc={overflowY:"auto",flex:1,WebkitOverflowScrolling:"touch"};
  const card={background:WH,borderRadius:18,border:`1px solid ${BD}`,boxShadow:"0 4px 20px rgba(0,0,0,.08)"};
  const sh="0 4px 20px rgba(0,0,0,.08)";

  const customRoute=fromCity&&toCity&&fromCity!==toCity
    ?IC_ROUTES.find(r=>r.from===fromCity&&r.to===toCity)||
      {from:fromCity,to:toCity,km:Math.round(100+Math.random()*300),h:"~3ч",seat:Math.round(60+Math.random()*80),full:Math.round(240+Math.random()*320),custom:true}
    :null;

  const displayRoutes=customRoute?[customRoute]:IC_ROUTES;
  const drivers=rt?getICDrivers(rt,mode,seats):[];
  const totalPrice=mode==="shared"?(rt?.seat||0)*seats:(rt?.full||0);

  // STEP 1: Выбор маршрута
  if(step==="route")return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#F8F7F4"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${NV},#1B3A5C)`,padding:"10px 16px 16px",flexShrink:0}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.15)",border:"none",color:WH,borderRadius:12,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700,marginBottom:12,fontFamily:"inherit"}}>← Назад</button>
        <div style={{color:WH,fontWeight:900,fontSize:20,marginBottom:4}}>🚌 Межгородское такси</div>
        <div style={{color:"rgba(255,255,255,.6)",fontSize:12}}>Попутчик или весь салон · вся страна</div>
      </div>
      {/* City picker */}
      <div style={{margin:"12px 14px 8px",borderRadius:18,overflow:"hidden",boxShadow:sh}}>
        {[{label:"Откуда",val:fromCity,key:"from",ph:"Город отправления"},{label:"Куда",val:toCity,key:"to",ph:"Город прибытия"}].map((f,i)=>(
          <div key={f.key} onClick={()=>setShowCityPick(f.key)} style={{background:WH,padding:"13px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:i===0?`1px solid ${BD}`:"none",cursor:"pointer"}}>
            <div style={{width:10,height:10,borderRadius:i===0?"50%":"3px",background:i===0?"#2E7D32":R,flexShrink:0}}/>
            {f.val
              ?<span style={{fontWeight:700,fontSize:14,color:DK}}>{f.val}</span>
              :<span style={{fontSize:13,color:MG}}>{f.ph}</span>}
          </div>
        ))}
      </div>
      {customRoute&&<div onClick={()=>{setRt(customRoute);setStep("drivers");}} style={{margin:"0 14px 10px",...card,padding:"13px 16px",cursor:"pointer",border:`2px solid ${NV}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div style={{fontWeight:800,fontSize:14,color:NV}}>{customRoute.from} → {customRoute.to}</div><div style={{fontSize:11,color:GY,marginTop:1}}>{customRoute.h} · {customRoute.km} км</div></div>
        <div style={{textAlign:"right"}}><div style={{fontWeight:900,fontSize:15,color:NV}}>от {customRoute.seat} с.</div><div style={{fontSize:10,color:GY}}>за место</div></div>
      </div>}
      <div style={sc}>
        <div style={{padding:"4px 14px 24px"}}>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:8}}>🔥 ПОПУЛЯРНЫЕ МАРШРУТЫ</div>
          {IC_ROUTES.filter(r=>r.hot).map(r=>(
            <div key={r.id} onClick={()=>{setRt(r);setStep("drivers");}} style={{...card,padding:"13px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:DK}}>{r.from} → {r.to}</div>
                <div style={{fontSize:11,color:GY,marginTop:2}}>🕒 {r.h} · {r.km} км</div>
              </div>
              <div style={{textAlign:"right",marginLeft:8}}>
                <div style={{fontWeight:900,fontSize:14,color:NV}}>от {r.seat} с.</div>
                <div style={{fontSize:9,color:GY}}>за место</div>
              </div>
              <span style={{color:MG,fontSize:18,marginLeft:6}}>›</span>
            </div>
          ))}
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,margin:"14px 0 8px"}}>ВСЕ МАРШРУТЫ</div>
          {IC_ROUTES.filter(r=>!r.hot).map(r=>(
            <div key={r.id} onClick={()=>{setRt(r);setStep("drivers");}} style={{...card,padding:"12px 16px",marginBottom:7,cursor:"pointer",display:"flex",alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:DK}}>{r.from} → {r.to}</div>
                <div style={{fontSize:10,color:GY,marginTop:1}}>{r.h} · {r.km} км</div>
              </div>
              <div style={{textAlign:"right"}}>
                <span style={{fontWeight:800,fontSize:13,color:NV}}>от {r.seat} с.</span>
                <span style={{color:MG,fontSize:15,marginLeft:8}}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* City picker modal */}
      {showCityPick&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:100,display:"flex",alignItems:"flex-end"}}>
        <div style={{background:WH,borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"70%",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 16px 8px",borderBottom:`1px solid ${BD}`,flexShrink:0}}>
            <div style={{fontWeight:700,fontSize:15,color:DK,marginBottom:6}}>{showCityPick==="from"?"Откуда":"Куда"}</div>
            <button onClick={()=>setShowCityPick(null)} style={{position:"absolute",top:12,right:16,background:"#F3F4F6",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16}}>✕</button>
          </div>
          <div style={{overflowY:"auto",flex:1,padding:"8px 0"}}>
            {IC_CITIES.filter(city=>showCityPick==="from"?city!==toCity:city!==fromCity).map(city=>(
              <div key={city} onClick={()=>{showCityPick==="from"?setFromCity(city):setToCity(city);setShowCityPick(null);}} style={{padding:"13px 18px",fontSize:14,fontWeight:500,color:DK,borderBottom:`1px solid ${BD}`,cursor:"pointer"}}>
                📍 {city}
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );

  // STEP 2: Выбор водителя
  if(step==="drivers")return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#F8F7F4"}}>
      <div style={{background:`linear-gradient(135deg,${NV},#1B3A5C)`,padding:"10px 16px 16px",flexShrink:0}}>
        <button onClick={()=>setStep("route")} style={{background:"rgba(255,255,255,.15)",border:"none",color:WH,borderRadius:12,padding:"7px 13px",cursor:"pointer",fontSize:12,fontWeight:700,marginBottom:10,fontFamily:"inherit"}}>← Назад</button>
        <div style={{color:WH,fontWeight:900,fontSize:18}}>{rt.from} <span style={{opacity:.5}}>→</span> {rt.to}</div>
        <div style={{color:"rgba(255,255,255,.6)",fontSize:11,marginTop:2}}>🕒 {rt.h} · {rt.km} км</div>
      </div>
      <div style={{background:WH,padding:"10px 14px",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
        {/* Mode toggle */}
        <div style={{display:"flex",background:"#F3F4F6",borderRadius:13,padding:3,marginBottom:10}}>
          {[{id:"shared",l:"👥 Попутчик"},{id:"full",l:"🚗 Весь салон"}].map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} style={{flex:1,padding:"9px 6px",borderRadius:10,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",background:mode===m.id?WH:"transparent",color:mode===m.id?NV:GY,boxShadow:mode===m.id?"0 2px 8px rgba(0,0,0,.1)":"none",fontFamily:"inherit",transition:"all .2s"}}>{m.l}</button>
          ))}
        </div>
        {/* Seats + Day */}
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {mode==="shared"&&<div style={{display:"flex",gap:5,alignItems:"center",flex:1}}>
            <span style={{fontSize:12,color:GY,fontWeight:600}}>Мест:</span>
            {[1,2,3,4].map(n=>(
              <button key={n} onClick={()=>setSeats(n)} style={{width:30,height:30,borderRadius:9,border:`1.5px solid ${seats===n?NV:BD}`,background:seats===n?NV:BG,color:seats===n?WH:DK,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{n}</button>
            ))}
          </div>}
          <div style={{display:"flex",gap:5,marginLeft:"auto"}}>
            {[{id:"today",l:"Сегодня"},{id:"tomorrow",l:"Завтра"}].map(d=>(
              <button key={d.id} onClick={()=>setDay(d.id)} style={{padding:"6px 11px",borderRadius:9,border:`1.5px solid ${day===d.id?NV:BD}`,background:day===d.id?NV:BG,color:day===d.id?WH:DK,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{d.l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={sc}>
        <div style={{padding:"10px 14px 28px"}}>
          {mode==="shared"?<>
            <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:8}}>ДОСТУПНЫЕ ПОПУТЧИКИ · {day==="today"?"СЕГОДНЯ":"ЗАВТРА"}</div>
            {drivers.length===0&&<div style={{textAlign:"center",padding:28,color:GY,fontSize:13}}>
              <div style={{fontSize:36,marginBottom:8}}>🔍</div>
              <div>Нет водителей с {seats} свободными местами</div>
              <div style={{fontSize:11,marginTop:4}}>Попробуйте меньше мест или другую дату</div>
            </div>}
            {drivers.map(d=>(
              <div key={d.id} style={{...card,padding:14,marginBottom:10,cursor:"pointer"}} onClick={()=>{setDrv(d);setStep("confirm");}}>
                <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
                  <div style={{width:46,height:46,background:`linear-gradient(135deg,${NV},#2D4B7A)`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:WH,fontWeight:900,flexShrink:0}}>{d.name[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:14,color:DK}}>{d.name}</div>
                    <div style={{fontSize:11,color:GY,marginTop:1}}>⭐ {d.r} · {d.trips} поездок · {d.car}</div>
                    <div style={{fontSize:10,color:GY,marginTop:1}}>{d.plate}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:900,fontSize:15,color:NV}}>{d.at}</div>
                    <div style={{fontSize:10,color:GY,marginTop:1}}>отправление</div>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <span style={{background:GRL,color:GR,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:7}}>👥 {d.seatsFree} места</span>
                    <span style={{background:BLL,color:BL,fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:7}}>💰 {rt.seat}с./место</span>
                  </div>
                  <div style={{fontWeight:900,fontSize:16,color:NV}}>{rt.seat*seats} с.</div>
                </div>
              </div>
            ))}
          </>:<>
            <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:12}}>АРЕНДА ВСЕГО АВТОМОБИЛЯ</div>
            <div style={{...card,padding:18,marginBottom:12,border:`2px solid ${NV}`}}>
              <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:12}}>
                <div style={{width:52,height:52,background:`linear-gradient(135deg,${NV},#2D4B7A)`,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>🚗</div>
                <div>
                  <div style={{fontWeight:800,fontSize:15,color:DK}}>Весь салон · 4 места</div>
                  <div style={{fontSize:11,color:GY,marginTop:2}}>Только ваши пассажиры · выезд в удобное время</div>
                </div>
              </div>
              {[["✅ Только ваши пассажиры","Никаких попутчиков"],["⚡ Выезд когда удобно","Без ожидания заполнения"],["💰 Фиксированная цена",`${rt.full} с. за весь маршрут`]].map(([t,s])=>(
                <div key={t} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}>
                  <div><div style={{fontSize:12,fontWeight:600,color:DK}}>{t}</div><div style={{fontSize:10,color:GY}}>{s}</div></div>
                </div>
              ))}
              <div style={{background:NV,borderRadius:14,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                <div style={{color:"rgba(255,255,255,.7)",fontSize:12}}>Итого за {rt.km} км:</div>
                <div style={{fontWeight:900,fontSize:22,color:WH}}>{rt.full} с.</div>
              </div>
            </div>
            <button onClick={()=>{setDrv({id:"full",name:"Ближайший водитель",r:4.8,car:"Подберём автомобиль",at:"Сейчас"});setStep("confirm");}} style={{width:"100%",padding:15,background:`linear-gradient(135deg,${NV},#2D4B7A)`,color:WH,border:"none",borderRadius:16,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 24px ${NV}44`}}>Заказать весь салон · {rt.full} с.</button>
          </>}
        </div>
      </div>
    </div>
  );

  // STEP 3: Подтверждение
  if(step==="confirm")return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#F8F7F4"}}>
      <div style={{background:`linear-gradient(135deg,${NV},#1B3A5C)`,padding:"10px 16px 16px",flexShrink:0}}>
        <button onClick={()=>setStep("drivers")} style={{background:"rgba(255,255,255,.15)",border:"none",color:WH,borderRadius:12,padding:"7px 13px",cursor:"pointer",fontSize:12,fontWeight:700,marginBottom:10,fontFamily:"inherit"}}>← Назад</button>
        <div style={{color:WH,fontWeight:900,fontSize:18}}>Подтверждение</div>
      </div>
      <div style={sc}><div style={{padding:"14px"}}>
        {/* Route summary */}
        <div style={{...card,padding:"14px 16px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:GR}}/><div style={{fontWeight:700,fontSize:13,color:DK}}>{rt.from}</div>
          </div>
          <div style={{width:2,height:14,background:BD,marginLeft:4,marginBottom:6}}/>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:10,height:10,borderRadius:"2px",background:R}}/><div style={{fontWeight:700,fontSize:13,color:DK}}>{rt.to}</div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:10,paddingTop:10,borderTop:`1px solid ${BD}`}}>
            <span style={{background:BG,borderRadius:8,padding:"3px 9px",fontSize:10,color:GY}}>🕒 {rt.h}</span>
            <span style={{background:BG,borderRadius:8,padding:"3px 9px",fontSize:10,color:GY}}>📍 {rt.km} км</span>
            <span style={{background:BG,borderRadius:8,padding:"3px 9px",fontSize:10,color:GY}}>{day==="today"?"Сегодня":"Завтра"} · {drv?.at}</span>
          </div>
        </div>
        {/* Driver */}
        {drv&&drv.id!=="full"&&<div style={{...card,padding:"13px 16px",marginBottom:10,display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:44,height:44,background:`linear-gradient(135deg,${NV},#2D4B7A)`,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:WH,fontWeight:900,flexShrink:0}}>{drv.name[0]}</div>
          <div><div style={{fontWeight:700,fontSize:13,color:DK}}>{drv.name}</div><div style={{fontSize:11,color:GY,marginTop:1}}>⭐ {drv.r} · {drv.car}</div></div>
        </div>}
        {/* Price breakdown */}
        <div style={{...card,padding:"13px 16px",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:8}}>💰 Стоимость поездки</div>
          {mode==="shared"
            ?[["Цена за место",`${rt.seat} с.`],[`Количество мест`,`× ${seats}`],["Итого",`${rt.seat*seats} с.`]].map(([l,v],i)=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<2?`1px solid ${BD}`:"none",fontSize:i===2?15:12,fontWeight:i===2?900:400,color:i===2?NV:DK}}>
                <span style={{color:i===2?NV:GY}}>{l}</span><span>{v}</span>
              </div>
            ))
            :[["Весь салон (4 места)",`${rt.full} с.`],["Ожидания нет","включено"],["Фиксированная цена",`${rt.full} с.`]].map(([l,v],i)=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<2?`1px solid ${BD}`:"none",fontSize:i===2?15:12,fontWeight:i===2?900:400,color:i===2?NV:DK}}>
                <span style={{color:i===2?NV:GY}}>{l}</span><span>{v}</span>
              </div>
            ))
          }
        </div>
        <button onClick={()=>setStep("booked")} style={{width:"100%",padding:15,background:`linear-gradient(135deg,${NV},#2D4B7A)`,color:WH,border:"none",borderRadius:16,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 24px ${NV}44`,marginBottom:10}}>
          💚 Оплатить через АЛИФ · {totalPrice} с.
        </button>
        <button onClick={()=>setStep("booked")} style={{width:"100%",padding:13,background:"none",border:`1.5px solid ${BD}`,borderRadius:14,fontSize:13,color:DK,cursor:"pointer",fontFamily:"inherit"}}>
          💵 Оплатить наличными водителю
        </button>
      </div></div>
    </div>
  );

  // STEP 4: Забронировано
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#F8F7F4",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:88,height:88,background:GRL,borderRadius:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,marginBottom:18}}>✅</div>
      <div style={{fontWeight:900,fontSize:22,color:DK,textAlign:"center",marginBottom:6}}>Поездка забронирована!</div>
      <div style={{fontSize:13,color:GY,textAlign:"center",marginBottom:24}}>{rt.from} → {rt.to}</div>
      <div style={{width:"100%",...card,padding:16,marginBottom:20}}>
        {[
          ["🗺️ Маршрут",`${rt.from} → ${rt.to}`],
          ["🕒 Отправление",`${day==="today"?"Сегодня":"Завтра"} · ${drv?.at||"по готовности"}`],
          ["🚗 Водитель", drv?.id==="full"?"Ближайший водитель":drv?.name||""],
          ["👥 Режим",mode==="shared"?`Попутчик · ${seats} мест(а)`:"Весь салон"],
          ["💰 Оплата",`${totalPrice} с.`],
        ].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BD}`,fontSize:12}}>
            <span style={{color:GY}}>{l}</span><span style={{fontWeight:600,color:DK}}>{v}</span>
          </div>
        ))}
      </div>
      <button onClick={onBack} style={{width:"100%",padding:15,background:R,color:WH,border:"none",borderRadius:16,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 8px 24px ${R}44`}}>← На главную</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  СХЕМАТИЧНАЯ ВЕКТОРНАЯ КАРТА — реальная геопроекция (Меркатор)
//  Весь мир · фокус на Таджикистане · pan/zoom · маршруты · анимация
// ══════════════════════════════════════════════════════════════════

// Проекция Меркатора (нормализованные мировые координаты 0..1)
function mercX(lng){ return (lng+180)/360; }
function mercY(lat){ const r=lat*Math.PI/180; return (1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2; }
function projXY(lat,lng,cLat,cLng,zoom,W,H){
  const scale=256*Math.pow(2,zoom);
  return {x:mercX(lng)*scale-mercX(cLng)*scale+W/2, y:mercY(lat)*scale-mercY(cLat)*scale+H/2};
}
function unprojLL(px,py,cLat,cLng,zoom,W,H){
  const scale=256*Math.pow(2,zoom);
  const mx=(px-W/2+mercX(cLng)*scale)/scale, my=(py-H/2+mercY(cLat)*scale)/scale;
  return {lat:180/Math.PI*Math.atan(Math.sinh(Math.PI*(1-2*my))), lng:mx*360-180};
}
function visBounds(cLat,cLng,zoom,W,H){
  const tl=unprojLL(0,0,cLat,cLng,zoom,W,H), br=unprojLL(W,H,cLat,cLng,zoom,W,H);
  return {n:tl.lat,s:br.lat,w:tl.lng,e:br.lng};
}

// Города Таджикистана (реальные координаты)
const TJ_CITIES=[
  {n:"Душанбе",lat:38.56,lng:68.77,big:true},
  {n:"Худжанд",lat:40.28,lng:69.62,big:true},
  {n:"Куляб",lat:37.91,lng:69.78,big:true},
  {n:"Бохтар",lat:37.84,lng:68.78,big:true},
  {n:"Хорог",lat:37.49,lng:71.55},
  {n:"Истаравшан",lat:39.91,lng:69.00},
  {n:"Канибадам",lat:40.28,lng:70.43},
  {n:"Исфара",lat:40.13,lng:70.62},
  {n:"Пенджикент",lat:39.50,lng:67.61},
  {n:"Турсунзаде",lat:38.51,lng:68.23},
  {n:"Вахдат",lat:38.56,lng:69.02},
  {n:"Гиссар",lat:38.52,lng:68.55},
  {n:"Нурек",lat:38.39,lng:69.32},
  {n:"Рогун",lat:38.69,lng:69.72},
];
// Упрощённый контур Таджикистана (lng,lat)
const TJ_OUTLINE="67.4,39.2 68.0,40.2 69.3,40.4 70.6,40.3 70.9,40.0 70.5,39.5 73.6,39.5 74.9,38.6 73.8,37.3 72.3,37.0 70.0,37.1 68.6,37.4 68.0,36.7 67.7,38.0 67.4,39.2";
// Соседи (метки)
const TJ_NEIGHBORS=[
  {n:"УЗБЕКИСТАН",lat:40.2,lng:67.3},
  {n:"КЫРГЫЗСТАН",lat:40.6,lng:72.0},
  {n:"КИТАЙ",lat:38.6,lng:74.3},
  {n:"АФГАНИСТАН",lat:36.9,lng:70.0},
];
// Очень упрощённые континенты (для вида мира при отдалении)
const WORLD_LAND=[
  "-130,55 -100,60 -80,48 -78,25 -100,16 -120,30 -125,42",
  "-80,8 -60,5 -35,-6 -55,-35 -72,-52 -78,-18 -82,2",
  "-10,52 18,60 40,58 42,44 14,37 -9,40",
  "-16,32 32,33 50,12 40,-18 18,-35 9,-2 -14,12",
  "42,58 90,68 140,62 150,38 120,18 95,8 60,22 45,36 40,48",
  "112,-12 134,-11 152,-30 138,-38 115,-34 113,-22",
];

// Генерация схематичной сетки улиц вокруг центра (для зума города)
function genStreets(cLat,cLng,zoom,W,H){
  const b=visBounds(cLat,cLng,zoom,W,H);
  const step=0.0045;
  const lines=[];
  const lat0=Math.floor(b.s/step)*step, lat1=Math.ceil(b.n/step)*step;
  const lng0=Math.floor(b.w/step)*step, lng1=Math.ceil(b.e/step)*step;
  let k=0;
  for(let la=lat0; la<=lat1; la+=step){
    const a=projXY(la,b.w,cLat,cLng,zoom,W,H), z=projXY(la,b.e,cLat,cLng,zoom,W,H);
    lines.push({x1:a.x,y1:a.y,x2:z.x,y2:z.y,major:k%3===0}); k++;
  }
  k=0;
  for(let ln=lng0; ln<=lng1; ln+=step){
    const a=projXY(b.n,ln,cLat,cLng,zoom,W,H), z=projXY(b.s,ln,cLat,cLng,zoom,W,H);
    lines.push({x1:a.x,y1:a.y,x2:z.x,y2:z.y,major:k%3===0}); k++;
  }
  return lines;
}
// Интерполяция позиции по маршруту (0..1) в lat/lng
function interpLL(route,t){
  let total=0,segs=[];
  for(let i=1;i<route.length;i++){const d=Math.hypot(route[i].lat-route[i-1].lat,route[i].lng-route[i-1].lng);segs.push(d);total+=d;}
  let dist=t*total,acc=0;
  for(let i=0;i<segs.length;i++){
    if(acc+segs[i]>=dist){const f=(dist-acc)/(segs[i]||1e-9);return {lat:route[i].lat+(route[i+1].lat-route[i].lat)*f,lng:route[i].lng+(route[i+1].lng-route[i].lng)*f,seg:i};}
    acc+=segs[i];
  }
  return {...route[route.length-1],seg:route.length-2};
}

// ═══ REAL MAP (Leaflet · CartoDB Voyager · стиль Яндекс) ═══
function loadLeafletOnce() {
    if (window.__lfP)
        return window.__lfP;
    window.__lfP = new Promise((res) => {
        if (!document.getElementById("lf-css")) {
            const l = document.createElement("link");
            l.id = "lf-css";
            l.rel = "stylesheet";
            l.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
            document.head.appendChild(l);
        }
        if (window.L)
            return res(window.L);
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        s.onload = () => res(window.L);
        document.head.appendChild(s);
    });
    return window.__lfP;
}
(function injectMapCss() {
    if (document.getElementById("zood-map-css"))
        return;
    const st = document.createElement("style");
    st.id = "zood-map-css";
    st.textContent = `
.leaflet-container{background:#EDEBE6;font-family:inherit}
.zm-pin{filter:drop-shadow(0 3px 5px rgba(0,0,0,.3))}
.zm-eta{background:#FFDE40;color:#111;font-weight:900;font-size:13px;padding:5px 10px;border-radius:12px;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,.25);border:2px solid #fff;text-align:center;line-height:1.15}
.zm-eta small{display:block;font-size:9px;font-weight:700;color:#6b5b00}
.zm-a{width:20px;height:20px;border-radius:50%;background:#fff;border:5px solid #111;box-shadow:0 2px 6px rgba(0,0,0,.3)}
.zm-wp{width:20px;height:20px;border-radius:50%;background:#D97706;border:3px solid #fff;color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3)}
.zm-car{width:34px;height:34px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,.35);border:2px solid #00B341}
.zm-car svg{transition:transform .8s linear}
.zm-user{position:relative;width:18px;height:18px}
.zm-user .dot{position:absolute;inset:0;border-radius:50%;background:#1A73E8;border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.35)}
.zm-user .ping{position:absolute;inset:-4px;border-radius:50%;background:#1A73E8;opacity:.35;animation:zping 2s ease-out infinite}
@keyframes zping{0%{transform:scale(.6);opacity:.5}100%{transform:scale(2.6);opacity:0}}
`;
    document.head.appendChild(st);
})();
function bearingLL(a, b) {
    const dLng = (b.lng - a.lng) * Math.cos((a.lat + b.lat) / 2 * Math.PI / 180);
    return Math.atan2(dLng, b.lat - a.lat) * 180 / Math.PI;
}
function SchematicMap({ markers, route, carProg, picking, onPick, fitKey, follow, userLoc, etaMin }) {
    const boxRef = useRef(null);
    const mapRef = useRef(null);
    const lyRef = useRef({ route: null, marks: null, car: null, user: null });
    const [ready, setReady] = useState(false);
    const pickRef = useRef(onPick);
    pickRef.current = onPick;
    // ── init ──
    useEffect(() => {
        let dead = false;
        loadLeafletOnce().then((L) => {
            if (dead || !boxRef.current || mapRef.current)
                return;
            const map = L.map(boxRef.current, { zoomControl: false, attributionControl: false, preferCanvas: true });
            map.setView([38.5598, 68.787], 13);
            L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 19, subdomains: "abcd" }).addTo(map);
            L.control.attribution({ position: "bottomleft", prefix: false }).addAttribution("© OSM · CARTO").addTo(map);
            map.on("click", (e) => { if (pickRef.current)
                pickRef.current(e.latlng.lat, e.latlng.lng); });
            mapRef.current = map;
            const ro = new ResizeObserver(() => { try {
                map.invalidateSize();
            }
            catch (e) { } });
            ro.observe(boxRef.current);
            map.__ro = ro;
            setTimeout(() => map.invalidateSize(), 80);
            setReady(true);
        });
        return () => {
            dead = true;
            if (mapRef.current) {
                if (mapRef.current.__ro)
                    mapRef.current.__ro.disconnect();
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);
    // ── маршрут (стиль Яндекс: белая подложка + зелёная линия + «пробки») ──
    const routeKey = route && route.length >= 2 ? route.length + "|" + route[0].lat.toFixed(4) + "|" + route[route.length - 1].lat.toFixed(4) + "|" + route[route.length - 1].lng.toFixed(4) : "0";
    useEffect(() => {
        const L = window.L, map = mapRef.current;
        if (!ready || !L || !map)
            return;
        if (lyRef.current.route) {
            map.removeLayer(lyRef.current.route);
            lyRef.current.route = null;
        }
        if (route && route.length >= 2) {
            const pts = route.map(p => [p.lat, p.lng]);
            const g = L.layerGroup();
            L.polyline(pts, { color: "#fff", weight: 11, opacity: 1, lineCap: "round", lineJoin: "round" }).addTo(g);
            L.polyline(pts, { color: "#00B341", weight: 6.5, opacity: 1, lineCap: "round", lineJoin: "round" }).addTo(g);
            // имитация пробок: детерминированные жёлтые/красные отрезки
            if (route.length > 20) {
                const segN = Math.min(14, Math.floor(route.length / 8));
                const step = Math.floor(route.length / segN);
                for (let i = 0; i < segN; i++) {
                    const h = (i * 2654435761 + route.length * 97) >>> 0;
                    const r = (h % 100);
                    if (r < 18) {
                        const a = i * step, b = Math.min(route.length - 1, a + Math.max(3, Math.floor(step * .6)));
                        L.polyline(pts.slice(a, b + 1), { color: r < 6 ? "#E53935" : "#F5A623", weight: 6.5, opacity: 1, lineCap: "round" }).addTo(g);
                    }
                }
            }
            g.addTo(map);
            lyRef.current.route = g;
        }
    }, [ready, routeKey, carProg == null ? "x" : "ride"]);
    // ── маркеры A/B + ETA ──
    const markKey = (markers || []).map(m => m.lat.toFixed(4) + "," + m.lng.toFixed(4)).join("|") + "|" + (etaMin || "");
    useEffect(() => {
        const L = window.L, map = mapRef.current;
        if (!ready || !L || !map)
            return;
        if (lyRef.current.marks) {
            map.removeLayer(lyRef.current.marks);
            lyRef.current.marks = null;
        }
        const ms = markers || [];
        if (!ms.length)
            return;
        const g = L.layerGroup();
        ms.forEach((m, i) => {
            const last = i === ms.length - 1;
            if (i === 0 && ms.length > 1) {
                L.marker([m.lat, m.lng], { icon: L.divIcon({ className: "", html: '<div class="zm-a"></div>', iconSize: [20, 20], iconAnchor: [10, 10] }), interactive: false }).addTo(g);
            }
            else if (last) {
                const pin = '<svg class="zm-pin" width="34" height="46" viewBox="0 0 34 46"><path d="M17 45C17 45 32 26.5 32 16.5C32 8 25.3 1 17 1C8.7 1 2 8 2 16.5C2 26.5 17 45 17 45Z" fill="#00B341" stroke="#fff" stroke-width="2.5"/><circle cx="17" cy="16.5" r="5.5" fill="#fff"/></svg>';
                L.marker([m.lat, m.lng], { icon: L.divIcon({ className: "", html: pin, iconSize: [34, 46], iconAnchor: [17, 44] }), interactive: false }).addTo(g);
                if (etaMin) {
                    L.marker([m.lat, m.lng], { icon: L.divIcon({ className: "", html: `<div class="zm-eta">${etaMin}<small>мин</small></div>`, iconSize: [0, 0], iconAnchor: [-14, 62] }), interactive: false }).addTo(g);
                }
            }
            else {
                L.marker([m.lat, m.lng], { icon: L.divIcon({ className: "", html: `<div class="zm-wp">${i}</div>`, iconSize: [20, 20], iconAnchor: [10, 10] }), interactive: false }).addTo(g);
            }
        });
        g.addTo(map);
        lyRef.current.marks = g;
    }, [ready, markKey]);
    // ── автоподгонка ──
    useEffect(() => {
        const L = window.L, map = mapRef.current;
        if (!ready || !L || !map)
            return;
        const ms = markers || [];
        if (!ms.length)
            return;
        if (ms.length === 1) {
            map.setView([ms[0].lat, ms[0].lng], 15, { animate: true });
            return;
        }
        const src = (route && route.length >= 2) ? route : ms;
        const b = L.latLngBounds(src.map(p => [p.lat, p.lng]));
        map.fitBounds(b, { paddingTopLeft: [42, 66], paddingBottomRight: [42, 86], animate: true, maxZoom: 16 });
    }, [ready, fitKey, routeKey]);
    // ── машина (плавное движение + поворот по маршруту) ──
    useEffect(() => {
        const L = window.L, map = mapRef.current;
        if (!ready || !L || !map)
            return;
        const has = carProg != null && route && route.length >= 2;
        if (!has) {
            if (lyRef.current.car) {
                map.removeLayer(lyRef.current.car);
                lyRef.current.car = null;
            }
            return;
        }
        const p = interpLL(route, carProg);
        const p2 = interpLL(route, Math.min(1, carProg + 0.012));
        const ang = bearingLL(p, p2);
        const html = `<div class="zm-car"><svg width="20" height="20" viewBox="0 0 24 24" style="transform:rotate(${Math.round(ang)}deg)"><path d="M12 2L19 21L12 17L5 21L12 2Z" fill="#00B341" stroke="#008C32" stroke-width="1" stroke-linejoin="round"/></svg></div>`;
        if (!lyRef.current.car) {
            lyRef.current.car = L.marker([p.lat, p.lng], { icon: L.divIcon({ className: "", html, iconSize: [34, 34], iconAnchor: [17, 17] }), interactive: false, zIndexOffset: 900 }).addTo(map);
        }
        else {
            lyRef.current.car.setLatLng([p.lat, p.lng]);
            const el = lyRef.current.car.getElement();
            if (el) {
                const svg = el.querySelector("svg");
                if (svg)
                    svg.style.transform = `rotate(${Math.round(ang)}deg)`;
            }
        }
        if (follow)
            map.panTo([p.lat, p.lng], { animate: true, duration: 0.8 });
    }, [ready, carProg, follow]);
    // ── моя геопозиция ──
    useEffect(() => {
        const L = window.L, map = mapRef.current;
        if (!ready || !L || !map)
            return;
        if (userLoc && userLoc.lat) {
            const html = '<div class="zm-user"><div class="ping"></div><div class="dot"></div></div>';
            if (!lyRef.current.user) {
                lyRef.current.user = L.marker([userLoc.lat, userLoc.lng], { icon: L.divIcon({ className: "", html, iconSize: [18, 18], iconAnchor: [9, 9] }), interactive: false, zIndexOffset: 800 }).addTo(map);
                if (!follow)
                    map.flyTo([userLoc.lat, userLoc.lng], Math.max(map.getZoom(), 15), { duration: 0.9 });
            }
            else
                lyRef.current.user.setLatLng([userLoc.lat, userLoc.lng]);
        }
        else if (lyRef.current.user) {
            map.removeLayer(lyRef.current.user);
            lyRef.current.user = null;
        }
    }, [ready, userLoc && userLoc.lat, userLoc && userLoc.lng]);
    return (React.createElement("div", { style: { position: "absolute", inset: 0, overflow: "hidden", background: "#EDEBE6" } },
        React.createElement("div", { ref: boxRef, style: { position: "absolute", inset: 0, cursor: picking ? "crosshair" : "grab" } }),
        !ready && React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 12, fontWeight: 600 } }, "Загрузка карты…"),
        React.createElement("div", { style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 6, zIndex: 500 } },
            React.createElement("button", { onClick: () => mapRef.current && mapRef.current.zoomIn(), style: { width: 38, height: 38, background: "#fff", border: "none", borderRadius: 11, boxShadow: "0 2px 10px rgba(0,0,0,.18)", fontSize: 20, fontWeight: 700, cursor: "pointer", color: "#333" } }, "+"),
            React.createElement("button", { onClick: () => mapRef.current && mapRef.current.zoomOut(), style: { width: 38, height: 38, background: "#fff", border: "none", borderRadius: 11, boxShadow: "0 2px 10px rgba(0,0,0,.18)", fontSize: 22, fontWeight: 700, cursor: "pointer", color: "#333" } }, "−"),
            React.createElement("button", { onClick: () => mapRef.current && mapRef.current.setView([38.5598, 68.787], 13, { animate: true }), title: "Таджикистан", style: { width: 38, height: 38, background: "#fff", border: "none", borderRadius: 11, boxShadow: "0 2px 10px rgba(0,0,0,.18)", fontSize: 15, cursor: "pointer" } }, "🇹🇯"))));
}
// ═══ CUSTOMER APP v3 — Yandex Go стиль · Рейтинг · Живая карта · Нижнее меню ═══

const SAVED_ADDRESSES=[
  {id:"home",icon:"🏠",label:"Домой",addr:"ул. Борбад, 22к1, кв. 47",sub:"Сохранённый"},
  {id:"work",icon:"💼",label:"Работа",addr:"пр. Рудаки, 15, оф. 304",sub:"Сохранённый"},
  {id:"mom", icon:"👩",label:"У мамы",addr:"мкр. Путовский, 5/2",sub:"Сохранённый"},
];
const PAY_METHODS=[
  {id:"alif",  label:"АЛИФ Пэй",        icon:"💚",balance:"245.50 с.",accent:"#00A850",bg:"#E8F8EE"},
  {id:"eskhata",label:"Эсхата",          icon:"🔵",balance:null,      accent:"#0057A8",bg:"#E8F2FF"},
  {id:"card",  label:"VISA **** 4521",   icon:"💳",balance:null,      accent:"#1A1A2E",bg:"#F1F5F9"},
  {id:"cash",  label:"Наличными курьеру",icon:"💵",balance:null,      accent:"#374151",bg:"#F9FAFB"},
];
const NOTIFS=[
  {id:1,e:"🔴",t:"Заказ принят",   b:"Рохат готовит ваш заказ. ~25 мин",time:"2 мин",read:false},
  {id:2,e:"🎁",t:"Скидка 20%!",   b:"Только до 23:59 на заказы от 50 с.",time:"1 час",read:false},
  {id:3,e:"🚴",t:"Курьер едет",   b:"Акбар Д. будет у вас через ~15 мин",time:"3 час",read:true},
  {id:4,e:"✅",t:"Заказ доставлен",b:"Корвон Маркет — заказ доставлен",   time:"Вчера",read:true},
  {id:5,e:"⚡",t:"Добро пожаловать!",b:"Первая доставка — бесплатно!",   time:"2 дня",read:true},
];
const ORDER_HISTORY=[
  {id:"h1",partner:"Рохат",e:"🍛",items:"Кабоби дамба ×2, Нони тандир",total:102,status:"Доставлен",date:"Сегодня, 14:23",ok:true},
  {id:"h2",partner:"Аптека Фараш",e:"💊",items:"Ибупрофен, Витамин C",total:27,status:"Доставлен",date:"Вчера, 11:05",ok:true},
  {id:"h3",partner:"Такси · Эконом",e:"🚗",items:"пр. Рудаки → ул. Айни",total:12,status:"Завершён",date:"Вчера, 09:30",ok:true},
  {id:"h4",partner:"Корвон Маркет",e:"🛒",items:"Гранат, Катык, Девзира",total:65,status:"Доставлен",date:"3 дня назад",ok:true},
  {id:"h5",partner:"Шарк Пицца",e:"🍕",items:"Пепперони 32 см ×1",total:58,status:"Отменён",date:"Неделю назад",ok:false},
];
const PROMOS=[
  {id:"p1",code:"ZOOD20",label:"−20% на первый заказ",desc:"Действует до конца месяца",color:"#00B341",icon:"🎁",used:false},
  {id:"p2",code:"ALIF50",label:"−50 с. при оплате АЛИФ",desc:"Только для новых пользователей",color:"#00A850",icon:"💚",used:false},
  {id:"p3",code:"TAXI10",label:"10 с. на такси",desc:"Каждый 5-й маршрут",color:"#1565C0",icon:"🚕",used:true},
];

// Город-иллюстрация (Душанбе) — SVG фон для главного экрана
function CityMapBg(){
  return(
    <svg viewBox="0 0 390 480" style={{position:"absolute",inset:0,width:"100%",height:"100%"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E9E6E0"/><stop offset="100%" stopColor="#DEDAD3"/></linearGradient>
        <linearGradient id="wG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#93C5FD"/><stop offset="100%" stopColor="#3B82F6" stopOpacity=".7"/></linearGradient>
        <linearGradient id="pG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#86EFAC"/><stop offset="100%" stopColor="#22C55E" stopOpacity=".8"/></linearGradient>
      </defs>
      <rect width="390" height="480" fill="url(#bgG)"/>
      <pattern id="pg" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0L0 0 0 32" fill="none" stroke="#CFCAC3" strokeWidth=".5" opacity=".7"/></pattern>
      <rect width="390" height="480" fill="url(#pg)"/>
      <path d="M365 0 Q371 70 360 150 Q349 230 362 310 Q375 390 368 480" stroke="url(#wG)" strokeWidth="28" fill="none" strokeLinecap="round"/>
      <path d="M365 0 Q371 70 360 150 Q349 230 362 310 Q375 390 368 480" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".4"/>
      <ellipse cx="195" cy="148" rx="78" ry="46" fill="url(#pG)" opacity=".7"/>
      <circle cx="98" cy="62" r="38" fill="#BBF7D0" opacity=".6"/>
      <circle cx="310" cy="380" r="28" fill="#BBF7D0" opacity=".5"/>
      <rect x="180" y="0" width="20" height="480" fill="white" opacity=".95"/>
      <rect x="183" y="0" width="14" height="480" fill="#FFF8E1" opacity=".5"/>
      <rect x="0" y="192" width="390" height="18" fill="white" opacity=".95"/>
      <rect x="0" y="195" width="390" height="12" fill="#FFF8E1" opacity=".5"/>
      {[[0,104,390,9],[0,292,390,9],[0,388,390,7],[88,0,9,480],[270,0,9,480],[143,0,6,480]].map(([x,y,w,h],i)=><rect key={i} x={x} y={y} width={w} height={h} fill="white" opacity={.72}/>)}
      <circle cx="190" cy="201" r="34" fill="none" stroke="white" strokeWidth="16" opacity=".8"/>
      <circle cx="190" cy="201" r="21" fill="#D4D0C8" opacity=".85"/>
      {[[8,8,58,46,6],[80,8,54,46,6],[8,64,46,28,4],[80,64,46,20,4],[228,8,54,46,6],[304,8,52,46,6],[228,64,46,20,4],[304,64,46,20,4],[8,222,58,52,6],[80,222,46,52,5],[8,288,54,46,5],[228,222,54,52,6],[304,222,54,52,6],[228,288,46,46,5],[304,288,46,46,5],[8,348,56,40,5],[80,348,46,40,4],[228,348,54,40,5],[304,348,52,40,5],[8,404,52,52,6],[80,404,46,52,5],[228,404,52,52,6]].map(([x,y,w,h,r],i)=>(<rect key={i} x={x} y={y} width={w} height={h} rx={r} fill={i%3===0?"#C4BFB7":i%3===1?"#CBC6BE":"#D0CBC3"} opacity=".75"/>))}
      <text x="128" y="188" fontSize="18" opacity=".85"><Icon name="taxi" size={15} color="currentColor"/></text>
      <text x="240" y="143" fontSize="16" opacity=".75"><Icon name="car" size={15} color="currentColor"/></text>
      <text x="74" y="198" fontSize="14" opacity=".65"><Icon name="car" size={15} color="currentColor"/></text>
      <text x="213" y="238" fontSize="15" opacity=".7"><Icon name="taxi" size={15} color="currentColor"/></text>
      <text x="148" y="248" fontSize="13" opacity=".6"><Icon name="car" size={15} color="currentColor"/></text>
      <text x="192" y="85" fontSize="8" fill="#9CA3AF" textAnchor="middle" fontWeight="600" opacity=".9" transform="rotate(-90 192 85)">пр. Рудаки</text>
      <text x="62" y="196" fontSize="7" fill="#9CA3AF" textAnchor="middle" opacity=".8">ул. Айни</text>
      <text x="316" y="196" fontSize="7" fill="#9CA3AF" textAnchor="middle" opacity=".8">пр. Сомони</text>
      <text x="192" y="145" fontSize="9" fill="#15803D" textAnchor="middle" fontWeight="600" opacity=".75"><Icon name="tree" size={14} color="currentColor" style={{marginRight:5}}/>Парк Рудаки</text>
      <circle cx="190" cy="201" r="24" fill="rgba(21,101,192,.12)"/>
      <circle cx="190" cy="201" r="14" fill="rgba(21,101,192,.22)"/>
      <circle cx="190" cy="201" r="9" fill="#1565C0" opacity=".92"/>
      <circle cx="190" cy="201" r="5.5" fill="white"/>
    </svg>
  );
}

// ── Rating Modal ──────────────────────────────────────────────────
function RatingModal({type,name,onDone}){
  const [stars,setStars]=useState(0);
  const [tags,setTags]=useState([]);
  const TAGS=type==="taxi"
    ?["Вежливый","Быстро","Аккуратное вождение","Чистый салон","Молчалив","Помог с вещами"]
    :["Вежливый","Быстро","Упаковка аккуратная","Всё в наличии","Горячая еда"];
  const toggle=t=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  return(
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.52)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:WH,borderRadius:"22px 22px 0 0",width:"100%",padding:"6px 18px 28px"}}>
        <div style={{width:36,height:4,background:BD,borderRadius:2,margin:"11px auto 16px"}}/>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:48,marginBottom:6}}>{type==="taxi"?"🚗":"🚴"}</div>
          <div style={{fontWeight:900,fontSize:17,color:DK}}>Оцените {type==="taxi"?"поездку":"доставку"}</div>
          <div style={{fontSize:12,color:GY,marginTop:2}}>{name}</div>
        </div>
        {/* Stars */}
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:14}}>
          {[1,2,3,4,5].map(s=>(
            <button key={s} onClick={()=>setStars(s)} style={{fontSize:36,background:"none",border:"none",cursor:"pointer",transition:"transform .1s",transform:s<=stars?"scale(1.15)":"scale(1)",filter:s<=stars?"none":"grayscale(100%) opacity(25%)"}}><Icon name="star" size={15} color="currentColor"/></button>
          ))}
        </div>
        {/* Tags */}
        {stars>0&&<div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center",marginBottom:16}}>
          {TAGS.map(t=>(
            <button key={t} onClick={()=>toggle(t)} style={{padding:"7px 12px",borderRadius:22,border:`1.5px solid ${tags.includes(t)?GR:BD}`,background:tags.includes(t)?GRL:WH,color:tags.includes(t)?GR:GY,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{t}</button>
          ))}
        </div>}
        <button onClick={onDone} style={{width:"100%",padding:14,background:stars>0?`linear-gradient(135deg,#1B5E20,${GR})`:BG,color:stars>0?WH:MG,border:"none",borderRadius:15,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:stars>0?`0 6px 20px ${GR}44`:"none",transition:"all .2s"}}>
          {stars>0?`Отправить оценку (${stars} ⭐)`:"Пропустить"}
        </button>
      </div>
    </div>
  );
}

function CustomerApp({onOrder,orders}){
  const [auth,setAuth]=useStore("zudgo_profile_v1",null);
  const cart=useCart();
  const [scr,setScr]=useState("home");
  const [showGuestPrompt,setShowGuestPrompt]=useState(false);
  const isGuest=auth?.guest===true;
  // ── Toast уведомления ─────────────────────────────────────────
  const [toasts,setToasts]=useState([]);
  function toast(msg,type){
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3500);
  };
  // ── Чат с водителем ────────────────────────────────────────────
  const [showChat,setShowChat]=useState(false);
  const [chatMsgs,setChatMsgs]=useState([
    {id:1,from:"driver",text:"Еду к вам, буду через 3 мин 👋",time:"14:25"},
    {id:2,from:"me",text:"Хорошо, жду у подъезда",time:"14:25"},
    {id:3,from:"driver",text:"Подъезжаю, посмотрите в окно 🚗",time:"14:27"},
  ]);
  const [chatInput,setChatInput]=useState("");
  function sendChatMsg(){
    if(!chatInput.trim())return;
    const id=Date.now();
    const now=new Date();
    const time=`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setChatMsgs(p=>[...p,{id,from:"me",text:chatInput,time}]);
    setChatInput("");
    setTimeout(()=>setChatMsgs(p=>[...p,{id:id+1,from:"driver",text:"Понял 👍",time}]),1200);
  };
  const [mainTab,setMainTab]=useState("home"); // home|orders|promo|profile
  const [showRating,setShowRating]=useState(false);
  function requireAuth(){if(isGuest){setShowGuestPrompt(true);return false;}return true;};
  const [ratingType,setRatingType]=useState("delivery");
  // checkout
  const [chkAddr,setChkAddr]=useState(SAVED_ADDRESSES[0]);
  const [chkPay,setChkPay]=useState(PAY_METHODS[0]);
  const [chkStep,setChkStep]=useState("address");
  const [cardNum,setCardNum]=useState(""); const [cardDate,setCardDate]=useState(""); const [cardCvv,setCardCvv]=useState("");
  // delivery
  const [dTab,setDTab]=useState("food");
  const [partner,setPartner]=useState(null); const [pCat,setPCat]=useState(null); const [showCart,setShowCart]=useState(false);
  const [dFrom,setDFrom]=useState(""); const [dTo,setDTo]=useState(""); const [dParcel,setDParcel]=useState(null);
  const [cFrom,setCFrom]=useState(""); const [cTo,setCTo]=useState(""); const [cVehicle,setCVehicle]=useState(null); const [cMovers,setCMovers]=useState(0);
  const [delivSug,setDelivSug]=useState({list:[],key:null});
  const [delivPts,setDelivPts]=useState({}); // координаты точек доставки {dFrom:{lat,lng},dTo:{...},cFrom,cTo}
  function delivSuggest(val,key,setter){
    setter(val);
    const q=val.toLowerCase().trim();
    if(q.length>0){setDelivSug({list:DUSHANBE_PLACES.filter(p=>p.name.toLowerCase().includes(q)||p.addr.toLowerCase().includes(q)).slice(0,5),key});}
    else{setDelivSug({list:DUSHANBE_PLACES.filter(p=>p.pop),key});}
  }
  function delivFocus(val,key){
    const q=(val||"").toLowerCase().trim();
    if(q.length>0){setDelivSug({list:DUSHANBE_PLACES.filter(p=>p.name.toLowerCase().includes(q)||p.addr.toLowerCase().includes(q)).slice(0,5),key});}
    else{setDelivSug({list:DUSHANBE_PLACES.filter(p=>p.pop),key});}
  }
  // help/gas
  const [selHelp,setSelHelp]=useState(null); const [hlpStatus,setHlpStatus]=useState("idle");
  const [gSt,setGSt]=useState(null); const [gFuel,setGFuel]=useState(null); const [gAmt,setGAmt]=useState("");
  // tracking
  const [trackStage,setTrackStage]=useState(0);
  // notifs
  const [notifs,setNotifs]=useState(NOTIFS);
  const unread=notifs.filter(n=>!n.read).length;
  // promos
  const [promos,setPromos]=useState(PROMOS);
  const [bannerIdx,setBannerIdx]=useState(0);
  const BANNERS=[
    {bg:`linear-gradient(135deg,${R},${RD})`,e:"🎁",t:"Первая поездка −50%",s:"Промокод ZOOD50 · До конца месяца",btn:"Применить"},
    {bg:`linear-gradient(135deg,${NV},#1B3A5C)`,e:"🚕",t:"Ночное такси −20%",s:"С 23:00 до 06:00 · Любой маршрут",btn:"Заказать"},
    {bg:`linear-gradient(135deg,${GR},#1B5E20)`,e:"📦",t:"Бесплатная доставка",s:"При заказе от 50 с. в любом кафе",btn:"Открыть"},
    {bg:`linear-gradient(135deg,${GD},#B45309)`,e:"⭐",t:"Приведи друга",s:"Вы и друг получите по 20 с.",btn:"Пригласить"},
  ];

  useEffect(()=>{
    let t;
    if(hlpStatus==="searching")t=setTimeout(()=>setHlpStatus("found"),3000);
    return()=>clearTimeout(t);
  },[hlpStatus]);

  useEffect(()=>{
    if(scr==="tracking"){
      setTrackStage(0);
      const t1=setTimeout(()=>setTrackStage(1),3000);
      const t2=setTimeout(()=>setTrackStage(2),7000);
      const t3=setTimeout(()=>setShowRating(true),11000);
      return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
    }
  },[scr]);

  function openPartner(p){setPartner(p);setPCat(p.cats[0]);setScr("partner");};
  function startCheckout(){setChkStep("address");setChkAddr(SAVED_ADDRESSES[0]);setChkPay(PAY_METHODS[0]);setShowCart(false);setScr("checkout");};
  function processPayment(){
    setChkStep("processing");
    setTimeout(()=>{
      if(partner)onOrder({customer:auth?.name||"Клиент",items:cart.items.map(i=>({name:i.name,qty:i.qty,price:i.price})),subtotal:cart.total,deliveryFee:partner.fee,total:cart.total+partner.fee,address:chkAddr.addr,partner:partner.name,partnerId:partner.id,comment:""});
      cart.clear();setScr("tracking");setChkStep("address");setRatingType("delivery");
    },2200);
  };

  function SB({bg=WH,dark=true}){return <div style={{background:bg,padding:"10px 22px 5px",display:"flex",justifyContent:"space-between",flexShrink:0}}><span style={{color:dark?DK:WH,fontSize:13,fontWeight:700}}>9:41</span><span style={{color:dark?DK:WH,fontSize:12}}>●●● 🔋</span></div>;}
  const card={background:WH,borderRadius:18,border:`1px solid ${BD}`,boxShadow:"0 2px 14px rgba(0,0,0,.06)"};
  const sc={flex:1,overflowY:"auto",overflowX:"hidden",scrollbarWidth:"none"};
  function Btn({label,on=true,onClick,color=R}){return <button onClick={onClick} disabled={!on} style={{width:"100%",padding:15,background:on?color:BD,color:on?WH:MG,border:"none",borderRadius:16,fontSize:14,fontWeight:800,cursor:on?"pointer":"default",transition:"all .2s",fontFamily:"inherit"}}>{label}</button>;}
  function Back({to}){return <button onClick={()=>setScr(to)} style={{background:"none",border:"none",cursor:"pointer",fontSize:21,color:DK,padding:"4px 2px",lineHeight:1}}>←</button>;}

  if(!auth)return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <SB bg={R} dark={false}/>
      <AuthScreen role="customer" onAuth={setAuth} accent={R} logo="zood" title="ZOOD" subtitle="Такси · Доставка · Помощь"/>
    </div>
  );

  // ── BOTTOM NAV ────────────────────────────────────────────────────
  function BottomNav(){
    const isHome=["home","deliv_catalog","deliv_menu","partner"].includes(scr)||scr==="home";
    if(!["home","orders_tab","promo_tab","profile_tab"].includes(scr)&&!["home"].includes(scr))return null;
    return(
      <div style={{background:WH,borderTop:`1px solid ${BD}`,display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"7px 0 14px",flexShrink:0}}>
        {[{id:"home",ic:"home",l:"Главная"},{id:"orders_tab",ic:"box",l:"Заказы",badge:ORDER_HISTORY.filter(o=>o.ok).length},{id:"promo_tab",ic:"gift",l:"Акции",badge:promos.filter(p=>!p.used).length},{id:"profile_tab",ic:"user",l:"Профиль"}].map(n=>(
          <button key={n.id} onClick={()=>{setMainTab(n.id);setScr(n.id==="home"?"home":n.id);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"}}>
            {n.badge>0&&<div style={{position:"absolute",top:-3,right:"20%",width:14,height:14,background:R,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:WH,fontWeight:800}}>{n.badge}</div>}
            <span style={{display:"flex",opacity:scr===n.id||mainTab===n.id?1:0.4}}><Icon name={n.ic} size={22} color={scr===n.id||mainTab===n.id?R:GY}/></span>
            <span style={{fontSize:9,fontWeight:700,color:scr===n.id||mainTab===n.id?R:MG}}>{n.l}</span>
          </button>
        ))}
      </div>
    );
  };

  // ── HOME (Yandex Go style) ────────────────────────────────────────
  const Home=()=>(
    <div style={{display:"flex",flexDirection:"column",flex:1}}>
      <SB bg="transparent" dark={true}/>
      {/* Map background */}
      <div style={{flex:1,position:"relative",minHeight:0}}>
        <SchematicMap markers={[]} route={null}/>
        {/* Floating header */}
        <div style={{position:"absolute",top:4,left:14,right:14,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <ZoodLogo size={34} rounded={10}/>
            <div style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(12px)",borderRadius:22,padding:"6px 12px",fontSize:11,fontWeight:600,color:DK,boxShadow:"0 2px 10px rgba(0,0,0,.14)"}}><Icon name="pin" size={14} color="currentColor" style={{marginRight:5}}/>Душанбе</div>
          </div>
          <div style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(12px)",borderRadius:22,padding:"6px 12px",display:"flex",gap:5,alignItems:"center",boxShadow:"0 2px 10px rgba(0,0,0,.14)"}}>
            <span style={{fontSize:13}}><Icon name="card" size={15} color="currentColor"/></span><span style={{fontSize:11,fontWeight:700,color:DK}}>245 с.</span>
          </div>
        </div>
        {/* Гостевой баннер */}
        {isGuest&&<div onClick={()=>setAuth(null)} style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",zIndex:20,background:"rgba(13,27,42,.85)",borderRadius:22,padding:"7px 16px",cursor:"pointer",display:"flex",gap:7,alignItems:"center",whiteSpace:"nowrap"}}>
          <span style={{fontSize:14}}><Icon name="user" size={15} color="currentColor"/></span>
          <span style={{color:"white",fontSize:11,fontWeight:600}}>Гостевой режим</span>
          <span style={{background:R,color:"white",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:8}}>ВОЙТИ</span>
        </div>}
        {/* Notification bell */}
        <button onClick={()=>setScr("notifications")} style={{position:"absolute",top:50,right:14,zIndex:10,background:"rgba(255,255,255,.92)",border:"none",borderRadius:"50%",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,.14)"}}>
          <span style={{fontSize:18}}><Icon name="bell" size={15} color="currentColor"/></span>
          {unread>0&&<div style={{position:"absolute",top:6,right:6,width:14,height:14,background:R,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:WH,fontWeight:800}}>{unread}</div>}
        </button>
      </div>
      {/* Bottom sheet */}
      <div style={{background:WH,borderRadius:"22px 22px 0 0",boxShadow:"0 -6px 28px rgba(0,0,0,.12)",flexShrink:0}}>
        <div style={{textAlign:"center",padding:"10px 0 6px"}}><div style={{display:"inline-block",width:38,height:4,background:BD,borderRadius:2}}/></div>
        {/* Search bar */}
        <div onClick={()=>requireAuth()&&setScr("taxi")} style={{margin:"0 14px 12px",background:"#F3F4F6",borderRadius:22,padding:"13px 16px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",border:`1.5px solid ${BD}`,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
          <span style={{fontSize:17,color:GY}}><Icon name="search" size={15} color="currentColor"/></span>
          <span style={{fontSize:14,color:GY,flex:1,fontWeight:500}}>Куда едем?</span>
          <div style={{background:NV,borderRadius:12,padding:"4px 10px",fontSize:11,color:WH,fontWeight:700}}>Такси</div>
        </div>
        {/* Service chips */}
        <div style={{display:"flex",gap:9,padding:"0 14px 12px"}}>
          {[{ic:"taxi",l:"Такси",s:"taxi",c:NV},{ic:"box",l:"Доставка",s:"deliv_menu",c:R},{ic:"shop",l:"Магазин",s:"deliv_catalog",c:GR},{ic:"wrench",l:"Помощь",s:"help",c:GD}].map(sv=>(
            <button key={sv.l} onClick={()=>(sv.s==="partner_landing"||requireAuth())&&setScr(sv.s)} style={{flex:1,padding:"10px 4px 8px",borderRadius:16,border:`1.5px solid ${BD}`,background:WH,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(0,0,0,.06)",transition:"all .15s"}}>
              <div style={{marginBottom:5,display:"flex",justifyContent:"center"}}><Icon name={sv.ic} size={26} color={sv.c}/></div>
              <div style={{fontSize:10,fontWeight:700,color:DK}}>{sv.l}</div>
            </button>
          ))}
        </div>
        {/* Промо-баннер */}
        <div style={{margin:"0 14px 10px",borderRadius:18,overflow:"hidden",position:"relative",cursor:"pointer"}} onClick={()=>setBannerIdx(p=>(p+1)%BANNERS.length)}>
          <div style={{background:BANNERS[bannerIdx].bg,padding:"13px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,background:"rgba(255,255,255,.2)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{BANNERS[bannerIdx].e}</div>
            <div style={{flex:1}}>
              <div style={{color:WH,fontWeight:800,fontSize:13,lineHeight:1.2}}>{BANNERS[bannerIdx].t}</div>
              <div style={{color:"rgba(255,255,255,.65)",fontSize:10,marginTop:2}}>{BANNERS[bannerIdx].s}</div>
            </div>
            <div style={{background:"rgba(255,255,255,.2)",borderRadius:10,padding:"5px 10px",fontSize:10,color:WH,fontWeight:700,whiteSpace:"nowrap"}}>{BANNERS[bannerIdx].btn}</div>
          </div>
          <div style={{position:"absolute",bottom:7,right:12,display:"flex",gap:4}}>
            {BANNERS.map((_,i)=><div key={i} style={{width:i===bannerIdx?16:5,height:5,borderRadius:3,background:"rgba(255,255,255,.7)",transition:"width .3s"}}/>)}
          </div>
        </div>
        {/* Межгород баннер */}
        <div onClick={()=>requireAuth()&&setScr("intercity")} style={{margin:"0 14px 10px",borderRadius:18,overflow:"hidden",cursor:"pointer",background:`linear-gradient(135deg,${NV},#1B3A5C)`,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:`0 6px 20px ${NV}33`}}>
          <div style={{width:46,height:46,background:"rgba(255,255,255,.15)",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}><Icon name="bus" size={15} color="currentColor"/></div>
          <div style={{flex:1}}>
            <div style={{color:WH,fontWeight:800,fontSize:14}}>Межгород</div>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:11,marginTop:1}}>Попутчик или весь салон · Дш→Хдж от 120 с.</div>
          </div>
          <div style={{background:"rgba(255,255,255,.15)",borderRadius:10,padding:"5px 10px",fontSize:11,color:WH,fontWeight:700}}>Выбрать →</div>
        </div>
        {/* Quick destinations */}
        <div style={{borderTop:`1px solid ${BD}`,padding:"10px 14px 6px"}}>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:8}}><Icon name="bolt" size={14} color="currentColor" style={{marginRight:5}}/>БЫСТРЫЕ МЕСТА</div>
          <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none",marginBottom:4}}>
            {[{ic:"home",l:"Дом",a:"ул. Айни, 45"},{ic:"work",l:"Работа",a:"пр. Рудаки, 12"},{ic:"cart",l:"Саймон",a:"ул. Исмоилова"},{ic:"plane",l:"Аэропорт",a:"Международный"},{ic:"pill",l:"Больница",a:"Ш. Шотемур, 69"}].map(p=>(
              <button key={p.l} onClick={()=>requireAuth()&&setScr("taxi")} style={{flexShrink:0,width:72,padding:"10px 6px 8px",background:BG,border:`1px solid ${BD}`,borderRadius:14,cursor:"pointer",textAlign:"center",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
                <div style={{marginBottom:4,display:"flex",justifyContent:"center"}}><Icon name={p.ic} size={20} color={NV}/></div>
                <div style={{fontSize:10,fontWeight:700,color:DK}}>{p.l}</div>
                <div style={{fontSize:8,color:GY,marginTop:1,lineHeight:1.2}}>{p.a}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav/>
    </div>
  );


  // ── ORDERS TAB ────────────────────────────────────────────────────
  const myLive=(orders||[]).filter(o=>o.customer===(auth?.name||"Клиент")&&o.status!=="delivered"&&o.status!=="cancelled");
  const statusRu={new:"Новый",partner_accepted:"Готовят",courier_assigned:"Курьер назначен",picked_up:"В пути",delivered:"Доставлен",cancelled:"Отменён"};
  const OrdersTab=()=>(
    <>
      <SB/>
      <div style={{padding:"6px 14px 14px",background:WH,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontWeight:800,fontSize:17,color:DK,display:"flex",alignItems:"center",gap:7}}><Icon name="box" size={19} color={DK}/>Мои заказы</span>
      </div>
      <div style={sc}><div style={{padding:"0 14px 24px"}}>
        {myLive.length===0&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0 10px"}}>
          <ZoodMascot size={110}/>
          <div style={{fontWeight:700,fontSize:14,color:DK,marginTop:6}}>Нет активных заказов</div>
          <div style={{fontSize:12,color:GY,marginTop:3,textAlign:"center"}}>Закажите такси, еду или доставку —<br/>заказ появится здесь</div>
        </div>}
        {myLive.length>0&&<div style={{marginBottom:6}}>
          <div style={{fontWeight:700,fontSize:10,color:GR,letterSpacing:1,padding:"12px 0 7px",textTransform:"uppercase"}}>● Активные заказы</div>
          {myLive.map(o=>(
            <div key={o.id} onClick={()=>setScr("tracking")} style={{...card,padding:13,marginBottom:9,display:"flex",gap:11,alignItems:"center",cursor:"pointer",border:`1.5px solid ${GR}`}}>
              <div style={{width:44,height:44,background:GRL,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="box" size={22} color={GR}/></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:2}}>{o.partner}</div>
                <div style={{fontSize:10,color:GY,marginBottom:4}}>{o.items?.map?o.items.map(it=>it.name).join(", "):o.items}</div>
                <span style={{background:GRL,color:"#16A34A",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:6}}>{statusRu[o.status]||o.status}</span>
              </div>
              <div style={{fontWeight:800,fontSize:13,color:DK}}>{o.total} с.</div>
            </div>
          ))}
        </div>}
        {["Сегодня","Вчера","Ранее"].map((period,pi)=>{
          const slice=pi===0?ORDER_HISTORY.slice(0,1):pi===1?ORDER_HISTORY.slice(1,3):ORDER_HISTORY.slice(3);
          return(
            <div key={period}>
              <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,padding:"12px 0 7px"}}>{period.toUpperCase()}</div>
              {slice.map(o=>(
                <div key={o.id} style={{...card,padding:13,marginBottom:9,display:"flex",gap:11,alignItems:"center"}}>
                  <div style={{width:44,height:44,background:o.ok?GRL:RL,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{o.e}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:2}}>{o.partner}</div>
                    <div style={{fontSize:10,color:GY,marginBottom:4}}>{o.items}</div>
                    <div style={{display:"flex",gap:7,alignItems:"center"}}>
                      <span style={{fontSize:11,fontWeight:800,color:DK}}>{o.total} с.</span>
                      <span style={{background:o.ok?GRL:RL,color:o.ok?"#16A34A":"#DC2626",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:5}}>{o.status}</span>
                    </div>
                  </div>
                  <div style={{fontSize:9,color:MG,textAlign:"right",whiteSpace:"nowrap"}}>{o.date}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div></div>
      <BottomNav/>
    </>
  );


  // ── PROMOS TAB ────────────────────────────────────────────────────
  const PromosTab=()=>(
    <>
      <SB/>
      <div style={{padding:"6px 14px 14px",background:WH}}><span style={{fontWeight:800,fontSize:17,color:DK}}><Icon name="gift" size={14} color="currentColor" style={{marginRight:5}}/>Акции и промокоды</span></div>
      <div style={sc}><div style={{padding:"0 14px 24px"}}>
        {/* Promo codes */}
        <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:10}}>ВАШИ ПРОМОКОДЫ</div>
        {promos.map(p=>(
          <div key={p.id} style={{...card,marginBottom:10,overflow:"hidden",opacity:p.used?.6:1}}>
            <div style={{background:`linear-gradient(135deg,${p.color},${p.color}99)`,padding:"12px 14px",display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:42,height:42,background:"rgba(255,255,255,.2)",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{p.icon}</div>
              <div style={{flex:1}}>
                <div style={{color:WH,fontWeight:800,fontSize:13}}>{p.label}</div>
                <div style={{color:"rgba(255,255,255,.65)",fontSize:11,marginTop:1}}>{p.desc}</div>
              </div>
              {p.used&&<span style={{background:"rgba(0,0,0,.2)",color:"rgba(255,255,255,.7)",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:8}}>Использован</span>}
            </div>
            <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"monospace",fontWeight:800,fontSize:14,color:DK,letterSpacing:1}}>{p.code}</div>
              {!p.used&&<button onClick={()=>setPromos(prev=>prev.map(x=>x.id===p.id?{...x,used:true}:x))} style={{background:p.color,color:WH,border:"none",borderRadius:9,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Применить</button>}
            </div>
          </div>
        ))}
        {/* Referral */}
        <div style={{...card,padding:16,background:`linear-gradient(135deg,${NV},${NM})`}}>
          <div style={{color:WH,fontWeight:800,fontSize:15,marginBottom:4}}><Icon name="users" size={14} color="currentColor" style={{marginRight:5}}/>Пригласи друга</div>
          <div style={{color:"rgba(255,255,255,.6)",fontSize:12,marginBottom:12}}>Ты и друг получите по 20 с. после его первого заказа</div>
          <div style={{background:"rgba(255,255,255,.12)",borderRadius:11,padding:"9px 13px",fontFamily:"monospace",fontSize:14,fontWeight:700,color:WH,letterSpacing:2,marginBottom:11}}>BEKH-{auth?.name?.slice(0,3).toUpperCase()||"XXX"}-2025</div>
          <button style={{width:"100%",padding:10,background:R,color:WH,border:"none",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="upload" size={14} color="currentColor" style={{marginRight:5}}/>Поделиться ссылкой</button>
        </div>
      </div></div>
      <BottomNav/>
    </>
  );


  // ── PROFILE TAB ───────────────────────────────────────────────────
  function ProfileTab(){
    if(isGuest)return(<>
      <SB bg={R} dark={false}/>
      <div style={{background:`linear-gradient(155deg,${RD},${R})`,padding:"30px 20px 26px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
        <div style={{width:72,height:72,background:"rgba(255,255,255,.18)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:12}}><Icon name="user" size={15} color="currentColor"/></div>
        <div style={{color:WH,fontWeight:900,fontSize:20,marginBottom:5}}>Гостевой режим</div>
        <div style={{color:"rgba(255,255,255,.65)",fontSize:12,lineHeight:1.7}}>Войдите чтобы делать заказы,<br/>получать бонусы и отслеживать доставку</div>
      </div>
      <div style={{padding:"16px"}}>
        <button onClick={()=>setAuth(null)} style={{width:"100%",padding:15,background:R,color:WH,border:"none",borderRadius:16,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 6px 20px ${R}44`,marginBottom:14}}><Icon name="mobile" size={14} color="currentColor" style={{marginRight:5}}/>Войти / Зарегистрироваться</button>
        {[{e:"ℹ️",l:"О приложении",sub:"ZOOD v1.0 · Карты © OpenStreetMap"},{e:"🌐",l:"Язык интерфейса",sub:"Русский / Тоҷикӣ"}].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"12px 4px",borderBottom:`1px solid ${BD}`}}>
            <div style={{width:38,height:38,background:BG,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}><Icon name={item.ic} size={19} color={NV}/></div>
            <div><div style={{fontWeight:600,fontSize:13,color:DK}}>{item.l}</div><div style={{fontSize:10,color:GY,marginTop:1}}>{item.sub}</div></div>
          </div>
        ))}
      </div>
      <BottomNav/>
    </>);
    return(<>
      <SB bg={R} dark={false}/>
      <div style={{background:`linear-gradient(155deg,${RD},${R})`,padding:"6px 16px 22px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:14}}>
          <div style={{width:60,height:60,background:"rgba(255,255,255,.2)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:"2px solid rgba(255,255,255,.3)"}}><Icon name="user" size={15} color="currentColor"/></div>
          <div>
            <div style={{color:WH,fontWeight:800,fontSize:17}}>{auth.name}</div>
            <div style={{color:"rgba(255,255,255,.65)",fontSize:11,marginTop:1}}>{auth.phone}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[[String(ORDER_HISTORY.filter(o=>o.ok).length+myLive.length),"box","Заказов"],["53 с.","money","Сэкономлено"],["4.8","star","Рейтинг"]].map(([v,ic,l])=>(
            <div key={l} style={{background:"rgba(255,255,255,.18)",borderRadius:12,padding:"10px 7px",textAlign:"center"}}>
              <div style={{color:WH,fontWeight:900,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>{v}<Icon name={ic} size={11} color="rgba(255,255,255,.8)"/></div>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:9,marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={sc}><div style={{padding:"12px 14px"}}>
        {[
          {ic:"box",l:"История заказов",s:"history"},
          {ic:"pin",l:"Мои адреса",s:"addresses"},
          {ic:"card",l:"Способы оплаты",sub:"АЛИФ Пэй, VISA ****4521"},
          {ic:"gift",l:"Промокоды и бонусы",s:"promo_tab",badge:promos.filter(p=>!p.used).length},
          {ic:"chat",l:"Поддержка",sub:"Чат, звонок, FAQ"},
          {ic:"settings",l:"Настройки"},
          {ic:"doc",l:"О приложении",sub:"ZOOD v1.0 · СНГ"},
        ].map((item,i)=>(
          <div key={i} onClick={()=>item.s&&setScr(item.s)} style={{...card,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:11,cursor:item.s?"pointer":"default"}}>
            <div style={{width:38,height:38,background:BG,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}><Icon name={item.ic} size={19} color={NV}/></div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:DK}}>{item.l}</div>{item.sub&&<div style={{fontSize:10,color:GY,marginTop:1}}>{item.sub}</div>}</div>
            {item.badge>0&&<span style={{background:R,color:WH,borderRadius:10,fontSize:9,fontWeight:800,padding:"2px 6px"}}>{item.badge}</span>}
            <span style={{color:MG,fontSize:16}}>›</span>
          </div>
        ))}
        <button onClick={()=>setAuth(null)} style={{width:"100%",padding:"12px",background:"none",border:`1.5px solid ${BD}`,borderRadius:13,color:R,fontSize:13,fontWeight:700,cursor:"pointer",marginTop:4,fontFamily:"inherit"}}>Выйти из аккаунта</button>
      </div></div>
      <BottomNav/>
    </>
  );
};

  // ── CHECKOUT ──────────────────────────────────────────────────────
  function Checkout(){
    const total=cart.total+(partner?.fee||8);
    if(chkStep==="processing")return(
      <div style={{display:"flex",flexDirection:"column",height:"100%",alignItems:"center",justifyContent:"center",background:WH}}>
        <div style={{width:80,height:80,background:`${chkPay.accent}15`,borderRadius:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:18}}>{chkPay.icon}</div>
        <div style={{fontWeight:800,fontSize:19,color:DK,marginBottom:6}}>Обрабатываем...</div>
        <div style={{fontSize:13,color:GY}}>{chkPay.label}</div>
        <div style={{marginTop:22,display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===0?R:BD}}/>)}</div>
      </div>
    );
    return(<>
      <SB/>
      <div style={{padding:"6px 14px 12px",background:WH}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <Back to="partner"/>
          <span style={{fontWeight:800,fontSize:16,color:DK}}>Оформление заказа</span>
        </div>
        <div style={{display:"flex",gap:0,background:BG,borderRadius:12,overflow:"hidden",border:`1px solid ${BD}`}}>
          {[{id:"address",l:"1. Адрес"},{id:"payment",l:"2. Оплата"}].map((s,i)=>(
            <div key={s.id} onClick={()=>setChkStep(s.id)} style={{flex:1,padding:"9px 8px",textAlign:"center",background:chkStep===s.id?WH:"transparent",fontSize:11,fontWeight:700,color:chkStep===s.id?R:GY,cursor:"pointer",borderRadius:10,margin:3,transition:"all .2s"}}>{s.l}</div>
          ))}
        </div>
      </div>
      <div style={sc}>
        {chkStep==="address"&&<div style={{padding:"0 14px 22px"}}>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:11}}>АДРЕС ДОСТАВКИ</div>
          {SAVED_ADDRESSES.map(addr=>(
            <div key={addr.id} onClick={()=>setChkAddr(addr)} style={{...card,padding:"13px 15px",marginBottom:9,cursor:"pointer",border:`2px solid ${chkAddr.id===addr.id?R:BD}`,background:chkAddr.id===addr.id?RL:WH,display:"flex",gap:12,alignItems:"center",transition:"all .15s"}}>
              <div style={{width:40,height:40,background:chkAddr.id===addr.id?R:BG,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,transition:"background .15s"}}>{addr.icon}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:chkAddr.id===addr.id?R:DK}}>{addr.label}</div><div style={{fontSize:10,color:GY,marginTop:2}}>{addr.addr}</div></div>
              {chkAddr.id===addr.id&&<span style={{color:R,fontSize:19,fontWeight:700}}>✓</span>}
            </div>
          ))}
          <button style={{width:"100%",padding:"12px",background:BG,color:DK,border:`1.5px dashed ${BD}`,borderRadius:13,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:18}}>+ Другой адрес</button>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:10}}>СОСТАВ ЗАКАЗА</div>
          <div style={{...card,padding:"11px 13px",marginBottom:18}}>
            {cart.items.map(it=><div key={it.id} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:`1px solid ${BD}`}}><div style={{fontSize:18}}>{it.emoji}</div><div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:DK}}>{it.name}</div></div><div style={{fontSize:11,fontWeight:700,color:DK}}>{it.qty}× {it.price} с.</div></div>)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0 0",fontSize:15,fontWeight:800,color:DK}}><span>Итого</span><span style={{color:R}}>{total} с.</span></div>
          </div>
          <Btn label="Выбрать оплату →" on={true} onClick={()=>setChkStep("payment")} color={R}/>
        </div>}
        {chkStep==="payment"&&<div style={{padding:"0 14px 22px"}}>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:11}}>СПОСОБ ОПЛАТЫ</div>
          {PAY_METHODS.map(pm=>(
            <div key={pm.id} onClick={()=>setChkPay(pm)} style={{...card,padding:"13px 15px",marginBottom:9,cursor:"pointer",border:`2px solid ${chkPay.id===pm.id?pm.accent:BD}`,background:chkPay.id===pm.id?pm.bg:WH,display:"flex",gap:12,alignItems:"center",transition:"all .15s"}}>
              <div style={{width:42,height:42,background:chkPay.id===pm.id?`${pm.accent}22`:BG,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{pm.icon}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:chkPay.id===pm.id?pm.accent:DK}}>{pm.label}</div>{pm.balance&&<div style={{fontSize:10,color:GY,marginTop:1}}>Баланс: {pm.balance}</div>}</div>
              {chkPay.id===pm.id&&<span style={{color:pm.accent,fontSize:19,fontWeight:700}}>✓</span>}
            </div>
          ))}
          {chkPay.id==="alif"&&<div style={{background:"#E8F8EE",borderRadius:12,padding:"11px 13px",marginBottom:14,border:"1px solid #A7F3D0"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{color:"#065F46"}}>Баланс</span><span style={{fontWeight:700,color:"#065F46"}}>245.50 с.</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{color:"#065F46"}}>Оплата</span><span style={{fontWeight:700,color:R}}>−{total} с.</span></div>
            <div style={{height:1,background:"#A7F3D0",margin:"6px 0"}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"#065F46"}}>Остаток</span><span style={{fontWeight:700,color:"#065F46"}}>{(245.50-total).toFixed(2)} с.</span></div>
          </div>}
          <div style={{...card,padding:"11px 13px",marginBottom:14}}>
            {[["Товары",`${cart.total} с.`],["Доставка",`${partner?.fee||8} с.`],["Итого",`${total} с.`]].map(([l,v],i)=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<2?`1px solid ${BD}`:"none",fontSize:i===2?15:12,fontWeight:i===2?800:400}}><span style={{color:i===2?DK:GY}}>{l}</span><span style={{color:i===2?R:DK,fontWeight:i===2?800:600}}>{v}</span></div>
            ))}
          </div>
          <Btn label={`${chkPay.icon} Оплатить ${total} с.`} on={true} onClick={processPayment} color={chkPay.accent||R}/>
        </div>}
      </div>
    </>);
  };

  // ── PARTNER DETAIL ────────────────────────────────────────────────
  function PartnerDetail(){
    if(!partner)return null;
    const items=partner.items.filter(i=>i.cat===pCat);
    return(<>
      <SB bg={partner.g[0]} dark={false}/>
      <div style={{background:`linear-gradient(155deg,${partner.g[0]},${partner.g[1]})`,padding:"5px 13px 15px",flexShrink:0}}>
        <button onClick={()=>setScr("deliv_catalog")} style={{background:"rgba(255,255,255,.18)",border:"1px solid rgba(255,255,255,.25)",color:WH,borderRadius:10,padding:"7px 11px",cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:11,display:"block",fontFamily:"inherit"}}>← Назад</button>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{width:48,height:48,background:"rgba(255,255,255,.15)",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{partner.e}</div>
          <div><div style={{color:WH,fontWeight:900,fontSize:16}}>{partner.name}</div><div style={{color:"rgba(255,255,255,.65)",fontSize:10,marginTop:1}}>{partner.sub}</div><div style={{display:"flex",gap:6,marginTop:4}}><span style={{background:"rgba(255,255,255,.15)",color:WH,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:7}}><Icon name="star" size={14} color="currentColor" style={{marginRight:5}}/>{partner.r}</span><span style={{background:"rgba(255,255,255,.15)",color:WH,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:7}}>⏱ {partner.time} мин</span><span style={{background:"rgba(255,255,255,.15)",color:WH,fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:7}}><Icon name="truck" size={14} color="currentColor" style={{marginRight:5}}/>{partner.fee} с.</span></div></div>
        </div>
      </div>
      <div style={{background:WH,display:"flex",overflowX:"auto",scrollbarWidth:"none",borderBottom:`1px solid ${BD}`,flexShrink:0}}>
        {partner.cats.map(cat=><button key={cat} onClick={()=>setPCat(cat)} style={{padding:"10px 12px",border:"none",background:"none",cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,color:pCat===cat?R:GY,borderBottom:`2.5px solid ${pCat===cat?R:"transparent"}`,fontFamily:"inherit"}}>{cat}</button>)}
      </div>
      <div style={sc}><div style={{padding:11}}>
        {items.map(it=>{const q=cart.qty(it.id);return(
          <div key={it.id} style={{...card,padding:12,marginBottom:9,display:"flex",gap:10,alignItems:"flex-start",border:`1.5px solid ${q>0?R:BD}`}}>
            <div style={{width:48,height:48,background:`${partner.g[0]}18`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{it.e}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:1,flexWrap:"wrap"}}><span style={{fontWeight:700,fontSize:12,color:DK}}>{it.name}</span>{it.hit&&<span style={{background:RL,color:R,fontSize:9,fontWeight:800,padding:"1px 4px",borderRadius:4}}>ХИТ</span>}</div>
              {it.d&&<div style={{fontSize:10,color:GY,marginBottom:5}}>{it.d}</div>}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontWeight:800,fontSize:13,color:R}}>{it.p} с.</span>
                {q===0?<button onClick={()=>cart.add({...it,id:it.id,price:it.p,emoji:it.e,name:it.name})} style={{background:R,color:WH,border:"none",borderRadius:9,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 3px 10px ${R}33`}}>+ Добавить</button>
                :<div style={{display:"flex",alignItems:"center",gap:7}}><button onClick={()=>cart.remove(it.id)} style={{width:25,height:25,borderRadius:7,background:RL,color:R,border:"none",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>−</button><span style={{fontWeight:800,color:R,minWidth:15,textAlign:"center"}}>{q}</span><button onClick={()=>cart.add({...it,id:it.id,price:it.p,emoji:it.e,name:it.name})} style={{width:25,height:25,borderRadius:7,background:R,color:WH,border:"none",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button></div>}
              </div>
            </div>
          </div>
        );})}
      </div></div>
      {cart.count>0&&<button onClick={startCheckout} style={{flexShrink:0,background:R,color:WH,border:"none",margin:"0 12px 10px",borderRadius:15,padding:"14px 15px",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:`0 8px 24px ${R}44`,display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}><span style={{display:"flex",alignItems:"center",gap:6}}><Icon name="cart" size={15} color={WH}/>{cart.count} позиции</span><span style={{background:"rgba(255,255,255,.2)",borderRadius:9,padding:"3px 9px"}}>Оформить · {cart.total+(partner?.fee||8)} с. →</span></button>}
    </>);
  };

  // ── TRACKING ──────────────────────────────────────────────────────
  function Tracking(){
    const stages=[
      {icon:"box",  t:"Принят",    s:"Заявка подтверждена"},
      {icon:"cook", t:"Готовится", s:"Ресторан готовит заказ"},
      {icon:"bike", t:"В пути",    s:"Курьер везёт заказ"},
    ];
    const cp=[0.07,0.50,1.0][trackStage]||0;
    const eta=[22,11,2][trackStage];
    const st=stages[Math.min(trackStage,2)];
    const demo=[{lat:38.562,lng:68.786},{lat:38.568,lng:68.778},{lat:38.574,lng:68.771}];
    return(<>
      <SB bg={GR} dark={false}/>
      <div style={{background:`linear-gradient(135deg,${GR},#1B5E20)`,padding:"12px 16px 14px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div onClick={()=>setScr("home")} style={{width:34,height:34,background:"rgba(255,255,255,.15)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="refresh" size={16} color={WH}/></div>
          <span style={{color:WH,fontWeight:800,fontSize:16}}>Отслеживание заказа</span>
        </div>
        <div style={{background:"rgba(255,255,255,.12)",borderRadius:14,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,background:"rgba(255,255,255,.18)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={st.icon} size={22} color={WH}/></div>
          <div style={{flex:1}}>
            <div style={{color:WH,fontWeight:800,fontSize:15}}>{st.t}</div>
            <div style={{color:"rgba(255,255,255,.72)",fontSize:11,marginTop:1}}>{st.s}</div>
          </div>
          {trackStage<2&&<div style={{textAlign:"center",background:"rgba(0,0,0,.18)",borderRadius:10,padding:"5px 10px"}}>
            <div style={{color:WH,fontWeight:900,fontSize:22,lineHeight:1}}>{eta}</div>
            <div style={{color:"rgba(255,255,255,.7)",fontSize:9}}>мин</div>
          </div>}
          {trackStage===2&&<div style={{background:"rgba(255,255,255,.2)",borderRadius:10,padding:"5px 10px"}}><Icon name="check" size={20} color={WH}/></div>}
        </div>
      </div>
      <div style={{height:190,flexShrink:0,position:"relative"}}>
        <SchematicMap markers={[demo[0],demo[2]]} route={demo} carProg={cp} follow={false} userLoc={null}/>
        <div style={{position:"absolute",top:8,right:8,background:"rgba(255,255,255,.93)",borderRadius:10,padding:"3px 10px",fontSize:10,fontWeight:700,color:DK,display:"flex",alignItems:"center",gap:4}}>
          <Icon name="bike" size={12} color={GR}/>Курьер онлайн
        </div>
      </div>
      <div style={sc}><div style={{padding:"10px 14px"}}>
        <div style={{...card,padding:"13px 15px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center"}}>
            {stages.map((st2,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,flex:0}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:i<=trackStage?GR:BD,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={st2.icon} size={14} color={i<=trackStage?WH:GY}/></div>
                  <div style={{fontSize:9,fontWeight:700,color:i<=trackStage?GR:MG,textAlign:"center",whiteSpace:"nowrap"}}>{st2.t}</div>
                </div>
                {i<2&&<div style={{flex:1,height:2,background:i<trackStage?GR:BD,margin:"0 4px",marginBottom:15}}/>}
              </div>
            ))}
          </div>
        </div>
        {trackStage>=2&&<div style={{...card,padding:"14px 16px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-around"}}>
            <div style={{textAlign:"center"}}>
              <div style={{position:"relative",width:52,height:52,margin:"0 auto 4px"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#F0C9A0,#D99B6C)",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="user" size={26} color="#7A4A28"/></div>
                <div style={{position:"absolute",bottom:-2,left:"50%",transform:"translateX(-50%)",background:GR,color:WH,fontSize:8,fontWeight:800,padding:"1px 6px",borderRadius:6,border:`2px solid ${WH}`}}>4.9</div>
              </div>
              <div style={{fontSize:10,fontWeight:700,color:DK}}>Акбар</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{width:48,height:48,background:BG,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 4px",border:`1px solid ${BD}`}}><Icon name="phone" size={20} color={DK}/></div>
              <div style={{fontSize:10,color:GY}}>Связь</div>
            </div>
            <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setShowChat(true)}>
              <div style={{width:48,height:48,background:BG,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 4px",border:`1px solid ${BD}`}}><Icon name="chat" size={20} color={DK}/></div>
              <div style={{fontSize:10,color:GY}}>Чат</div>
            </div>
          </div>
        </div>}
        <div style={{...card,padding:"12px 14px",marginBottom:10}}>
          <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:8}}>Детали заказа</div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GY,marginBottom:5}}><span>Ресторан</span><span style={{color:DK,fontWeight:600}}>{partner?.name||"Рохат"}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GY,marginBottom:5}}><span>Сумма</span><span style={{color:DK,fontWeight:600}}>{cart.total||42} с.</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:GY}}><span>Доставка</span><span style={{color:GR,fontWeight:600}}>{partner?.fee||8} с.</span></div>
        </div>
        {trackStage===2&&<button onClick={()=>setScr("home")} style={{width:"100%",padding:13,background:GR,color:WH,border:"none",borderRadius:15,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>Отлично! На главную</button>}
      </div></div>
      {showRating&&<RatingModal type="delivery" name="Акбар Д. · ⭐ 4.9" onDone={()=>{setShowRating(false);setScr("home");}}/>}
    </>);
  };

  // ── SIMPLE SCREENS ────────────────────────────────────────────────
  function DelivCatalog(){
    const tabMap={food:"restaurant",grocery:"store",pharmacy:"pharmacy"};
    const list=Object.values(CATALOG).filter(p=>p.t===tabMap[dTab]);
    const ac={food:R,grocery:GR,pharmacy:"#00838F"}[dTab];
    return(<>
      <SB/>
      <div style={{padding:"5px 13px 10px",background:WH}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}><Back to="home"/><span style={{fontWeight:800,fontSize:16,color:DK}}>Из магазина</span></div>
        <div style={{display:"flex",gap:4,background:BG,borderRadius:13,padding:3}}>
          {[{id:"food",ic:"food",l:"Еда"},{id:"grocery",ic:"cart",l:"Продукты"},{id:"pharmacy",ic:"pill",l:"Аптека"}].map(t=><button key={t.id} onClick={()=>setDTab(t.id)} style={{flex:1,padding:"8px 4px",borderRadius:10,border:"none",fontSize:10,fontWeight:700,cursor:"pointer",background:dTab===t.id?WH:"transparent",color:dTab===t.id?ac:GY,boxShadow:dTab===t.id?"0 1px 6px rgba(0,0,0,.08)":"none",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Icon name={t.ic} size={13} color={dTab===t.id?ac:GY}/>{t.l}</button>)}
        </div>
      </div>

      <div style={sc}><div style={{padding:"5px 13px"}}>{list.map(p=><div key={p.id} onClick={()=>openPartner(p)} style={{...card,marginBottom:10,cursor:"pointer",overflow:"hidden"}}><div style={{background:`linear-gradient(150deg,${p.g[0]},${p.g[1]})`,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}><div style={{width:44,height:44,background:"rgba(255,255,255,.15)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{p.e}</div><div style={{flex:1}}><div style={{color:WH,fontWeight:800,fontSize:13}}>{p.name}</div><div style={{color:"rgba(255,255,255,.7)",fontSize:10,marginTop:1}}>{p.sub}</div></div></div><div style={{padding:"8px 14px",display:"flex",gap:0,fontSize:11}}><span style={{color:GD,fontWeight:700}}><Icon name="star" size={14} color="currentColor" style={{marginRight:5}}/>{p.r}</span><span style={{color:MG,margin:"0 5px"}}>·</span><span style={{color:GY}}>⏱ {p.time} мин</span><span style={{color:MG,margin:"0 5px"}}>·</span><span style={{color:GY}}><Icon name="truck" size={14} color="currentColor" style={{marginRight:5}}/>{p.fee} с.</span>{p.bike&&<span style={{marginLeft:5,background:"#ECFDF5",color:"#059669",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6,border:"1px solid #A7F3D0"}}><Icon name="bike" size={15} color="currentColor"/></span>}</div></div>)}</div></div>
    </>);
  };

  function Notifications(){
    const markAll=()=>setNotifs(p=>p.map(n=>({...n,read:true})));
    return(<>
      <SB/>
      <div style={{padding:"5px 13px 13px",background:WH,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}><Back to="home"/><span style={{fontWeight:800,fontSize:16,color:DK}}>Уведомления</span></div>
        {unread>0&&<button onClick={markAll} style={{background:"none",border:"none",color:BL,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Прочитать все</button>}
      </div>
      <div style={sc}><div style={{padding:"0 13px 22px"}}>{notifs.map(n=>(
        <div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))} style={{...card,padding:"12px 13px",marginBottom:8,cursor:"pointer",background:n.read?WH:"#FFF8F6",border:`1px solid ${n.read?BD:"#FCA5A5"}`}}>
          <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
            <div style={{width:40,height:40,background:n.read?BG:GRL,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.e}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:1}}>
                <span style={{fontWeight:700,fontSize:12,color:DK,flex:1}}>{n.t}</span>
                {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:GR,flexShrink:0,marginLeft:5,marginTop:2}}/>}
              </div>
              <div style={{fontSize:11,color:GY,lineHeight:1.4,marginBottom:3}}>{n.b}</div>
              <div style={{fontSize:10,color:MG}}>{n.time} назад</div>
            </div>
          </div>
        </div>
      ))}</div></div>
    </>);
  };

  const History=()=>{
    const myDone=(orders||[]).filter(o=>(o.customer===(auth?.name||"Клиент"))&&o.status==="delivered");
    const combined=[...myDone.map(o=>({id:o.id,partner:o.partner,items:Array.isArray(o.items)?o.items.map(x=>x.name).join(", "):o.items,date:o.createdAt||"Сегодня",ok:true,total:o.total})),...ORDER_HISTORY];
    return(<>
      <SB/>
      <div style={{padding:"5px 13px 13px",background:WH,display:"flex",alignItems:"center",gap:9}}><Back to="profile_tab"/><span style={{fontWeight:800,fontSize:16,color:DK}}>История заказов</span></div>
      <div style={sc}><div style={{padding:"0 13px 22px"}}>
        {combined.length===0&&<div style={{textAlign:"center",padding:"40px 20px"}}>
          <ZoodMascot size={90}/>
          <div style={{fontWeight:700,fontSize:14,color:DK,marginTop:8}}>Заказов пока нет</div>
          <div style={{fontSize:12,color:GY,marginTop:4}}>Ваша история заказов появится здесь</div>
        </div>}
        {combined.map(o=>(
          <div key={o.id} style={{...card,padding:12,marginBottom:9,display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:44,height:44,background:o.ok?GRL:BG,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="box" size={22} color={o.ok?GR:GY}/></div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:2}}>{o.partner}</div>
              <div style={{fontSize:10,color:GY,marginBottom:2}}>{o.items}</div>
              <span style={{background:GRL,color:GR,fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:5}}>Доставлен</span>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontWeight:700,fontSize:12,color:DK}}>{o.total||"—"} с.</div>
              <div style={{fontSize:9,color:MG,marginTop:2}}>{o.date}</div>
            </div>
          </div>
        ))}
      </div></div>
    </>);
  };


  const Addresses=()=>(<>
    <SB/>
    <div style={{padding:"5px 13px 13px",background:WH,display:"flex",alignItems:"center",gap:9}}><Back to="profile_tab"/><span style={{fontWeight:800,fontSize:16,color:DK}}>Мои адреса</span></div>
    <div style={sc}><div style={{padding:"0 13px 22px"}}>
      {SAVED_ADDRESSES.map(a=>(
        <div key={a.id} style={{...card,padding:"13px 14px",marginBottom:9,display:"flex",gap:11,alignItems:"center"}}>
          <div style={{width:42,height:42,background:RL,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.icon}</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:DK}}>{a.label}</div><div style={{fontSize:11,color:GY,marginTop:2}}>{a.addr}</div></div>
          <button style={{background:"none",border:"none",color:MG,cursor:"pointer"}}>✏️</button>
        </div>
      ))}
      <button style={{width:"100%",padding:"12px",background:BG,border:`1.5px dashed ${BD}`,borderRadius:13,fontSize:12,fontWeight:600,color:DK,cursor:"pointer",fontFamily:"inherit"}}>+ Добавить адрес</button>
    </div></div>
  </>
  );


  const Help=()=>(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,padding:"10px 13px"}}>
        <button onClick={()=>setScr("home")} style={{background:"rgba(255,255,255,.9)",border:"none",borderRadius:11,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",color:DK,fontFamily:"inherit"}}>← Главная</button>
      </div>
      <div style={{flex:1,background:"#D8E4EE",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:64,opacity:.2}}>🗺️</div></div>
      <div style={{flexShrink:0,background:WH,borderRadius:"22px 22px 0 0",boxShadow:"0 -6px 28px rgba(0,0,0,.13)"}}>
        <div style={{textAlign:"center",padding:"10px 0 5px"}}><div style={{display:"inline-block",width:36,height:4,background:BD,borderRadius:2}}/></div>
        <div style={{padding:"0 13px 4px"}}><div style={{fontWeight:800,fontSize:14,color:DK}}>🔧 Помощь на дороге</div></div>
        {hlpStatus==="idle"&&<>
          <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",padding:"6px 13px 8px"}}>
            {HELP_OPTIONS.map(o=>{const s=selHelp?.id===o.id;return(
              <div key={o.id} onClick={()=>setSelHelp(o)} style={{flexShrink:0,minWidth:78,display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 4px 7px",borderRadius:12,cursor:"pointer",background:s?"#FFF8EC":BG,border:`2px solid ${s?"#F59E0B":"transparent"}`,marginRight:7}}>
                <div style={{fontSize:9,color:GY,fontWeight:600,marginBottom:3}}>{o.time}</div>
                <div style={{fontSize:22,marginBottom:3}}>{o.emoji}</div>
                <div style={{fontSize:9,fontWeight:700,color:DK,textAlign:"center",lineHeight:1.3}}>{o.name}</div>
                <div style={{fontSize:11,fontWeight:800,color:s?"#D97706":DK,marginTop:1}}>от {o.price} с.</div>
              </div>
            );})}
          </div>
          <div style={{padding:"0 13px 12px"}}><Btn label={selHelp?`Вызвать · от ${selHelp.price} с.`:"Выберите услугу"} on={!!selHelp} onClick={()=>selHelp&&setHlpStatus("searching")} color={GD}/></div>
        </>}
        {hlpStatus==="searching"&&<div style={{padding:"20px",textAlign:"center"}}><div style={{fontSize:40,marginBottom:8}}>⏳</div><div style={{fontWeight:700,fontSize:14,color:DK}}>Ищем мастера...</div></div>}
        {hlpStatus==="found"&&<div style={{padding:"10px 13px 12px"}}><div style={{background:"#E8F5E9",border:`1.5px solid ${GR}`,borderRadius:13,padding:13}}><div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}><div style={{fontSize:26}}>{selHelp?.emoji}</div><div><div style={{fontWeight:800,fontSize:12,color:DK}}>Мастер найден!</div><div style={{fontSize:11,color:GR}}>~{selHelp?.time}</div></div></div><button onClick={()=>setHlpStatus("idle")} style={{width:"100%",padding:10,background:GR,color:WH,border:"none",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ Завершить</button></div></div>}
      </div>
    </div>
  );


  function Gas(){
    const can=!!(gSt&&gFuel&&gAmt&&parseFloat(gAmt)>0);
    return(<>
      <SB bg="#2D1800" dark={false}/>
      <div style={{background:"linear-gradient(155deg,#2D1800,#5C3400,#C57F00)",padding:"5px 13px 12px",flexShrink:0}}>
        <button onClick={()=>setScr("home")} style={{background:"rgba(255,255,255,.18)",border:"none",color:WH,borderRadius:11,padding:"7px 11px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>←</button>
        <span style={{color:WH,fontWeight:800,fontSize:14,marginLeft:9,display:"flex",alignItems:"center",gap:6}}><Icon name="gas" size={16} color={WH}/>Заправка</span>
      </div>
      <div style={sc}><div style={{padding:11}}>
        {GAS_DATA.map(st=>(
          <div key={st.id} onClick={()=>{if(st.open){setGSt(gSt?.id===st.id?null:st);setGFuel(null);setGAmt("");}}} style={{...card,padding:11,marginBottom:9,cursor:st.open?"pointer":"default",border:`2px solid ${gSt?.id===st.id?GD:BD}`,opacity:st.open?1:.55}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div><div style={{fontWeight:700,fontSize:12,color:DK}}><Icon name="gas" size={14} color="currentColor" style={{marginRight:5}}/>{st.name}</div><div style={{fontSize:10,color:GY,marginTop:1}}><Icon name="pin" size={14} color="currentColor" style={{marginRight:5}}/>{st.addr} · {st.dist}</div></div><span style={{background:st.open?GRL:RL,color:st.open?GR:R,fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6}}>{st.open?"Открыто":"Закрыто"}</span></div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{st.fuels.map(f=><span key={f.t} style={{background:BG,borderRadius:7,padding:"2px 6px",fontSize:10,border:`1px solid ${BD}`}}><b>{f.t}</b> {f.p} с/л</span>)}</div>
          </div>
        ))}
        {gSt&&<div style={{...card,padding:13,border:`2px solid ${GD}`,marginBottom:13}}>
          <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:9}}>Оформить заправку</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>{gSt.fuels.map(f=><button key={f.t} onClick={()=>{setGFuel(f);setGAmt("");}} style={{padding:"6px 9px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",background:gFuel?.t===f.t?DK:BG,color:gFuel?.t===f.t?WH:DK,border:`1px solid ${gFuel?.t===f.t?DK:BD}`,fontFamily:"inherit"}}>{f.t} · {f.p} с/л</button>)}</div>
          <div style={{display:"flex",gap:5,marginBottom:8}}>{[20,50,100,200].map(v=><button key={v} onClick={()=>setGAmt(String(v))} style={{flex:1,padding:"7px 2px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",background:gAmt===String(v)?R:BG,color:gAmt===String(v)?WH:DK,border:`1px solid ${gAmt===String(v)?R:BD}`,fontFamily:"inherit"}}>{v}с.</button>)}</div>
          <div style={{position:"relative",marginBottom:7}}><input type="number" value={gAmt} onChange={e=>setGAmt(e.target.value)} placeholder="Или введите сумму..." style={{width:"100%",padding:"10px 38px 10px 12px",borderRadius:11,border:`1.5px solid ${gFuel?R:BD}`,fontSize:12,color:DK,background:BG,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/><span style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:GY,fontWeight:700,fontSize:12}}>с.</span></div>
          {gFuel&&gAmt&&parseFloat(gAmt)>0&&<div style={{background:BG,borderRadius:9,padding:"6px 10px",marginBottom:8,fontSize:10,border:`1px solid ${BD}`}}>≈ <b>{(parseFloat(gAmt)/gFuel.p).toFixed(1)} л</b> {gFuel.t}</div>}
          <Btn label={can?`💚 Оплатить через АЛИФ ${gAmt} с.`:"Выберите и введите сумму"} on={can} onClick={()=>{setGSt(null);setGFuel(null);setGAmt("");setScr("home");}} color={GD}/>
        </div>}
      </div></div>
    </>);
  };

  const DelivMenu=()=>(<>
    <SB/><div style={{padding:"5px 13px 13px",background:WH,display:"flex",alignItems:"center",gap:9}}><Back to="home"/><span style={{fontWeight:800,fontSize:16,color:DK}}>Доставка</span></div>
    <div style={sc}><div style={{padding:"0 13px"}}>
      <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:9}}>ОТПРАВИТЬ ЧТО-ТО</div>
      {[{e:"📦",t:"Посылка / документы",s:"Курьер из А в Б",scr:"deliv_ab"},{e:"🚚",t:"Грузовая доставка",s:"Мебель, техника",scr:"deliv_cargo"}].map(o=>(
        <div key={o.scr} onClick={()=>setScr(o.scr)} style={{...card,padding:13,marginBottom:8,cursor:"pointer",display:"flex",gap:11,alignItems:"center"}}>
          <div style={{width:44,height:44,background:BG,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{o.e}</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:DK,marginBottom:1}}>{o.t}</div><div style={{fontSize:11,color:GY}}>{o.s}</div></div><span style={{color:MG,fontSize:17}}>›</span>
        </div>
      ))}
      <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,margin:"14px 0 9px"}}>ИЗ МАГАЗИНА</div>
      {[{e:"🍽️",t:"Рестораны и кафе",tab:"food"},{e:"🛒",t:"Продукты",tab:"grocery"},{e:"💊",t:"Аптека",tab:"pharmacy"}].map(o=>(
        <div key={o.tab} onClick={()=>{setDTab(o.tab);setScr("deliv_catalog");}} style={{...card,padding:12,marginBottom:8,cursor:"pointer",display:"flex",gap:11,alignItems:"center"}}>
          <div style={{width:42,height:42,background:BG,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{o.e}</div>
          <span style={{flex:1,fontWeight:700,fontSize:13,color:DK}}>{o.t}</span><span style={{color:MG,fontSize:17}}>›</span>
        </div>
      ))}
    </div></div>
  </>
  );


  const PartnerLanding=()=>(<>
    <SB bg={NV} dark={false}/>
    <div style={sc}>
      <div style={{background:`linear-gradient(155deg,${NV},${NM})`,padding:"26px 22px 30px",textAlign:"center"}}><div style={{fontSize:54,marginBottom:11}}><Icon name="shop" size={15} color="currentColor"/></div><div style={{color:WH,fontWeight:900,fontSize:22,marginBottom:7,lineHeight:1.2}}>Подключите свой<br/>бизнес к ZOOD</div><div style={{color:"rgba(255,255,255,.6)",fontSize:12,lineHeight:1.7}}>Рестораны, кафе, магазины, аптеки —<br/>получайте заказы от тысяч клиентов</div></div>
      <div style={{padding:"18px 16px"}}>
        {[["📦","Больше заказов","Тысячи клиентов в Душанбе и Худжанде"],["📊","Умная аналитика","Статистика заказов и выручки"],["🚴","Наши курьеры","Не нужна своя доставка"],["💰","от 15% комиссии","Ниже, чем у конкурентов"]].map(([e,t,s])=>(
          <div key={t} style={{display:"flex",gap:13,marginBottom:15,alignItems:"flex-start"}}>
            <div style={{width:42,height:42,background:BG,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{e}</div>
            <div><div style={{fontWeight:700,fontSize:13,color:DK,marginBottom:1}}>{t}</div><div style={{fontSize:11,color:GY,lineHeight:1.5}}>{s}</div></div>
          </div>
        ))}
        <div style={{...card,padding:"13px 14px",marginBottom:14,background:GDL}}><div style={{fontWeight:700,fontSize:12,color:"#78350F",marginBottom:3}}><Icon name="gift" size={14} color="currentColor" style={{marginRight:5}}/>Специальное предложение</div><div style={{fontSize:11,color:"#92400E"}}>Первые 30 дней без комиссии! Подключитесь сейчас.</div></div>
        <Btn label="Стать партнёром →" on={true} onClick={()=>setScr("home")} color={R}/>
        <button onClick={()=>setScr("home")} style={{width:"100%",padding:"10px",background:"none",border:"none",color:GY,fontSize:11,cursor:"pointer",marginTop:4,fontFamily:"inherit"}}>← Вернуться</button>
      </div>
    </div>
  </>
  );


  function DelivAB(){const can=dFrom&&dTo&&dParcel;const costs={doc:18,small:22,med:28,large:38};return(<><SB/><div style={{padding:"5px 13px 13px",background:WH,display:"flex",alignItems:"center",gap:9}}><Back to="deliv_menu"/><span style={{fontWeight:800,fontSize:15,color:DK}}><Icon name="box" size={14} color="currentColor" style={{marginRight:5}}/>Посылка</span></div>
      <div style={{height:200,position:"relative",flexShrink:0,borderBottom:`1px solid ${BD}`}}>
        <SchematicMap markers={[delivPts.dFrom&&{...delivPts.dFrom,color:GR,label:"A"},delivPts.dTo&&{...delivPts.dTo,color:R,label:"B"}].filter(Boolean)} route={delivPts.dFrom&&delivPts.dTo?[delivPts.dFrom,delivPts.dTo]:null}/>
        <div style={{position:"absolute",top:10,left:10,background:"rgba(255,255,255,.95)",borderRadius:10,padding:"5px 11px",fontSize:11,fontWeight:700,color:DK,boxShadow:"0 2px 8px rgba(0,0,0,.12)",display:"flex",alignItems:"center",gap:5}}><Icon name="compass" size={14} color={GR}/>{delivPts.dFrom&&delivPts.dTo?"Маршрут построен":"Выберите адреса"}</div>
      </div>
      <div style={sc}><div style={{padding:"0 13px 18px"}}><div style={{...card,padding:"0 12px",marginBottom:11}}>{[{ph:"Откуда?",v:dFrom,sv:setDFrom,k:"dFrom"},{ph:"Куда?",v:dTo,sv:setDTo,k:"dTo"}].map((f,i)=><div key={i} style={{position:"relative",display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i===0?`1px solid ${BD}`:"none"}}><div style={{width:10,height:10,borderRadius:i===0?"50%":"3px",background:i===0?GR:R,flexShrink:0}}/><input value={f.v} onFocus={()=>delivFocus(f.v,f.k)} onChange={e=>delivSuggest(e.target.value,f.k,f.sv)} placeholder={f.ph} style={{border:"none",outline:"none",flex:1,fontSize:13,color:DK,background:"transparent",fontFamily:"inherit"}}/>{delivSug.key===f.k&&delivSug.list.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:WH,borderRadius:12,boxShadow:"0 8px 28px rgba(0,0,0,.16)",zIndex:30,marginTop:4,maxHeight:200,overflowY:"auto",border:`1px solid ${BD}`}}><div style={{padding:"7px 13px 5px",fontSize:9,color:MG,fontWeight:700,letterSpacing:.5,borderBottom:`1px solid ${BG}`}}>{f.v?"НАЙДЕНО":"⭐ ПОПУЛЯРНЫЕ"}</div>{delivSug.list.map(p=><div key={p.name} onClick={()=>{f.sv(p.name);setDelivPts(pr=>({...pr,[f.k]:{lat:p.lat,lng:p.lng}}));setDelivSug({list:[],key:null});}} style={{padding:"10px 13px",fontSize:12,display:"flex",alignItems:"center",gap:8,cursor:"pointer",borderBottom:`1px solid ${BG}`}}><span style={{fontSize:13}}><Icon name="pin" size={15} color="currentColor"/></span><div><div style={{fontWeight:600,color:DK}}>{p.name}</div><div style={{fontSize:10,color:GY}}>{p.addr}</div></div></div>)}</div>}</div>)}</div><div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:.8,marginBottom:7}}>ЧТО ВЕЗЁМ?</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:13}}>{[{id:"doc",n:"Документы",e:"📄",d:"Конверт"},{id:"small",n:"Малая",e:"📦",d:"до 5 кг"},{id:"med",n:"Средняя",e:"📦",d:"до 20 кг"},{id:"large",n:"Крупная",e:"📦",d:"до 50 кг"}].map(p=>{const s=dParcel?.id===p.id;return(<div key={p.id} onClick={()=>setDParcel(p)} style={{...card,padding:"10px",cursor:"pointer",border:`2px solid ${s?R:BD}`,background:s?RL:WH,display:"flex",gap:7,alignItems:"center"}}><span style={{fontSize:18}}>{p.e}</span><div><div style={{fontWeight:700,fontSize:10,color:s?R:DK}}>{p.n}</div><div style={{fontSize:9,color:GY}}>{p.d}</div></div></div>);})}</div>{dParcel&&<div style={{background:GDL,borderRadius:11,padding:"9px 12px",marginBottom:11,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#78350F",fontWeight:600}}>Стоимость</span><span style={{fontWeight:900,fontSize:14,color:GD}}>{costs[dParcel.id]} с.</span></div>}<Btn label={can?"Заказать доставку":"Заполните поля"} on={!!can} onClick={()=>can&&setScr("tracking")} color={R}/></div></div></>);};

  function DelivCargo(){const can=cFrom&&cTo&&cVehicle;const cost=(cVehicle?.price||0)+[0,20,35][cMovers];return(<><SB/><div style={{padding:"5px 13px 13px",background:WH,display:"flex",alignItems:"center",gap:9}}><Back to="deliv_menu"/><span style={{fontWeight:800,fontSize:15,color:DK}}><Icon name="truck" size={14} color="currentColor" style={{marginRight:5}}/>Грузовая</span></div>
      <div style={{height:200,position:"relative",flexShrink:0,borderBottom:`1px solid ${BD}`}}>
        <SchematicMap markers={[delivPts.cFrom&&{...delivPts.cFrom,color:GR,label:"A"},delivPts.cTo&&{...delivPts.cTo,color:R,label:"B"}].filter(Boolean)} route={delivPts.cFrom&&delivPts.cTo?[delivPts.cFrom,delivPts.cTo]:null}/>
        <div style={{position:"absolute",top:10,left:10,background:"rgba(255,255,255,.95)",borderRadius:10,padding:"5px 11px",fontSize:11,fontWeight:700,color:DK,boxShadow:"0 2px 8px rgba(0,0,0,.12)",display:"flex",alignItems:"center",gap:5}}><Icon name="compass" size={14} color={GR}/>{delivPts.cFrom&&delivPts.cTo?"Маршрут построен":"Выберите адреса"}</div>
      </div>
      <div style={sc}><div style={{padding:"0 13px 18px"}}><div style={{...card,padding:"0 12px",marginBottom:11}}>{[{ph:"Откуда?",v:cFrom,sv:setCFrom,k:"cFrom"},{ph:"Куда?",v:cTo,sv:setCTo,k:"cTo"}].map((f,i)=><div key={i} style={{position:"relative",display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i===0?`1px solid ${BD}`:"none"}}><div style={{width:10,height:10,borderRadius:i===0?"50%":"3px",background:i===0?GR:R,flexShrink:0}}/><input value={f.v} onFocus={()=>delivFocus(f.v,f.k)} onChange={e=>delivSuggest(e.target.value,f.k,f.sv)} placeholder={f.ph} style={{border:"none",outline:"none",flex:1,fontSize:13,color:DK,background:"transparent",fontFamily:"inherit"}}/>{delivSug.key===f.k&&delivSug.list.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:WH,borderRadius:12,boxShadow:"0 8px 28px rgba(0,0,0,.16)",zIndex:30,marginTop:4,maxHeight:200,overflowY:"auto",border:`1px solid ${BD}`}}><div style={{padding:"7px 13px 5px",fontSize:9,color:MG,fontWeight:700,letterSpacing:.5,borderBottom:`1px solid ${BG}`}}>{f.v?"НАЙДЕНО":"⭐ ПОПУЛЯРНЫЕ"}</div>{delivSug.list.map(p=><div key={p.name} onClick={()=>{f.sv(p.name);setDelivPts(pr=>({...pr,[f.k]:{lat:p.lat,lng:p.lng}}));setDelivSug({list:[],key:null});}} style={{padding:"10px 13px",fontSize:12,display:"flex",alignItems:"center",gap:8,cursor:"pointer",borderBottom:`1px solid ${BG}`}}><span style={{fontSize:13}}><Icon name="pin" size={15} color="currentColor"/></span><div><div style={{fontWeight:600,color:DK}}>{p.name}</div><div style={{fontSize:10,color:GY}}>{p.addr}</div></div></div>)}</div>}</div>)}</div>{[{id:"car",n:"Легковая",e:"🚗",v:"до 1 м³",p:40},{id:"van",n:"Газель",e:"🚐",v:"до 9 м³",p:80},{id:"truck",n:"ЗИЛ",e:"🚚",v:"до 30 м³",p:150}].map(v=>{const s=cVehicle?.id===v.id;return(<div key={v.id} onClick={()=>setCVehicle(v)} style={{...card,padding:"11px 13px",marginBottom:7,cursor:"pointer",border:`2px solid ${s?"#475569":BD}`,background:s?"#F1F5F9":WH,display:"flex",gap:10,alignItems:"center"}}><div style={{width:40,height:40,background:s?"#47556920":BG,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21}}>{v.e}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:DK}}>{v.n}</div><div style={{fontSize:10,color:GY}}>{v.v}</div></div><div style={{fontWeight:800,fontSize:12,color:s?"#475569":DK}}>от {v.p} с.</div></div>);})}<div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:.8,margin:"11px 0 7px"}}>ГРУЗЧИКИ</div><div style={{display:"flex",gap:7,marginBottom:13}}>{[{n:0,l:"Не нужны"},{n:1,l:"1 грузчик",s:"+20 с."},{n:2,l:"2 грузчика",s:"+35 с."}].map(m=><div key={m.n} onClick={()=>setCMovers(m.n)} style={{flex:1,...card,padding:"9px 4px",cursor:"pointer",border:`2px solid ${cMovers===m.n?"#475569":BD}`,background:cMovers===m.n?"#F1F5F9":WH,textAlign:"center"}}><div style={{fontWeight:700,fontSize:10,color:DK}}>{m.l}</div>{m.s&&<div style={{fontSize:9,color:GY}}>{m.s}</div>}</div>)}</div>{cVehicle&&<div style={{background:"#F1F5F9",borderRadius:11,padding:"9px 12px",marginBottom:11,display:"flex",justifyContent:"space-between",border:"1px solid #CBD5E1"}}><span style={{fontSize:11,color:SL,fontWeight:600}}>Стоимость</span><span style={{fontWeight:900,fontSize:14,color:"#475569"}}>от {cost} с.</span></div>}<Btn label={can?"Заказать":"Заполните поля"} on={!!can} onClick={()=>can&&setScr("tracking")} color="#475569"/></div></div></>);};

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
      {/* Модал «Войдите чтобы продолжить» */}
      {showGuestPrompt&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
        <div style={{background:WH,borderRadius:"24px 24px 0 0",width:"100%",padding:"8px 18px 32px"}}>
          <div style={{width:38,height:4,background:BD,borderRadius:2,margin:"12px auto 18px"}}/>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:68,height:68,background:RL,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px"}}><Icon name="lock" size={15} color="currentColor"/></div>
            <div style={{fontWeight:900,fontSize:18,color:DK,marginBottom:5}}>Нужна авторизация</div>
            <div style={{fontSize:12,color:GY,lineHeight:1.7}}>Чтобы делать заказы и отслеживать<br/>доставку — войдите в аккаунт</div>
          </div>
          <button onClick={()=>{setShowGuestPrompt(false);setAuth(null);}} style={{width:"100%",padding:15,background:R,color:WH,border:"none",borderRadius:16,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 6px 20px ${R}44`,marginBottom:10}}><Icon name="mobile" size={14} color="currentColor" style={{marginRight:5}}/>Войти / Зарегистрироваться</button>
          <button onClick={()=>setShowGuestPrompt(false)} style={{width:"100%",padding:11,background:"none",border:`1.5px solid ${BD}`,borderRadius:14,fontSize:12,color:GY,cursor:"pointer",fontFamily:"inherit"}}>Позже</button>
        </div>
      </div>}
      {/* ── Toast уведомления ── */}
      <div style={{position:"absolute",top:44,left:0,right:0,zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",gap:6,pointerEvents:"none"}}>
        {toasts.map(t=>(
          <div key={t.id} style={{background:t.type==="success"?GR:t.type==="error"?R:NV,color:WH,padding:"9px 18px",borderRadius:22,fontSize:12,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,.25)",maxWidth:"85%",textAlign:"center"}}>
            {t.msg}
          </div>
        ))}
      </div>
      {/* ── Чат с водителем ── */}
      {showChat&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
        <div style={{background:WH,borderRadius:"22px 22px 0 0",width:"100%",height:"70%",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"10px 16px 8px",borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:38,height:38,background:GRL,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}><Icon name="bike" size={15} color="currentColor"/></div>
            <div><div style={{fontWeight:700,fontSize:13,color:DK}}>Акбар Д.</div><div style={{fontSize:10,color:GR}}>● Онлайн</div></div>
            <button onClick={()=>setShowChat(false)} style={{marginLeft:"auto",background:"none",border:"none",fontSize:20,color:MG,cursor:"pointer",lineHeight:1}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
            {chatMsgs.map(m=>(
              <div key={m.id} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"75%",background:m.from==="me"?R:BG,color:m.from==="me"?WH:DK,borderRadius:m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"9px 12px",fontSize:12,lineHeight:1.5}}>
                  {m.text}
                  <div style={{fontSize:9,opacity:.6,marginTop:3,textAlign:"right"}}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:"8px 14px 16px",borderTop:`1px solid ${BD}`,display:"flex",gap:8,flexShrink:0}}>
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChatMsg()} placeholder="Написать..." style={{flex:1,padding:"10px 14px",borderRadius:22,border:`1.5px solid ${BD}`,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
            <button onClick={sendChatMsg} disabled={!chatInput.trim()} style={{width:42,height:42,borderRadius:"50%",background:R,color:WH,border:"none",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>↑</button>
          </div>
        </div>
      </div>}
      {scr==="intercity"      &&<IntercityScreen onBack={()=>setScr("home")}/>}
      {scr==="home"          &&<Home/>}
      {scr==="orders_tab"    &&<OrdersTab/>}
      {scr==="promo_tab"     &&<PromosTab/>}
      {scr==="profile_tab"   &&<ProfileTab/>}
      {scr==="taxi"          &&<TaxiScreen onBack={()=>setScr("home")} onHelp={()=>setScr("help")}/>}
      {scr==="checkout"      &&<Checkout/>}
      {scr==="tracking"      &&<Tracking/>}
      {scr==="deliv_menu"    &&<DelivMenu/>}
      {scr==="deliv_ab"      &&<DelivAB/>}
      {scr==="deliv_cargo"   &&<DelivCargo/>}
      {scr==="deliv_catalog" &&<DelivCatalog/>}
      {scr==="partner"       &&<PartnerDetail/>}
      {scr==="help"          &&<Help/>}
      {scr==="gas"           &&<Gas/>}
      {scr==="notifications" &&<Notifications/>}
      {scr==="history"       &&<History/>}
      {scr==="addresses"     &&<Addresses/>}
      {scr==="partner_landing"&&<PartnerLanding/>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  PARTNER APP
// ════════════════════════════════════════════════════════════════════
function PartnerApp({orders,onUpdate}){
  const [auth,setAuth]=useState(null);
  const [dashTab,setDashTab]=useState("orders");
  const [isOpen,setIsOpen]=useState(true);
  const [showAdd,setShowAdd]=useState(false);
  const [newIt,setNewIt]=useState({cat:"",name:"",price:""});
  const [menuItems,setMenuItems]=useState(CATALOG.rohot.items.map(i=>({...i,active:true})));
  const myOrders=orders.filter(o=>o.partnerId==="rohot");
  const newOrd=myOrders.filter(o=>o.status==="new");
  const actOrd=myOrders.filter(o=>o.status==="partner_accepted");
  const card={background:WH,borderRadius:16,border:`1px solid ${BD}`,boxShadow:"0 2px 12px rgba(0,0,0,.05)"};
  const sc={flex:1,overflowY:"auto",scrollbarWidth:"none"};
  const SB=()=><div style={{background:BL,padding:"10px 22px 5px",display:"flex",justifyContent:"space-between",flexShrink:0}}><span style={{color:WH,fontSize:13,fontWeight:700}}>9:41</span><span style={{color:WH,fontSize:12}}>●●● 🔋</span></div>;

  if(!auth) return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <SB/>
      <AuthScreen role="partner" onAuth={setAuth} accent={BL} logo="zood" title="ZOOD Бизнес" subtitle="Портал партнёра — управляйте заказами"/>
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <SB/>
      <div style={{background:`linear-gradient(155deg,${NV},${NM},${BL})`,padding:"6px 16px 13px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
          <div><div style={{color:WH,fontWeight:900,fontSize:16}}><Icon name="dish" size={14} color="currentColor" style={{marginRight:5}}/>Рохат</div><div style={{color:"rgba(255,255,255,.5)",fontSize:10,marginTop:1}}>пр. Рудаки, 15 · {auth.name}</div></div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>setIsOpen(!isOpen)} style={{background:isOpen?"rgba(46,125,50,.6)":"rgba(220,38,38,.6)",border:"1px solid rgba(255,255,255,.18)",borderRadius:18,padding:"6px 11px",color:WH,fontSize:10,fontWeight:700,cursor:"pointer"}}>{isOpen?"● Открыто":"○ Закрыто"}</button>
            <button onClick={()=>setAuth(null)} style={{background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.55)",borderRadius:8,padding:"6px 9px",fontSize:9,cursor:"pointer"}}>Выйти</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
          {[[newOrd.length,"Новых"],[actOrd.length,"В работе"],["24 450","Выручка"]].map(([v,l],i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.12)",borderRadius:11,padding:"9px 7px",textAlign:"center"}}>
              <div style={{color:WH,fontWeight:900,fontSize:i<2?17:13}}>{v}</div>
              <div style={{color:"rgba(255,255,255,.55)",fontSize:9,marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:WH,display:"flex",borderBottom:`1px solid ${BD}`,flexShrink:0}}>
        {[{id:"orders",l:"Заказы"},{id:"menu",l:"Меню"},{id:"stats",l:"Аналитика"}].map(t=>(
          <button key={t.id} onClick={()=>setDashTab(t.id)} style={{flex:1,padding:"11px",border:"none",background:"none",cursor:"pointer",fontSize:11,fontWeight:700,color:dashTab===t.id?BL:GY,borderBottom:`2.5px solid ${dashTab===t.id?BL:"transparent"}`}}>
            {t.id==="orders"&&newOrd.length>0&&<span style={{background:"#DC2626",color:WH,borderRadius:"50%",fontSize:9,padding:"1px 4px",marginRight:3}}>{newOrd.length}</span>}
            {t.l}
          </button>
        ))}
      </div>
      <div style={{...sc,background:BG}}>
        {dashTab==="orders"&&<div style={{padding:11}}>
          {newOrd.map(o=>(
            <div key={o.id} style={{...card,marginBottom:9,overflow:"hidden",border:"1px solid #FCA5A5"}}>
              <div style={{background:"linear-gradient(90deg,#DC2626,#EF4444)",padding:"8px 13px",display:"flex",justifyContent:"space-between"}}>
                <div><div style={{color:WH,fontWeight:700,fontSize:12}}>Заказ #{o.id}</div><div style={{color:"rgba(255,255,255,.7)",fontSize:10}}>{o.customer} · {o.createdAt}</div></div>
                <div style={{color:WH,fontWeight:800,fontSize:14}}>{o.total} с.</div>
              </div>
              <div style={{padding:"9px 13px"}}>
                {o.items.map((it,i)=><div key={i} style={{fontSize:11,color:DK,marginBottom:2}}>{it.qty}× {it.name}</div>)}
                {o.comment&&<div style={{fontSize:10,color:GY,marginTop:4,fontStyle:"italic"}}><Icon name="chat" size={14} color="currentColor" style={{marginRight:5}}/>{o.comment}</div>}
                <div style={{display:"flex",gap:6,marginTop:9}}>
                  <button onClick={()=>onUpdate(o.id,"partner_accepted")} style={{flex:2,padding:"9px",background:BL,color:WH,border:"none",borderRadius:9,fontSize:11,fontWeight:700,cursor:"pointer"}}>✓ Принять</button>
                  <button onClick={()=>onUpdate(o.id,"declined")} style={{flex:1,padding:"9px",background:BG,color:"#DC2626",border:"1px solid #FCA5A5",borderRadius:9,fontSize:11,cursor:"pointer"}}>✗</button>
                </div>
              </div>
            </div>
          ))}
          {actOrd.map(o=>(
            <div key={o.id} style={{...card,marginBottom:9,overflow:"hidden",border:"1px solid #FDE68A"}}>
              <div style={{background:"linear-gradient(90deg,#D97706,#F59E0B)",padding:"8px 13px",display:"flex",justifyContent:"space-between"}}>
                <div style={{color:WH,fontWeight:700,fontSize:12}}>Заказ #{o.id}</div>
                <div style={{color:WH,fontWeight:800,fontSize:14}}>{o.total} с.</div>
              </div>
              <div style={{padding:"9px 13px"}}>
                {o.items.map((it,i)=><div key={i} style={{fontSize:11,color:DK,marginBottom:2}}>{it.qty}× {it.name}</div>)}
                <button onClick={()=>onUpdate(o.id,"ready")} style={{width:"100%",marginTop:9,padding:"9px",background:GR,color:WH,border:"none",borderRadius:9,fontSize:11,fontWeight:700,cursor:"pointer"}}>✓ Готово → ждём курьера</button>
              </div>
            </div>
          ))}
          {newOrd.length===0&&actOrd.length===0&&<div style={{textAlign:"center",padding:40,color:GY}}><div style={{fontSize:42,marginBottom:8}}><Icon name="inbox" size={15} color="currentColor"/></div><div style={{fontWeight:700,fontSize:13}}>Нет активных заказов</div></div>}
        </div>}

        {dashTab==="menu"&&<div style={{padding:11}}>
          {Object.entries(menuItems.reduce((g,i)=>({...g,[i.cat]:[...(g[i.cat]||[]),i]}),{})).map(([cat,its])=>(
            <div key={cat} style={{marginBottom:13}}>
              <div style={{fontWeight:700,fontSize:9,color:MG,letterSpacing:1.2,marginBottom:6}}>{cat.toUpperCase()}</div>
              {its.map(it=>(
                <div key={it.id} style={{...card,padding:"10px 12px",marginBottom:6,display:"flex",alignItems:"center",gap:9}}>
                  <div style={{width:34,height:34,background:`${BL}15`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{it.e}</div>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:11,color:it.active?DK:MG}}>{it.name}</div><div style={{fontSize:10,color:BL,fontWeight:700,marginTop:1}}>{it.p} с.</div></div>
                  <button onClick={()=>setMenuItems(p=>p.map(x=>x.id===it.id?{...x,active:!x.active}:x))} style={{background:it.active?GRL:RL,color:it.active?GR:R,border:`1px solid ${it.active?"#A7F3D0":"#FCA5A5"}`,borderRadius:8,padding:"4px 9px",fontSize:9,fontWeight:700,cursor:"pointer"}}>{it.active?"Вкл":"Выкл"}</button>
                </div>
              ))}
            </div>
          ))}
          {!showAdd
            ?<button onClick={()=>setShowAdd(true)} style={{width:"100%",padding:12,background:BLL,color:BL,border:`2px dashed ${BL}55`,borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Добавить позицию</button>
            :<div style={{...card,padding:13,border:`1.5px solid ${BL}`}}>
              <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:9}}>Новая позиция</div>
              {[["name","Название"],["cat","Категория"],["price","Цена (с.)"]].map(([k,l])=>(
                <div key={k} style={{marginBottom:8}}>
                  <div style={{fontSize:9,color:GY,marginBottom:3,fontWeight:700}}>{l}</div>
                  <input value={newIt[k]} onChange={e=>setNewIt(d=>({...d,[k]:e.target.value}))} style={{width:"100%",padding:"8px 10px",borderRadius:9,border:`1px solid ${BD}`,fontSize:11,color:DK,background:BG,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                </div>
              ))}
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>{setShowAdd(false);setNewIt({cat:"",name:"",price:""});}} style={{flex:1,padding:"8px",background:BG,color:DK,border:`1px solid ${BD}`,borderRadius:9,fontSize:11,cursor:"pointer"}}>Отмена</button>
                <button onClick={()=>{if(newIt.name&&newIt.cat&&newIt.price){setMenuItems(p=>[...p,{id:`n_${Date.now()}`,cat:newIt.cat,name:newIt.name,p:parseInt(newIt.price)||0,e:"🍽️",active:true}]);setShowAdd(false);setNewIt({cat:"",name:"",price:""});}}} style={{flex:2,padding:"8px",background:BL,color:WH,border:"none",borderRadius:9,fontSize:11,fontWeight:700,cursor:"pointer"}}>Добавить</button>
              </div>
            </div>
          }
        </div>}

        {dashTab==="stats"&&<div style={{padding:11}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:11}}>
            {[["24","📦","Заказов"],["24 450 с.","💰","Выручка"],["4.9 ⭐","","Рейтинг"],["98%","✅","Успешных"]].map(([v,e,l])=>(
              <div key={l} style={{...card,padding:12,textAlign:"center"}}><div style={{fontSize:18,marginBottom:4}}>{e}</div><div style={{fontWeight:900,fontSize:15,color:DK}}>{v}</div><div style={{fontSize:9,color:MG,marginTop:2}}>{l}</div></div>
            ))}
          </div>
          <div style={{...card,padding:12}}>
            <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:8}}>Выручка (7 дней)</div>
            {(()=>{
              const days=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
              const vals=[18000,26000,22000,32000,28000,38000,24000];
              const max=Math.max(...vals);
              return(
                <div>
                  <div style={{display:"flex",gap:3,alignItems:"flex-end",height:64,marginBottom:4}}>
                    {vals.map((v,i)=>(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <div style={{fontSize:8,color:BL,fontWeight:700,marginBottom:1}}>{i===5?Math.round(v/1000)+"к":""}</div>
                        <div style={{width:"100%",background:i===5?BL:`linear-gradient(to top,${NM},${BL})`,borderRadius:"4px 4px 0 0",height:`${(v/max)*56}px`,opacity:i===5?1:.65,transition:"height .3s"}}/>
                        <div style={{fontSize:8,color:MG}}>{days[i]}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:GY,borderTop:`1px solid ${BD}`,paddingTop:5}}>
                    <span>Пн–Вс</span><span style={{color:BL,fontWeight:700}}>Лучший: Сб 38 000 с.</span><span>Всего: 188 000 с.</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>}
      </div>
    </div>
  );
}



// ════════════════════════════════════════════════════════════════════
//  DRIVER APP v2 — OSRM реальные маршруты + Яндекс Навигатор deep link
// ════════════════════════════════════════════════════════════════════

// ── OSRM Routing ─────────────────────────────────────────────────
async function fetchOSRM(coords){
  const pts=coords.map(c=>`${c.lng},${c.lat}`).join(";");
  const url=`https://router.project-osrm.org/route/v1/driving/${pts}?overview=full&geometries=geojson&steps=true`;
  try{
    const r=await fetch(url,{signal:AbortSignal.timeout(8000)});
    if(!r.ok)throw new Error(`${r.status}`);
    const d=await r.json();
    if(d.code!=="Ok")throw new Error("no route");
    const route=d.routes[0];
    const steps=(route.legs[0]?.steps||[]).map(s=>({
      text:formatManeuver(s.maneuver,s.name),
      dist:Math.round(s.distance),
      type:s.maneuver.type,
    })).filter(s=>s.dist>10);
    return{
      pts:route.geometry.coordinates.map(c=>[c[1],c[0]]),
      km:+(route.distance/1000).toFixed(1),
      min:Math.round(route.duration/60),
      steps,
    };
  }catch(e){
    console.warn("OSRM fallback:",e.message);
    return null;
  }
}
function formatManeuver(m,name){
  const d={left:"← Налево",right:"→ Направо","slight left":"↖ Чуть левее","slight right":"↗ Чуть правее",straight:"↑ Прямо",uturn:"↩ Разворот"}[m.modifier||""]||"↑";
  const t={depart:"Начните движение",arrive:"🏁 Прибытие",turn:"Поверните",continue:"Продолжайте",fork:"Развилка",merge:"Съезд",roundabout:"Кольцо",rotary:"Кольцо","new name":"Продолжайте"}[m.type]||"↑";
  return `${t}${m.modifier?` ${d}`:""} ${name?`· ${name}`:""}`.trim();
}

function DriverApp({orders,onUpdate}){
  const [auth,setAuth]=useState(null);
  const [online,setOnline]=useState(false);
  const [autoAccept,setAutoAccept]=useState(false);
  const [dSt,setDSt]=useState("idle");
  const [pending,setPending]=useState(null);
  const [active,setActive]=useState(null);
  const [cd,setCd]=useState(15);
  const [earn,setEarn]=useState({today:0,orders:0});
  const [dTab,setDTab]=useState("map");
  const [dNavMode,setDNavMode]=useState(false);
  const [dNavDest,setDNavDest]=useState(null); // map|earn|profile
  const [mapLoaded,setMapLoaded]=useState(false);
  const [routeInfo,setRouteInfo]=useState(null);
  const [curStep,setCurStep]=useState(0);
  const [loadingRoute,setLoadingRoute]=useState(false);
  // ── Баланс водителя ────────────────────────────────────────────
  const [balance,setBalance]=useState(0);      // текущий баланс
  const [showTopUp,setShowTopUp]=useState(false);
  const [topUpAmt,setTopUpAmt]=useState(100);
  const [topUpPay,setTopUpPay]=useState("alif");
  const MIN_BAL=5; // минимум для принятия заказов
  const COMM_RATE=0.15; // 15% комиссия платформы

  const mapRef=useRef(null);
  const leafRef=useRef(null);
  const driverMk=useRef(null);
  const pickMk=useRef(null);
  const destMk=useRef(null);
  const rtRef=useRef(null);
  const rtGRef=useRef(null);
  const animRef=useRef(null);
  const dStRef=useRef("idle");

  useEffect(()=>{dStRef.current=dSt;},[dSt]);

  // Координаты (демо Душанбе)
  const DPOS={lat:38.5598,lng:68.7870};
  const PPOS={lat:38.5549,lng:68.7736}; // Рохат
  const APOS={lat:38.5480,lng:68.7820}; // адрес клиента

  // Входящие заказы
  useEffect(()=>{
    if(!online||dSt!=="idle")return;
    const avail=orders.filter(o=>["new","ready","partner_accepted"].includes(o.status));
    if(avail.length>0&&!pending){setPending(avail[0]);setDSt("incoming");setCd(15);}
  },[orders,online,dSt]);

  // Обратный отсчёт
  useEffect(()=>{
    if(dSt!=="incoming")return;
    if(cd<=0){setPending(null);setDSt("idle");return;}
    const t=setTimeout(()=>setCd(c=>c-1),1000);
    return()=>clearTimeout(t);
  },[cd,dSt]);

  // Автопринятие заказа (как в Яндекс Про)
  useEffect(()=>{
    if(dSt==="incoming"&&autoAccept&&pending){
      const t=setTimeout(()=>{ if(dStRef.current==="incoming") accept(); },1400);
      return()=>clearTimeout(t);
    }
  },[dSt,autoAccept,pending]);

  // Инит карты
  useEffect(()=>{
    if(!auth)return;
    const mount=mapRef.current;
    if(!mount||leafRef.current)return;
    if(!document.getElementById("drv-anim")){
      const s=document.createElement("style");s.id="drv-anim";
      s.textContent=`
        @keyframes drvcarpulse{0%{transform:scale(.5);opacity:.8}70%{transform:scale(2.4);opacity:0}100%{opacity:0}}
        @keyframes drvblink{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes navstep{0%{transform:translateX(-6px);opacity:0}100%{transform:translateX(0);opacity:1}}
      `;
      document.head.appendChild(s);
    }
    function init(){
      const L=window.L;
      const map=L.map(mount,{zoomControl:false,attributionControl:false,dragging:true,scrollWheelZoom:false,tap:false}).setView([DPOS.lat,DPOS.lng],15);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",{
        attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a>',maxZoom:19,subdomains:"abc"
      }).addTo(map);
      L.control.zoom({position:"bottomright"}).addTo(map);
      // Car icon
      const carIcon=L.divIcon({html:`<div style="font-size:28px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.5))"><Icon name="car" size={15} color="currentColor"/></div>`,iconSize:[34,34],iconAnchor:[17,17],className:""});
      driverMk.current=L.marker([DPOS.lat,DPOS.lng],{icon:carIcon,zIndexOffset:1000}).addTo(map);
      // Pulse ring
      if(!document.getElementById("drv-pulse2")){
        const ps=document.createElement("style");ps.id="drv-pulse2";
        ps.textContent="@keyframes drvring{0%{transform:scale(.4);opacity:.8}100%{transform:scale(2.5);opacity:0}}";
        document.head.appendChild(ps);
      }
      const pulseIcon=L.divIcon({html:`<div style="width:48px;height:48px;border-radius:50%;background:rgba(46,125,50,.18);animation:drvring 2.5s ease-out infinite"></div>`,iconSize:[48,48],iconAnchor:[24,24],className:"",interactive:false});
      L.marker([DPOS.lat,DPOS.lng],{icon:pulseIcon,zIndexOffset:999,interactive:false}).addTo(map);
      leafRef.current={map,L};
      setMapLoaded(true);
    };
    if(!document.getElementById("lf-css")){const l=document.createElement("link");l.id="lf-css";l.rel="stylesheet";l.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";document.head.appendChild(l);}
    if(window.L){init();}else{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";s.onload=init;document.head.appendChild(s);}
    return()=>{if(animRef.current)clearInterval(animRef.current);if(leafRef.current){leafRef.current.map.remove();leafRef.current=null;}};
  },[auth]);

  // ── Построить маршрут (OSRM → реальные дороги, fallback bezier) ──
  const buildRoute=async(from,to,color="#2E7D32")=>{
    const{map,L}=leafRef.current||{};if(!map)return;
    [rtRef,rtGRef].forEach(r=>{if(r.current)map.removeLayer(r.current);});
    setLoadingRoute(true);setCurStep(0);
    const info=await fetchOSRM([from,to]);
    setLoadingRoute(false);
    if(info){
      setRouteInfo(info);
      rtGRef.current=L.polyline(info.pts,{color,weight:14,opacity:.18}).addTo(map);
      rtRef.current=L.polyline(info.pts,{color,weight:5,opacity:.92}).addTo(map);
      map.fitBounds(L.latLngBounds(info.pts),{padding:[90,90]});
      return info.pts;
    } else {
      // Fallback: bezier curve
      const pts=bz([from.lat,from.lng],[to.lat,to.lng],60);
      rtGRef.current=L.polyline(pts,{color,weight:14,opacity:.15}).addTo(map);
      rtRef.current=L.polyline(pts,{color,weight:5,opacity:.9}).addTo(map);
      map.fitBounds(L.latLngBounds([[from.lat,from.lng],[to.lat,to.lng]]),{padding:[90,90]});
      setRouteInfo({km:2.1,min:8,steps:[{text:"↑ Двигайтесь по маршруту",dist:2100}]});
      return pts;
    }
  };

  const bz=(a,b,n=40)=>{
    const mx=(a[0]+b[0])/2+(b[1]-a[1])*.1,my=(a[1]+b[1])/2-(b[0]-a[0])*.1;
    const p=[];for(let i=0;i<=n;i++){const t=i/n;p.push([(1-t)*(1-t)*a[0]+2*(1-t)*t*mx+t*t*b[0],(1-t)*(1-t)*a[1]+2*(1-t)*t*my+t*t*b[1]]);}return p;
  };

  const animDriver=(pts,onDone)=>{
    let i=0;if(animRef.current)clearInterval(animRef.current);
    animRef.current=setInterval(()=>{
      if(i>=pts.length){clearInterval(animRef.current);if(onDone)onDone();return;}
      driverMk.current?.setLatLng(pts[i]);
      // Advance nav step
      if(routeInfo?.steps&&i>0&&i%(Math.floor(pts.length/Math.max(routeInfo.steps.length,1)))===0)
        setCurStep(c=>Math.min(c+1,routeInfo.steps.length-1));
      i++;
    },65);
  };

  const mkPin=(L,col,emoji)=>L.divIcon({
    html:emoji
      ?`<div style="background:${col};border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:19px;border:3px solid white;box-shadow:0 3px 12px rgba(0,0,0,.3)">${emoji}</div>`
      :`<div><div style="background:${col};border:3px solid white;border-radius:50%;width:22px;height:22px;box-shadow:0 3px 10px rgba(0,0,0,.3)"></div><div style="width:2px;height:14px;background:${col};margin:0 auto"></div></div>`,
    iconSize:emoji?[38,38]:[24,38],iconAnchor:emoji?[19,19]:[12,38],className:""
  });

  // ── Accept → к партнёру ───────────────────────────────────────────
  const accept=async()=>{
    const o=pending;setActive(o);setPending(null);setDSt("to_pickup");
    onUpdate(o.id,"driver_accepted");
    const{map,L}=leafRef.current||{};
    if(map&&L){if(pickMk.current)map.removeLayer(pickMk.current);pickMk.current=L.marker([PPOS.lat,PPOS.lng],{icon:mkPin(L,"#C42B0A","🏪")}).addTo(map);}
    const pts=await buildRoute(DPOS,PPOS,"#1565C0");
    if(pts)animDriver(pts,()=>setDSt("at_pickup"));
  };

  // ── Забрал → к клиенту ───────────────────────────────────────────
  const arrivedPickup=async()=>{
    setDSt("to_dest");onUpdate(active.id,"picked_up");
    const{map,L}=leafRef.current||{};
    if(map&&L){if(destMk.current)map.removeLayer(destMk.current);destMk.current=L.marker([APOS.lat,APOS.lng],{icon:mkPin(L,"#C42B0A","")}).addTo(map);}
    const pts=await buildRoute(PPOS,APOS,"#2E7D32");
    if(pts)animDriver(pts,()=>setDSt("almost"));
  };

  const deliver=()=>{
    setDSt("done");onUpdate(active?.id||"","delivered");
    const fee=Math.round((active?.deliveryFee||8)*0.8);
    const comm=Math.round((active?.total||50)*COMM_RATE);
    setBalance(prev=>Math.max(0,prev-comm));
    setEarn(p=>({today:p.today+fee,orders:p.orders+1}));
    const{map}=leafRef.current||{};
    if(map)[pickMk,destMk,rtRef,rtGRef].forEach(r=>{if(r.current){map.removeLayer(r.current);r.current=null;}});
    setRouteInfo(null);setCurStep(0);
    setTimeout(()=>{setActive(null);setDSt("idle");if(driverMk.current)driverMk.current.setLatLng([DPOS.lat,DPOS.lng]);if(leafRef.current)leafRef.current.map.flyTo([DPOS.lat,DPOS.lng],15,{duration:.8});},4000);
  };

  // ── Открыть Яндекс Навигатор ──────────────────────────────────────
  const openYandex=(from,to)=>{
    const app=`yandexnavi://build_route_on_map?lat_to=${to.lat}&lon_to=${to.lng}&lat_from=${from.lat}&lon_from=${from.lng}`;
    const web=`https://yandex.ru/maps/?rtext=${from.lat},${from.lng}~${to.lat},${to.lng}&rtt=auto&lang=ru_RU`;
    try{window.location.href=app;}catch(e){}
    setTimeout(()=>window.open(web,"_blank"),800);
  };

  const SB=()=><div style={{background:GR,padding:"10px 22px 5px",display:"flex",justifyContent:"space-between",flexShrink:0}}><span style={{color:WH,fontSize:13,fontWeight:700}}>9:41</span><span style={{color:WH,fontSize:12}}>●●● 🔋</span></div>;
  if(!auth)return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><SB/><AuthScreen role="driver" onAuth={setAuth} accent={GR} logo="zood" title="ZOOD Драйв" subtitle="Навигация · Заказы · Заработок"/></div>);

  const progSteps=["to_pickup","at_pickup","to_dest","almost","done"];
  const progLabels=["→ К партнёру","↓ Забираю","→ Клиенту","📍 Рядом","✓ Готово"];
  const curProg=progSteps.indexOf(dSt);

  // Active nav step text
  const navStep=routeInfo?.steps?.[curStep];

  return(
    <>
    <div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,#1B5E20,${GR})`,padding:"8px 14px 10px",flexShrink:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:active?7:0}}>
          <div><div style={{color:WH,fontWeight:800,fontSize:14}}>{auth.name}</div>
          <div style={{display:"flex",gap:7,alignItems:"center",marginTop:1}}>
            <span style={{color:"rgba(255,255,255,.55)",fontSize:10}}><Icon name="star" size={14} color="currentColor" style={{marginRight:5}}/>4.9 · {earn.orders} дост.</span>
            <span style={{background:balance<MIN_BAL?"#DC2626":"rgba(255,255,255,.18)",borderRadius:8,padding:"2px 7px",fontSize:10,fontWeight:700,color:WH,cursor:"pointer"}} onClick={()=>setShowTopUp(true)}>💼 {balance} с. {balance<MIN_BAL?"⚠️ пополни":""}</span>
          </div></div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>{if(!online&&balance<MIN_BAL){setShowTopUp(true);return;}setOnline(!online);}} style={{background:online?"rgba(255,255,255,.22)":"rgba(0,0,0,.3)",border:`2px solid ${online?"rgba(255,255,255,.5)":"rgba(255,255,255,.2)"}`,borderRadius:20,padding:"6px 12px",color:WH,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{online?"● В сети":"○ Офлайн"}</button>
            <button onClick={()=>setAuth(null)} style={{background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.45)",borderRadius:8,padding:"5px 8px",fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>Выйти</button>
          </div>
        </div>
        {active&&<div style={{display:"flex",gap:0,background:"rgba(0,0,0,.2)",borderRadius:9,overflow:"hidden"}}>
          {progLabels.map((l,i)=><div key={i} style={{flex:1,padding:"5px 2px",textAlign:"center",fontSize:9,fontWeight:i<=curProg?800:400,color:i<=curProg?WH:"rgba(255,255,255,.3)",background:i<curProg?"rgba(255,255,255,.12)":i===curProg?"rgba(255,255,255,.24)":"transparent",borderRight:i<4?"1px solid rgba(255,255,255,.07)":""}}>{l}</div>)}
        </div>}
      </div>

      {/* Авто-принятие заказов */}
      {online&&!active&&dSt!=="incoming"&&<div style={{background:WH,padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${BD}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:autoAccept?GRL:BG,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="bolt" size={18} color={autoAccept?GR:GY}/></div>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:DK}}>Автоприём заказов</div>
            <div style={{fontSize:10,color:GY}}>{autoAccept?"Заказы принимаются автоматически":"Принимать заказы вручную"}</div>
          </div>
        </div>
        <div onClick={()=>setAutoAccept(a=>!a)} style={{width:50,height:28,borderRadius:14,background:autoAccept?GR:BD,position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:WH,position:"absolute",top:3,left:autoAccept?25:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
        </div>
      </div>}

      {/* NAVIGATION HEADER (Яндекс Про стиль) */}
      {navStep&&(dSt==="to_pickup"||dSt==="to_dest")&&<div style={{background:dSt==="to_pickup"?"#1565C0":"#1B5E20",padding:"10px 14px",flexShrink:0,zIndex:9}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:32,minWidth:38,textAlign:"center"}}>{navStep.text.split(" ")[0]}</div>
          <div style={{flex:1}}>
            <div style={{color:WH,fontWeight:800,fontSize:15,animation:"navstep .3s ease-out"}}>{navStep.text.replace(/^[←→↑↖↗↩🏁]\s*/,"")}</div>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:11,marginTop:2}}>{navStep.dist>999?`${(navStep.dist/1000).toFixed(1)} км`:`${navStep.dist} м`} до поворота</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:WH,fontWeight:900,fontSize:18}}>{routeInfo?.min||"?"}</div>
            <div style={{color:"rgba(255,255,255,.55)",fontSize:9}}>мин</div>
          </div>
        </div>
        {/* Steps preview */}
        {routeInfo?.steps[curStep+1]&&<div style={{marginTop:7,paddingTop:7,borderTop:"1px solid rgba(255,255,255,.15)",fontSize:11,color:"rgba(255,255,255,.55)"}}>Затем: {routeInfo.steps[curStep+1].text}</div>}
      </div>}

      {/* Loading route indicator */}
      {loadingRoute&&<div style={{background:BL,padding:"8px 14px",flexShrink:0,textAlign:"center",fontSize:11,color:WH,fontWeight:600}}>⏳ Строим маршрут по реальным дорогам...</div>}

      {/* Map */}
      <div style={{flex:1,position:"relative",minHeight:0}}>
        <div ref={mapRef} style={{width:"100%",height:"100%"}}/>
        {!mapLoaded&&<div style={{position:"absolute",inset:0,background:"#E8EEE5",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,zIndex:10}}><div style={{fontSize:40}}>🗺️</div><div style={{fontWeight:700,fontSize:13,color:GY}}>Загружаем навигатор...</div></div>}
        {!online&&mapLoaded&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.48)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:20}}>
          <div style={{textAlign:"center",padding:26,background:"rgba(17,24,39,.82)",borderRadius:22}}>
            <div style={{fontSize:44,marginBottom:10}}><Icon name="sleepz" size={15} color="currentColor"/></div>
            <div style={{color:WH,fontWeight:800,fontSize:17,marginBottom:5}}>Вы офлайн</div>
            <div style={{color:"rgba(255,255,255,.5)",fontSize:12,marginBottom:18}}>Нажмите «В сети» чтобы начать</div>
            <button onClick={()=>{if(balance<MIN_BAL){setShowTopUp(true);}else{setOnline(true);}}} style={{background:`linear-gradient(135deg,#1B5E20,${GR})`,color:WH,border:"none",borderRadius:14,padding:"13px 28px",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Начать работу →</button>
          </div>
        </div>}
        {/* ── Модал пополнения баланса ── */}
        {showTopUp&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.52)",zIndex:100,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:WH,borderRadius:"22px 22px 0 0",width:"100%",padding:"6px 16px 28px"}}>
            <div style={{width:36,height:4,background:BD,borderRadius:2,margin:"11px auto 14px"}}/>
            <div style={{fontWeight:800,fontSize:16,color:DK,marginBottom:3}}>💼 Пополнить баланс</div>
            <div style={{fontSize:11,color:GY,marginBottom:14}}>Минимум для работы: {MIN_BAL} с. · Комиссия платформы: {COMM_RATE*100}%</div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {[50,100,200,500].map(amt=><button key={amt} onClick={()=>setTopUpAmt(amt)} style={{flex:1,padding:"11px 4px",borderRadius:12,border:`2px solid ${topUpAmt===amt?GR:BD}`,background:topUpAmt===amt?GRL:BG,color:topUpAmt===amt?GR:DK,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{amt} с.</button>)}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[{id:"alif",l:"💚 АЛИФ Пэй"},{id:"card",l:"💳 Карта"},{id:"cash",l:"💵 Касса"}].map(p=><button key={p.id} onClick={()=>setTopUpPay(p.id)} style={{flex:1,padding:"9px 4px",borderRadius:10,border:`2px solid ${topUpPay===p.id?BL:BD}`,background:topUpPay===p.id?BLL:BG,color:topUpPay===p.id?BL:DK,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{p.l}</button>)}
            </div>
            <div style={{background:GRL,borderRadius:11,padding:"9px 13px",marginBottom:12,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:12,color:GR,fontWeight:600}}>Баланс после пополнения</span>
              <span style={{fontWeight:900,fontSize:15,color:GR}}>{balance+topUpAmt} с.</span>
            </div>
            <button onClick={()=>{setBalance(p=>p+topUpAmt);setShowTopUp(false);if(!online&&(balance+topUpAmt)>=MIN_BAL)setOnline(true);}} style={{width:"100%",padding:14,background:`linear-gradient(135deg,#1B5E20,${GR})`,color:WH,border:"none",borderRadius:14,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 6px 20px ${GR}44`}}>Пополнить {topUpAmt} с.</button>
            <button onClick={()=>setShowTopUp(false)} style={{width:"100%",padding:"10px",background:"none",border:"none",color:GY,fontSize:12,cursor:"pointer",marginTop:4,fontFamily:"inherit"}}>Отмена</button>
          </div>
        </div>}
        {online&&dSt==="idle"&&mapLoaded&&<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",zIndex:10,background:"rgba(46,125,50,.88)",borderRadius:22,padding:"7px 16px",display:"flex",gap:7,alignItems:"center"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:WH,animation:"drvblink 1.4s ease-in-out infinite"}}/>
          <span style={{color:WH,fontSize:11,fontWeight:600}}>В сети · Ждём заказы...</span>
        </div>}
        {/* Distance badge */}
        {routeInfo&&(dSt==="to_pickup"||dSt==="to_dest")&&<div style={{position:"absolute",bottom:10,left:14,zIndex:10,background:"rgba(13,27,42,.85)",borderRadius:12,padding:"6px 11px",color:WH,fontSize:11,fontWeight:600}}><Icon name="pin" size={14} color="currentColor" style={{marginRight:5}}/>{routeInfo.km} км · {routeInfo.min} мин</div>}
        {/* Yandex button */}
        {(dSt==="to_pickup"||dSt==="to_dest")&&<button onClick={()=>openNav(dSt==="to_pickup"?PPOS[0]:APOS[0],dSt==="to_pickup"?PPOS[1]:APOS[1],"Маршрут")} style={{position:"absolute",bottom:10,right:14,zIndex:10,background:"#FC3f1D",border:"none",borderRadius:12,padding:"7px 12px",color:WH,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 3px 12px rgba(252,63,29,.4)"}}>Яндекс<br/>Навигатор →</button>}
      </div>

      {/* Bottom cards */}
      <div style={{flexShrink:0,background:WH}}>
        {/* NEW ORDER */}
        {dSt==="incoming"&&pending&&<div style={{padding:"12px 14px 14px",borderTop:`3px solid ${R}`,boxShadow:"0 -4px 20px rgba(0,0,0,.15)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div><div style={{fontWeight:800,fontSize:16,color:DK,display:"flex",alignItems:"center",gap:7}}><span style={{display:"flex",alignItems:"center"}}><Icon name="bell" size={14} color="currentColor" style={{marginRight:5}}/>Новый заказ!</span>{autoAccept&&<span style={{background:GR,color:WH,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:6,letterSpacing:.5}}>АВТО</span>}</div><div style={{fontSize:10,color:GY,marginTop:2}}><Icon name="money" size={14} color="currentColor" style={{marginRight:5}}/>Ваш заработок: ~{Math.round((pending?.deliveryFee||8)*0.8)} с.</div></div>
            <div style={{position:"relative",width:52,height:52,flexShrink:0}}>
              <svg width="52" height="52" style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
                <circle cx="26" cy="26" r="22" fill="none" stroke={BD} strokeWidth="3"/>
                <circle cx="26" cy="26" r="22" fill="none" stroke={cd<=5?R:GR} strokeWidth="3" strokeDasharray={`${2*Math.PI*22}`} strokeDashoffset={`${2*Math.PI*22*(1-cd/15)}`} style={{transition:"stroke-dashoffset .9s linear,stroke .3s"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:17,color:cd<=5?R:GR}}>{cd}</div>
            </div>
          </div>
          <div style={{background:BG,borderRadius:13,padding:"11px 13px",marginBottom:10}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
              <div style={{width:38,height:38,background:BLL,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}><Icon name="person" size={15} color="currentColor"/></div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:DK}}>{pending.customer||pending.partner}</div><div style={{fontSize:10,color:GY,marginTop:1}}>→ {pending.address}</div></div>
            </div>
            <div style={{display:"flex",gap:7}}>
              <span style={{background:GRL,color:GR,borderRadius:7,padding:"3px 9px",fontSize:11,fontWeight:700}}>+{Math.round((pending.deliveryFee||8)*0.8)} с.</span>
              <span style={{background:BLL,color:BL,borderRadius:7,padding:"3px 9px",fontSize:11,fontWeight:600}}>~1.2 км</span>
              <span style={{background:"#F1F5F9",color:GY,borderRadius:7,padding:"3px 9px",fontSize:11}}>~4 мин</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setPending(null);setDSt("idle");}} style={{flex:1,padding:12,background:BG,color:GY,border:`1px solid ${BD}`,borderRadius:12,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Пропустить</button>
            <button onClick={accept} style={{flex:2,padding:12,background:`linear-gradient(135deg,#1B5E20,${GR})`,color:WH,border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 14px ${GR}44`}}>✓ Принять</button>
          </div>
        </div>}

        {/* TO PICKUP */}
        {dSt==="to_pickup"&&active&&<div style={{padding:"10px 14px 12px",borderTop:`2px solid ${BL}`}}>
          <div style={{fontSize:10,color:BL,fontWeight:700,letterSpacing:.5,marginBottom:6}}><Icon name="dot" size={14} color="currentColor" style={{marginRight:5}}/>ЕДУ К ПАССАЖИРУ · OSRM</div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:9}}>
            <div style={{width:38,height:38,background:BLL,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}><Icon name="person" size={15} color="currentColor"/></div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:DK}}>{active.customer}</div><div style={{fontSize:10,color:GY}}>{active.address}{routeInfo?` · ${routeInfo.km} км · ${routeInfo.min} мин`:""}</div></div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={arrivedPickup} style={{flex:1,padding:11,background:BL,color:WH,border:"none",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="target" size={14} color="currentColor" style={{marginRight:5}}/>На месте!</button>
            <button onClick={()=>{setDNavDest({x:190,y:200,label:"Пассажир"});setDNavMode(true);}} style={{padding:"11px 12px",background:`linear-gradient(135deg,${NV},#1B3A5C)`,color:WH,border:"none",borderRadius:11,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="compass" size={14} color="currentColor" style={{marginRight:5}}/>Навигатор</button>
          </div>
        </div>}

        {/* AT PICKUP — ВОДИТЕЛЬ НА МЕСТЕ */}
        {dSt==="at_pickup"&&active&&<div style={{padding:"10px 14px 12px",borderTop:`2px solid ${GD}`}}>
          <div style={{fontSize:10,color:GD,fontWeight:700,letterSpacing:.5,marginBottom:6}}><Icon name="target" size={14} color="currentColor" style={{marginRight:5}}/>НА МЕСТЕ — ОЖИДАЮ ПАССАЖИРА</div>
          <div style={{background:GDL,borderRadius:11,padding:"9px 12px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:12,color:DK}}>⏱ Ожидание бесплатно 3 мин</div>
            <div style={{fontWeight:800,fontSize:13,color:GD}}>Эконом</div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={arrivedPickup} style={{flex:2,padding:11,background:`linear-gradient(135deg,#1B5E20,${GR})`,color:WH,border:"none",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="rocket" size={14} color="currentColor" style={{marginRight:5}}/>Начать поездку!</button>
            <button onClick={()=>{setDSt("waiting_passenger");}} style={{flex:1,padding:11,background:GDL,color:GD,border:`1.5px solid ${GD}`,borderRadius:11,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⏱ Ожидание</button>
          </div>
        </div>}

        {/* ОЖИДАНИЕ ПАССАЖИРА */}
        {dSt==="waiting_passenger"&&active&&<div style={{padding:"10px 14px 12px",borderTop:`2px solid ${GD}`}}>
          <div style={{fontSize:10,color:GD,fontWeight:700,letterSpacing:.5,marginBottom:6}}>⏱ РЕЖИМ ОЖИДАНИЯ (1 с./мин)</div>
          <div style={{background:GDL,borderRadius:11,padding:"9px 12px",marginBottom:8}}>
            <div style={{fontSize:13,color:DK,fontWeight:600}}>Начисляется плата за ожидание</div>
            <div style={{fontSize:11,color:GY,marginTop:2}}>Пассажир получил уведомление</div>
          </div>
          <button onClick={arrivedPickup} style={{width:"100%",padding:11,background:`linear-gradient(135deg,#1B5E20,${GR})`,color:WH,border:"none",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="rocket" size={14} color="currentColor" style={{marginRight:5}}/>Пассажир сел — Начать поездку!</button>
        </div>}

        {/* ПОЕЗДКА В ПРОЦЕССЕ — СЧЁТЧИК */}
        {(dSt==="to_dest"||dSt==="almost")&&active&&<div style={{padding:"10px 14px 12px",borderTop:`2px solid ${GR}`}}>
          <div style={{fontSize:10,color:GR,fontWeight:700,letterSpacing:.5,marginBottom:6}}><Icon name="dot" size={14} color="currentColor" style={{marginRight:5}}/>ПОЕЗДКА · OSRM · ПО СЧЁТЧИКУ</div>
          <div style={{background:`linear-gradient(135deg,${NV},#1B3A5C)`,borderRadius:11,padding:"10px 13px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{color:"rgba(255,255,255,.6)",fontSize:10}}><Icon name="money" size={14} color="currentColor" style={{marginRight:5}}/>Счётчик</div><div style={{fontWeight:900,fontSize:22,color:WH}}>≈{Math.round((routeInfo?.km||distKm||5)*3)} с.</div></div>
            <div style={{textAlign:"right"}}><div style={{color:"rgba(255,255,255,.6)",fontSize:10}}><Icon name="pin" size={14} color="currentColor" style={{marginRight:5}}/>Маршрут</div><div style={{color:WH,fontSize:12,fontWeight:600}}>{active.address?.split(",")[0]||"Назначение"}</div>{routeInfo&&<div style={{color:"rgba(255,255,255,.5)",fontSize:10}}>{routeInfo.km} км · {routeInfo.min} мин</div>}</div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={deliver} style={{flex:2,padding:11,background:`linear-gradient(135deg,#1B5E20,${GR})`,color:WH,border:"none",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="flag" size={14} color="currentColor" style={{marginRight:5}}/>Завершить поездку</button>
            <button onClick={()=>{setDNavDest({x:270,y:104,label:active?.address||"Назначение"});setDNavMode(true);}} style={{padding:"11px 12px",background:`linear-gradient(135deg,${NV},#1B3A5C)`,color:WH,border:"none",borderRadius:11,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}><Icon name="compass" size={14} color="currentColor" style={{marginRight:5}}/>Навигатор</button>
          </div>
        </div>}

        {/* DONE */}
        {dSt==="done"&&<div style={{padding:"13px",textAlign:"center",borderTop:`2px solid ${GR}`,background:GRL}}>
          <div style={{fontSize:36,marginBottom:4}}><Icon name="party" size={15} color="currentColor"/></div>
          <div style={{fontWeight:800,fontSize:15,color:GR}}>Доставлено!</div>
          <div style={{fontSize:11,color:GY,marginTop:2}}>+{Math.round((active?.deliveryFee||8)*0.8)} с. · Итого: {earn.today} с. сегодня</div>
        </div>}

        {dSt==="idle"&&online&&<div style={{padding:"9px 14px 11px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:11,color:GY}}>Ожидаем заказы...</div>
          <div style={{display:"flex",gap:3}}>{[1,2,3].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:GR,opacity:1/i}}/>)}</div>
        </div>}
        {dSt==="idle"&&!online&&<div style={{padding:"8px 14px 10px",borderTop:`1px solid ${BD}`}}><div style={{textAlign:"center",fontSize:10,color:MG}}>Нажмите «В сети» для начала работы</div></div>}
      </div>
      {/* Нижняя навигация водителя */}
      <div style={{background:WH,borderTop:`1px solid ${BD}`,display:"flex",flexShrink:0}}>
        {[{id:"map",e:"🗺️",l:"Карта"},{id:"earn",e:"💰",l:"Заработок"},{id:"profile",e:"👤",l:"Профиль"}].map(t=>(
          <button key={t.id} onClick={()=>setDTab(t.id)} style={{flex:1,padding:"8px 4px 10px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:19,filter:dTab===t.id?"none":"grayscale(100%) opacity(35%)"}}>{t.e}</span>
            <span style={{fontSize:9,fontWeight:700,color:dTab===t.id?GR:MG}}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>
    {/* Вкладка заработка */}
    {dTab==="earn"&&<div style={{position:"absolute",inset:0,background:WH,zIndex:50,display:"flex",flexDirection:"column"}}>
      <div style={{background:`linear-gradient(135deg,#1B5E20,${GR})`,padding:"10px 16px 14px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{color:WH,fontWeight:800,fontSize:16}}><Icon name="money" size={14} color="currentColor" style={{marginRight:5}}/>Мой заработок</div>
            <div style={{color:"rgba(255,255,255,.7)",fontSize:11,marginTop:2}}><Icon name="star" size={14} color="currentColor" style={{marginRight:5}}/>4.9 · {earn.orders} поездок</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:"rgba(255,255,255,.6)",fontSize:9,marginBottom:3}}>ЦЕЛЬ ДНЯ: 200 с.</div>
            <div style={{width:90,height:6,background:"rgba(255,255,255,.2)",borderRadius:3,overflow:"hidden"}}>
              <div style={{width:`${Math.min(100,Math.round((earn.today/200)*100))}%`,height:"100%",background:"rgba(255,255,255,.9)",borderRadius:3,transition:"width .5s"}}/>
            </div>
            <div style={{color:"rgba(255,255,255,.5)",fontSize:9,marginTop:2}}>{earn.today}/200 с. · {Math.min(100,Math.round((earn.today/200)*100))}%</div>
          </div>
        </div>
      </div>
      <div style={{overflowY:"auto",flex:1,padding:"14px"}}>
        {/* Сводка */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[{l:"Сегодня",v:`${earn.today} с.`,c:GR},{l:"Баланс",v:`${balance} с.`,c:balance<5?"#DC2626":BL},{l:"Доставок",v:earn.orders,c:NV}].map(s=>(
            <div key={s.l} style={{background:`${s.c}12`,border:`1px solid ${s.c}30`,borderRadius:14,padding:"11px 6px",textAlign:"center"}}>
              <div style={{fontWeight:900,fontSize:15,color:s.c}}>{s.v}</div>
              <div style={{fontSize:9,color:GY,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* График */}
        <div style={{background:WH,borderRadius:16,padding:"12px 6px",marginBottom:12,border:`1px solid ${BD}`,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
          <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:8,paddingLeft:8}}><Icon name="chart" size={14} color="currentColor" style={{marginRight:5}}/>Заработок за неделю</div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={[{d:"Пн",e:0},{d:"Вт",e:45},{d:"Ср",e:32},{d:"Чт",e:67},{d:"Пт",e:89},{d:"Сб",e:120},{d:"Вс",e:earn.today}]} margin={{top:4,right:4,left:-20,bottom:0}}>
              <XAxis dataKey="d" tick={{fontSize:10,fill:GY}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v)=>[`${v} с.`,"Заработок"]} contentStyle={{borderRadius:10,border:`1px solid ${BD}`,fontSize:11}}/>
              <Bar dataKey="e" fill={GR} radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 8px 0",fontSize:10,color:GY,borderTop:`1px solid ${BD}`}}>
            <span>Пн–Вс</span><span style={{color:GR,fontWeight:700}}>Лучший: Сб 120 с.</span><span>Итого: {353+earn.today} с.</span>
          </div>
        </div>
        {/* История транзакций */}
        <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:8}}>ТРАНЗАКЦИИ</div>
        {[{type:"delivery",amt:8,time:"Сегодня, 14:23",partner:"Рохат"},{type:"topup",amt:100,time:"Сегодня, 10:15",method:"АЛИФ Пэй"},{type:"commission",amt:-7,time:"Вчера, 18:40",partner:"Корвон"},{type:"delivery",amt:12,time:"Вчера, 16:22",partner:"Shah Abbas"},{type:"delivery",amt:6,time:"Вчера, 14:05",partner:"Шарк Пицца"}].map((tx,i)=>(
          <div key={i} style={{background:WH,borderRadius:12,border:`1px solid ${BD}`,padding:"10px 12px",marginBottom:7,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:tx.type==="topup"?BLL:tx.type==="commission"?RL:GRL,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>
              {tx.type==="topup"?"💳":tx.type==="commission"?"📊":"🚴"}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:DK}}>{tx.type==="topup"?`Пополнение · ${tx.method}`:tx.type==="commission"?`Комиссия · ${tx.partner}`:`Доставка · ${tx.partner}`}</div>
              <div style={{fontSize:10,color:GY,marginTop:1}}>{tx.time}</div>
            </div>
            <div style={{fontWeight:800,fontSize:13,color:tx.amt<0?R:tx.type==="topup"?BL:GR}}>{tx.amt>0?"+":""}{tx.amt} с.</div>
          </div>
        ))}
        <button onClick={()=>setShowTopUp(true)} style={{width:"100%",padding:13,background:`linear-gradient(135deg,#1B5E20,${GR})`,color:WH,border:"none",borderRadius:14,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}><Icon name="card" size={14} color="currentColor" style={{marginRight:5}}/>Пополнить баланс</button>
      </div>
      <div style={{background:WH,borderTop:`1px solid ${BD}`,display:"flex",flexShrink:0}}>
        {[{id:"map",e:"🗺️",l:"Карта"},{id:"earn",e:"💰",l:"Заработок"},{id:"profile",e:"👤",l:"Профиль"}].map(t=>(
          <button key={t.id} onClick={()=>setDTab(t.id)} style={{flex:1,padding:"8px 4px 10px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:19,filter:dTab===t.id?"none":"grayscale(100%) opacity(35%)"}}>{t.e}</span>
            <span style={{fontSize:9,fontWeight:700,color:dTab===t.id?GR:MG}}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>}

    {/* Вкладка профиля водителя */}
    {dTab==="profile"&&<div style={{position:"absolute",inset:0,background:BG,zIndex:50,display:"flex",flexDirection:"column"}}>
      <div style={{background:`linear-gradient(135deg,#1B5E20,${GR})`,padding:"16px 18px 22px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:13}}>
          <div style={{width:62,height:62,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",border:"2.5px solid rgba(255,255,255,.5)"}}><Icon name="user" size={30} color={WH}/></div>
          <div style={{flex:1}}>
            <div style={{color:WH,fontWeight:800,fontSize:18}}>{auth?.name||"Водитель"}</div>
            <div style={{color:"rgba(255,255,255,.8)",fontSize:12,marginTop:2}}>{auth?.phone||"+992 90 000-00-00"}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.2)",borderRadius:8,padding:"2px 9px",marginTop:6}}><Icon name="star" size={12} color={WH}/><span style={{color:WH,fontSize:11,fontWeight:700}}>4.9 · {earn.orders} поездок</span></div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[["Баланс",`${balance} с.`,"money"],["Сегодня",`${earn.today} с.`,"chart"],["Поездок",String(earn.orders),"car"]].map(([l,v,ic])=>(
            <div key={l} style={{flex:1,background:WH,borderRadius:14,padding:"13px 8px",textAlign:"center",border:`1px solid ${BD}`}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:5}}><Icon name={ic} size={18} color={GR}/></div>
              <div style={{fontWeight:800,fontSize:15,color:DK}}>{v}</div>
              <div style={{fontSize:10,color:GY,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{background:WH,borderRadius:16,overflow:"hidden",border:`1px solid ${BD}`,marginBottom:14}}>
          {[["car","Мой автомобиль","Chevrolet Cobalt · 1234 AB 01"],["doc","Документы","Права, ТО, страховка"],["card","Способ выплат","АЛИФ Банк ****4521"],["chart","Статистика","Доходы и поездки"],["settings","Настройки","Уведомления, язык"],["shield","Безопасность","Экстренная связь"]].map(([ic,t,sub],i,arr)=>(
            <div key={t} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderBottom:i<arr.length-1?`1px solid ${BG}`:"none",cursor:"pointer"}}>
              <div style={{width:38,height:38,background:GRL,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name={ic} size={18} color={GR}/></div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:DK}}>{t}</div><div style={{fontSize:10,color:GY,marginTop:1}}>{sub}</div></div>
              <span style={{color:MG,fontSize:18}}>›</span>
            </div>
          ))}
        </div>
        <button onClick={()=>{setAuth(null);setOnline(false);}} style={{width:"100%",padding:13,background:WH,color:"#DC2626",border:`1px solid ${BD}`,borderRadius:13,fontSize:14,fontWeight:700,cursor:"pointer"}}>Выйти из аккаунта</button>
      </div>
      <div style={{display:"flex",background:WH,borderTop:`1px solid ${BD}`,flexShrink:0}}>
        {[{id:"map",e:"🗺️",l:"Карта"},{id:"earn",e:"💰",l:"Заработок"},{id:"profile",e:"👤",l:"Профиль"}].map(t=>(
          <button key={t.id} onClick={()=>setDTab(t.id)} style={{flex:1,padding:"8px 4px",background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}}>
            <span style={{fontSize:19,filter:dTab===t.id?"none":"grayscale(100%) opacity(35%)"}}>{t.e}</span>
            <span style={{fontSize:9,fontWeight:700,color:dTab===t.id?GR:MG}}>{t.l}</span>
          </button>
        ))}
      </div>
    </div>}
    {dNavMode&&dNavDest&&<div style={{position:"absolute",inset:0,zIndex:200,display:"flex",flexDirection:"column"}}>
      <NavScreen
        city="Душанбе"
        from={{x:190,y:200}}
        to={dNavDest}
        label={dNavDest.label||"Назначение"}
        onArrived={()=>{setDNavMode(false);}}
        onClose={()=>setDNavMode(false)}
      />
    </div>}
    </>
  );
}


// ════════════════════════════════════════════════════════════════════
//  ADMIN APP  — полная видимость системы
// ════════════════════════════════════════════════════════════════════
function AdminApp({orders,onUpdate}){
  const [auth,setAuth]=useState(null);
  const [tab,setTab]=useState("dash");
  const [oFilter,setOFilter]=useState("all");
  const [pFilter,setPFilter]=useState("active");
  const [selOrd,setSelOrd]=useState(null);
  const sc={flex:1,overflowY:"auto",scrollbarWidth:"none"};
  function SB(){return(<div style={{background:ADM,padding:"10px 22px 5px",display:"flex",justifyContent:"space-between",flexShrink:0}}><span style={{color:WH,fontSize:13,fontWeight:700}}>9:41</span><span style={{color:WH,fontSize:12}}>●●● 🔋</span></div>);}
  function Bdg({l,c,bg}){return(<span style={{background:bg,color:c,fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:5,whiteSpace:"nowrap"}}>{l}</span>);}
  function sBdg(s){const m={new:{l:"Новый",c:"#DC2626",bg:"#FEF2F2"},partner_accepted:{l:"У партнёра",c:GD,bg:GDL},driver_accepted:{l:"У курьера",c:BL,bg:BLL},picked_up:{l:"Забрали",c:BL,bg:BLL},delivered:{l:"Доставлен",c:GR,bg:GRL},declined:{l:"Отменён",c:MG,bg:BG},ready:{l:"Ждёт курьера",c:DSPA,bg:DSPL}}[s]||{l:s,c:GY,bg:BG};return<Bdg l={m.l} c={m.c} bg={m.bg}/>;}
  const fOrders=oFilter==="all"?orders:orders.filter(o=>o.status===oFilter);
  const revenue=orders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.total,0);
  const onlineDrvrs=MOCK_DRIVERS.filter(d=>d.online);

  if(!auth) return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <SB/>
      <AuthScreen role="admin" onAuth={setAuth} accent={ADMA} logo="zood" title="ZOOD Админ" subtitle="Полный контроль над системой"/>
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#F0F4F8"}}>
      <SB/>
      <div style={{background:`linear-gradient(135deg,${ADM},#1E293B)`,padding:"7px 14px 13px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
          <div><div style={{color:WH,fontWeight:900,fontSize:15}}><Icon name="shield" size={14} color="currentColor" style={{marginRight:5}}/>Администратор</div><div style={{color:"rgba(255,255,255,.5)",fontSize:10,marginTop:1}}>{auth.name} · Полный доступ</div></div>
          <button onClick={()=>setAuth(null)} style={{background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.55)",borderRadius:7,padding:"5px 9px",fontSize:9,cursor:"pointer"}}>Выйти</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
          {[[orders.length,"📦","Заказов"],[`${revenue}с.`,"💰","Выручка"],[onlineDrvrs.length,"🚴","Онлайн"],[MOCK_PARTNERS.filter(p=>p.status==="pending").length,"⏳","Заявки"]].map(([v,e,l])=>(
            <div key={l} style={{background:"rgba(255,255,255,.1)",borderRadius:9,padding:"7px 4px",textAlign:"center"}}>
              <div style={{color:WH,fontWeight:900,fontSize:12}}>{v}</div>
              <div style={{color:"rgba(255,255,255,.45)",fontSize:8,marginTop:1}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:WH,display:"flex",borderBottom:`1px solid ${BD}`,flexShrink:0,overflowX:"auto",scrollbarWidth:"none"}}>
        {[{id:"dash",e:"📊",l:"Дашборд"},{id:"orders",e:"📦",l:"Заказы"},{id:"partners",e:"🏪",l:"Партнёры"},{id:"drivers",e:"🚴",l:"Курьеры"},{id:"finance",e:"💰",l:"Финансы"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:"10px 10px",border:"none",background:"none",cursor:"pointer",fontSize:10,fontWeight:tab===t.id?800:500,color:tab===t.id?ADMA:GY,borderBottom:`2.5px solid ${tab===t.id?ADMA:"transparent"}`}}>{t.e} {t.l}</button>
        ))}
      </div>

      <div style={sc}>
        {/* DASHBOARD */}
        {tab==="dash"&&<div style={{padding:12}}>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:9}}>АКТИВНОСТЬ СЕГОДНЯ (LIVE)</div>
          <div style={{background:WH,borderRadius:14,border:`1px solid ${BD}`,padding:13,marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:9}}><Icon name="dot" size={14} color="currentColor" style={{marginRight:5}}/>Последние заказы</div>
            {orders.slice(-5).reverse().map(o=>(
              <div key={o.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${BD}`}}>
                <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:DK}}>#{o.id} · {o.customer}</div><div style={{fontSize:9,color:GY,marginTop:1}}>{o.partner} · {o.createdAt}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:11,fontWeight:700,color:DK,marginBottom:2}}>{o.total} с.</div>{sBdg(o.status)}</div>
              </div>
            ))}
          </div>
          <div style={{background:WH,borderRadius:14,border:`1px solid ${BD}`,padding:13,marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:9}}><Icon name="bike" size={14} color="currentColor" style={{marginRight:5}}/>Курьеры (live)</div>
            {MOCK_DRIVERS.map(d=>(
              <div key={d.id} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:`1px solid ${BD}`}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:d.online?GRL:BG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}><Icon name="bike" size={15} color="currentColor"/></div>
                <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:DK}}>{d.name}</div><div style={{fontSize:9,color:GY}}>{d.today.orders} д. · {d.today.earn} с.</div></div>
                <Bdg l={d.online?(d.status==="delivering"?"Везёт":"Свободен"):"Офлайн"} c={d.online?(d.status==="delivering"?BL:GR):MG} bg={d.online?(d.status==="delivering"?BLL:GRL):BG}/>
              </div>
            ))}
          </div>
          {MOCK_PARTNERS.filter(p=>p.status==="pending").length>0&&(
            <div style={{background:WH,borderRadius:14,border:`2px solid ${ADMA}44`,padding:13}}>
              <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:8}}>⏳ Заявки на подключение</div>
              {MOCK_PARTNERS.filter(p=>p.status==="pending").map(p=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:`1px solid ${BD}`}}>
                  <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:DK}}>{p.name}</div><div style={{fontSize:9,color:GY}}>{p.type==="restaurant"?"Ресторан":p.type==="pharmacy"?"Аптека":"Магазин"} · {p.city}</div></div>
                  <div style={{display:"flex",gap:5}}><button style={{background:GRL,color:GR,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,fontWeight:700,cursor:"pointer"}}>✓</button><button style={{background:RL,color:R,border:"none",borderRadius:6,padding:"4px 8px",fontSize:10,fontWeight:700,cursor:"pointer"}}>✗</button></div>
                </div>
              ))}
            </div>
          )}
        </div>}

        {/* ORDERS */}
        {tab==="orders"&&<div style={{padding:12}}>
          <div style={{display:"flex",gap:4,overflowX:"auto",scrollbarWidth:"none",marginBottom:10}}>
            {[{id:"all",l:"Все"},{id:"new",l:"Новые"},{id:"partner_accepted",l:"У партнёра"},{id:"delivered",l:"Доставлено"},{id:"declined",l:"Отменено"}].map(f=>(
              <button key={f.id} onClick={()=>setOFilter(f.id)} style={{flexShrink:0,padding:"5px 9px",borderRadius:8,border:`1px solid ${oFilter===f.id?ADMA:BD}`,background:oFilter===f.id?ADML:WH,color:oFilter===f.id?ADMA:GY,fontSize:10,fontWeight:700,cursor:"pointer"}}>{f.l}</button>
            ))}
          </div>
          {fOrders.length===0?<div style={{textAlign:"center",padding:30,color:GY}}><div style={{fontSize:38,marginBottom:6}}><Icon name="inbox" size={15} color="currentColor"/></div><div>Нет заказов</div></div>
          :fOrders.map(o=>(
            <div key={o.id} style={{background:WH,borderRadius:13,border:`1px solid ${BD}`,padding:12,marginBottom:7,cursor:"pointer"}} onClick={()=>setSelOrd(selOrd?.id===o.id?null:o)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                <div><div style={{fontSize:11,fontWeight:800,color:DK}}>#{o.id} · {o.partner}</div><div style={{fontSize:9,color:GY,marginTop:1}}><Icon name="user" size={14} color="currentColor" style={{marginRight:5}}/>{o.customer} · {o.createdAt} · 📍 {o.address}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:800,color:DK,marginBottom:2}}>{o.total} с.</div>{sBdg(o.status)}</div>
              </div>
              {selOrd?.id===o.id&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${BD}`}}>
                {o.items.map((it,i)=><div key={i} style={{fontSize:10,color:DK,marginBottom:2}}>{it.qty}× {it.name}</div>)}
                <div style={{marginTop:7,display:"flex",gap:4,flexWrap:"wrap"}}>
                  {["new","partner_accepted","ready","delivered"].map(s=>(
                    <button key={s} onClick={e=>{e.stopPropagation();onUpdate(o.id,s);}} style={{padding:"4px 7px",borderRadius:6,border:`1px solid ${ADMA}55`,background:o.status===s?ADML:BG,color:o.status===s?ADMA:GY,fontSize:9,fontWeight:700,cursor:"pointer"}}>{s}</button>
                  ))}
                </div>
              </div>}
            </div>
          ))}
        </div>}

        {/* PARTNERS */}
        {tab==="partners"&&<div style={{padding:12}}>
          <div style={{display:"flex",gap:5,marginBottom:10}}>
            {[{id:"active",l:"Активные"},{id:"pending",l:"На проверке"}].map(f=>(
              <button key={f.id} onClick={()=>setPFilter(f.id)} style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${pFilter===f.id?ADMA:BD}`,background:pFilter===f.id?ADML:WH,color:pFilter===f.id?ADMA:GY,fontSize:10,fontWeight:700,cursor:"pointer"}}>{f.l}</button>
            ))}
          </div>
          {MOCK_PARTNERS.filter(p=>p.status===pFilter).map(p=>(
            <div key={p.id} style={{background:WH,borderRadius:13,border:`1px solid ${BD}`,padding:12,marginBottom:7}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                <div><div style={{fontSize:12,fontWeight:800,color:DK}}>{p.name}</div><div style={{fontSize:10,color:GY,marginTop:1}}>{p.type==="restaurant"?"Ресторан":p.type==="pharmacy"?"Аптека":"Магазин"} · {p.city}</div></div>
                <Bdg l={p.status==="active"?"Активен":"Проверка"} c={p.status==="active"?GR:GD} bg={p.status==="active"?GRL:GDL}/>
              </div>
              {p.status==="active"&&<div style={{display:"flex",gap:0,fontSize:10}}><span style={{color:GD,fontWeight:700,marginRight:8}}><Icon name="star" size={14} color="currentColor" style={{marginRight:5}}/>{p.rating}</span><span style={{color:GY,marginRight:8}}><Icon name="box" size={14} color="currentColor" style={{marginRight:5}}/>{p.orders} зак.</span><span style={{color:GY}}><Icon name="money" size={14} color="currentColor" style={{marginRight:5}}/>{p.revenue} с.</span></div>}
              {p.status==="pending"&&<div style={{display:"flex",gap:6,marginTop:7}}><button style={{flex:1,padding:"8px",background:GRL,color:GR,border:`1px solid ${GR}44`,borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer"}}>✓ Одобрить</button><button style={{flex:1,padding:"8px",background:RL,color:R,border:`1px solid ${R}44`,borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer"}}>✗ Отклонить</button></div>}
            </div>
          ))}
        </div>}

        {/* DRIVERS */}
        {tab==="drivers"&&<div style={{padding:12}}>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:9}}>ВСЕ КУРЬЕРЫ ({MOCK_DRIVERS.length})</div>
          {MOCK_DRIVERS.map(d=>(
            <div key={d.id} style={{background:WH,borderRadius:13,border:`1px solid ${BD}`,padding:12,marginBottom:7}}>
              <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:7}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:d.online?GRL:BG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}><Icon name="bike" size={15} color="currentColor"/></div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:DK}}>{d.name}</div><div style={{fontSize:10,color:GY}}>{d.phone}</div></div>
                <Bdg l={d.online?(d.status==="delivering"?"Везёт":"Свободен"):"Офлайн"} c={d.online?(d.status==="delivering"?BL:GR):MG} bg={d.online?(d.status==="delivering"?BLL:GRL):BG}/>
              </div>
              <div style={{display:"flex",gap:0,flexWrap:"wrap",fontSize:10}}><span style={{color:GD,fontWeight:700,marginRight:7}}><Icon name="star" size={14} color="currentColor" style={{marginRight:5}}/>{d.rating}</span><span style={{color:GY,marginRight:7}}><Icon name="box" size={14} color="currentColor" style={{marginRight:5}}/>{d.total} всего</span><span style={{color:GY,marginRight:7}}><Icon name="money" size={14} color="currentColor" style={{marginRight:5}}/>{d.today.earn} с./день</span><span style={{color:GY}}>{d.today.orders} д.</span></div>
            </div>
          ))}
        </div>}

        {/* FINANCE */}
        {tab==="finance"&&<div style={{padding:12}}>
          <div style={{background:WH,borderRadius:14,border:`1px solid ${BD}`,padding:14,marginBottom:11}}>
            <div style={{fontWeight:700,fontSize:13,color:DK,marginBottom:12}}><Icon name="money" size={14} color="currentColor" style={{marginRight:5}}/>Финансовый обзор</div>
            {[
              ["Общая выручка",`${revenue} с.`,BL],
              ["Доставлено заказов",orders.filter(o=>o.status==="delivered").length,GR],
              ["Комиссия платформы (15%)",`${Math.round(revenue*0.15)} с.`,GD],
              ["Партнёрам (75%)",`${Math.round(revenue*0.75)} с.`,GR],
              ["Курьерам (80% доставки)",`${Math.round(orders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.deliveryFee,0)*0.8)} с.`,GR],
            ].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${BD}`,fontSize:11}}>
                <span style={{color:GY}}>{l}</span>
                <span style={{fontWeight:700,color:c}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{background:WH,borderRadius:14,border:`1px solid ${BD}`,padding:12}}>
            <div style={{fontWeight:700,fontSize:12,color:DK,marginBottom:10}}>По партнёрам</div>
            {MOCK_PARTNERS.filter(p=>p.status==="active").map(p=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${BD}`,fontSize:11}}>
                <span style={{color:DK,fontWeight:600}}>{p.name}</span>
                <span style={{fontWeight:700,color:ADMA}}>{p.revenue} с.</span>
              </div>
            ))}
          </div>
        </div>}
      </div>

      <div style={{background:WH,borderTop:`1px solid ${BD}`,display:"grid",gridTemplateColumns:"repeat(5,1fr)",padding:"7px 0 11px",flexShrink:0}}>
        {[{id:"dash",e:"📊",l:"Главная"},{id:"orders",e:"📦",l:"Заказы"},{id:"partners",e:"🏪",l:"Партнёры"},{id:"drivers",e:"🚴",l:"Курьеры"},{id:"finance",e:"💰",l:"Финансы"}].map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:17,filter:tab===n.id?"none":"grayscale(100%) opacity(35%)"}}>{n.e}</span>
            <span style={{fontSize:8,fontWeight:700,color:tab===n.id?ADMA:MG}}>{n.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  DISPATCHER APP  — оперативный диспетчер
// ════════════════════════════════════════════════════════════════════
function DispatcherApp({orders,onUpdate}){
  const [auth,setAuth]=useState(null);
  const [tab,setTab]=useState("queue");
  const [assignOpen,setAssignOpen]=useState(null);
  const sc={flex:1,overflowY:"auto",scrollbarWidth:"none"};
  function SB(){return(<div style={{background:DSP,padding:"10px 22px 5px",display:"flex",justifyContent:"space-between",flexShrink:0}}><span style={{color:WH,fontSize:13,fontWeight:700}}>9:41</span><span style={{color:WH,fontSize:12}}>●●● 🔋</span></div>);}
  function Bdg({l,c,bg}){return(<span style={{background:bg,color:c,fontSize:9,fontWeight:800,padding:"2px 6px",borderRadius:5,whiteSpace:"nowrap"}}>{l}</span>);}
  const pending=orders.filter(o=>["new","ready"].includes(o.status));
  const active=orders.filter(o=>["partner_accepted","driver_accepted","picked_up"].includes(o.status));
  const freeDrivers=MOCK_DRIVERS.filter(d=>d.online&&d.status==="available");

  if(!auth) return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <SB/>
      <AuthScreen role="dispatcher" onAuth={setAuth} accent={DSPA} logo="zood" title="ZOOD Диспетчер" subtitle="Управление заказами и курьерами в реальном времени"/>
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#F5F0EB"}}>
      <SB/>
      <div style={{background:`linear-gradient(135deg,${DSP},#292524)`,padding:"7px 14px 13px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
          <div><div style={{color:WH,fontWeight:900,fontSize:15}}><Icon name="phone" size={14} color="currentColor" style={{marginRight:5}}/>Диспетчер</div><div style={{color:"rgba(255,255,255,.5)",fontSize:10,marginTop:1}}>{auth.name}</div></div>
          <button onClick={()=>setAuth(null)} style={{background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.55)",borderRadius:7,padding:"5px 9px",fontSize:9,cursor:"pointer"}}>Выйти</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
          {[[pending.length,"🔴","Ждут"],[active.length,"🟡","В работе"],[freeDrivers.length,"🟢","Свободных"],[orders.filter(o=>o.status==="delivered").length,"✅","Готово"]].map(([v,e,l])=>(
            <div key={l} style={{background:"rgba(255,255,255,.08)",borderRadius:9,padding:"7px 4px",textAlign:"center"}}>
              <div style={{fontSize:10,marginBottom:2}}>{e}</div>
              <div style={{color:WH,fontWeight:900,fontSize:14}}>{v}</div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:8}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"#292524",display:"flex",borderBottom:"1px solid #44403C",flexShrink:0}}>
        {[{id:"queue",e:"📋",l:"Очередь"},{id:"active",e:"🔄",l:"Активные"},{id:"drivers",e:"🚴",l:"Курьеры"},{id:"support",e:"💬",l:"Поддержка"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 5px",border:"none",background:"none",cursor:"pointer",fontSize:10,fontWeight:tab===t.id?800:500,color:tab===t.id?DSPA:"rgba(255,255,255,.4)",borderBottom:`2px solid ${tab===t.id?DSPA:"transparent"}`}}>{t.e} {t.l}</button>
        ))}
      </div>

      <div style={sc}>
        {/* QUEUE */}
        {tab==="queue"&&<div style={{padding:11}}>
          {pending.length===0
            ?<div style={{textAlign:"center",padding:38,color:GY}}><div style={{fontSize:42,marginBottom:8}}>✅</div><div style={{fontWeight:700,fontSize:13}}>Очередь пуста</div></div>
            :<>
              <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:9}}>ОЖИДАЮТ НАЗНАЧЕНИЯ ({pending.length})</div>
              {pending.map(o=>(
                <div key={o.id} style={{background:WH,borderRadius:13,border:`2px solid ${o.status==="new"?"#FCA5A5":"#FDE68A"}`,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <div><div style={{fontSize:11,fontWeight:800,color:DK}}>#{o.id} · {o.partner}</div><div style={{fontSize:9,color:GY,marginTop:1}}><Icon name="user" size={14} color="currentColor" style={{marginRight:5}}/>{o.customer} · {o.total} с. · 📍 {o.address}</div></div>
                    <Bdg l={o.status==="new"?"Новый":"Готов"} c={o.status==="new"?"#DC2626":GD} bg={o.status==="new"?"#FEF2F2":GDL}/>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>setAssignOpen(assignOpen===o.id?null:o.id)} style={{flex:1,padding:"8px",background:DSPL,color:DSPA,border:`1px solid ${DSPA}44`,borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer"}}><Icon name="user" size={14} color="currentColor" style={{marginRight:5}}/>Назначить курьера</button>
                    <button onClick={()=>onUpdate(o.id,"declined")} style={{padding:"8px 10px",background:RL,color:R,border:`1px solid ${R}44`,borderRadius:8,fontSize:10,fontWeight:600,cursor:"pointer"}}>✗</button>
                  </div>
                  {assignOpen===o.id&&<div style={{marginTop:7,paddingTop:7,borderTop:`1px solid ${BD}`}}>
                    <div style={{fontSize:10,color:GY,marginBottom:5}}>Доступные курьеры:</div>
                    {freeDrivers.length===0
                      ?<div style={{fontSize:10,color:MG,textAlign:"center",padding:"6px 0"}}>Нет свободных курьеров</div>
                      :freeDrivers.map(d=>(
                        <div key={d.id} onClick={()=>{onUpdate(o.id,"driver_accepted");setAssignOpen(null);}} style={{display:"flex",gap:8,alignItems:"center",padding:"7px 9px",background:BG,borderRadius:9,marginBottom:4,cursor:"pointer",border:`1px solid ${BD}`}}>
                          <div style={{fontSize:16}}><Icon name="bike" size={15} color="currentColor"/></div>
                          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:DK}}>{d.name}</div><div style={{fontSize:9,color:GY}}><Icon name="star" size={14} color="currentColor" style={{marginRight:5}}/>{d.rating} · {d.today.orders} д. сегодня</div></div>
                          <span style={{fontSize:10,color:GR,fontWeight:700}}>Назначить →</span>
                        </div>
                      ))
                    }
                  </div>}
                </div>
              ))}
            </>
          }
        </div>}

        {/* ACTIVE */}
        {tab==="active"&&<div style={{padding:11}}>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:9}}>В РАБОТЕ ({active.length})</div>
          {active.length===0?<div style={{textAlign:"center",padding:36,color:GY}}><div style={{fontSize:38,marginBottom:6}}><Icon name="inbox" size={15} color="currentColor"/></div><div>Нет активных</div></div>
          :active.map(o=>(
            <div key={o.id} style={{background:WH,borderRadius:13,border:`1px solid ${BD}`,padding:12,marginBottom:7}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <div><div style={{fontSize:11,fontWeight:800,color:DK}}>#{o.id} · {o.partner} → {o.customer}</div><div style={{fontSize:9,color:GY,marginTop:1}}><Icon name="pin" size={14} color="currentColor" style={{marginRight:5}}/>{o.address} · {o.total} с.</div></div>
                <div style={{fontSize:10}}>{{partner_accepted:"👨‍🍳",driver_accepted:"🚴",picked_up:"📦"}[o.status]||"•"}</div>
              </div>
              <div style={{display:"flex",gap:5}}>
                <button onClick={()=>onUpdate(o.id,"delivered")} style={{flex:1,padding:"6px",background:GRL,color:GR,border:"none",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer"}}>✓ Доставлен</button>
                <button style={{padding:"6px 9px",background:DSPL,color:DSPA,border:"none",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer"}}><Icon name="phone" size={15} color="currentColor"/></button>
                <button style={{padding:"6px 9px",background:BG,color:GY,border:`1px solid ${BD}`,borderRadius:7,fontSize:10,cursor:"pointer"}}><Icon name="chat" size={15} color="currentColor"/></button>
              </div>
            </div>
          ))}
        </div>}

        {/* DRIVERS */}
        {tab==="drivers"&&<div style={{padding:11}}>
          {MOCK_DRIVERS.map(d=>(
            <div key={d.id} style={{background:WH,borderRadius:13,border:`1px solid ${BD}`,padding:12,marginBottom:7}}>
              <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:7}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:d.online?GRL:BG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{d.online?"🚴":"😴"}</div>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:DK}}>{d.name}</div><div style={{fontSize:10,color:GY}}>{d.phone}</div></div>
                <Bdg l={d.online?(d.status==="delivering"?"Везёт":"Свободен"):"Офлайн"} c={d.online?(d.status==="delivering"?BL:GR):MG} bg={d.online?(d.status==="delivering"?BLL:GRL):BG}/>
              </div>
              <div style={{fontSize:10,color:GY}}><span style={{color:GD,fontWeight:700,marginRight:6}}><Icon name="star" size={14} color="currentColor" style={{marginRight:5}}/>{d.rating}</span><span style={{marginRight:6}}>{d.today.orders} д. сегодня</span><span>{d.today.earn} с.</span></div>
              {d.online&&<div style={{display:"flex",gap:5,marginTop:7}}>
                <button style={{flex:1,padding:"6px",background:DSPL,color:DSPA,border:"none",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer"}}><Icon name="phone" size={14} color="currentColor" style={{marginRight:5}}/>Позвонить</button>
                <button style={{flex:1,padding:"6px",background:BG,color:GY,border:`1px solid ${BD}`,borderRadius:7,fontSize:10,cursor:"pointer"}}><Icon name="chat" size={14} color="currentColor" style={{marginRight:5}}/>Написать</button>
              </div>}
            </div>
          ))}
        </div>}

        {/* SUPPORT */}
        {tab==="support"&&<div style={{padding:11}}>
          <div style={{fontWeight:700,fontSize:10,color:MG,letterSpacing:1,marginBottom:9}}>ОБРАЩЕНИЯ КЛИЕНТОВ</div>
          {[{id:1,name:"Зафар А.",issue:"Заказ опаздывает на 40 мин",order:"#o1",pri:"high"},{id:2,name:"Малика Т.",issue:"Привезли не тот товар",order:"#o2",pri:"medium"},{id:3,name:"Бахром К.",issue:"Хочу вернуть деньги",order:"#o3",pri:"low"}].map(t=>(
            <div key={t.id} style={{background:WH,borderRadius:13,border:`2px solid ${t.pri==="high"?"#FCA5A5":t.pri==="medium"?"#FDE68A":BD}`,padding:12,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <div><div style={{fontSize:11,fontWeight:700,color:DK}}>{t.name} · {t.order}</div></div>
                <Bdg l={t.pri==="high"?"Срочно":t.pri==="medium"?"Важно":"Обычное"} c={t.pri==="high"?"#DC2626":t.pri==="medium"?GD:GY} bg={t.pri==="high"?"#FEF2F2":t.pri==="medium"?GDL:BG}/>
              </div>
              <div style={{fontSize:11,color:SL,marginBottom:7}}>{t.issue}</div>
              <div style={{display:"flex",gap:5}}>
                <button style={{flex:1,padding:"7px",background:DSPL,color:DSPA,border:"none",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer"}}><Icon name="phone" size={14} color="currentColor" style={{marginRight:5}}/>Позвонить</button>
                <button style={{flex:1,padding:"7px",background:GRL,color:GR,border:"none",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer"}}>✓ Решить</button>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════════
export default function ZudGoEcosystem(){
  const [app,setApp]=useState("customer");
  const [orders,setOrders]=useStore("zudgo_orders_v1",[
    {id:"o1",customer:"Умед Б.",phone:"+992 93 456-78-90",items:[{name:"Шурбо из баранины",qty:1,price:18},{name:"Кабоби дамба",qty:2,price:42},{name:"Нони тандир",qty:1,price:4}],total:114,subtotal:106,deliveryFee:8,address:"ул. Айни, 5",partner:"Рохат",partnerId:"rohot",status:"new",createdAt:"14:23",comment:""},
    {id:"o2",customer:"Нилуфар М.",phone:"+992 88 234-56-78",items:[{name:"Плов душанбинский",qty:1,price:30},{name:"Чой сабз",qty:2,price:7}],total:52,subtotal:44,deliveryFee:8,address:"пр. Рудаки, 58",partner:"Рохат",partnerId:"rohot",status:"new",createdAt:"14:31",comment:"Без лука"},
    {id:"o3",customer:"Рустам К.",phone:"+992 77 789-01-23",items:[{name:"Хумус с лавашем",qty:2,price:18},{name:"Форель на мангале",qty:1,price:52}],total:98,subtotal:88,deliveryFee:10,address:"ул. Ленина, 22",partner:"Shah Abbas",partnerId:"shah",status:"partner_accepted",createdAt:"14:45",comment:""},
    {id:"o4",customer:"Дилноза С.",phone:"+992 90 333-44-55",items:[{name:"Говядина 1 кг",qty:1,price:55}],total:65,subtotal:55,deliveryFee:10,address:"ул. Борбад, 5",partner:"Корвон Маркет",partnerId:"korv",status:"delivered",createdAt:"13:10",comment:""},
  ]);
  const placeOrder=o=>setOrders(p=>[...p,{...o,id:`o${Date.now()}`,status:"new",createdAt:new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})}]);
  const updateOrder=(id,status)=>setOrders(p=>p.map(o=>o.id===id?{...o,status}:o));

  // Автопрогресс заказов — партнёр готовит, курьер везёт (живой цикл)
  useEffect(()=>{
    const flow={new:"partner_accepted",partner_accepted:"courier_assigned",courier_assigned:"picked_up",picked_up:"delivered"};
    const t=setInterval(()=>{
      setOrders(prev=>{
        const idx=prev.findIndex(o=>flow[o.status]&&o.status!=="delivered"&&o.status!=="cancelled");
        if(idx<0) return prev;
        const o=prev[idx];
        // продвигаем по одному заказу за такт (имитация работы экосистемы)
        if(Math.random()<0.5) return prev;
        return prev.map((x,i)=>i===idx?{...x,status:flow[x.status]}:x);
      });
    },4000);
    return()=>clearInterval(t);
  },[]);

  const APPS=[
    {id:"customer",l:"👤 Покупатель",c:R},
    {id:"partner", l:"🏪 Партнёр",   c:BL},
    {id:"driver",  l:"🚴 Курьер",    c:GR},
    {id:"admin",   l:"🛡 Админ",     c:ADMA},
    {id:"dispatch",l:"📞 Диспетчер", c:DSPA},
  ];

  const phone={width:"100%",maxWidth:390,height:820,margin:"0 auto",background:WH,borderRadius:44,overflow:"hidden",boxShadow:"0 50px 120px rgba(0,0,0,.55),0 0 0 8px #1F2937,0 0 0 10px #0F172A",display:"flex",flexDirection:"column",position:"relative",fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif"};

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F172A 0%,#1E1B4B 50%,#0F172A 100%)",display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 10px 22px"}}>
      <div style={{marginBottom:12,textAlign:"center"}}>
        <span style={{color:"rgba(255,255,255,.95)",fontWeight:900,fontSize:19,letterSpacing:-.5,display:"flex",alignItems:"center",gap:7}}><ZoodLogo size={22} rounded={7}/>ZOOD</span>
        <span style={{color:"rgba(255,255,255,.3)",fontSize:10,marginLeft:7}}>Ecosystem v6</span>
        <div style={{color:"rgba(255,255,255,.25)",fontSize:9,marginTop:2}}>5 приложений · заказы синхронизируются в реальном времени</div>
      </div>
      {/* Row 1: Customer / Partner / Driver */}
      <div style={{display:"flex",gap:4,background:"rgba(255,255,255,.06)",borderRadius:14,padding:4,marginBottom:5,width:"100%",maxWidth:390,border:"1px solid rgba(255,255,255,.07)"}}>
        {APPS.slice(0,3).map(a=><button key={a.id} onClick={()=>setApp(a.id)} style={{flex:1,padding:"8px 5px",borderRadius:10,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,background:app===a.id?a.c:"transparent",color:app===a.id?WH:"rgba(255,255,255,.4)",transition:"all .2s"}}>{a.l}</button>)}
      </div>
      {/* Row 2: Admin / Dispatcher */}
      <div style={{display:"flex",gap:4,background:"rgba(255,255,255,.06)",borderRadius:14,padding:4,marginBottom:14,width:"100%",maxWidth:390,border:"1px solid rgba(255,255,255,.07)"}}>
        {APPS.slice(3).map(a=><button key={a.id} onClick={()=>setApp(a.id)} style={{flex:1,padding:"8px 5px",borderRadius:10,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,background:app===a.id?a.c:"transparent",color:app===a.id?WH:"rgba(255,255,255,.4)",transition:"all .2s"}}>{a.l}</button>)}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:8,color:"rgba(255,255,255,.18)",textAlign:"center",lineHeight:1.4}}>Заказы<br/>синхро</div></div>
      </div>

      {/* Phone frame */}
      <div style={phone}>
        {app==="customer" && <CustomerApp onOrder={placeOrder} orders={orders}/>}
        {app==="partner"  && <PartnerApp orders={orders} onUpdate={updateOrder}/>}
        {app==="driver"   && <DriverApp orders={orders} onUpdate={updateOrder}/>}
        {app==="admin"    && <AdminApp orders={orders} onUpdate={updateOrder}/>}
        {app==="dispatch" && <DispatcherApp orders={orders} onUpdate={updateOrder}/>}
      </div>

      <div style={{display:"flex",gap:5,marginTop:11,flexWrap:"wrap",justifyContent:"center"}}>
        {[["🔑 Любые цифры для входа","rgba(196,43,10,.7)"],["🔄 Заказы синхронизируются","rgba(21,101,192,.7)"],["🛡 Админ видит всё","rgba(59,130,246,.7)"],["📞 Диспетчер управляет","rgba(249,115,22,.7)"]].map(([t,c])=>(
          <div key={t} style={{background:c,borderRadius:7,padding:"4px 8px",fontSize:9,color:"rgba(255,255,255,.85)",fontWeight:600}}>{t}</div>
        ))}
      </div>
    </div>
  );
}
