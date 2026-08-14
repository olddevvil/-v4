const ROLE_CODES = { 
  judge: "3dl-srab", 
  lawyer: "3dl-mohami", 
  investigator: "3dl-muhaqqiq" 
}; 
 
const ROLE_NAMES = { 
  judge: "القاضي", 
  lawyer: "المحامي", 
  investigator: "المحقق" 
}; 
 
const DEFAULT_CASES = [ 
  { 
    id:1,title:"قضية بجاد ستارك",type:"قضية قضائية",date:"2026-08-01", 
    status:"مغلقة",plaintiff:"—",defendant:"رئيس الجمهورية",lawyer:"—",investigator:"—", 
    summary:"يتم إلغاء ملف القضية المرفوعة على رئيس الجمهورية.", 
    details:"يتم إلغاء ملف القضية المرفوعة على رئيس الجمهورية.", 
    evidence:"لا توجد أدلة إضافية مسجلة.",judgment:"تم إلغاء ملف القضية." 
  }, 
  { 
    id:2,title:"قضية العم جدو ورجال القانون",type:"اعتداء وإطلاق نار",date:"2026-08-14", 
    status:"قيد التحقيق",plaintiff:"العم جدو",defendant:"رجال القانون",lawyer:"—",investigator:"يايا ال منذر", 
    summary:"وقائع اعتداء وإطلاق نار وبلاغات متبادلة بين الأطراف.", 
    details:`إفادة العم جدو: 
كنا أنا واللمبي أمام محل الملابس. قلت لرجال القانون ابتعدوا عن هذا المكان، وقالوا إن المكان آمن ولا يجب عليك قول هذا. دفعني ودفعته وربطني ووضعني على الأرض، ثم فك قيدي عندما رأى رجالي يريدون التدخل. ثم أتى اليخاندرو وكبر الشجار وطلق النار على ذراعي. طلبت منه عدم فعل ذلك، ثم ذهب بي اللمبي إلى المستشفى. 
 
إفادة اللمبي: 
كنت مع العم جدو في محل الملابس. خرج هو من اليمين وأنا من الشمال، وكنت أريد أن أجلب حصاني. عندما وصلت رأيت العم جدو مربوطاً من رجال القانون، ففككت الحبل. رأيت رجل قانون يربط لوفي وكانت يايا معي. ثم رأيت إطلاق نار وركضت، ورأيت العم جدو مصاباً وأخذته إلى المستشفى. وكان جاك مصاباً أيضاً، والذي أطلق على العم جدو هو اليخاندرو. 
 
إفادة جاك هاربر: 
بعد استدعائي لحماية المحكمة ذهبنا إلى محل الملابس. وجدنا العم جدو يقول لا تجلسوا هنا. قمت بربطه وقلت له لا تكلمني بهذا الكلام مرة أخرى، ثم فككت قيده. أتى ودفعني ثم ضرب اليخاندرو، فقمت بتربيطه وتربيط لوفي وذهبت به إلى السجن. ثم أتى شخص من الروتشيلد وأطلق النار علي وعلى اليخاندرو. 
 
إفادة الجنرال سيف: 
إذا كان هذا الاعتداء الذي فعلوه مثلما قال صاحبنا المارشال جاك ال منذر، ربما سوف أقسو عليهم قليلاً، ولا أريد أن أبدأ عهدي بالقسوة، وسوف أوكل الأمر إليك. 
 
إفادة اللمبي أمام المحكمة: 
قال لجاك هاربر: كلب الجنرال. 
 
إفادة يويو ال منذر: 
كان موجوداً العم جدو وهجم على جاك فقط، هذا ما رأيته، وكان معي والي الدار.`, 
    evidence:"إفادات الأطراف والشهود وتقارير الإصابة.", 
    judgment:"لم يصدر حكم نهائي بعد." 
  } 
]; 
 
function currentRole(){ return localStorage.getItem("court_role") || ""; } 
function isLoggedIn(){ return !!currentRole(); } 
function canCreate(){ return ["judge","investigator"].includes(currentRole()); } 
function canChangeStatus(){ return currentRole()==="judge"; } 
function canAddLegalNote(){ return currentRole()==="lawyer"; } 
function canAddInvestigation(){ return currentRole()==="investigator"; } 
 
function getCases(){ 
  const saved=localStorage.getItem("court_cases"); 
  if(saved){ try{return JSON.parse(saved)}catch(e){} } 
  localStorage.setItem("court_cases",JSON.stringify(DEFAULT_CASES)); 
  return DEFAULT_CASES; 
} 
function saveCases(cases){localStorage.setItem("court_cases",JSON.stringify(cases));} 
 
function showLogin(){ 
  const m=document.getElementById("loginModal"); 
  if(m){m.classList.add("show");setTimeout(()=>document.getElementById("modalCode")?.focus(),80);} 
} 
function closeLogin(){document.getElementById("loginModal")?.classList.remove("show");} 
function login(){ 
  const code=document.getElementById("codeInput")?.value.trim(); 
  authenticate(code); 
} 
function loginFromModal(){ 
  const code=document.getElementById("modalCode")?.value.trim(); 
  authenticate(code); 
} 
function authenticate(code){ 
  const role=Object.keys(ROLE_CODES).find(r=>ROLE_CODES[r]===code); 
  const err=document.getElementById("loginError"); 
  if(!role){ if(err) err.textContent="رمز الدخول غير صحيح."; return; } 
  localStorage.setItem("court_role",role); 
  localStorage.setItem("court_logged_in","true"); 
  closeLogin(); 
  location.reload(); 
} 
function logout(){ 
  localStorage.removeItem("court_role"); 
  localStorage.removeItem("court_logged_in"); 
  location.reload(); 
} 
 
