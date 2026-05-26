"use client";
import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { reviews, getAllMastersWithProfiles, getMasterWithProfile } from "@/lib/mock/data";
import { useRouter } from "next/navigation";

function Stars({r,size=15}:{r:number;size?:number}){return(<div className="flex gap-0.5">{[1,2,3,4,5].map(s=>(<svg key={s} width={size} height={size} className={s<=Math.round(r)?"text-amber-400":"text-gray-200"} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>))}</div>);}
function relDate(d:string){const days=Math.floor((Date.now()-new Date(d).getTime())/86400000);if(days===0)return"Bugun";if(days<7)return`${days} kun oldin`;if(days<30)return`${Math.floor(days/7)} hafta oldin`;return`${Math.floor(days/30)} oy oldin`;}

/* ── Confirmation Modal ── */
function ConfirmModal({title,message,onConfirm,onCancel}:{title:string;message:string;onConfirm:()=>void;onCancel:()=>void}){
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel}/>
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm animate-slide-up">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">{title}</h3>
          <p className="text-sm text-[#6B7280] mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#374151] bg-gray-100 hover:bg-gray-200 transition">Bekor qilish</button>
            <button onClick={onConfirm} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition active:scale-[0.97]">Ha, o&apos;chirish</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Toast Notification ── */
