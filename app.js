'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const fmt=n=>Number(n).toLocaleString('en-US');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pic=(key,alt='',cls='')=>'<img class="'+cls+'" src="media/'+key+'.webp" alt="'+esc(alt)+'" draggable="false">';
const shapes={
 home:'<path d="m3 11 9-8 9 8M5 10v11h5v-6h4v6h5V10"/>',
 search:'<circle cx="10.5" cy="10.5" r="7.8"/><path d="m16.5 16.5 5 5"/>',
 bell:'<path d="M4.5 17c2-2 1.8-6.9 2.8-10a4.9 4.9 0 0 1 9.4 0c1 3.1.8 8 2.8 10 .5.7.2 1.4-.8 1.4H5.3c-1 0-1.3-.7-.8-1.4ZM9.5 20a2.7 2.7 0 0 0 5 0"/>',
 close:'<path d="m6 6 12 12M18 6 6 18"/>',check:'<path d="m4.5 12 5 5L20 6.5"/>',
 ticket:'<path d="m3.5 5 17 .1v4.2c-3.4 0-3.4 5.5 0 5.5V19h-17v-4.2c3.3 0 3.3-5.5 0-5.5z"/><path d="M15 5v2m0 3v2m0 3v2"/>',
 filter:'<path d="M2 5h5m5 0h10M2 12h12m5 0h3M2 19h3m5 0h12"/><circle cx="9.5" cy="5" r="2.2"/><circle cx="16.5" cy="12" r="2.2"/><circle cx="7.5" cy="19" r="2.2"/>',
 zoom:'<path d="M3 8V3h5m8 0h5v5m0 8v5h-5m-8 0H3v-5"/><rect x="7" y="7" width="10" height="10" rx="1.5"/>',
 undo:'<path d="m8 5-6 5 6 5M3 10h10c6 0 8 3 7 8"/>',redo:'<path d="m16 5 6 5-6 5m5-5H11c-6 0-8 3-7 8"/>',
 trash:'<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15m-8 4v7m4-7v7"/>',
 pose:'<circle cx="12" cy="4" r="2"/><path d="m11 8-3 6-4 1m7-7 4 5 4-1m-8 0-3 9m5-9 3 9"/>',
 thumb:'<path fill="currentColor" stroke="none" d="M3 10h4v11H3zm6 0 5-8c3 0 2 4 1 7h5c2 0 2 1 2 3l-2 7c0 1-1 2-3 2H9z"/>',
 user:'<circle cx="12" cy="7" r="4"/><path d="M4 21c0-8 16-8 16 0"/>', arrow:'<path d="m9 5 7 7-7 7"/>', bag:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>'};
const robuxIcon = (variant = 'home') => pic('robux-' + variant, '', 'robux-icon');
function ico(k) {
 if (k === 'robux') return robuxIcon();
 return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(shapes[k]||'')+'</svg>';
}
const ib=(act,label,k,cls='')=>'<button class="iconbtn '+cls+'" data-act="'+act+'" aria-label="'+esc(label)+'">'+ico(k)+'</button>';
const btn=(act,title,cls='primary')=>'<button class="'+cls+'" data-act="'+act+'">'+title+'</button>';
const packageList=[[22500,'199.99'],[10000,'99.99'],[4500,'49.99'],[3150,'34.99'],[1700,'19.99'],[1200,'14.99'],[800,'9.99'],[400,'4.99'],[80,'0.99'],[40,'0.49']];
const key='black-friday-robux-studio-v1';
const initial=()=>({balance:17,coupon:'new',redeemed:0,owned:[],outfit:null,slots:{},transfers:[]});
let memory=initial();
function read(){try{const raw=localStorage.getItem(key);if(raw)return Object.assign(initial(),JSON.parse(raw))}catch{}return memory}
function write(obj){memory=obj;try{localStorage.setItem(key,JSON.stringify(obj))}catch{}}
let scene='desktop',page='Home',homeTab='For you',homeQuery='',homeScroll=0;
let dialogType='',opener=null,pendingPackage=0,shopReturn='Home',priceApplied=false,launching=false,checkoutBusy=false;
let mode='Marketplace',category='All',selection=null,cart=[],undo=[],redo=[],slot=1,motion='Full Set',subtab='Bundles',filter='Featured',catalogQuery='',expanded=false,zoom=1;
let toastTimer,previewOverride=null,equippedPreview=null;
const gameNames=['Brookhaven 🏡RP','Throw Food For Animals','+1 Assassin Leveling','[ABILITIES] CRAZY 8 Ball','Fetchford: Hatch, Trade & Drive','RoWorld [World PvP]','Ecos: La Brea','Croydon: London Bus Simulator','My Hero Academia: Ultimate','The Corner 🔊 [18+]','Honeypot Shop 🍯 (SALE)','Sell a Million Sushi','STEAL A CHRISMAS EGG','CANDELA 🎉','Climb the Creepypasta Tower','[🔥THANKSGIVING] Hypershot','MALLCORE 🎄 Christmas Dress Up Avatar Shop','Build a Gingerbread House!','DONT SWIM 🚫','Driving Empire [✨NEW LIMITED]','DONT SPLASH','Keepers of the Hollow Reach','Ant Evolution','Blox Fruits','Natural Disaster Survival','Zombies vs. Plants','Bonk and Steal [NEW]'];
const rating=[85,94,95,98,80,82,91,77,87,85,32,99,66,90,63,94,87,100,78,92,85,75,93,92,70,88,63];
const contNames=['birthday game','FERAL 🐺 Animal Survival','Animal Hospital (Anomaly) 🧪','The Hunt: Roblox 20','Steal An Egg','Murder Mystery 2'];
const friendNames=['Add Friends','Papipigblox','rafa2026brlox','Allbaconarenoth…','luiza_star96','Rzrobiz','Marii','Skz_THZofc'];
const productData={};
function group(prefix,names,prices,creators=[]){return names.map((name,i)=>{const id=prefix+i;return productData[id]={id,name,price:prices[i]||0,creator:creators[i]||'Roblox',prefix,idx:i}})}
const items=group('item',['Christmas Hat Red','Silver Ninja Star of the Silent','Red Moon Tree Dark','Festive Cozy Cat Christmas','🇧🇷Professora Six Seven','low cortisol pookie','Cozy Christmas Fireplace','Headless'],[61,15,134,134,34,55,134,37],['Chibi Couture','Roblox','Backgrounds Incorporated','Valkenheim','DyD Corporation','Academy IV','winterden','Need A Chrome Heart']);
const looks=group('look',['type 1','Cat Bear Companion','Bear Samurai','Crimson Rose Princess','Plushie Cuddler Companion','Shadow Wanderer','Blue Bunny Wanderer','Green Dinosaur Bear'],[510,491,435,519,372,258,526,444],['Hekketsu09']);
const packs=group('pack',['adidas Community','Korblox Community','adidas aura animation','👼 Angel (Floating)','Oldschool Animation','Cartoony Animation','Joyful Animation Pack','Cute Kawaii Shy Bundle'],[300,189,300,189,80,200,200,189],['adidas','AnonymousGroupH','adidas',"Juno’s Animations"]);
const wear=group('wear',['Floral top','Crimson hair','Pink striped pants','Pumpkin head','Jack-o’-lantern','Blue jacket','Black T-shirt','Sketch shirt','Black graphic tee','Striped sweater','White top','Graphic shirt'],[]);
const emotes=group('emote',['Jeyke Funk Setalcix','🔥 I got that feeling','Shrug','Point2','Stadium','Hello'],[]);
productData.rthro={id:'rthro',name:'Rthro Animation Package',price:0,creator:'Roblox',prefix:'pack',idx:9};
const marketCats=['All','Avatars','Backgrounds','Body','Clothing','Accessories','Animations','Emotes'];
const customCats=['All','Clothing','Accessories','Backgrounds','Animations','Emotes','Makeup'];
function fit(){
 const w=window.innerWidth,h=window.innerHeight,narrow=w/h<.9;
 const scale=narrow?Math.min(w/400,1.5):Math.min(w/1133,h/595);
 const sw=w/scale,sh=h/scale;const stage=$('#stage');stage.style.width=sw+'px';stage.style.height=sh+'px';stage.style.transform='scale('+scale+')';stage.classList.toggle('narrow',narrow);
 const desk=$('.deskpanel');desk.style.width=Math.min(sw,sh*1133/744)+'px';
}
addEventListener('resize',fit);fit();
function view(v){scene=v;for(const e of $$('.view'))e.hidden=e.id!==v}
function toast(msg){clearTimeout(toastTimer);$('#toast').textContent=msg;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2200)}
function modal(type,title,html,cls=''){
 if(!dialogType)opener=document.activeElement;
 dialogType=type;const d=$('#dialog');d.className=cls;d.innerHTML='<h2 id="dialogTitle">'+esc(title)+'</h2>'+ib('dismiss','Close','close','dialogclose')+html;
 $('#veil').classList.toggle('ipad-veil',cls.startsWith('ipad-'));$('#veil').hidden=false;d.focus({preventScroll:true});
}
function dismiss(){dialogType='';$('#veil').hidden=true;$('#veil').classList.remove('ipad-veil');$('#dialog').innerHTML='';if(opener?.isConnected)opener.focus({preventScroll:true});opener=null}
function coupon(){
 const state=read();
 if(state.coupon==='used'){receipt(false);return}
 const saved=state.coupon==='saved';
 modal('coupon',saved?'Your coupon':'Black Friday coupon','<div class="ticket"><div class="ticketline"><b>BLACK FRIDAY</b>'+ico('ticket')+'</div><div class="discount">100% OFF</div><div class="perfs"></div><div class="ticketbottom"><span>One Robux package</span><i class="barcode"></i></div></div><p>Choose a Robux package and redeem this coupon to bring the total to <b>$0.00</b>.</p><div class="mini">Demo coupon · One use</div><div class="actions">'+btn(saved?'shop':'save-coupon',saved?'Go to Robux':'Save coupon')+'</div>');
}
function saveCoupon(){const s=read();if(s.coupon==='new'){s.coupon='saved';write(s)}dismiss();if(scene==='shop')renderShop();toast('Coupon saved to Robux')}
function enter(source) {
 if (launching || scene !== 'desktop') return;
 launching = true;
 const tapped = source?.querySelector?.('.os-glyph, img') || source;
 const rect = tapped?.getBoundingClientRect?.();
 const desktop = $('#desktop'), splash = $('#splash');
 dismiss();
 splash.hidden = false;
 scene = 'splash';
 desktop.inert = true;
 const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (!reduce && rect?.width && typeof splash.animate === 'function') {
   const screen = $('#stage').getBoundingClientRect();
   const initialX = (rect.left - screen.left) / screen.width * splash.clientWidth;
   const initialY = (rect.top - screen.top) / screen.height * splash.clientHeight;
   const scaleX = rect.width / screen.width, scaleY = rect.height / screen.height;
   splash.style.transformOrigin = 'top left';
   splash.animate([
     {transform:'translate('+initialX+'px,'+initialY+'px) scale('+scaleX+','+scaleY+')',borderRadius:'19%',opacity:.72},
     {transform:'translate(0,0) scale(1)',borderRadius:'0',opacity:1}
   ],{duration:410,easing:'cubic-bezier(.19,.78,.22,1)'});
   splash.querySelector('img').animate([{opacity:0},{opacity:1}],{duration:320,delay:100,fill:'backwards'});
 }
 setTimeout(()=>{
   desktop.inert=false;
   launching=false;
   go('Home');
   if(read().coupon==='new') coupon();
 },reduce ? 170 : 1100);
}
$('.launch').onclick=e=>enter(e.currentTarget);
$('.recent').onclick=e=>enter(e.currentTarget);
function rail(){const names=['Home','Moments','Chat','Me','More'];$('#rail').innerHTML=names.map((n,i)=>'<button class="nav" data-act="page:'+n+'" '+(page===n?'aria-current="page"':'')+'>'+pic('nav'+i)+'<span>'+n+'</span></button>').join('')}
function go(p){if(scene==='shell'&&page==='Home'&&$('.feed'))homeScroll=$('.feed').scrollTop;dismiss();view('shell');page=p;rail();if(p==='Home')home();else if(p==='Me')market();else other(p)}
function game(k,i){const n=k==='g'?gameNames[i]:contNames[i];return '<button class="card" data-act="game:'+k+i+'">'+pic(k+i,n)+'<strong>'+esc(n)+'</strong><small>'+ico('thumb')+' '+(k==='g'?rating[i]:[36,82,92,83,91,90][i])+'% Rating</small></button>'}
function gameSet(indices,k='g',small=false){return '<div class="cards'+(small?' small':'')+'">'+indices.map(i=>game(k,i)).join('')+'</div>'}
function feedMarkup(){const query=homeQuery.toLowerCase().trim();if(query){const ids=gameNames.map((_,i)=>i).filter(i=>gameNames[i].toLowerCase().includes(query));return '<h2>Search results</h2>'+(ids.length?gameSet(ids):'<p class="muted">No experiences found.</p>')}
 if(homeTab==='Charts')return '<h2>Top rated</h2>'+gameSet(gameNames.map((_,i)=>i).sort((a,b)=>rating[b]-rating[a]));
 return '<div class="friends">'+friendNames.map((n,i)=>'<button class="friend" data-act="friend:'+i+'">'+pic('friend'+i,n)+esc(n)+(i===1?'<small>Ragdoll Sandbox</small>':'')+'</button>').join('')+'</div><button class="hero" data-act="banner" aria-label="Send Gratitude Sky-High">'+pic('banner','Send Gratitude Sky-High · The Great Build')+'</button><h2>Recommended For You</h2>'+gameSet([0,1,2,3,4,5])+'<h2>Continue ›</h2>'+gameSet([0,1,2,3,4,5],'c',true)+'<h2>Standout Games</h2><p class="muted feed-sub">Curated games shaping what’s next for Roblox</p>'+gameSet([6,7,8])+'<h2>Discover Avatars</h2><div class="cards small">'+[0,1,2,3,4,5].map((n)=>'<button class="card" data-act="discover:'+n+'">'+pic('discover'+n)+'<small>Roblox</small></button>').join('')+'</div><h2>Recommended For You</h2>'+gameSet(gameNames.map((_,i)=>i).slice(9));}
