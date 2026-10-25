const KEY="my-ai-v1";
const DEFAULT_PROMPT=`You are My AI, a private personal assistant. Be helpful, clear, concise, and honest about your capabilities. If you do not know something, say so.`;
let state=JSON.parse(localStorage.getItem(KEY)||"null")||{chats:[],prompt:DEFAULT_PROMPT};
let current=[];
const chat=document.querySelector("#chat"), input=document.querySelector("#input"), form=document.querySelector("#composer");
const welcome=document.querySelector("#welcome"), settings=document.querySelector("#settings"), systemPrompt=document.querySelector("#systemPrompt");

function save(){localStorage.setItem(KEY,JSON.stringify({chats:current.length? [current]:state.chats,prompt:state.prompt}))}
function bubble(role,text){const row=document.createElement("div");row.className=`msg ${role}`;const b=document.createElement("div");b.className="bubble";b.textContent=text;row.appendChild(b);chat.appendChild(row);chat.scrollTop=chat.scrollHeight}
function render(){chat.querySelectorAll(".msg").forEach(x=>x.remove()); if(!current.length){welcome.style.display="block";return} welcome.style.display="none";current.forEach(m=>bubble(m.role,m.content))}
function add(role,content){current.push({role,content});state.chats=[current];save();render()}
form.addEventListener("submit",e=>{e.preventDefault();const text=input.value.trim();if(!text)return;add("user",text);input.value="";input.style.height="auto";setTimeout(()=>add("assistant","Local AI engine not connected yet. This interface is ready for an on-device model; your message was saved locally on this device."),150)});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,130)+"px"});
document.querySelector("#newChat").onclick=()=>{current=[];render();input.focus()};
document.querySelector("#settingsBtn").onclick=()=>{systemPrompt.value=state.prompt;settings.showModal()};
document.querySelector("#closeSettings").onclick=()=>settings.close();
document.querySelector("#saveSettings").onclick=()=>{state.prompt=systemPrompt.value.trim()||DEFAULT_PROMPT;save();settings.close()};
document.querySelector("#clearData").onclick=()=>{if(confirm("Delete all local chats and settings?")){localStorage.removeItem(KEY);location.reload()}};
if(state.chats.length) current=state.chats[state.chats.length-1];
render();
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
