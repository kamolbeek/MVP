"use client";
import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { reviews, getAllMastersWithProfiles, getMasterWithProfile } from "@/lib/mock/data";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";

function Stars({r,size=15}:{r:number;size?:number}){return(<div className="flex gap-0.5">{[1,2,3,4,5].map(s=>(<svg key={s} width={size} height={size} className={s<=Math.round(r)?"text-amber-400":"text-gray-200"} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>))}</div>);}
function relDate(d:string){const days=Math.floor((Date.now()-new Date(d).getTime())/86400000);if(days===0)return"Bugun";if(days<7)return`${days} kun oldin`;if(days<30)return`${Math.floor(days/7)} hafta oldin`;return`${Math.floor(days/30)} oy oldin`;}

/* ── Shared avatar upload component — works for both Client and Master ── */
function AvatarUpload({src,alt,large=false}:{src:string;alt:string;large?:boolean}){
  const{currentUser,setCurrentUser}=useStore();
  const fileInputRef=useRef<HTMLInputElement>(null);
  const[uploading,setUploading]=useState(false);

  async function handleUpload(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];
    if(!file||!currentUser)return;
    if(file.size>5*1024*1024){alert("Fayl 5 MB dan katta bo'lmasin");return;}
    setUploading(true);
    try{
      const storageRef=sRef(storage,`avatars/${currentUser.id}`);
      await uploadBytes(storageRef,file);
      const url=await getDownloadURL(storageRef);
      await updateDoc(doc(db,"users",currentUser.id),{avatar:url});
      setCurrentUser({...currentUser,avatar:url});
    }catch(err){
      console.error("Avatar upload xatosi:",err);
      alert("Rasm yuklanmadi. Qayta urinib ko'ring.");
    }finally{
      setUploading(false);
      e.target.value="";
    }
  }

  const dim=large?"w-28 h-28":"w-24 h-24";
  const sz=large?112:96;

  return(
    <>
      <div className="relative group cursor-pointer shrink-0" onClick={()=>fileInputRef.current?.click()}>
        <div className={`${dim} rounded-full overflow-hidden bg-gray-100 ring-4 ring-white`}>
          <Image src={src} alt={alt} width={sz} height={sz} className="w-full h-full object-cover" unoptimized/>
        </div>
        <div className={`absolute inset-0 rounded-full flex items-center justify-center transition ${uploading?"bg-black/50":"bg-black/40 opacity-0 group-hover:opacity-100"}`}>
          {uploading?(
            <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ):(
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          )}
        </div>
      </div>
      <input type="file" accept="image/jpeg,image/png,image/webp" hidden ref={fileInputRef} onChange={handleUpload}/>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Client Profile
══════════════════════════════════════════════════════════════════ */
function ClientProfile(){
  const{currentUser}=useStore();
  const[tab,setTab]=useState<"reviews"|"saved"|"settings">("reviews");
  const myReviews=useMemo(()=>reviews.filter(r=>r.clientId===currentUser?.id),[currentUser]);
  const savedMasters=useMemo(()=>getAllMastersWithProfiles().slice(0,3),[]);
  if(!currentUser)return null;
  const tabs: {id: "reviews"|"saved"|"settings"; label: string}[] = [{id:"reviews",label:"Mening sharhlarim"},{id:"saved",label:"Saqlangan ustalar"},{id:"settings",label:"Sozlamalar"}];

  return(
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
        <div className="h-24 w-full" style={{background:"linear-gradient(135deg, #00C896, #00A87E)"}}/>
        <div className="px-6 sm:px-8 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <AvatarUpload src={currentUser.avatar} alt={currentUser.name}/>
            <div className="flex-1 text-center sm:text-left sm:mb-1">
              <h1 className="text-2xl font-extrabold text-[#0A0A0A]">{currentUser.name}</h1>
              <p className="text-[#374151] text-sm mt-0.5 flex items-center gap-1 justify-center sm:justify-start">📞 {currentUser.phone}</p>
            </div>
            <button onClick={()=>setTab("settings")} className="btn-outline text-sm py-2 px-5 w-full sm:w-auto">Profilni tahrirlash</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-max sm:w-fit min-w-full sm:min-w-0">
          {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} className={`shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab===t.id?"bg-white text-[#0A0A0A] shadow-sm":"text-[#6B7280] hover:text-[#0A0A0A]"}`}>{t.label}</button>))}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 animate-fade-in" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
        {tab==="reviews"&&(
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#0A0A0A]">Mening sharhlarim</h2>
            {myReviews.length===0?(<div className="text-center py-12"><div className="text-5xl mb-3">💬</div><h3 className="font-bold text-[#0A0A0A] text-lg">Hali sharh qoldirmagansiz</h3><p className="text-[#6B7280] text-sm mt-1">Ustalarni baholab sharh yozing</p></div>):(
              <div className="space-y-4">{myReviews.map(r=>{const m=getMasterWithProfile(r.masterId);return(
                <div key={r.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex gap-3 hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">{m&&<Image src={m.avatar} alt={m.name} width={48} height={48} className="w-full h-full object-cover" unoptimized/>}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start"><p className="font-bold text-[#0A0A0A]">{m?.name||"Usta"}</p><span className="text-xs text-[#6B7280]">{relDate(r.createdAt)}</span></div>
                    <Stars r={r.rating} size={14}/><p className="mt-1.5 text-sm text-[#374151]">{r.comment}</p>
                  </div>
                </div>);})}</div>)}
          </div>
        )}
        {tab==="saved"&&(
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#0A0A0A]">Saqlangan ustalar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{savedMasters.map(m=>(
              <div key={m.id} className="p-4 rounded-xl bg-white border border-gray-100 relative group" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                <button className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">✕</button>
                <div className="flex gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100"><Image src={m.avatar} alt={m.name} width={56} height={56} className="w-full h-full object-cover" unoptimized/></div>
                  <div><p className="font-bold text-[#0A0A0A]">{m.name}</p><div className="flex items-center gap-1 mt-0.5"><Stars r={m.profile.rating} size={13}/><span className="text-xs font-bold text-[#0A0A0A]">{m.profile.rating}</span></div></div>
                </div>
                <Link href={`/master/${m.id}`} className="block w-full text-center py-2 rounded-lg text-sm font-semibold border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white transition-all">Profilni ko&apos;rish</Link>
              </div>))}</div>
          </div>
        )}
        {tab==="settings"&&(
          <div className="max-w-xl space-y-8">
            <div><h3 className="text-lg font-bold text-[#0A0A0A] mb-4">Shaxsiy ma&apos;lumotlar</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Ism familiya</label><input type="text" defaultValue={currentUser.name} className="input-field"/></div>
                <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Telefon</label><input type="text" disabled defaultValue={currentUser.phone} className="input-field bg-gray-50 text-[#6B7280] cursor-not-allowed"/></div>
                <button className="btn-primary text-sm">Saqlash</button>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-4">Parolni o&apos;zgartirish</h3>
              <div className="space-y-3"><input type="password" placeholder="Joriy parol" className="input-field"/><input type="password" placeholder="Yangi parol" className="input-field"/><button className="btn-secondary text-sm">Parolni yangilash</button></div>
            </div>
            <div className="pt-6 border-t border-gray-100"><h3 className="text-lg font-bold text-[#0A0A0A] mb-3">Bildirishnomalar</h3>
              {["Yangi xabarlar","Usta javoblari"].map(label=>(<label key={label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer mb-2"><div><p className="font-semibold text-sm text-[#0A0A0A]">{label}</p></div><div className="relative w-11 h-6 rounded-full bg-brand-500"><div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow translate-x-5 transition-transform"/></div></label>))}
            </div>
            <div className="pt-6 border-t border-red-100"><h3 className="text-lg font-bold text-red-600 mb-2">Xavfli hudud</h3><p className="text-sm text-[#6B7280] mb-4">Hisobni o&apos;chirish barcha ma&apos;lumotlaringizni yo&apos;q qiladi.</p><button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition active:scale-[0.97]">Hisobni o&apos;chirish</button></div>
          </div>
        )}
      </div>
    </div>);
}

/* ══════════════════════════════════════════════════════════════════
   Master Profile
══════════════════════════════════════════════════════════════════ */
function MasterProfile(){
  const{currentUser}=useStore();
  const[tab,setTab]=useState<"edit"|"portfolio"|"reviews"|"settings">("edit");
  const[isAvailable,setIsAvailable]=useState(true);
  const masterData=useMemo(()=>{if(!currentUser)return null;return getMasterWithProfile(currentUser.id)||{profile:{rating:0,reviewCount:0,categories:[],location:{district:""},experience:0,bio:""}};},[currentUser]);
  if(!currentUser||!masterData)return null;
  const tabs: {id: "edit"|"portfolio"|"reviews"|"settings"; label: string}[] = [{id:"edit",label:"Ma'lumotlar"},{id:"portfolio",label:"Portfolio"},{id:"reviews",label:"Sharhlar"},{id:"settings",label:"Sozlamalar"}];

  return(
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header with cover */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
        <div className="h-28 w-full relative" style={{background:"linear-gradient(135deg, #0B1120, #0A3D2E)"}}>
          <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:"radial-gradient(circle at 1px 1px, white 1px, transparent 0)",backgroundSize:"24px 24px"}}/>
        </div>
        <div className="px-6 sm:px-8 pb-6 -mt-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <AvatarUpload src={currentUser.avatar} alt={currentUser.name} large/>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-[#0A0A0A]">{currentUser.name}</h1>
              <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start flex-wrap">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-lg"><Stars r={masterData.profile.rating||5} size={14}/><span className="text-sm font-bold text-amber-700">{masterData.profile.rating||"5.0"}</span></div>
                <span className="text-sm text-[#6B7280]">{masterData.profile.reviewCount||0} ta sharh</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                <div className="relative" onClick={()=>setIsAvailable(!isAvailable)}>
                  <div className={`w-11 h-6 rounded-full transition-colors ${isAvailable?"bg-brand-500":"bg-gray-300"}`}/>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isAvailable?"translate-x-5":"translate-x-0"}`}/>
                </div>
                <span className={`text-sm font-bold ${isAvailable?"text-brand-700":"text-[#6B7280]"}`}>{isAvailable?"Bo'sh":"Band"}</span>
              </label>
              <Link href={`/master/${currentUser.id}`} className="btn-outline text-sm py-2 px-4">Profil ko&apos;rinishi</Link>
            </div>
          </div>
          {/* Stats mini cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[{icon:"⭐",val:masterData.profile.rating||"5.0",label:"Reyting"},{icon:"💬",val:masterData.profile.reviewCount||0,label:"Sharhlar"},{icon:"👁",val:142,label:"Ko'rishlar"}].map(s=>(
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <span className="text-lg">{s.icon}</span><p className="text-xl font-extrabold text-[#0A0A0A] mt-1">{s.val}</p><p className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold">{s.label}</p>
              </div>))}
          </div>
        </div>
      </div>

      {/* Pill tabs */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-max sm:w-fit min-w-full sm:min-w-0">
          {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} className={`shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab===t.id?"bg-white text-[#0A0A0A] shadow-sm":"text-[#6B7280] hover:text-[#0A0A0A]"}`}>{t.label}</button>))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 animate-fade-in" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
        {tab==="edit"&&(
          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Ism familiya</label><input type="text" defaultValue={currentUser.name} className="input-field"/></div>
              <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Telefon</label><input type="text" disabled defaultValue={currentUser.phone} className="input-field bg-gray-50 text-[#6B7280]"/></div>
              <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Tajriba (yil)</label><input type="number" defaultValue={masterData.profile.experience||5} className="input-field"/></div>
            </div>
            <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">O&apos;zingiz haqida</label><textarea rows={4} defaultValue={masterData.profile.bio||""} className="input-field resize-none"/></div>
            <button className="btn-primary text-sm">Saqlash</button>
          </div>)}
        {tab==="portfolio"&&(
          <div className="space-y-5">
            <div className="flex justify-between items-center"><h2 className="text-lg font-bold text-[#0A0A0A]">Portfolio</h2><button className="btn-primary text-sm py-2 px-4">+ Yangi qo&apos;shish</button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{[1,2,3].map(i=>(
              <div key={i} className="group relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-brand-400 to-teal-500 cursor-pointer" onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)"}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"}}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"/>
                <button className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10 active:scale-95">✕</button>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent"><p className="text-white font-semibold text-sm">Namuna ish #{i}</p><p className="text-white/70 text-xs">Ta&apos;mirlash xizmati</p></div>
              </div>))}
              <div className="rounded-xl border-2 border-dashed border-gray-200 aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-all group">
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center text-xl transition-colors">+</div>
                <p className="text-sm font-medium text-[#6B7280] group-hover:text-brand-600">Yangi qo&apos;shish</p>
              </div>
            </div>
          </div>)}
        {tab==="reviews"&&(<div className="space-y-4"><h2 className="text-lg font-bold text-[#0A0A0A]">Mijozlar sharhlari</h2>{[1,2].map(i=>(<div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"><div className="flex justify-between mb-2"><p className="font-bold text-[#0A0A0A]">Mijoz ismi</p><span className="text-xs text-[#6B7280]">2 kun oldin</span></div><Stars r={5} size={14}/><p className="mt-2 text-sm text-[#374151]">Juda zo&apos;r usta, ishi yoqdi! Tavsiya qilaman.</p></div>))}</div>)}
        {tab==="settings"&&(
          <div className="max-w-xl space-y-6">
            <div><h3 className="text-lg font-bold text-[#0A0A0A] mb-4">Bildirishnomalar</h3>
              <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer"><div><p className="font-semibold text-sm text-[#0A0A0A]">Yangi buyurtmalar</p><p className="text-xs text-[#6B7280]">Mijozlardan yangi so&apos;rovlar kelsa xabar berish</p></div><div className="relative w-11 h-6 rounded-full bg-brand-500"><div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow translate-x-5"/></div></label>
            </div>
            <div className="pt-6 border-t border-red-100"><h3 className="text-lg font-bold text-red-600 mb-2">Hisobni o&apos;chirish</h3><p className="text-sm text-[#6B7280] mb-4">Profil va barcha ma&apos;lumotlaringiz o&apos;chib ketadi.</p><button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition active:scale-[0.97]">Hisobni o&apos;chirish</button></div>
          </div>)}
      </div>
    </div>);
}

/* ══════════════════════════════════════════════════════════════════
   Page entry point
══════════════════════════════════════════════════════════════════ */
export default function ProfilePage(){
  const{currentUser,isLoggedIn}=useStore();
  if(!isLoggedIn||!currentUser) return(
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="text-6xl mb-4">🔒</div>
      <h1 className="text-2xl font-extrabold text-[#0A0A0A] mb-2">Tizimga kirmagansiz</h1>
      <p className="text-[#6B7280] mb-6">Profilni ko&apos;rish uchun hisobingizga kiring.</p>
      <Link href="/login" className="btn-primary text-sm">Kirish sahifasiga o&apos;tish</Link>
    </div>);
  return(<div className="min-h-screen" style={{background:"#F8FAFB"}}>{currentUser.role==="client"?<ClientProfile/>:<MasterProfile/>}</div>);
}