function home(){const m=$('#main');m.innerHTML='<div class="home"><header class="homehead">'+pic('wordmark','Roblox','logo')+'<label class="searchbar">'+ico('search')+'<input id="homefind" type="search" aria-label="Search experiences" placeholder="Search" value="'+esc(homeQuery)+'"></label><div class="headtools">'+ib('shop','Robux','robux')+ib('notifications','Notifications','bell')+'</div></header><div class="tabs">'+['For you','Charts'].map(n=>btn('home-tab:'+n,n,homeTab===n?'on':'')).join('')+'</div><div class="feed">'+feedMarkup()+'</div></div>';$('.feed').scrollTop=homeScroll;$('#homefind').oninput=e=>{homeQuery=e.target.value;$('.feed').innerHTML=feedMarkup();$('.feed').scrollTop=0}}
function other(p){let html='';if(p==='More'){html='<div class="menulist">'+[['shop','Robux','robux'],['page:Me','Marketplace','bag'],['coupon','Black Friday coupon','ticket'],['ipad-home','iPad Home','home'],['reset','Restart demo','undo']].map(([a,n,k])=>btn(a,ico(k)+n+'<span aria-hidden="true">›</span>','')).join('')+'</div>'}
 if(p==='Chat')html='<div class="menulist">'+friendNames.slice(1).map((n,i)=>btn('friend:'+(i+1),pic('friend'+(i+1))+esc(n),'')).join('')+'</div>';
 if(p==='Moments')html='<div class="hero">'+btn('banner',pic('banner','The Great Build'),'')+'</div>';
 $('#main').innerHTML='<div class="plainpage"><h1>'+p+'</h1>'+html+'</div>'}