function openCase(id){ 
  if(!isLoggedIn()){showLogin();return;} 
  location.href="case.html?id="+encodeURIComponent(id); 
} 
 
function showCreateCase(){ 
  if(!canCreate()){alert("هذه الصلاحية متاحة للقاضي والمحقق فقط.");return;} 
  document.getElementById("createCaseModal")?.classList.add("show"); 
} 
function closeCreateCase(){document.getElementById("createCaseModal")?.classList.remove("show");} 
 
function createCase(){ 
  if(!canCreate()) return; 
  const val=id=>document.getElementById(id)?.value.trim()||""; 
  const title=val("newTitle"), type=val("newType"), date=val("newDate")||new Date().toISOString().slice(0,10); 
  const plaintiff=val("newPlaintiff"), defendant=val("newDefendant"), lawyer=val("newLawyer"); 
  const investigator=val("newInvestigator"), status=document.getElementById("newStatus").value; 
  const summary=val("newSummary"), details=val("newDetails"), evidence=val("newEvidence"); 
  const err=document.getElementById("createCaseError"); 
  if(!title||!summary||!details){err.textContent="اسم القضية والملخص والتفاصيل مطلوبة.";return;} 
  const cases=getCases(); 
  const id=cases.reduce((m,c)=>Math.max(m,Number(c.id)||0),0)+1; 
  cases.push({id,title,type,date,status,plaintiff,defendant,lawyer,investigator,summary,details, 
    evidence:evidence||"لا توجد أدلة مسجلة بعد.",judgment:"لم يصدر حكم نهائي بعد.",legalNotes:[],investigationNotes:[]}); 
  saveCases(cases); 
  closeCreateCase(); 
  alert("تم إنشاء القضية رقم "+id+" بنجاح."); 
  renderCases(); 
} 
 
function renderCases(){ 
  const grid=document.getElementById("casesGrid"); if(!grid)return; 
  const cases=getCases(), logged=isLoggedIn(); 
  grid.innerHTML=cases.map(c=>` 
    <article class="case-card"> 
      <div class="case-no">${String(c.id).padStart(2,"0")}</div> 
      <span class="badge ${c.status==="مغلقة"?"closed":c.status==="مفتوحة"?"open":"pending"}">${escapeHtml(c.status)}</span> 
      <h3>${escapeHtml(c.title)}</h3> 
      <p>${escapeHtml(c.summary)}</p> 
      <small class="case-public">رقم ${String(c.id).padStart(2,"0")} • ${escapeHtml(c.date||"")}</small> 
      <button onclick="openCase(${Number(c.id)})">${logged?"فتح ملف القضية":"التفاصيل محجوبة — تسجيل الدخول"}</button> 
    </article>`).join(""); 
  const stats=document.querySelector(".stats"); 
  if(stats){ 
    const bs=stats.querySelectorAll("div b"); 
    bs[0].textContent=cases.length; 
    bs[1].textContent=cases.filter(c=>c.status!=="مغلقة").length; 
    bs[2].textContent=cases.filter(c=>c.status==="مغلقة").length; 
  } 
  document.querySelectorAll(".admin-only").forEach(el=>el.style.display=canCreate()?"inline-flex":"none"); 
  const who=document.getElementById("currentRole"); 
  if(who){ 
    who.textContent=logged?`مسجل الدخول: ${ROLE_NAMES[currentRole()]}`:"غير مسجل"; 
  } 
} 
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));} 
 
document.addEventListener("DOMContentLoaded",()=>{ 
  renderCases(); 
  const role=currentRole(); 
  const btn=document.getElementById("loginTop"); 
  if(btn){ 
    btn.textContent=role?`خروج (${ROLE_NAMES[role]})`:"تسجيل الدخول"; 
    btn.onclick=role?logout:showLogin; 
  } 
  const help=document.getElementById("roleHelp"); 
  if(help) help.textContent=role?`أنت مسجل بصلاحية: ${ROLE_NAMES[role]}`:"رموز الدخول مخصصة للقاضي والمحامي والمحقق."; 
}); 
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeLogin();closeCreateCase();}});


/* =========================================================
   طلب الحصول على رخصة محامي
   ========================================================= */

const LAWYER_EXAM_URL = "https://forms.gle/w8yLPEvRn7tZXNgbA";

function startLawyerExam(){

  const input = document.getElementById("lawyerName");
  const message = document.getElementById("licenseMessage");

  if(!input){
    return;
  }

  const name = input.value.trim();

  if(!name){
    if(message){
      message.textContent = "يرجى كتابة الاسم الكامل أولاً.";
      message.style.color = "#ff7777";
    }

    input.focus();
    return;
  }

  if(name.length < 3){
    if(message){
      message.textContent = "يرجى إدخال الاسم الكامل بشكل صحيح.";
      message.style.color = "#ff7777";
    }

    input.focus();
    return;
  }

  // حفظ اسم المتقدم في المتصفح
  localStorage.setItem("lawyer_applicant_name", name);

  if(message){
    message.textContent = "تم تسجيل طلبك، جارٍ تحويلك إلى اختبار رخصة المحاماة...";
    message.style.color = "#d4af37";
  }

  setTimeout(function(){
    window.location.href = LAWYER_EXAM_URL;
  }, 800);
}
