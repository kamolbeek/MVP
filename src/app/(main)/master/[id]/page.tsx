"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getMasterWithProfile, getReviewsByMaster, categories, getAllMastersWithProfiles } from "@/lib/mock/data";
import { MasterWithProfile } from "@/types";

const CAT_COLORS: Record<string,{bg:string;text:string}> = {
  "cat-1":{bg:"bg-blue-50",text:"text-blue-700"},"cat-2":{bg:"bg-amber-50",text:"text-amber-700"},
  "cat-3":{bg:"bg-orange-50",text:"text-orange-700"},"cat-4":{bg:"bg-violet-50",text:"text-violet-700"},
  "cat-5":{bg:"bg-rose-50",text:"text-rose-700"},"cat-6":{bg:"bg-pink-50",text:"text-pink-700"},
  "cat-7":{bg:"bg-teal-50",text:"text-teal-700"},"cat-8":{bg:"bg-red-50",text:"text-red-700"},
  "cat-9":{bg:"bg-indigo-50",text:"text-indigo-700"},"cat-10":{bg:"bg-emerald-50",text:"text-emerald-700"},
};

function Stars({r,size=16}:{r:number;size?:number}) {
  return (<div className="flex gap-0.5">{[1,2,3,4,5].map(s=>(
    <svg key={s} width={size} height={size} className={s<=Math.round(r)?"text-amber-400":"text-gray-200"} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>))}</div>);
}

function fmtPrice(n:number){return n.toLocaleString("uz-UZ")+" so'm";}
function relDate(d:string){const days=Math.floor((Date.now()-new Date(d).getTime())/86400000);if(days===0)return"Bugun";if(days<7)return`${days} kun oldin`;if(days<30)return`${Math.floor(days/7)} hafta oldin`;if(days<365)return`${Math.floor(days/30)} oy oldin`;return`${Math.floor(days/365)} yil oldin`;}

const PORTFOLIO_ITEMS = [
  {title:"Vannaxona ta'miri",color:"from-blue-400 to-cyan-500",icon:"🚿"},
  {title:"Quvur almashtirish",color:"from-emerald-400 to-teal-500",icon:"🔧"},
  {title:"Kran o'rnatish",color:"from-violet-400 to-purple-500",icon:"⚙️"},
  {title:"Chiqindi tizimi",color:"from-orange-400 to-amber-500",icon:"🏗️"},
  {title:"Asbob-uskunalar",color:"from-rose-400 to-pink-500",icon:"🛠️"},
  {title:"Issiqlik tizimi",color:"from-slate-400 to-slate-600",icon:"🌡️"},
];