function openShop(){if(scene!=='shop'){if(page==='Home'&&$('.feed'))homeScroll=$('.feed').scrollTop;shopReturn=page;$('#main').querySelector('video')?.pause()}dismiss();view('shop');renderShop();$('#shopscroll').scrollTop=0}
function renderShop(){const s=read();$('#shopbalance').innerHTML=robuxIcon('balance')+fmt(s.balance);const used=s.coupon==='used';if(used)priceApplied=false;const title=used?'Coupon redeemed':priceApplied?'Black Friday coupon applied':'Black Friday coupon';const sub=used?fmt(s.redeemed)+' Robux added':priceApplied?'Choose one package for $0.00.':'100% off one Robux package.';
 $('#storeCoupon').innerHTML='<div class="couponline '+(used?'used':'')+'">'+ico(used?'check':'ticket')+'<div><strong>'+title+'</strong><small>'+sub+'</small></div>'+btn(used?'receipt':priceApplied?'remove-coupon':'apply-coupon',used?'View receipt':priceApplied?'Remove':'Apply coupon','')+'</div>';
 $('#packages').innerHTML=packageList.map(([q,p])=>'<div class="pkg"><span class="qty">'+robuxIcon('package')+fmt(q)+(q===400?'<span class="tag">✪ For you</span>':'')+'</span><button class="buy '+(q===400?'feature':'')+'" data-act="package:'+q+'" aria-label="'+fmt(q)+' Robux, '+(priceApplied?'$0.00':'$'+p)+'">'+(priceApplied?'<del>$'+p+'</del> $0.00':'$'+p)+'</button></div>').join('');
 $('#plusplans').innerHTML=[['Roblox Plus','$4.99','Up to 20% off on items and avatars'],['Plus 500','$10.99','+500 Robux every month'],['Plus 1000','$15.99','+1,000 Robux every month']].map(([n,p,t])=>'<div class="plan"><h3>'+n+' <b>'+p+'</b></h3><p>'+t+'</p><p>Free private servers</p>'+btn('plus:'+n,'Learn more','secondary')+'</div>').join('')}