function Toast({message,type="success",onClose}:{message:string;type?:"success"|"error";onClose:()=>void}){
  return(
    <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl animate-slide-down text-sm font-semibold ${type==="success"?"bg-emerald-500 text-white":"bg-red-500 text-white"}`}>
      <span>{type==="success"?"✅":"❌"}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">✕</button>
    </div>
  );
}

function ClientProfile(){
  const router = useRouter();
  const { currentUser, updateProfile, changePassword, deleteAccount, savedMasterIds, removeSavedMaster, notificationSettings, toggleNotificationSetting } = useStore();
  const [tab,setTab]=useState<"reviews"|"saved"|"settings">("reviews");
  const myReviews=useMemo(()=>reviews.filter(r=>r.clientId===currentUser?.id),[currentUser]);
  const savedMasters=useMemo(()=>getAllMastersWithProfiles().filter(m=>(savedMasterIds || []).includes(m.id)),[savedMasterIds]);
  
  // Edit states
  const [editName,setEditName]=useState(currentUser?.name||"");
  const [oldPwd,setOldPwd]=useState("");
  const [newPwd,setNewPwd]=useState("");
  const [toast,setToast]=useState<{msg:string;type:"success"|"error"}|null>(null);
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  const avatarInputRef=useRef<HTMLInputElement>(null);

  if(!currentUser)return null;

  function showToast(msg:string,type:"success"|"error"="success"){
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  }

  function handleSaveProfile(){
    if(!editName.trim()){showToast("Ism kiritilmagan","error");return;}
    updateProfile({name:editName});
    showToast("Ma'lumotlar saqlandi!");
  }

  function handleChangePassword(){
    if(!newPwd.trim()){showToast("Yangi parol kiritilmagan","error");return;}
    if(newPwd.length<6){showToast("Parol kamida 6 ta belgi bo'lishi kerak","error");return;}
    const result=changePassword(oldPwd,newPwd);
    if(result.success){
      showToast("Parol muvaffaqiyatli yangilandi!");
      setOldPwd("");setNewPwd("");
    }else{
      showToast(result.error||"Xatolik","error");
    }
  }

  function handleDeleteAccount(){
    deleteAccount();
    router.push("/home");
  }

  function handleAvatarChange(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const result=ev.target?.result as string;
      if(result) updateProfile({avatar:result});
      showToast("Avatar yangilandi!");
    };
    reader.readAsDataURL(file);
  }

  const tabs=[{id:"reviews",label:"Mening sharhlarim"},{id:"saved",label:"Saqlangan ustalar"},{id:"settings",label:"Sozlamalar"}];

  return(
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {showDeleteConfirm&&<ConfirmModal title="Hisobni o'chirish" message="Barcha ma'lumotlaringiz o'chiriladi. Bu amalni qaytarib bo'lmaydi!" onConfirm={handleDeleteAccount} onCancel={()=>setShowDeleteConfirm(false)}/>}
      
      {/* Hidden file input for avatar */}
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
        <div className="h-24 w-full" style={{background:"linear-gradient(135deg, #00C896, #00A87E)"}}/>
        <div className="px-6 sm:px-8 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white">
                <Image src={currentUser.avatar} alt={currentUser.name} width={96} height={96} className="w-full h-full object-cover" unoptimized/>
              </div>
              <button onClick={()=>avatarInputRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-full flex items-center justify-center cursor-pointer">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left sm:mb-1">
              <h1 className="text-2xl font-extrabold text-[#0A0A0A]">{currentUser.name}</h1>
              <p className="text-[#374151] text-sm mt-0.5 flex items-center gap-1 justify-center sm:justify-start">📞 {currentUser.phone}</p>
            </div>
            <button onClick={()=>setTab("settings")} className="btn-outline text-sm py-2 px-5">Profilni tahrirlash</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id as typeof tab)} className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab===t.id?"bg-white text-[#0A0A0A] shadow-sm":"text-[#6B7280] hover:text-[#0A0A0A]"}`}>{t.label}</button>))}
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
            {savedMasters.length===0?(
              <div className="text-center py-12">
                <div className="text-5xl mb-3">⭐</div>
                <h3 className="font-bold text-[#0A0A0A] text-lg">Hali saqlangan usta yo&apos;q</h3>
                <p className="text-[#6B7280] text-sm mt-1">Usta profilida ⭐ tugmasini bosib saqlang</p>
                <Link href="/search" className="btn-primary text-sm mt-4 inline-block">Usta qidirish</Link>
              </div>
            ):(
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{savedMasters.map(m=>(
                <div key={m.id} className="p-4 rounded-xl bg-white border border-gray-100 relative group" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                  <button onClick={()=>{removeSavedMaster(m.id);showToast("Usta o'chirildi");}} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">✕</button>
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100"><Image src={m.avatar} alt={m.name} width={56} height={56} className="w-full h-full object-cover" unoptimized/></div>
                    <div><p className="font-bold text-[#0A0A0A]">{m.name}</p><div className="flex items-center gap-1 mt-0.5"><Stars r={m.profile.rating} size={13}/><span className="text-xs font-bold text-[#0A0A0A]">{m.profile.rating}</span></div></div>
                  </div>
                  <Link href={`/master/${m.id}`} className="block w-full text-center py-2 rounded-lg text-sm font-semibold border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white transition-all">Profilni ko&apos;rish</Link>
                </div>))}</div>
            )}
          </div>
        )}
        {tab==="settings"&&(
          <div className="max-w-xl space-y-8">
            <div><h3 className="text-lg font-bold text-[#0A0A0A] mb-4">Shaxsiy ma&apos;lumotlar</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Ism familiya</label><input type="text" value={editName} onChange={e=>setEditName(e.target.value)} className="input-field"/></div>
                <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Telefon</label><input type="text" disabled defaultValue={currentUser.phone} className="input-field bg-gray-50 text-[#6B7280] cursor-not-allowed"/></div>
                <button onClick={handleSaveProfile} className="btn-primary text-sm">Saqlash</button>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-[#0A0A0A] mb-4">Parolni o&apos;zgartirish</h3>
              <div className="space-y-3">
                <input type="password" placeholder="Joriy parol" value={oldPwd} onChange={e=>setOldPwd(e.target.value)} className="input-field"/>
                <input type="password" placeholder="Yangi parol (kamida 6 ta belgi)" value={newPwd} onChange={e=>setNewPwd(e.target.value)} className="input-field"/>
                <button onClick={handleChangePassword} className="btn-secondary text-sm">Parolni yangilash</button>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100"><h3 className="text-lg font-bold text-[#0A0A0A] mb-3">Bildirishnomalar</h3>
              {([
                {key:"newMessages" as const,label:"Yangi xabarlar"},
                {key:"masterReplies" as const,label:"Usta javoblari"},
              ]).map(item=>(
                <label key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer mb-2" onClick={()=>toggleNotificationSetting(item.key)}>
                  <div><p className="font-semibold text-sm text-[#0A0A0A]">{item.label}</p></div>
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${(notificationSettings && notificationSettings[item.key])?"bg-brand-500":"bg-gray-300"}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${(notificationSettings && notificationSettings[item.key])?"translate-x-5":"translate-x-0"}`}/>
                  </div>
                </label>
              ))}
            </div>
            <div className="pt-6 border-t border-red-100"><h3 className="text-lg font-bold text-red-600 mb-2">Xavfli hudud</h3><p className="text-sm text-[#6B7280] mb-4">Hisobni o&apos;chirish barcha ma&apos;lumotlaringizni yo&apos;q qiladi.</p><button onClick={()=>setShowDeleteConfirm(true)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition active:scale-[0.97]">Hisobni o&apos;chirish</button></div>
          </div>
        )}
      </div>
    </div>);
}

function MasterProfile(){
  const router = useRouter();
  const { currentUser, updateProfile, changePassword, deleteAccount, portfolioItems, addPortfolioItem, removePortfolioItem, notificationSettings, toggleNotificationSetting } = useStore();
  const [tab,setTab]=useState<"edit"|"portfolio"|"reviews"|"settings">("edit");
  const [isAvailable,setIsAvailable]=useState(true);
  const masterData=useMemo(()=>{if(!currentUser)return null;return getMasterWithProfile(currentUser.id)||{profile:{rating:0,reviewCount:0,categories:[],location:{district:""},experience:0,bio:""}};},[currentUser]);
  
  // Edit states
  const [editName,setEditName]=useState(currentUser?.name||"");
  const [editBio,setEditBio]=useState(masterData?.profile?.bio||"");
  const [editExp,setEditExp]=useState(masterData?.profile?.experience||5);
  const [oldPwd,setOldPwd]=useState("");
  const [newPwd,setNewPwd]=useState("");
  const [toast,setToast]=useState<{msg:string;type:"success"|"error"}|null>(null);
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  const avatarInputRef=useRef<HTMLInputElement>(null);
  
  // Portfolio states
  const [showAddPortfolio,setShowAddPortfolio]=useState(false);
  const [newPortTitle,setNewPortTitle]=useState("");
  const [newPortDesc,setNewPortDesc]=useState("");
  const [selectedPortfolio,setSelectedPortfolio]=useState<any>(null);

  if(!currentUser||!masterData)return null;

  function showToast(msg:string,type:"success"|"error"="success"){
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  }

  function handleSaveProfile(){
    if(!editName.trim()){showToast("Ism kiritilmagan","error");return;}
    updateProfile({name:editName});
    showToast("Ma'lumotlar saqlandi!");
  }

  function handleChangePassword(){
    if(!newPwd.trim()){showToast("Yangi parol kiritilmagan","error");return;}
    if(newPwd.length<6){showToast("Parol kamida 6 ta belgi bo'lishi kerak","error");return;}
    const result=changePassword(oldPwd,newPwd);
    if(result.success){
      showToast("Parol muvaffaqiyatli yangilandi!");
      setOldPwd("");setNewPwd("");
    }else{
      showToast(result.error||"Xatolik","error");
    }
  }

  function handleDeleteAccount(){
    deleteAccount();
    router.push("/home");
  }

  function handleAvatarChange(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const result=ev.target?.result as string;
      if(result) updateProfile({avatar:result});
      showToast("Avatar yangilandi!");
    };
    reader.readAsDataURL(file);
  }

  function handleAddPortfolio(){
    if(!newPortTitle.trim()){showToast("Sarlavha kiriting","error");return;}
    addPortfolioItem(newPortTitle,newPortDesc);
    setShowAddPortfolio(false);
    setNewPortTitle("");
    setNewPortDesc("");
    showToast("Portfolio qo'shildi!");
  }

  const tabs=[{id:"edit",label:"Ma'lumotlar"},{id:"portfolio",label:"Portfolio"},{id:"reviews",label:"Sharhlar"},{id:"settings",label:"Sozlamalar"}];

  // Merge default + user added portfolio
  const defaultPortfolioItems = [{id:"d-1",title:"Namuna ish #1",description:"Ta'mirlash xizmati",color:"from-brand-400 to-teal-500"},{id:"d-2",title:"Namuna ish #2",description:"Ta'mirlash xizmati",color:"from-violet-400 to-purple-500"},{id:"d-3",title:"Namuna ish #3",description:"Ta'mirlash xizmati",color:"from-orange-400 to-amber-500"}];
  const allPortfolio = [...defaultPortfolioItems, ...(portfolioItems || [])];

  return(
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {showDeleteConfirm&&<ConfirmModal title="Hisobni o'chirish" message="Profil va barcha ma'lumotlaringiz o'chiriladi. Bu amalni qaytarib bo'lmaydi!" onConfirm={handleDeleteAccount} onCancel={()=>setShowDeleteConfirm(false)}/>}
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>

      {/* Header with cover */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
        <div className="h-28 w-full relative" style={{background:"linear-gradient(135deg, #0B1120, #0A3D2E)"}}>
          <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:"radial-gradient(circle at 1px 1px, white 1px, transparent 0)",backgroundSize:"24px 24px"}}/>
        </div>
        <div className="px-6 sm:px-8 pb-6 -mt-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white"><Image src={currentUser.avatar} alt={currentUser.name} width={112} height={112} className="w-full h-full object-cover" unoptimized/></div>
              <button onClick={()=>avatarInputRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-full flex items-center justify-center cursor-pointer">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>
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
      <div className="flex gap-2 overflow-x-auto scrollbar-hide p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id as typeof tab)} className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab===t.id?"bg-white text-[#0A0A0A] shadow-sm":"text-[#6B7280] hover:text-[#0A0A0A]"}`}>{t.label}</button>))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 animate-fade-in" style={{boxShadow:"0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"}}>
        {tab==="edit"&&(
          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Ism familiya</label><input type="text" value={editName} onChange={e=>setEditName(e.target.value)} className="input-field"/></div>
              <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Telefon</label><input type="text" disabled defaultValue={currentUser.phone} className="input-field bg-gray-50 text-[#6B7280]"/></div>
              <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">Tajriba (yil)</label><input type="number" value={editExp} onChange={e=>setEditExp(Number(e.target.value))} className="input-field"/></div>
            </div>
            <div><label className="block text-sm font-bold text-[#0A0A0A] mb-1.5">O&apos;zingiz haqida</label><textarea rows={4} value={editBio} onChange={e=>setEditBio(e.target.value)} className="input-field resize-none"/></div>
            <button onClick={handleSaveProfile} className="btn-primary text-sm">Saqlash</button>
          </div>)}
        {tab==="portfolio"&&(
          <div className="space-y-5">
            <div className="flex justify-between items-center"><h2 className="text-lg font-bold text-[#0A0A0A]">Portfolio</h2><button onClick={()=>setShowAddPortfolio(true)} className="btn-primary text-sm py-2 px-4">+ Yangi qo&apos;shish</button></div>
            
            {/* Centered Add Portfolio Modal Overlay */}
            {showAddPortfolio&&(
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>{setShowAddPortfolio(false);setNewPortTitle("");setNewPortDesc("");}}/>
                <div className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md animate-slide-up z-10">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-[#0A0A0A]">Yangi portfolio qo&apos;shish</h3>
                    <button onClick={()=>{setShowAddPortfolio(false);setNewPortTitle("");setNewPortDesc("");}} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#6B7280] transition">✕</button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0A0A0A] mb-1">Ish nomi</label>
                      <input value={newPortTitle} onChange={e=>setNewPortTitle(e.target.value)} placeholder="Masalan: Vannaxona ta'miri" className="input-field"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0A0A0A] mb-1">Qisqacha tavsif</label>
                      <textarea rows={3} value={newPortDesc} onChange={e=>setNewPortDesc(e.target.value)} placeholder="Bajarilgan ish haqida..." className="input-field resize-none"/>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={()=>{setShowAddPortfolio(false);setNewPortTitle("");setNewPortDesc("");}} className="btn-secondary flex-1 text-sm py-2.5">Bekor qilish</button>
                      <button onClick={handleAddPortfolio} className="btn-primary flex-1 text-sm py-2.5">Qo&apos;shish</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Centered View Portfolio Modal Overlay */}
            {selectedPortfolio&&(
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setSelectedPortfolio(null)}/>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md animate-slide-up z-10">
                  <div className={`h-40 bg-gradient-to-br ${selectedPortfolio.color || 'from-brand-400 to-teal-500'} flex items-end p-6 relative`}>
                    <button onClick={()=>setSelectedPortfolio(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition">✕</button>
                    <h3 className="text-xl font-extrabold text-white">{selectedPortfolio.title}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Bajarilgan xizmat tavsifi</h4>
                      <p className="text-[#374151] leading-relaxed text-sm">{selectedPortfolio.description || "Ta'mirlash xizmati to'g'risida batafsil ma'lumot kiritilmagan."}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex justify-end">
                      <button onClick={()=>setSelectedPortfolio(null)} className="btn-primary text-sm py-2 px-6">Yopish</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{allPortfolio.map(item=>(
              <div key={item.id} onClick={()=>setSelectedPortfolio(item)} className={`group relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br ${item.color} cursor-pointer transition-transform`} onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)"}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"}}>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"/>
                <button onClick={(e)=>{e.stopPropagation();if(item.id.startsWith("d-")){showToast("Standart namuna o'chirilmaydi","error");}else{removePortfolioItem(item.id);showToast("Portfolio o'chirildi");}}} className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10 active:scale-95">✕</button>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent"><p className="text-white font-semibold text-sm">{item.title}</p><p className="text-white/70 text-xs">{item.description||"Ta'mirlash xizmati"}</p></div>
              </div>))}
              <div onClick={()=>setShowAddPortfolio(true)} className="rounded-xl border-2 border-dashed border-gray-200 aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-all group">
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center text-xl transition-colors">+</div>
                <p className="text-sm font-medium text-[#6B7280] group-hover:text-brand-600">Yangi qo&apos;shish</p>
              </div>
            </div>
          </div>)}
        {tab==="reviews"&&(<div className="space-y-4"><h2 className="text-lg font-bold text-[#0A0A0A]">Mijozlar sharhlari</h2>{[1,2].map(i=>(<div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"><div className="flex justify-between mb-2"><p className="font-bold text-[#0A0A0A]">Mijoz ismi</p><span className="text-xs text-[#6B7280]">2 kun oldin</span></div><Stars r={5} size={14}/><p className="mt-2 text-sm text-[#374151]">Juda zo&apos;r usta, ishi yoqdi! Tavsiya qilaman.</p></div>))}</div>)}
        {tab==="settings"&&(
          <div className="max-w-xl space-y-6">
            <div><h3 className="text-lg font-bold text-[#0A0A0A] mb-4">Parolni o&apos;zgartirish</h3>
              <div className="space-y-3">
                <input type="password" placeholder="Joriy parol" value={oldPwd} onChange={e=>setOldPwd(e.target.value)} className="input-field"/>
                <input type="password" placeholder="Yangi parol (kamida 6 ta belgi)" value={newPwd} onChange={e=>setNewPwd(e.target.value)} className="input-field"/>
                <button onClick={handleChangePassword} className="btn-secondary text-sm">Parolni yangilash</button>
              </div>
            </div>
            <div><h3 className="text-lg font-bold text-[#0A0A0A] mb-4">Bildirishnomalar</h3>
              <label className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer" onClick={()=>toggleNotificationSetting("newOrders")}>
                <div><p className="font-semibold text-sm text-[#0A0A0A]">Yangi buyurtmalar</p><p className="text-xs text-[#6B7280]">Mijozlardan yangi so&apos;rovlar kelsa xabar berish</p></div>
                <div className={`relative w-11 h-6 rounded-full transition-colors ${(notificationSettings && notificationSettings.newOrders)?"bg-brand-500":"bg-gray-300"}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${(notificationSettings && notificationSettings.newOrders)?"translate-x-5":"translate-x-0"}`}/>
                </div>
              </label>
            </div>
            <div className="pt-6 border-t border-red-100"><h3 className="text-lg font-bold text-red-600 mb-2">Hisobni o&apos;chirish</h3><p className="text-sm text-[#6B7280] mb-4">Profil va barcha ma&apos;lumotlaringiz o&apos;chiriladi.</p><button onClick={()=>setShowDeleteConfirm(true)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition active:scale-[0.97]">Hisobni o&apos;chirish</button></div>
          </div>)}
      </div>
    </div>);
}

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