function ContactModal({master,onClose}:{master:MasterWithProfile;onClose:()=>void}){
  if(!master)return null;
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white w-full sm:max-w-sm sm:rounded-3xl rounded-t-3xl p-8 animate-slide-up" style={{boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"/>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition">✕</button>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mx-auto mb-4 ring-4 ring-brand-100">
            <Image src={master.avatar} alt={master.name} width={80} height={80} className="w-full h-full object-cover" unoptimized/>
          </div>
          <h3 className="text-xl font-bold text-[#0A0A0A]">{master.name}</h3>
          <p className="text-[#6B7280] text-sm mt-1 mb-6">Bog&apos;lanish uchun quyidagi raqamga qo&apos;ng&apos;iroq qiling</p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-5">
            <p className="text-xs text-[#9CA3AF] mb-1">Telefon raqam</p>
            <p className="text-2xl font-bold text-[#0A0A0A] tracking-wide">{master.phone}</p>
          </div>
          <a href={`tel:${master.phone}`} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white text-sm mb-3 transition-all active:scale-[0.97]" style={{background:"linear-gradient(135deg,#00C896,#00A87E)",boxShadow:"0 4px 14px rgba(0,200,150,0.25)"}}>
            📞 Qo&apos;ng&apos;iroq qilish
          </a>
          <a href={`https://t.me/+${master.phone?.replace(/\D/g,"")}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 text-sm mb-3 transition-all active:scale-[0.97]">
            ✈️ Telegram
          </a>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-medium text-[#6B7280] bg-gray-100 hover:bg-gray-200 transition">Yopish</button>
        </div>
      </div>
    </div>);
}

/* ── Portfolio Gallery with lightbox ── */
function PortfolioGallery({items}:{items:typeof PORTFOLIO_ITEMS}) {
  const [active,setActive]=useState<number|null>(null);
  return(
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item,i)=>(
          <button key={i} onClick={()=>setActive(i)}
            className={`group relative aspect-video rounded-xl bg-gradient-to-br ${item.color} overflow-hidden cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-brand-500`}
            style={{transition:"transform 0.2s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.03)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";}}>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"/>
            <div className="absolute top-2 right-2 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-30 text-4xl pointer-events-none">{item.icon}</div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
              <span className="text-white text-xs font-semibold drop-shadow">{item.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active!==null&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={()=>setActive(null)}>
          <div className="relative max-w-lg w-full rounded-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className={`w-full aspect-video bg-gradient-to-br ${items[active].color} flex items-center justify-center`}>
              <span className="text-7xl">{items[active].icon}</span>
            </div>
            <div className="bg-white p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#0A0A0A]">{items[active].title}</p>
                <p className="text-xs text-[#6B7280]">{active+1} / {items.length}</p>
              </div>
              <div className="flex gap-2">
                <button disabled={active===0} onClick={()=>setActive(a=>a!-1)} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button disabled={active===items.length-1} onClick={()=>setActive(a=>a!+1)} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
                <button onClick={()=>setActive(null)} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition text-sm">✕</button>
              </div>
            </div>
          </div>
        </div>)}
    </>);
}

export default function MasterPage(){
  const {id}=useParams<{id:string}>();
  const master=getMasterWithProfile(id);
  const reviews=getReviewsByMaster(id);
  const [showModal,setShowModal]=useState(false);
  const [showAllReviews,setShowAllReviews]=useState(false);
  const [showReviewForm,setShowReviewForm]=useState(false);
  const [newReview,setNewReview]=useState({rating:5,comment:""});
  const similar=useMemo(()=>{if(!master)return[];return getAllMastersWithProfiles().filter(m=>m.id!==master.id&&m.profile.categories.includes(master.profile.categories[0])).slice(0,3);},[master]);

  if(!master) return(
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8" style={{background:"#F8FAFB"}}>
      <div className="text-6xl mb-4">😕</div>
      <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Usta topilmadi</h1>
      <p className="text-[#6B7280] mb-6">Bu sahifa mavjud emas yoki usta o&apos;chirilgan.</p>
      <Link href="/search" className="btn-primary text-sm">Qidirishga qaytish</Link>
    </div>);

  const {profile}=master;
  const cat=categories.find(c=>c.id===profile.categories[0]);
  const catColor=CAT_COLORS[profile.categories[0]]||CAT_COLORS["cat-1"];
  const visibleReviews=showAllReviews?reviews:reviews.slice(0,5);
  const breakdown=[{stars:5,pct:78},{stars:4,pct:14},{stars:3,pct:5},{stars:2,pct:2},{stars:1,pct:1}];

  return(
    <div className="min-h-screen" style={{background:"#F8FAFB"}}>
      {showModal&&<ContactModal master={master} onClose={()=>setShowModal(false)}/>}

      {/* HEADER */}
      <div className="relative overflow-hidden pt-8 pb-28" style={{background:`linear-gradient(135deg, #0B1120, #0F1D2F, ${cat?.id==="cat-2"?"#3D2E0A":"#0A3D2E"})`}}>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/8 rounded-full blur-[100px] pointer-events-none"/>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/search" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Orqaga
          </Link>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-white/10 ring-4 ring-white/20">
                <Image src={master.avatar} alt={master.name} width={112} height={112} className="w-full h-full object-cover" unoptimized/>
              </div>
              <span className="absolute bottom-1 right-1 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-3 ring-white/20" title="Tasdiqlangan">✓</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{master.name}</h1>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${profile.isAvailable?"bg-emerald-500/20 text-emerald-300 border border-emerald-500/30":"bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}>
                  {profile.isAvailable?"Hozir bo'sh":"Band"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {cat&&<span className={`px-3 py-1 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>{cat.icon} {cat.name}</span>}
                <span className="text-sm text-gray-300 flex items-center gap-1">📍 {profile.location.district}, {profile.location.region}</span>
                <span className="text-sm text-gray-300">📅 {profile.experience} yil tajriba</span>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Stars r={profile.rating} size={18}/>
                  <span className="text-lg font-bold text-white">{profile.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({profile.reviewCount} ta sharh)</span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-sm font-bold text-emerald-300">
                  💰 {fmtPrice(profile.hourlyRate)}<span className="text-xs font-normal text-gray-400">/soat</span>
                </span>
              </div>
              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <button onClick={()=>setShowModal(true)} className="px-7 py-3 rounded-xl font-semibold text-white text-sm transition-all active:scale-[0.97]" style={{background:"linear-gradient(135deg,#00C896,#00A87E)",boxShadow:"0 4px 14px rgba(0,200,150,0.25)"}}>📞 Bog&apos;lanish</button>
                <button onClick={()=>setShowReviewForm(!showReviewForm)} className="px-7 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition text-sm active:scale-[0.97]">✍️ Sharh qoldirish</button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 48" fill="none"><path d="M0 48 C360 0 1080 0 1440 48 L1440 48 L0 48 Z" fill="#F8FAFB"/></svg></div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-3">Usta haqida</h2>
              <p className="text-[#374151] leading-relaxed">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {cat&&<span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>{cat.icon} {cat.name}</span>}
                <span className="badge-success">🏆 Top usta</span>
                <span className="badge-success">✓ Tasdiqlangan</span>
                <span className="badge-info">📍 {profile.location.district}</span>
              </div>
            </div>

            {/* Narx va ish vaqti */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-4">Narx va ish vaqti</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-2xl shrink-0">💰</div>
                  <div>
                    <p className="text-xs text-[#6B7280] font-medium">Soatlik narx</p>
                    <p className="text-xl font-extrabold text-emerald-700">{fmtPrice(profile.hourlyRate)}</p>
                    <p className="text-xs text-[#9CA3AF]">Kelishib olish mumkin</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-2xl shrink-0">🕐</div>
                  <div>
                    <p className="text-xs text-[#6B7280] font-medium">Ish vaqti</p>
                    <p className="text-base font-bold text-blue-700">{profile.workHours}</p>
                    <p className="text-xs text-[#9CA3AF]">Belgilangan jadval</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-bold text-[#0A0A0A]">Xizmat buyurtma qilmoqchimisiz?</p>
                  <p className="text-xs text-[#6B7280]">Usta bilan bevosita bog&apos;laning</p>
                </div>
                <button onClick={()=>setShowModal(true)}
                  className="shrink-0 px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all active:scale-[0.97]"
                  style={{background:"linear-gradient(135deg,#00C896,#00A87E)",boxShadow:"0 4px 14px rgba(0,200,150,0.2)"}}>
                  📞 Bog&apos;lanish
                </button>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0A0A0A]">Ishlar namunasi</h2>
                <span className="text-xs text-[#6B7280] bg-gray-100 px-2.5 py-1 rounded-lg font-medium">{PORTFOLIO_ITEMS.length} ta loyiha</span>
              </div>
              <PortfolioGallery items={PORTFOLIO_ITEMS}/>
            </div>

            {/* Review form */}
            {showReviewForm&&(
              <div className="bg-white rounded-2xl border border-brand-100 p-6 animate-slide-up" style={{boxShadow:"0 4px 16px rgba(0,200,150,0.08)"}}>
                <h3 className="font-bold text-[#0A0A0A] mb-4">Sharh qoldirish</h3>
                <div className="mb-4">
                  <label className="text-sm font-bold text-[#0A0A0A] mb-2 block">Baho</label>
                  <div className="flex gap-2">{[1,2,3,4,5].map(s=>(<button key={s} onClick={()=>setNewReview(p=>({...p,rating:s}))} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${s<=newReview.rating?"bg-amber-50 text-amber-400 scale-110":"bg-gray-50 text-gray-300"}`}>★</button>))}</div>
                </div>
                <textarea value={newReview.comment} onChange={e=>setNewReview(p=>({...p,comment:e.target.value}))} placeholder="Usta haqida fikringizni yozing..." rows={3} className="input-field resize-none"/>
                <div className="flex gap-3 mt-3">
                  <button onClick={()=>{setShowReviewForm(false);setNewReview({rating:5,comment:""});}} className="btn-secondary flex-1 text-sm py-2.5">Bekor qilish</button>
                  <button onClick={()=>{setShowReviewForm(false);}} className="btn-primary flex-1 text-sm py-2.5">Yuborish</button>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
              <h2 className="text-lg font-bold text-[#0A0A0A] mb-5">Mijozlar sharhlari</h2>
              <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-100">
                <div className="text-center shrink-0">
                  <div className="text-5xl font-extrabold text-[#0A0A0A]">{profile.rating.toFixed(1)}</div>
                  <Stars r={profile.rating} size={18}/><p className="text-xs text-[#6B7280] mt-1">{profile.reviewCount} ta sharh</p>
                </div>
                <div className="flex-1 space-y-2">
                  {breakdown.map(({stars,pct})=>(
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#374151] w-3 text-right">{stars}</span>
                      <svg width={14} height={14} className="text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full transition-all" style={{width:`${pct}%`}}/></div>
                      <span className="text-xs font-medium text-[#6B7280] w-8">{pct}%</span>
                    </div>))}
                </div>
              </div>
              {reviews.length===0?(<div className="text-center py-8"><div className="text-4xl mb-2">💬</div><p className="text-sm text-[#6B7280]">Hali sharhlar yo&apos;q</p></div>):(
                <div className="space-y-4">
                  {visibleReviews.map(rev=>(
                    <div key={rev.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0"><Image src={rev.clientAvatar} alt={rev.clientName} width={40} height={40} className="w-full h-full object-cover" unoptimized/></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-[#0A0A0A]">{rev.clientName}</span>
                          <span className="text-xs text-[#6B7280]">{relDate(rev.createdAt)}</span>
                        </div>
                        <Stars r={rev.rating} size={14}/>
                        <p className="mt-1.5 text-sm text-[#374151] leading-relaxed">{rev.comment}</p>
                      </div>
                    </div>))}
                  {reviews.length>5&&(<button onClick={()=>setShowAllReviews(!showAllReviews)} className="w-full py-3 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition">{showAllReviews?"Kamroq ko'rsatish":`Ko'proq ko'rish (${reviews.length-5} ta)`}</button>)}
                </div>)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
              <h3 className="font-bold text-[#0A0A0A] mb-4">Statistika</h3>
              <div className="space-y-3">
                {[
                  {label:"Umumiy reyting",val:`${profile.rating.toFixed(1)} / 5`,color:"text-amber-500"},
                  {label:"Jami sharhlar",val:`${profile.reviewCount} ta`,color:"text-brand-600"},
                  {label:"Tajriba",val:`${profile.experience} yil`,color:"text-blue-600"},
                  {label:"Soatlik narx",val:fmtPrice(profile.hourlyRate),color:"text-emerald-600"},
                  {label:"Ish vaqti",val:profile.workHours,color:"text-violet-600"},
                  {label:"Holati",val:profile.isAvailable?"Bo'sh":"Band",color:profile.isAvailable?"text-emerald-600":"text-gray-500"},
                ].map(s=>(
                  <div key={s.label} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-[#6B7280]">{s.label}</span>
                    <span className={`text-sm font-bold ${s.color} text-right max-w-[55%]`}>{s.val}</span>
                  </div>))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="rounded-2xl p-5 text-white" style={{background:"linear-gradient(135deg,#00C896,#00A87E)",boxShadow:"0 8px 24px rgba(0,200,150,0.2)"}}>
              <h3 className="font-bold mb-1">Bog&apos;lanishga tayyor!</h3>
              <p className="text-emerald-100 text-sm mb-1">Usta hozir {profile.isAvailable?"bo'sh":"band"}.</p>
              <p className="text-emerald-200 text-xs mb-4">💰 {fmtPrice(profile.hourlyRate)} / soat · 🕐 {profile.workHours}</p>
              <button onClick={()=>setShowModal(true)} className="w-full py-3 rounded-xl font-semibold text-brand-700 bg-white hover:bg-brand-50 transition text-sm active:scale-[0.97]">📞 Hozir bog&apos;lanish</button>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
              <h3 className="font-bold text-[#0A0A0A] mb-3">📍 Joylashuv</h3>
              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{backgroundImage:"linear-gradient(rgba(0,0,0,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.08) 1px,transparent 1px)",backgroundSize:"20px 20px"}}/>
                <div className="relative z-10 text-center"><div className="text-3xl mb-1">📍</div><p className="text-xs font-bold text-[#374151]">{profile.location.district}</p></div>
              </div>
              <p className="text-sm text-[#374151] font-medium">{profile.location.address}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{profile.location.region}, O&apos;zbekiston</p>
            </div>

            {/* Similar masters */}
            {similar.length>0&&(
              <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
                <h3 className="font-bold text-[#0A0A0A] mb-4">O&apos;xshash ustalar</h3>
                <div className="space-y-3">{similar.map(m=>{const sc=categories.find(c=>c.id===m.profile.categories[0]);return(
                  <Link key={m.id} href={`/master/${m.id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0"><Image src={m.avatar} alt={m.name} width={40} height={40} className="w-full h-full object-cover" unoptimized/></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0A0A0A] truncate">{m.name}</p>
                      <p className="text-xs text-[#6B7280]">{sc?.icon} {sc?.name} · ⭐ {m.profile.rating}</p>
                    </div>
                    <span className="text-xs font-semibold text-brand-600 shrink-0">Ko&apos;rish →</span>
                  </Link>);})}</div>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
}