function applyCoupon(){const s=read();if(s.coupon==='used'){renderShop();return}if(s.coupon==='new'){s.coupon='saved';write(s)}priceApplied=true;renderShop()}
function choosePackage(q){const pair=packageList.find(p=>p[0]===q);if(!pair)return;pendingPackage=q;const s=read();if(s.coupon==='used'){modal('already','Robux package','<div class="packagehero">'+robuxIcon('package')+fmt(q)+' Robux</div><p>Your Black Friday coupon has already been redeemed. Your demo balance is <b>'+fmt(s.balance)+' Robux</b>.</p><div class="actions">'+btn('dismiss','Done')+'</div>');return}
 modal('redeem','Redeem coupon','<div class="packagehero">'+robuxIcon('package')+fmt(q)+' Robux</div><div class="rowline"><span>Package price</span><b>$'+pair[1]+'</b></div><div class="rowline"><span>Black Friday coupon</span><b>−$'+pair[1]+'</b></div><div class="rowline total"><span>Total</span><span>$0.00</span></div><div class="actions">'+btn('dismiss','Cancel','secondary')+btn('confirm','Redeem for $0.00')+'</div>')}
async function transact(fn){if(navigator.locks?.request)return navigator.locks.request(key,fn);return fn()}
async function redeem(){if(checkoutBusy||dialogType!=='redeem')return;checkoutBusy=true;const q=pendingPackage;try{await transact(()=>{const s=read();if(s.coupon==='used')return;s.coupon='used';s.redeemed=q;s.balance+=q;write(s)});priceApplied=false;renderShop();receipt(true)}finally{checkoutBusy=false}}
function receipt(fresh){const s=read();modal('receipt',fresh?'Coupon redeemed!':'Coupon receipt','<div class="center"><div class="okmark">'+ico('check')+'</div><h3>+'+fmt(s.redeemed)+' Robux</h3><p class="mini">Added to your demo balance</p></div><div class="rowline"><span>Amount paid</span><b>$0.00</b></div><div class="rowline total"><span>Balance</span><span>'+ico('robux')+' '+fmt(s.balance)+'</span></div><div class="actions">'+btn('dismiss','Done')+'</div>','success')}
$('#exitShop').innerHTML=ico('close');$('#exitShop').onclick=()=>go(shopReturn);
$('#plusInfo').onclick=()=>plus('Roblox Plus');function plus(n){modal('plus',n,'<p>Up to 20% off on items and avatars, free private servers and the option to send Robux.</p><div class="mini">Subscriptions are outside this demo.</div><div class="actions">'+btn('dismiss','Done')+'</div>')}
$('#send').onclick=()=>{modal('send','Send Robux','<form class="subform" id="sendform"><label for="recipient">Friend</label><select id="recipient">'+friendNames.slice(1).map(n=>'<option>'+esc(n)+'</option>').join('')+'</select><label for="amount">Demo Robux</label><input id="amount" type="number" min="1" max="'+read().balance+'" required inputmode="numeric"><div id="formerror" class="notice"></div><button class="primary">Send</button></form>');$('#sendform').onsubmit=async e=>{e.preventDefault();const n=Number($('#amount').value),who=$('#recipient').value;await transact(()=>{const s=read();if(!Number.isSafeInteger(n)||n<1||n>s.balance){$('#formerror').textContent='Choose an amount within your balance.';return}s.balance-=n;s.transfers.push({n,who});write(s);dismiss();renderShop();toast('Sent '+fmt(n)+' demo Robux to '+who)})}};

