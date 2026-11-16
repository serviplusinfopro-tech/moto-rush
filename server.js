// Serveur Moto Rush — zéro dépendance. Lancer : node server.js  (port 3000, ou PORT=xxxx)
const http=require('http'),fs=require('fs'),path=require('path'),R={};
const rid=()=>Math.random().toString(36).slice(2,8),rc=()=>Math.random().toString(36).slice(2,6).toUpperCase();
http.createServer((q,r)=>{
  if(q.method=='GET'){r.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});return r.end(fs.readFileSync(path.join(__dirname,'game.html')))}
  let d='';q.on('data',c=>d+=c).on('end',()=>{
    let b={};try{b=JSON.parse(d||'{}')}catch(e){}
    const J=o=>{r.writeHead(200,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});r.end(JSON.stringify(o))};
    const u=q.url,now=Date.now();
    if(u=='/api/create'){let c=rc();while(R[c])c=rc();const id=rid();R[c]={host:id,lvl:0,go:0,p:{[id]:{n:b.n,s:null,f:0,t:now}}};return J({code:c,id})}
    const m=R[b.code];if(!m)return J({e:'Code inconnu'});
    if(u=='/api/join'){const id=rid();m.p[id]={n:b.n,s:null,f:0,t:now};return J({code:b.code,id})}
    if(!m.p[b.id])return J({e:'Expulsé'});
    if(u=='/api/start'&&b.id==m.host){m.lvl=b.lvl|0;m.go=now+3500;for(const k in m.p){m.p[k].f=0;m.p[k].s=null}return J({ok:1})}
    if(u=='/api/sync'){const p=m.p[b.id];p.s=b.s;p.t=now;if(b.f)p.f=b.f;
      for(const k in m.p)if(now-m.p[k].t>10000){delete m.p[k];if(k==m.host)m.host=Object.keys(m.p)[0]}
      if(!Object.keys(m.p).length){delete R[b.code];return J({e:'Fermé'})}
      return J({t:now,lvl:m.lvl,go:m.go,host:m.host,ps:Object.entries(m.p).map(([id,v])=>({id,n:v.n,s:v.s,f:v.f}))})}
    J({e:'?'})});
}).listen(process.env.PORT||3000,()=>console.log('Moto Rush sur http://localhost:'+(process.env.PORT||3000)));