function currentGroup(){
 if(mode==='Marketplace'){
  if(category==='Avatars'||category==='Body')return looks;
  if(category==='Animations')return subtab==='Emotes'?emotes:packs;
  if(category==='Emotes')return emotes;
  if(category==='Accessories')return [items[0],items[1],items[7]];
  if(category==='Backgrounds')return [items[2],items[3],items[6]];
  if(category==='Clothing')return [items[0],items[7],...looks.slice(0,2)];
  return items;
 }
 const own=read().owned.map(id=>productData[id]).filter(Boolean);
 if(category==='Animations')return [productData.rthro];
 if(category==='Emotes')return emotes;
 if(category==='Accessories')return [wear[1],wear[3],wear[4],...own.filter(p=>p.prefix==='item')];
 if(category==='Backgrounds')return own.filter(p=>['item2','item3','item6'].includes(p.id));
 if(category==='Makeup')return [wear[1],...own.filter(p=>p.prefix==='look')];
 return [...(category==='All'?wear:wear.filter((_,i)=>![1,3,4].includes(i))),...own];
}
function productCard(p){const active=selection===p.id;const tall=mode==='Marketplace'&&['look','pack'].includes(p.prefix);
 const custom=mode==='Customize';const showName=!custom||['Animations','Emotes'].includes(category);
 return '<button class="product '+(active?'active':'')+'" data-act="product:'+p.id+'" aria-label="'+esc(p.name)+'"><span class="tile" style="aspect-ratio:'+(tall?'144/205':'1')+'">'+pic(p.id,p.name)+(active?'<em>Details</em>':'')+'</span>'+(showName?'<strong>'+esc(p.name)+'</strong>':'')+(!custom?'<span class="creator">'+esc(p.creator)+' '+(p.creator==='Roblox'||['Chibi Couture','Valkenheim','DyD Corporation','winterden','adidas'].includes(p.creator)?'<i class="verified">✓</i>':'')+'</span><span class="price">'+robuxIcon('price')+fmt(p.price)+'</span>':'')+'</button>';
}
function catalogMarkup(){
 const q=catalogQuery.toLowerCase();let groupItems=currentGroup().filter(p=>p.name.toLowerCase().includes(q));
 if(filter==='Price: low to high')groupItems.sort((a,b)=>a.price-b.price);if(filter==='Price: high to low')groupItems.sort((a,b)=>b.price-a.price);
 const all=category==='All'&&mode==='Marketplace',custom=mode==='Customize';
 let html=all?'<h2>Recommended For You</h2>':'';
 if(catalogQuery)html+='<p class="muted">Results for “'+esc(catalogQuery)+'” '+btn('clear-search','Clear','')+'</p>';
 html+='<div class="productgrid">'+groupItems.map(productCard).join('')+'</div>';
 if(!groupItems.length)html+='<p class="muted">No items here yet.</p>';
 if(!catalogQuery&&all)html+='<h2 class="follow-title">Explore Styles</h2><div class="productgrid">'+looks.map(productCard).join('')+'</div>';
 if(!catalogQuery&&custom&&['Animations','Emotes'].includes(category))html+='<h2 class="follow-title">You May Also Like</h2><div class="productgrid">'+(category==='Animations'?[packs[3],packs[0],packs[5],packs[1]]:items.slice(4,6)).map(productCard).join('')+'</div>';
 return html;
}
function getPreview(){
 if(previewOverride)return {video:previewOverride};
 const id=selection||equippedPreview||read().outfit,p=productData[id];
 if(!p)return {video:mode==='Marketplace'?'main':'closet'};
 if(p.prefix==='look'&&[0,1,2,3,4,6].includes(p.idx))return {video:'model'+p.idx};
 if(p.prefix==='emote')return {video:p.idx===5||p.idx===3?'hello':p.idx===2||p.idx===4?'floating':'dance'};
 if(p.prefix==='pack')return {video:p.id==='rthro'?'closet':'floating'};
 return {cut:p.id};
}
function snap(){return {selection,cart:[...cart],previewOverride,equippedPreview}}
function memo(){undo.push(snap());if(undo.length>32)undo.shift();redo=[]}
function restore(s){selection=s.selection;cart=[...s.cart];previewOverride=s.previewOverride;equippedPreview=s.equippedPreview;market(true)}
function previewHtml(){const pre=getPreview();return pre.video?'<video class="modelview" autoplay loop muted playsinline disablepictureinpicture poster="media/'+pre.video+'.webp" src="media/'+pre.video+'.mp4" aria-label="Avatar preview"></video>':pic('room','','modelview')+'<img class="roomobject" src="media/cut-'+pre.cut+'.png" alt="'+esc(productData[pre.cut]?.name||'')+'">'}
function market(keep=false){const offset=keep?$('.catbody')?.scrollTop||0:0;const prevStrip=keep?$('.catstrip')?.scrollLeft||0:0;
 const cats=mode==='Marketplace'?marketCats:customCats;let strip='';
 if(mode==='Marketplace'&&category==='Animations')strip='<div class="subtabs">'+['Bundles','Emotes'].map(n=>btn('sub:'+n,n,subtab===n?'sel':'')).join('')+'</div>';
 if(mode==='Customize'&&category==='Emotes')strip='<div class="slots">'+Array.from({length:8},(_,i)=>btn('slot:'+(i+1),read().slots[i+1]||i===0?ico('pose'):String(i+1),slot===i+1?'sel':'')).join('')+'</div>';
 if(mode==='Customize'&&category==='Animations')strip='<div class="slots motion">'+['Full Set','Idle','Walk','Run','Jump','Fall','Climb'].map(n=>btn('motion:'+n,ico('pose')+'<br>'+n,motion===n?'sel':'')).join('')+'</div>';
 const picked=productData[selection],shopMode=mode==='Marketplace',offer=!!(picked&&cart.length&&shopMode||picked&&mode==='Customize'&&picked.price&&!read().owned.includes(picked.id));
 const wallet=read().balance;
 const bar=offer?'<div class="checkoutbar">'+btn('checkout',shopMode?'View Checkout ('+cart.length+')':robuxIcon('price')+' '+fmt(picked.price))+ib('clear-cart','Remove preview','trash')+'</div>':'';
 $('#main').innerHTML='<div class="market '+(expanded?'expanded':'')+'"><div class="catalog"><header class="cathead"><div class="segment">'+['Marketplace','Customize'].map(n=>btn('mode:'+n,n,mode===n?'sel':'')).join('')+'</div>'+ib('cat-search','Search catalog','search','catsearch')+'</header><div class="categories"><div class="catstrip">'+cats.map(n=>btn('cat:'+n,n,n===category?'sel':'')).join('')+'</div>'+ib('filter','Filters','filter','filters')+'</div>'+strip+'<div class="catbody">'+catalogMarkup()+'</div></div><section class="camera '+(offer?'checkout':'')+'" aria-label="Avatar"><div class="renderarea">'+previewHtml()+'</div><div class="camtool tool1">'+btn('original',pic('nav3','Original avatar'),'')+btn('poses',ico('pose'),'')+'</div><div class="camtool tool2"><button data-act="undo" aria-label="Undo" '+(!undo.length?'disabled':'')+'>'+ico('undo')+'</button><button data-act="redo" aria-label="Redo" '+(!redo.length?'disabled':'')+'>'+ico('redo')+'</button></div><button class="camwallet" data-act="shop" aria-label="Robux balance '+fmt(wallet)+'">'+robuxIcon('wallet')+fmt(wallet)+'</button>'+ib('expand','Toggle expanded avatar preview','zoom','camzoom')+bar+'</section></div>';
 $('.catbody').scrollTop=offset;const stripEl=$('.catstrip');stripEl.scrollLeft=prevStrip;const selected=stripEl.querySelector('.sel');if(selected){const x=selected.offsetLeft-stripEl.offsetLeft;if(x<stripEl.scrollLeft)stripEl.scrollLeft=x;else if(x+selected.offsetWidth>stripEl.scrollLeft+stripEl.clientWidth)stripEl.scrollLeft=x+selected.offsetWidth-stripEl.clientWidth}
 const movie=$('.camera video');if(movie){movie.muted=true;movie.play().catch(()=>{})}
 const a=$('.renderarea');let lastDist=0,initialY=0;
 function paint(){for(const el of a.children)el.style.transform='scale('+zoom+')'}
 paint();a.onwheel=e=>{e.preventDefault();zoom=Math.max(.7,Math.min(2.2,zoom-e.deltaY*.002));paint()};
 a.ontouchstart=e=>{if(e.touches.length===2)lastDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);else initialY=e.touches[0].clientY};
 a.ontouchmove=e=>{if(e.touches.length!==2||!lastDist)return;e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);zoom=Math.min(2.2,Math.max(.7,zoom*d/lastDist));lastDist=d;paint()};
 a.ontouchend=()=>{lastDist=0};a.ondblclick=()=>{zoom=zoom===1?1.35:1;paint()};
}
function switchCatalog(m,c){mode=m;category=c;subtab='Bundles';catalogQuery='';selection=null;previewOverride=null;zoom=1;market()}
function pick(id){const p=productData[id];if(!p)return;
 if(selection===id){detail(p);return}
 memo();selection=id;previewOverride=null;zoom=1;
 if(mode==='Customize'&&p.prefix==='emote'){const s=read();s.slots[slot]=id;write(s)}
 if(mode==='Marketplace'&&p.price&&!read().owned.includes(id)){cart=cart.filter(other=>productData[other].prefix!==p.prefix||!['look','pack'].includes(p.prefix));if(!cart.includes(id))cart.push(id)}
 if(mode==='Customize'&&!p.price&&p.prefix!=='emote'){equippedPreview=id;const s=read();s.outfit=id;write(s)}
 market(true);
}
function detail(p){modal('detail',p.name,pic(p.id,p.name,'detailpic')+'<div class="rowline"><span>Creator</span><b>'+esc(p.creator)+'</b></div><div class="rowline"><span>'+(!p.price?'Inventory':'Price')+'</span><b>'+(!p.price?'Owned':ico('robux')+' '+fmt(p.price))+'</b></div><div class="actions">'+btn('dismiss','Back','secondary')+btn('detail-action:'+p.id,read().owned.includes(p.id)||!p.price?'Equip':'View checkout')+'</div>')}
function checkout(){const s=read();const ids=(mode==='Customize'?[selection]:cart).filter(id=>productData[id]&&!s.owned.includes(id)&&productData[id].price);
 if(!ids.length){toast('Your checkout is empty');return}
 const total=ids.reduce((v,id)=>v+productData[id].price,0),enough=s.balance>=total;
 modal('checkout','Checkout','<div class="sheetbody">'+ids.map(id=>'<div class="resultbtn">'+pic(id)+'<span>'+esc(productData[id].name)+'</span><b class="price" style="margin-left:auto">'+robuxIcon('price')+productData[id].price+'</b></div>').join('')+'</div><div class="rowline"><span>Demo balance</span><b>'+ico('robux')+' '+fmt(s.balance)+'</b></div><div class="rowline total"><span>Total</span><b>'+ico('robux')+' '+fmt(total)+'</b></div>'+(!enough?'<p class="mini">You need '+fmt(total-s.balance)+' more Robux.</p>':'')+'<div class="actions">'+btn('dismiss','Cancel','secondary')+btn(enough?'purchase':'shop',enough?'Confirm purchase':'Get Robux')+'</div>');
}
async function purchase(){if(dialogType!=='checkout'||checkoutBusy)return;checkoutBusy=true;try{await transact(()=>{const s=read();const ids=(mode==='Customize'?[selection]:cart).filter(id=>productData[id]&&!s.owned.includes(id)&&productData[id].price);const total=ids.reduce((v,id)=>v+productData[id].price,0);if(!ids.length||total>s.balance){checkout();return}s.balance-=total;s.owned.push(...ids);s.outfit=ids.at(-1);write(s);equippedPreview=s.outfit;selection=null;cart=[];undo=[];redo=[];dismiss();market(true);toast('Purchase complete · Added to Customize')})}finally{checkoutBusy=false}}
function resetDemo(){write(initial());homeQuery='';homeScroll=0;homeTab='For you';mode='Marketplace';category='All';selection=null;cart=[];undo=[];redo=[];expanded=false;zoom=1;priceApplied=false;previewOverride=null;equippedPreview=null;slot=1;catalogQuery='';filter='Featured';dismiss();$('#main').innerHTML='';view('desktop')}
function friend(i){if(!i){modal('friends','Add Friends','<div class="menulist">'+friendNames.slice(1).map((n,i)=>btn('friend:'+(i+1),pic('friend'+(i+1))+esc(n),'')).join('')+'</div>');return}modal('friend',friendNames[i],pic('friend'+i,friendNames[i],'detailpic')+'<div class="rowline"><span>Connection</span><b>Friend</b></div><div class="actions">'+btn('dismiss','Done')+'</div>')}
function gameDetails(id){const k=id[0],i=Number(id.slice(1)),name=(k==='g'?gameNames:contNames)[i];modal('game',name,pic(id,name,'detailpic detailwide')+'<div class="rowline"><span>Experience</span><b>'+ico('thumb')+' '+(k==='g'?rating[i]:[36,82,92,83,91,90][i])+'%</b></div><div class="actions">'+btn('dismiss','Back to Home')+'</div>')}
function menu(a,source){const cut=a.indexOf(':'),t=cut<0?a:a.slice(0,cut),v=cut<0?'':a.slice(cut+1);
 switch(t){
 case 'enter':enter(source);break;
 case 'ipad-home':showIpad();break;
 case 'ipad-library':showIpad('library');break;
 case 'ipad-games':showGamesFolder();break;
 case 'dismiss':dismiss();break;
 case 'page':go(v);break;
 case 'shop':openShop();break;
 case 'home-tab':homeTab=v;homeScroll=0;home();break;
 case 'game':gameDetails(v);break;
 case 'friend':friend(Number(v));break;
 case 'banner':modal('banner','Send Gratitude Sky-High',pic('banner','The Great Build','detailpic detailwide')+'<p>Add your message to the tower.</p><form class="subform" id="gratitude"><input aria-label="Your message" maxlength="100" required placeholder="Your message"><button class="primary">Join</button></form>');$('#gratitude').onsubmit=e=>{e.preventDefault();dismiss();toast('Your message was added to the demo tower')};break;
 case 'discover':go('Me');switchCatalog('Marketplace','Avatars');pick(looks[[0,1,6,2,4,7][+v]].id);break;
 case 'notifications':modal('notifications','Notifications','<button class="resultbtn" data-act="coupon">'+ico('ticket')+' Black Friday coupon</button>');break;
 case 'coupon':coupon();break;
 case 'save-coupon':saveCoupon();break;
 case 'apply-coupon':applyCoupon();break;
 case 'remove-coupon':priceApplied=false;renderShop();break;
 case 'package':choosePackage(Number(v));break;
 case 'confirm':redeem();break;
 case 'receipt':receipt(false);break;
 case 'plus':plus(v);break;
 case 'mode':switchCatalog(v,'All');break;
 case 'cat':switchCatalog(mode,v);break;
 case 'sub':subtab=v;selection=null;market();break;
 case 'product':pick(v);break;
 case 'slot':slot=+v;selection=read().slots[slot]||null;previewOverride=null;market(true);break;
 case 'motion':motion=v;selection=null;previewOverride=v==='Full Set'||v==='Idle'?'closet':'floating';market(true);break;
 case 'original':memo();selection=null;equippedPreview=null;previewOverride=mode==='Marketplace'?'main':'closet';zoom=1;market(true);break;
 case 'poses':switchCatalog('Customize','Emotes');break;
 case 'undo':if(undo.length){redo.push(snap());restore(undo.pop())}break;
 case 'redo':if(redo.length){undo.push(snap());restore(redo.pop())}break;
 case 'expand':expanded=!expanded;market(true);break;
 case 'detail-action':{const p=productData[v];dismiss();if(!p.price||read().owned.includes(v)){const s=read();s.outfit=v;write(s);equippedPreview=v;selection=v;market(true);toast('Equipped')}else{if(!cart.includes(v))cart.push(v);checkout()}break}
 case 'checkout':checkout();break;
 case 'purchase':purchase();break;
 case 'clear-cart':memo();cart=[];selection=null;previewOverride=null;market(true);break;
 case 'cat-search':modal('cat-search','Search catalog','<form class="subform" id="searchcatalog"><input id="catq" maxlength="80" value="'+esc(catalogQuery)+'" placeholder="Search this category" aria-label="Search this category"><button class="primary">Search</button></form>');$('#catq').focus();$('#searchcatalog').onsubmit=e=>{e.preventDefault();catalogQuery=$('#catq').value.trim();dismiss();market()};break;
 case 'clear-search':catalogQuery='';market();break;
 case 'filter':modal('filters','Filters','<form class="subform" id="filters"><label for="sort">Sort by</label><select id="sort">'+['Featured','Price: low to high','Price: high to low'].map(n=>'<option '+(n===filter?'selected':'')+'>'+n+'</option>').join('')+'</select><button class="primary">Apply</button></form>');$('#filters').onsubmit=e=>{e.preventDefault();filter=$('#sort').value;dismiss();market()};break;
 case 'reset':modal('reset','Restart demo?','<p>Return to the iPad and start again with 17 Robux and a new Black Friday coupon.</p><div class="actions">'+btn('dismiss','Cancel','secondary')+btn('reset-yes','Restart')+'</div>');break;
 case 'reset-yes':resetDemo();break;
 }
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b&&!b.disabled)menu(b.dataset.act,b)});
$('#veil').addEventListener('click',e=>{if(e.target===$('#veil'))dismiss()});
addEventListener('keydown',e=>{if(e.key==='Escape'){if(dialogType)dismiss();else if(scene==='shop')go(shopReturn);else if(scene==='shell'&&page!=='Home')go('Home')}if(dialogType&&e.key==='Tab'){const nodes=Array.from($('#dialog').querySelectorAll('button,input,select')).filter(n=>!n.disabled&&!n.hidden);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#dialog'))){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
addEventListener('storage',e=>{if(e.key!==key)return;if(scene==='shop')renderShop();if(scene==='shell'&&page==='Me')market(true)});

const deskLabels=['Sugeridas','Recientes','Utilidades','Redes sociales','Juegos','Ocio','Creatividad','Productividad y finanzas','Información y lectura','Otras','Ocultas'];
const portrait=document.createElement('div');
portrait.className='deskportrait';
portrait.innerHTML='<button class="portraitsearch" aria-label="Buscar apps">'+ico('search')+' Biblioteca de apps</button><div class="foldergrid">'+deskLabels.map((n,i)=>{const x=[195,390,585,780][i%4],y=[146,351,556][Math.floor(i/4)];const launchArea=i===4?'<button class="folderlaunch" data-act="enter" aria-label="Roblox en Juegos"></button>':i===1?'<button class="folderrecent" data-act="enter" aria-label="Roblox en Recientes"></button>':'';return '<div><div class="folderface" style="background-position:-'+x+'px -'+y+'px">'+launchArea+'</div><span>'+n+'</span></div>'}).join('')+'</div>';
$('#desktop').appendChild(portrait);

const ipadApps = {
  facetime:'FaceTime', photos:'Fotos', reminders:'Recordatorios', home:'Casa',
  appstore:'App Store', maps:'Mapas', drive:'Drive', tiktok:'TikTok',
  netflix:'Netflix', whatsapp:'WhatsApp', fortnite:'Fortnite', roblox:'Roblox',
  settings:'Configuración', files:'Archivos', imovie:'iMovie', prime:'Prime Video',
  books:'Libros', calculator:'Calculadora', safari:'Safari', contacts:'Contactos',
  phone:'Teléfono', rocket:'Juegos', health:'Salud', tips:'Consejos'
};
const ipadIconKeys = ['facetime', 'photos', 'reminders', 'home', 'appstore', 'maps', 'drive', 'tiktok', 'netflix', 'whatsapp', 'fortnite', 'roblox', 'settings', 'files', 'imovie', 'prime', 'books', 'calculator', 'safari', 'rocket'];
function ipadGlyph(key) {
  const index=ipadIconKeys.indexOf(key);
  return '<span class="os-glyph" aria-hidden="true" style="--glyph-x:'+(-(index%5)*100)+'%;--glyph-y:'+(-Math.floor(index/5)*100)+'%">'+pic('ipad-icons')+'</span>';
}
function ipadTile(key, showName=true) {
  const name = ipadApps[key];
  const content = ipadGlyph(key) + (showName ? '<span>'+name+'</span>' : '');
  if (key === 'roblox') return '<button class="os-app" data-act="enter" aria-label="Abrir Roblox">'+content+'</button>';
  return '<div class="os-app" aria-label="'+name+'">'+content+'</div>';
}
function showIpad(pageName='home') {
  dismiss();
  $('#main').querySelector('video')?.pause();
  view('desktop');
  $('#desktop').classList.toggle('on-home',pageName==='home');
  $('#ipad-home').hidden = pageName!=='home';
  $('.deskpanel').inert = pageName==='home';
  $('.deskportrait').inert = pageName==='home';
}
function showGamesFolder() {
  modal('ipad-folder','Juegos','<div class="os-folder-apps">'+['fortnite','rocket','roblox'].map(k=>ipadTile(k)).join('')+'</div>','ipad-folder');
}
function searchIpad() {
  modal('desksearch','Biblioteca de apps','<form id="os-find"><label class="os-field">'+ico('search')+'<input id="appfind" type="search" placeholder="Buscar apps" autocomplete="off" aria-label="Buscar apps"></label></form><div id="os-matches"><button class="os-match" data-act="enter">'+ipadGlyph('roblox')+'<b>Roblox</b></button><span id="os-empty" hidden>Sin resultados</span></div>','ipad-find');
  const field=$('#appfind'), result=$('.os-match');
  field.oninput=()=>{result.hidden=!'roblox'.includes(field.value.trim().toLowerCase());$('#os-empty').hidden=!result.hidden};
  $('#os-find').onsubmit=e=>{e.preventDefault();if(!result.hidden)enter(result)};
  field.focus();
}
const ipadHome=document.createElement('section');
ipadHome.id='ipad-home';
ipadHome.hidden=true;
ipadHome.setAttribute('aria-label','Pantalla de inicio del iPad');
const mainApps=['facetime','photos','reminders','home','appstore','maps','drive','tiktok','netflix','whatsapp','fortnite','roblox','settings','files','imovie','prime','books','calculator'];
const libraryGlyph='<span class="os-library-icon" aria-hidden="true">'+['appstore','photos','tiktok','imovie','books','whatsapp','roblox','drive','safari'].map(key=>ipadGlyph(key)).join('')+'</span>';
ipadHome.innerHTML=pic('ipad-wall','','os-wall')+'<div class="os-app-grid">'+mainApps.map(key=>ipadTile(key)).join('')+'</div><div class="os-bottom"><button class="os-pager" data-act="ipad-library" aria-label="Ir a la biblioteca de apps"><i></i><i></i></button><div class="os-dock">'+['safari','files','photos','tiktok'].map(key=>ipadTile(key,false)).join('')+'<span class="os-dock-divider"></span>'+ipadTile('roblox',false)+'<button class="os-app" data-act="ipad-library" aria-label="Biblioteca de apps">'+libraryGlyph+'</button></div></div>';
$('#desktop').append(ipadHome);
const folderButton=document.createElement('button');
folderButton.className='hot games-area';
folderButton.dataset.act='ipad-games';
folderButton.setAttribute('aria-label','Abrir carpeta Juegos');
$('.deskpanel').insertBefore(folderButton,$('.launch'));
const portraitGame=$('.folderlaunch');
const portraitFolder=folderButton.cloneNode();
portraitFolder.className='portrait-games-area';
portraitGame.before(portraitFolder);
$('.desksearch').onclick=searchIpad;
$('.portraitsearch').onclick=searchIpad;
let swipeFrom=null;
$('#desktop').addEventListener('touchstart',event=>{
  if(event.touches.length!==1||dialogType||launching){swipeFrom=null;return}
  const touch=event.touches[0];
  swipeFrom={x:touch.clientX,y:touch.clientY};
},{passive:true});
$('#desktop').addEventListener('touchend',event=>{
  if(!swipeFrom||launching||dialogType||!event.changedTouches.length)return;
  const touch=event.changedTouches[0],dx=touch.clientX-swipeFrom.x,dy=touch.clientY-swipeFrom.y;
  swipeFrom=null;
  if(Math.abs(dx)<65||Math.abs(dx)<Math.abs(dy)*1.6)return;
  if(dx<0&&!ipadHome.hidden)showIpad('library');
  else if(dx>0&&ipadHome.hidden)showIpad();
},{passive:true});
$('#desktop').addEventListener('touchcancel',()=>{swipeFrom=null},{passive:true});
document.addEventListener('keydown',event=>{
  if(scene!=='desktop'||dialogType||launching)return;
  if(event.key==='ArrowLeft')showIpad();
  if(event.key==='ArrowRight')showIpad('library');
});
const launchOptions = new URLSearchParams(location.search);
if (!launchOptions.has('start') || launchOptions.get('start') === 'ipad') showIpad();
$('#stage').classList.toggle('recording', launchOptions.get('record') === '1');
if (launchOptions.get('start') === 'coupon') {
  go('Home');
  coupon();
}

